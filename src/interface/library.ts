import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance'
}

export enum BorrowRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RETURNED = 'returned',
  OVERDUE = 'overdue'
}

export enum Genre {
  FICTION = 'Fiction',
  NON_FICTION = 'Non-Fiction',
  BIOGRAPHY = 'Biography',
  HISTORY = 'History',
  SCIENCE = 'Science',
  RELIGION = 'Religion',
  PHILOSOPHY = 'Philosophy',
  SELF_HELP = 'Self-Help',
  POETRY = 'Poetry',
  DRAMA = 'Drama',
  CHILDRENS = 'Children\'s',
  BUSINESS = 'Business',
  TRAVEL = 'Travel',
  COOKING = 'Cooking',
  OTHER = 'Other'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  genre: Genre;
  year: number;
  status: BookStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // UID of the admin who added the book
}

export interface BorrowRequest {
  id: string;
  bookId: string;
  userId: string;
  status: BorrowRequestStatus;
  borrowDate: Timestamp;
  dueDate: Timestamp; // Expected return date
  returnDate?: Timestamp; // Actual return date
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedBy?: string; // UID of the admin who approved the request
}

export interface BookWithDetails extends Book {
  currentBorrower?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    borrowDate: Timestamp;
    dueDate: Timestamp;
    borrowRequestId: string;
  };
  isOverdue?: boolean;
}

export interface BorrowRequestWithDetails extends BorrowRequest {
  book?: {
    id: string;
    title: string;
    author: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}