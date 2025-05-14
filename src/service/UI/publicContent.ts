'use client';

import { Event, EventStatus, GalleryImage, Program, Scripture } from '@/interface/content';

export default new class PublicContentService {
  // Get public content from API
  getPrograms = async (activeOnly = false): Promise<Program[]> => {
    try {
      const response = await fetch(`/api/content?type=programs&activeOnly=${activeOnly}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      
      const data = await response.json();
      return data.programs || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  }

  getGalleryImages = async (activeOnly = false): Promise<GalleryImage[]> => {
    try {
      const response = await fetch(`/api/content?type=gallery&activeOnly=${activeOnly}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }
      
      const data = await response.json();
      return data.gallery || [];
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
  }

  getScriptures = async (activeOnly = false): Promise<Scripture[]> => {
    try {
      const response = await fetch(`/api/content?type=scriptures&activeOnly=${activeOnly}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch scriptures');
      }
      
      const data = await response.json();
      return data.scriptures || [];
    } catch (error) {
      console.error('Error fetching scriptures:', error);
      return [];
    }
  }

  getEvents = async (status?: EventStatus): Promise<Event[]> => {
    try {
      const statusParam = status ? `&status=${status}` : '';
      const response = await fetch(`/api/content?type=events${statusParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      // Convert Firestore timestamps to Firebase Timestamp objects
      const events = data.events || [];
      return events.map((event: any) => {
        // Convert the date timestamp from Firestore format to a JavaScript Date
        // that can be displayed properly
        const eventDate = event.date;
        let date;
        
        if (eventDate && eventDate._seconds) {
          // Convert Firestore timestamp to Date
          date = new Date(eventDate._seconds * 1000);
        } else {
          date = new Date();
        }
        
        return {
          ...event,
          date: {
            // Mimic a Firebase Timestamp object with a toDate method
            toDate: () => date
          }
        };
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  getEvent = async (id: string): Promise<Event | null> => {
    try {
      // Get all events and find the one with matching ID
      const events = await this.getEvents();
      const event = events.find(e => e.id === id);
      return event || null;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }
}