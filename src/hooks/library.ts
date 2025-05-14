'use client';

import { useEffect, useState } from 'react';
import { Book, BookStatus, BookWithDetails, BorrowRequest, BorrowRequestStatus, BorrowRequestWithDetails, Genre } from '@/interface/library';
import LibraryService from '@/service/UI/library';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/service/UI/firebaseUiClient';
import { QueryDocumentSnapshot } from 'firebase/firestore';

// Hook for pagination and filtering books
export const useBooks = (
  statusFilter?: BookStatus[],
  genreFilter?: Genre[],
  searchQuery?: string,
  pageSize: number = 10,
  showPendingRequests: boolean = false
) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<any> | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);
  const [pendingRequestBooks, setPendingRequestBooks] = useState<Set<string>>(new Set());

  const fetchBooks = async (reset: boolean = false) => {
    try {
      setLoading(true);
      
      const result = await LibraryService.getBooks(
        statusFilter,
        genreFilter,
        searchQuery,
        reset ? undefined : lastVisible,
        pageSize,
        'title'
      );
      
      if (reset) {
        setBooks(result.books);
      } else {
        setBooks(prev => [...prev, ...result.books]);
      }
      
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
      setError(null);

      // If showPendingRequests is true, fetch pending requests to filter books
      if (showPendingRequests && result.books.length > 0) {
        const pendingRequests = await LibraryService.getBorrowRequests(
          [BorrowRequestStatus.PENDING]
        );
        
        // Create a set of book IDs with pending requests
        const bookIdsWithPendingRequests = new Set(
          pendingRequests.map(request => request.bookId)
        );
        
        setPendingRequestBooks(bookIdsWithPendingRequests);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err as Error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchBooks(true);
  }, [statusFilter, genreFilter, searchQuery, refresh, showPendingRequests]);

  // Function to load more books
  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchBooks(false);
  };

  // Function to refresh the list
  const refreshBooks = () => {
    setRefresh(prev => prev + 1);
  };

  // Filter books based on whether they have pending requests
  const filteredBooks = showPendingRequests 
    ? books.filter(book => pendingRequestBooks.has(book.id))
    : books;

  return {
    books: filteredBooks,
    loading,
    error,
    hasMore,
    loadMore,
    refreshBooks,
    pendingRequestBooks
  };
};

// Hook for getting a single book with details
export const useBook = (id: string) => {
  const [book, setBook] = useState<BookWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const bookData = await LibraryService.getBook(id);
      setBook(bookData);
      setError(null);
    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err as Error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  return {
    book,
    loading,
    error,
    refreshBook: fetchBook
  };
};

// Hook for managing book operations (admin)
export const useBookOperations = () => {
  const [user] = useAuthState(auth);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const addBook = async (
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'createdBy'>,
    coverImage?: File
  ) => {
    if (!user) {
      toast.error('You must be logged in to add a book');
      return null;
    }
    
    try {
      setSubmitting(true);
      return await LibraryService.addBook(bookData, coverImage, user.uid);
    } catch (error) {
      console.error('Error adding book:', error);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateBook = async (
    id: string,
    bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>,
    coverImage?: File
  ) => {
    try {
      setSubmitting(true);
      return await LibraryService.updateBook(id, bookData, coverImage);
    } catch (error) {
      console.error('Error updating book:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setSubmitting(true);
      return await LibraryService.deleteBook(id);
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    addBook,
    updateBook,
    deleteBook
  };
};

// Hook for managing borrow requests
export const useBorrowRequests = (
  status?: BorrowRequestStatus[],
  userId?: string,
  bookId?: string
) => {
  const [requests, setRequests] = useState<BorrowRequestWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await LibraryService.getBorrowRequests(status, userId, bookId);
      setRequests(requestsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching borrow requests:', err);
      setError(err as Error);
      toast.error('Failed to load borrow requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status, userId, bookId, refresh]);

  const refreshRequests = () => {
    setRefresh(prev => prev + 1);
  };

  return {
    requests,
    loading,
    error,
    refreshRequests
  };
};

// Hook for user borrow operations
export const useBorrowOperations = () => {
  const [user] = useAuthState(auth);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const createBorrowRequest = async (bookId: string, dueDate: Date) => {
    if (!user) {
      toast.error('You must be logged in to borrow a book');
      return null;
    }
    
    try {
      setSubmitting(true);
      return await LibraryService.createBorrowRequest(bookId, user.uid, dueDate);
    } catch (error) {
      console.error('Error creating borrow request:', error);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    createBorrowRequest
  };
};

// Hook for admin borrow operations
export const useAdminBorrowOperations = () => {
  const [user] = useAuthState(auth);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const approveBorrowRequest = async (requestId: string) => {
    if (!user) {
      toast.error('You must be logged in to approve a request');
      return false;
    }
    
    try {
      setSubmitting(true);
      return await LibraryService.approveBorrowRequest(requestId, user.uid);
    } catch (error) {
      console.error('Error approving request:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const rejectBorrowRequest = async (requestId: string) => {
    try {
      setSubmitting(true);
      return await LibraryService.rejectBorrowRequest(requestId);
    } catch (error) {
      console.error('Error rejecting request:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const returnBook = async (requestId: string) => {
    try {
      setSubmitting(true);
      return await LibraryService.returnBook(requestId);
    } catch (error) {
      console.error('Error returning book:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    approveBorrowRequest,
    rejectBorrowRequest,
    returnBook
  };
};