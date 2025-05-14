'use client';

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  orderBy,
  getDoc,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  or,
  and,
  QueryConstraint,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db, fireBaseStorage } from './firebaseUiClient';
import { Book, BookStatus, BookWithDetails, BorrowRequest, BorrowRequestStatus, BorrowRequestWithDetails, Genre } from '@/interface/library';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithPic } from '@/interface/user';

export default new class LibraryService {
  // Book Methods
  getBooks = async (
    statusFilter?: BookStatus[],
    genreFilter?: Genre[],
    searchQuery?: string,
    lastVisible?: QueryDocumentSnapshot<any>,
    pageSize: number = 10,
    orderByField: string = 'title'
  ): Promise<{ books: Book[], lastVisible?: QueryDocumentSnapshot<any>, hasMore: boolean }> => {
    try {
      const constraints: QueryConstraint[] = [
        orderBy(orderByField, 'asc')
      ];
      
      // Add status filter if provided
      if (statusFilter && statusFilter.length > 0) {
        constraints.push(where('status', 'in', statusFilter));
      }
      
      // Add genre filter if provided
      if (genreFilter && genreFilter.length > 0) {
        constraints.push(where('genre', 'in', genreFilter));
      }
      
      // Basic query
      let q = query(
        collection(db, 'books'),
        ...constraints,
        limit(pageSize + 1) // Fetch one extra to determine if there are more
      );
      
      // Add pagination if lastVisible is provided
      if (lastVisible) {
        q = query(
          collection(db, 'books'),
          ...constraints,
          startAfter(lastVisible),
          limit(pageSize + 1)
        );
      }
      
      const snapshot = await getDocs(q);
      const hasMore = snapshot.docs.length > pageSize;
      const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
      
      // If search query is provided, we need to filter in memory
      // (Firestore doesn't support full text search)
      let books = docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id
        } as Book;
      });
      
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        books = books.filter(book => 
          book.title.toLowerCase().includes(lowerCaseQuery) ||
          book.author.toLowerCase().includes(lowerCaseQuery) ||
          (book.description && book.description.toLowerCase().includes(lowerCaseQuery))
        );
      }
      
      return {
        books,
        lastVisible: hasMore ? docs[docs.length - 1] : undefined,
        hasMore
      };
    } catch (error) {
      console.error('Error getting books:', error);
      toast.error('Failed to load books');
      return { books: [], hasMore: false };
    }
  };

  getBook = async (id: string): Promise<BookWithDetails | null> => {
    try {
      const docRef = doc(db, 'books', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        const bookData = {
          ...docSnapshot.data(),
          id: docSnapshot.id
        } as Book;
        
        // Get active borrow request for this book
        const borrowRequestQuery = query(
          collection(db, 'borrowRequests'),
          where('bookId', '==', id),
          where('status', '==', BorrowRequestStatus.APPROVED)
        );
        
        const borrowRequestSnapshot = await getDocs(borrowRequestQuery);
        let bookWithDetails: BookWithDetails = { ...bookData };
        
        if (!borrowRequestSnapshot.empty) {
          const borrowRequest = {
            ...borrowRequestSnapshot.docs[0].data(),
            id: borrowRequestSnapshot.docs[0].id
          } as BorrowRequest;
          
          // Get borrower info
          const userRef = doc(db, 'users', borrowRequest.userId);
          const userSnapshot = await getDoc(userRef);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data() as User;
            
            bookWithDetails.currentBorrower = {
              id: userData.uid,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              borrowDate: borrowRequest.borrowDate,
              dueDate: borrowRequest.dueDate,
              borrowRequestId: borrowRequest.id
            };
            
            // Check if overdue
            const now = new Date();
            const dueDate = borrowRequest.dueDate.toDate();
            bookWithDetails.isOverdue = now > dueDate && !borrowRequest.returnDate;
          }
        }
        
        return bookWithDetails;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting book:', error);
      toast.error('Failed to load book details');
      return null;
    }
  };

  addBook = async (
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'createdBy'>,
    coverImage?: File,
    userId: string
  ): Promise<Book | null> => {
    try {
      let coverImageUrl = '';
      
      // Upload cover image if provided
      if (coverImage) {
        const fileName = `library/covers/${uuidv4()}_${coverImage.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(fireBaseStorage, fileName);
        
        // Upload and get URL
        const uploadTask = await uploadBytesResumable(storageRef, coverImage);
        coverImageUrl = await getDownloadURL(uploadTask.ref);
      }
      
      // Create book document
      const newBook = {
        ...bookData,
        coverImageUrl: coverImageUrl || '',
        status: BookStatus.AVAILABLE,
        createdBy: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'books'), newBook);
      
      toast.success('Book added successfully!');
      return {
        ...newBook,
        id: docRef.id
      } as Book;
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
      return null;
    }
  };

  updateBook = async (
    id: string,
    bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>,
    coverImage?: File
  ): Promise<boolean> => {
    try {
      const docRef = doc(db, 'books', id);
      let updateData = {
        ...bookData,
        updatedAt: Timestamp.now()
      };
      
      // Upload new cover image if provided
      if (coverImage) {
        // Get current book to check if we need to delete old image
        const bookSnapshot = await getDoc(docRef);
        if (bookSnapshot.exists()) {
          const currentBook = bookSnapshot.data() as Book;
          
          // Delete old image if exists
          if (currentBook.coverImageUrl) {
            try {
              const oldImageRef = ref(fireBaseStorage, currentBook.coverImageUrl);
              await deleteObject(oldImageRef);
            } catch (error) {
              console.log('Previous image not found or already deleted');
            }
          }
        }
        
        // Upload new image
        const fileName = `library/covers/${uuidv4()}_${coverImage.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(fireBaseStorage, fileName);
        
        const uploadTask = await uploadBytesResumable(storageRef, coverImage);
        const coverImageUrl = await getDownloadURL(uploadTask.ref);
        
        updateData = {
          ...updateData,
          coverImageUrl
        };
      }
      
      await updateDoc(docRef, updateData);
      toast.success('Book updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
      return false;
    }
  };

  deleteBook = async (id: string): Promise<boolean> => {
    try {
      // Check if book is currently borrowed
      const bookSnapshot = await getDoc(doc(db, 'books', id));
      if (bookSnapshot.exists()) {
        const book = bookSnapshot.data() as Book;
        
        if (book.status === BookStatus.BORROWED) {
          toast.error('Cannot delete a book that is currently borrowed');
          return false;
        }
        
        // Delete cover image if exists
        if (book.coverImageUrl) {
          try {
            const imageRef = ref(fireBaseStorage, book.coverImageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.log('Image not found or already deleted');
          }
        }
      }
      
      // Delete the book document
      await deleteDoc(doc(db, 'books', id));
      
      // Delete any associated borrow requests
      const borrowRequestsQuery = query(
        collection(db, 'borrowRequests'),
        where('bookId', '==', id)
      );
      
      const borrowRequestsSnapshot = await getDocs(borrowRequestsQuery);
      const deletePromises = borrowRequestsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      toast.success('Book deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
      return false;
    }
  };

  // Borrow Request Methods
  createBorrowRequest = async (
    bookId: string, 
    userId: string,
    dueDate: Date
  ): Promise<BorrowRequest | null> => {
    try {
      // Check if book is available
      const bookRef = doc(db, 'books', bookId);
      const bookSnapshot = await getDoc(bookRef);
      
      if (!bookSnapshot.exists()) {
        toast.error('Book not found');
        return null;
      }
      
      const book = bookSnapshot.data() as Book;
      
      if (book.status !== BookStatus.AVAILABLE) {
        toast.error('Book is not available for borrowing');
        return null;
      }
      
      // Check if user already has a pending request for this book
      const existingRequestQuery = query(
        collection(db, 'borrowRequests'),
        where('bookId', '==', bookId),
        where('userId', '==', userId),
        where('status', '==', BorrowRequestStatus.PENDING)
      );
      
      const existingRequestSnapshot = await getDocs(existingRequestQuery);
      
      if (!existingRequestSnapshot.empty) {
        toast.info('You already have a pending request for this book');
        return null;
      }
      
      // Create the borrow request
      const borrowRequest = {
        bookId,
        userId,
        status: BorrowRequestStatus.PENDING,
        borrowDate: Timestamp.now(), // Will be updated when approved
        dueDate: Timestamp.fromDate(dueDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'borrowRequests'), borrowRequest);
      
      toast.success('Borrow request submitted successfully');
      return {
        ...borrowRequest,
        id: docRef.id
      } as BorrowRequest;
    } catch (error) {
      console.error('Error creating borrow request:', error);
      toast.error('Failed to create borrow request');
      return null;
    }
  };

  getBorrowRequests = async (
    status?: BorrowRequestStatus[],
    userId?: string,
    bookId?: string
  ): Promise<BorrowRequestWithDetails[]> => {
    try {
      let queryConstraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc')
      ];
      
      if (status && status.length > 0) {
        queryConstraints.push(where('status', 'in', status));
      }
      
      if (userId) {
        queryConstraints.push(where('userId', '==', userId));
      }
      
      if (bookId) {
        queryConstraints.push(where('bookId', '==', bookId));
      }
      
      const q = query(
        collection(db, 'borrowRequests'),
        ...queryConstraints
      );
      
      const snapshot = await getDocs(q);
      const borrowRequests = snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id
        } as BorrowRequest;
      });
      
      // Get details for each request
      const requestsWithDetails: BorrowRequestWithDetails[] = await Promise.all(
        borrowRequests.map(async (request) => {
          const bookRef = doc(db, 'books', request.bookId);
          const userRef = doc(db, 'users', request.userId);
          
          const [bookSnapshot, userSnapshot] = await Promise.all([
            getDoc(bookRef),
            getDoc(userRef)
          ]);
          
          const requestWithDetails: BorrowRequestWithDetails = { ...request };
          
          if (bookSnapshot.exists()) {
            const bookData = bookSnapshot.data() as Book;
            requestWithDetails.book = {
              id: bookData.id,
              title: bookData.title,
              author: bookData.author
            };
          }
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data() as User;
            requestWithDetails.user = {
              id: userData.uid,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email
            };
          }
          
          if (request.approvedBy) {
            const approverRef = doc(db, 'users', request.approvedBy);
            const approverSnapshot = await getDoc(approverRef);
            
            if (approverSnapshot.exists()) {
              const approverData = approverSnapshot.data() as User;
              requestWithDetails.approver = {
                id: approverData.uid,
                firstName: approverData.firstName,
                lastName: approverData.lastName
              };
            }
          }
          
          return requestWithDetails;
        })
      );
      
      return requestsWithDetails;
    } catch (error) {
      console.error('Error getting borrow requests:', error);
      toast.error('Failed to load borrow requests');
      return [];
    }
  };

  approveBorrowRequest = async (
    requestId: string,
    adminId: string
  ): Promise<boolean> => {
    try {
      const requestRef = doc(db, 'borrowRequests', requestId);
      const requestSnapshot = await getDoc(requestRef);
      
      if (!requestSnapshot.exists()) {
        toast.error('Borrow request not found');
        return false;
      }
      
      const borrowRequest = requestSnapshot.data() as BorrowRequest;
      
      if (borrowRequest.status !== BorrowRequestStatus.PENDING) {
        toast.error('Can only approve pending requests');
        return false;
      }
      
      // Prevent approving own request
      if (borrowRequest.userId === adminId) {
        toast.error('You cannot approve your own book request');
        return false;
      }
      
      // Check if book is still available
      const bookRef = doc(db, 'books', borrowRequest.bookId);
      const bookSnapshot = await getDoc(bookRef);
      
      if (!bookSnapshot.exists()) {
        toast.error('Book not found');
        return false;
      }
      
      const book = bookSnapshot.data() as Book;
      
      if (book.status !== BookStatus.AVAILABLE) {
        toast.error('Book is no longer available');
        return false;
      }
      
      // Update book status
      await updateDoc(bookRef, {
        status: BookStatus.BORROWED,
        updatedAt: Timestamp.now()
      });
      
      // Update borrow request
      await updateDoc(requestRef, {
        status: BorrowRequestStatus.APPROVED,
        borrowDate: Timestamp.now(),
        approvedBy: adminId,
        updatedAt: Timestamp.now()
      });
      
      // Reject any other pending requests for this book
      const otherRequestsQuery = query(
        collection(db, 'borrowRequests'),
        where('bookId', '==', borrowRequest.bookId),
        where('status', '==', BorrowRequestStatus.PENDING),
        where('id', '!=', requestId)
      );
      
      const otherRequestsSnapshot = await getDocs(otherRequestsQuery);
      
      const rejectPromises = otherRequestsSnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          status: BorrowRequestStatus.REJECTED,
          updatedAt: Timestamp.now()
        })
      );
      
      await Promise.all(rejectPromises);
      
      toast.success('Borrow request approved');
      return true;
    } catch (error) {
      console.error('Error approving borrow request:', error);
      toast.error('Failed to approve borrow request');
      return false;
    }
  };

  rejectBorrowRequest = async (
    requestId: string
  ): Promise<boolean> => {
    try {
      const requestRef = doc(db, 'borrowRequests', requestId);
      const requestSnapshot = await getDoc(requestRef);
      
      if (!requestSnapshot.exists()) {
        toast.error('Borrow request not found');
        return false;
      }
      
      const borrowRequest = requestSnapshot.data() as BorrowRequest;
      
      if (borrowRequest.status !== BorrowRequestStatus.PENDING) {
        toast.error('Can only reject pending requests');
        return false;
      }
      
      // Update borrow request
      await updateDoc(requestRef, {
        status: BorrowRequestStatus.REJECTED,
        updatedAt: Timestamp.now()
      });
      
      toast.success('Borrow request rejected');
      return true;
    } catch (error) {
      console.error('Error rejecting borrow request:', error);
      toast.error('Failed to reject borrow request');
      return false;
    }
  };

  returnBook = async (
    requestId: string
  ): Promise<boolean> => {
    try {
      const requestRef = doc(db, 'borrowRequests', requestId);
      const requestSnapshot = await getDoc(requestRef);
      
      if (!requestSnapshot.exists()) {
        toast.error('Borrow request not found');
        return false;
      }
      
      const borrowRequest = requestSnapshot.data() as BorrowRequest;
      
      if (borrowRequest.status !== BorrowRequestStatus.APPROVED) {
        toast.error('Book is not currently borrowed');
        return false;
      }
      
      // Update book status
      const bookRef = doc(db, 'books', borrowRequest.bookId);
      await updateDoc(bookRef, {
        status: BookStatus.AVAILABLE,
        updatedAt: Timestamp.now()
      });
      
      // Update borrow request
      await updateDoc(requestRef, {
        status: BorrowRequestStatus.RETURNED,
        returnDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      toast.success('Book marked as returned');
      return true;
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to process book return');
      return false;
    }
  };
}();