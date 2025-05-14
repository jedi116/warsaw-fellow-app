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
  setDoc,
  limit
} from 'firebase/firestore';
import { db, fireBaseStorage } from './firebaseUiClient';
import { Event, EventStatus, GalleryImage, Program, Scripture } from '@/interface/content';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default new class ContentService {
  // Event Methods
  getEvents = async (status?: EventStatus) => {
    try {
      let q;
      
      if (status) {
        q = query(
          collection(db, 'events'),
          where('status', '==', status),
          orderBy('date', status === EventStatus.PAST ? 'desc' : 'asc')
        );
      } else {
        q = query(
          collection(db, 'events'),
          orderBy('date', 'desc')
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id
        } as Event;
      });
    } catch (error) {
      console.error('Error getting events:', error);
      toast.error('Failed to load events');
      return [];
    }
  }

  getEvent = async (id: string) => {
    try {
      const docRef = doc(db, 'events', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        return {
          ...docSnapshot.data(),
          id: docSnapshot.id
        } as Event;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      toast.error('Failed to load event');
      return null;
    }
  }

  uploadEventImage = async (file: File) => {
    try {
      // Create a unique filename
      const fileName = `events/${uuidv4()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(fireBaseStorage, fileName);
      
      // Upload the file
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return { imageUrl: downloadURL, storageRef: fileName };
    } catch (error) {
      console.error('Error uploading event image:', error);
      toast.error('Failed to upload event image');
      return null;
    }
  }

  saveEvent = async (
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
    imageFile?: File
  ) => {
    try {
      let imageData = {};
      
      if (imageFile) {
        const uploadResult = await this.uploadEventImage(imageFile);
        if (uploadResult) {
          imageData = uploadResult;
        }
      }
      
      const newEvent = {
        ...event,
        ...imageData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'events'), newEvent);
      toast.success('Event saved successfully!');
      
      return {
        ...newEvent,
        id: docRef.id
      } as Event;
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
      return null;
    }
  }

  updateEvent = async (
    id: string, 
    event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>,
    imageFile?: File
  ) => {
    try {
      let imageData = {};
      
      if (imageFile) {
        // First check if there's an existing image to delete
        const existingEvent = await this.getEvent(id);
        if (existingEvent && existingEvent.storageRef) {
          try {
            const oldImageRef = ref(fireBaseStorage, existingEvent.storageRef);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.log('Previous image not found or already deleted');
          }
        }
        
        // Upload new image
        const uploadResult = await this.uploadEventImage(imageFile);
        if (uploadResult) {
          imageData = uploadResult;
        }
      }
      
      const docRef = doc(db, 'events', id);
      const updateData = {
        ...event,
        ...imageData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
      toast.success('Event updated successfully!');
      
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  }

  deleteEvent = async (id: string) => {
    try {
      // First, get the event data to find the storage reference if there's an image
      const docRef = doc(db, 'events', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        const eventData = docSnapshot.data() as Event;
        
        // Delete the image from storage if it exists
        if (eventData.storageRef) {
          try {
            const storageReference = ref(fireBaseStorage, eventData.storageRef);
            await deleteObject(storageReference);
          } catch (err) {
            console.log('Image not found or already deleted');
          }
        }
        
        // Delete the event document
        await deleteDoc(docRef);
        
        toast.success('Event deleted successfully!');
        return true;
      } else {
        throw new Error('Event not found');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  }

  updateEventStatus = async (id: string, status: EventStatus) => {
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, { 
        status,
        updatedAt: Timestamp.now()
      });
      
      toast.success(`Event marked as ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
      return false;
    }
  }

  toggleEventHighlight = async (id: string, isHighlighted: boolean) => {
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, { 
        isHighlighted,
        updatedAt: Timestamp.now()
      });
      
      toast.success(isHighlighted ? 'Event highlighted' : 'Event unhighlighted');
      return true;
    } catch (error) {
      console.error('Error toggling event highlight:', error);
      toast.error('Failed to update event');
      return false;
    }
  }
  // Program Methods
  getPrograms = async (activeOnly = false) => {
    try {
      let q = query(
        collection(db, 'programs'),
        orderBy('order', 'asc')
      );
      
      if (activeOnly) {
        q = query(
          collection(db, 'programs'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id
        } as Program;
      });
    } catch (error) {
      console.error('Error getting programs:', error);
      toast.error('Failed to load programs');
      return [];
    }
  }

  getProgram = async (id: string) => {
    try {
      const docRef = doc(db, 'programs', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        return {
          ...docSnapshot.data(),
          id: docSnapshot.id
        } as Program;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting program:', error);
      toast.error('Failed to load program');
      return null;
    }
  }

  saveProgram = async (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProgram = {
        ...program,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'programs'), newProgram);
      toast.success('Program saved successfully!');
      
      return {
        ...newProgram,
        id: docRef.id
      } as Program;
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
      return null;
    }
  }

  updateProgram = async (id: string, program: Partial<Omit<Program, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const docRef = doc(db, 'programs', id);
      const updateData = {
        ...program,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
      toast.success('Program updated successfully!');
      
      return true;
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update program');
      return false;
    }
  }

  deleteProgram = async (id: string) => {
    try {
      const docRef = doc(db, 'programs', id);
      await deleteDoc(docRef);
      toast.success('Program deleted successfully!');
      
      return true;
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
      return false;
    }
  }

  // Gallery Methods
  getGalleryImages = async (activeOnly = false) => {
    try {
      let q = query(
        collection(db, 'gallery'),
        orderBy('order', 'asc')
      );
      
      if (activeOnly) {
        q = query(
          collection(db, 'gallery'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id
        } as GalleryImage;
      });
    } catch (error) {
      console.error('Error getting gallery images:', error);
      toast.error('Failed to load gallery images');
      return [];
    }
  }

  getGalleryImage = async (id: string) => {
    try {
      const docRef = doc(db, 'gallery', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        return {
          ...docSnapshot.data(),
          id: docSnapshot.id
        } as GalleryImage;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting gallery image:', error);
      toast.error('Failed to load gallery image');
      return null;
    }
  }

  uploadImage = async (file: File, title: string, isActive: boolean, order: number) => {
    try {
      // Create a unique filename
      const fileName = `gallery/${uuidv4()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(fireBaseStorage, fileName);
      
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Return a promise that resolves when the upload is complete
      return new Promise<GalleryImage | null>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
          },
          (error) => {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
            reject(error);
          },
          async () => {
            // Upload complete, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save the image info to Firestore
            const imageData = {
              title,
              imageUrl: downloadURL,
              storageRef: fileName,
              isActive,
              order,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            };
            
            try {
              const docRef = await addDoc(collection(db, 'gallery'), imageData);
              const galleryImage = {
                ...imageData,
                id: docRef.id
              } as GalleryImage;
              
              toast.success('Image uploaded successfully!');
              resolve(galleryImage);
            } catch (error) {
              console.error('Error saving image data:', error);
              toast.error('Failed to save image data');
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error in uploadImage:', error);
      toast.error('Failed to process image upload');
      return null;
    }
  }

  updateGalleryImage = async (id: string, data: Partial<Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'storageRef'>>) => {
    try {
      const docRef = doc(db, 'gallery', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
      toast.success('Gallery image updated successfully!');
      
      return true;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      toast.error('Failed to update gallery image');
      return false;
    }
  }

  deleteGalleryImage = async (id: string) => {
    try {
      // First, get the image data to find the storage reference
      const docRef = doc(db, 'gallery', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        const imageData = docSnapshot.data() as GalleryImage;
        
        // Delete the image from storage
        const storageReference = ref(fireBaseStorage, imageData.storageRef);
        await deleteObject(storageReference);
        
        // Then delete the Firestore document
        await deleteDoc(docRef);
        
        toast.success('Gallery image deleted successfully!');
        return true;
      } else {
        throw new Error('Image not found');
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Failed to delete gallery image');
      return false;
    }
  }

  // Scripture Methods
  getScriptures = async (activeOnly = false) => {
    try {
      let q = query(
        collection(db, 'scriptures'),
        orderBy('createdAt', 'desc')
      );
      
      if (activeOnly) {
        q = query(
          collection(db, 'scriptures'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id
        } as Scripture;
      });
    } catch (error) {
      console.error('Error getting scriptures:', error);
      toast.error('Failed to load scriptures');
      return [];
    }
  }

  getScripture = async (id: string) => {
    try {
      const docRef = doc(db, 'scriptures', id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        return {
          ...docSnapshot.data(),
          id: docSnapshot.id
        } as Scripture;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting scripture:', error);
      toast.error('Failed to load scripture');
      return null;
    }
  }

  saveScripture = async (scripture: Omit<Scripture, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newScripture = {
        ...scripture,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'scriptures'), newScripture);
      toast.success('Scripture saved successfully!');
      
      return {
        ...newScripture,
        id: docRef.id
      } as Scripture;
    } catch (error) {
      console.error('Error saving scripture:', error);
      toast.error('Failed to save scripture');
      return null;
    }
  }

  updateScripture = async (id: string, scripture: Partial<Omit<Scripture, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const docRef = doc(db, 'scriptures', id);
      const updateData = {
        ...scripture,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
      toast.success('Scripture updated successfully!');
      
      return true;
    } catch (error) {
      console.error('Error updating scripture:', error);
      toast.error('Failed to update scripture');
      return false;
    }
  }

  deleteScripture = async (id: string) => {
    try {
      const docRef = doc(db, 'scriptures', id);
      await deleteDoc(docRef);
      toast.success('Scripture deleted successfully!');
      
      return true;
    } catch (error) {
      console.error('Error deleting scripture:', error);
      toast.error('Failed to delete scripture');
      return false;
    }
  }

}();