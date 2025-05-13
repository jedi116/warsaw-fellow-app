import { Timestamp } from "firebase/firestore";

export interface Program {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: string; // 'calendar' | 'book' | 'users' | etc.
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  storageRef: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Scripture {
  id: string;
  verse: string;
  reference: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type IconType = 
  | 'calendar' 
  | 'book' 
  | 'users' 
  | 'heart' 
  | 'star' 
  | 'music' 
  | 'microphone'
  | 'pray'
  | 'bible'
  | 'church';

export const AVAILABLE_ICONS: { value: IconType; label: string }[] = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'book', label: 'Book' },
  { value: 'users', label: 'Users Group' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'music', label: 'Music' },
  { value: 'microphone', label: 'Microphone' },
  { value: 'pray', label: 'Prayer' },
  { value: 'bible', label: 'Bible' },
  { value: 'church', label: 'Church' }
];