'use client';

import { useEffect, useState } from 'react';
import { Event, EventStatus, GalleryImage, Program, Scripture } from '@/interface/content';
import ContentService from '@/service/UI/content';
import { toast } from 'react-toastify';
import { Timestamp } from 'firebase/firestore';
import { auth } from '@/service/UI/firebaseUiClient';

export const usePrograms = (activeOnly = false) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      // Check if the user is authenticated before fetching
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // User is not logged in, return empty array silently
        setPrograms([]);
        return;
      }
      
      const fetchedPrograms = await ContentService.getPrograms(activeOnly);
      setPrograms(fetchedPrograms);
      setError(null);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err as Error);
      setPrograms([]); // Set empty array on error
      // Don't show toast for permission errors to avoid spamming
      if (!(err instanceof Error) || !err.message.includes('permission')) {
        toast.error('Failed to load programs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [activeOnly]);

  return {
    programs,
    loading,
    error,
    refreshPrograms: fetchPrograms
  };
};

export const useGalleryImages = (activeOnly = false) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Check if the user is authenticated before fetching
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // User is not logged in, return empty array silently
        setImages([]);
        return;
      }
      
      const fetchedImages = await ContentService.getGalleryImages(activeOnly);
      setImages(fetchedImages);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(err as Error);
      setImages([]); // Set empty array on error
      // Don't show toast for permission errors to avoid spamming
      if (!(err instanceof Error) || !err.message.includes('permission')) {
        toast.error('Failed to load gallery images');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeOnly]);

  return {
    images,
    loading,
    error,
    refreshImages: fetchImages
  };
};

export const useScriptures = (activeOnly = false) => {
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScriptures = async () => {
    try {
      setLoading(true);
      // Check if the user is authenticated before fetching
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // User is not logged in, return empty array silently
        setScriptures([]);
        return;
      }
      
      const fetchedScriptures = await ContentService.getScriptures(activeOnly);
      setScriptures(fetchedScriptures);
      setError(null);
    } catch (err) {
      console.error('Error fetching scriptures:', err);
      setError(err as Error);
      setScriptures([]); // Set empty array on error
      // Don't show toast for permission errors to avoid spamming
      if (!(err instanceof Error) || !err.message.includes('permission')) {
        toast.error('Failed to load scriptures');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScriptures();
  }, [activeOnly]);

  return {
    scriptures,
    loading,
    error,
    refreshScriptures: fetchScriptures
  };
};

export const useProgramOperations = () => {
  const { programs, refreshPrograms } = usePrograms(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const addProgram = async (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSubmitting(true);
      await ContentService.saveProgram(program);
      refreshPrograms();
      return true;
    } catch (error) {
      console.error('Error adding program:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateProgram = async (id: string, program: Partial<Omit<Program, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setSubmitting(true);
      await ContentService.updateProgram(id, program);
      refreshPrograms();
      return true;
    } catch (error) {
      console.error('Error updating program:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      setSubmitting(true);
      await ContentService.deleteProgram(id);
      refreshPrograms();
      return true;
    } catch (error) {
      console.error('Error deleting program:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProgramActive = async (id: string, isActive: boolean) => {
    return updateProgram(id, { isActive });
  };

  return {
    programs,
    submitting,
    addProgram,
    updateProgram,
    deleteProgram,
    toggleProgramActive,
    refreshPrograms
  };
};

export const useGalleryOperations = () => {
  const { images, refreshImages } = useGalleryImages(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const uploadImage = async (file: File, title: string, isActive: boolean, order: number) => {
    try {
      setSubmitting(true);
      await ContentService.uploadImage(file, title, isActive, order);
      refreshImages();
      return true;
    } catch (error) {
      console.error('Error uploading image:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateImage = async (id: string, data: Partial<Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'storageRef'>>) => {
    try {
      setSubmitting(true);
      await ContentService.updateGalleryImage(id, data);
      refreshImages();
      return true;
    } catch (error) {
      console.error('Error updating image:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      setSubmitting(true);
      await ContentService.deleteGalleryImage(id);
      refreshImages();
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleImageActive = async (id: string, isActive: boolean) => {
    return updateImage(id, { isActive });
  };

  return {
    images,
    submitting,
    uploadImage,
    updateImage,
    deleteImage,
    toggleImageActive,
    refreshImages
  };
};

export const useScriptureOperations = () => {
  const { scriptures, refreshScriptures } = useScriptures(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const addScripture = async (scripture: Omit<Scripture, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSubmitting(true);
      await ContentService.saveScripture(scripture);
      refreshScriptures();
      return true;
    } catch (error) {
      console.error('Error adding scripture:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateScripture = async (id: string, scripture: Partial<Omit<Scripture, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setSubmitting(true);
      await ContentService.updateScripture(id, scripture);
      refreshScriptures();
      return true;
    } catch (error) {
      console.error('Error updating scripture:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteScripture = async (id: string) => {
    try {
      setSubmitting(true);
      await ContentService.deleteScripture(id);
      refreshScriptures();
      return true;
    } catch (error) {
      console.error('Error deleting scripture:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleScriptureActive = async (id: string, isActive: boolean) => {
    return updateScripture(id, { isActive });
  };

  return {
    scriptures,
    submitting,
    addScripture,
    updateScripture,
    deleteScripture,
    toggleScriptureActive,
    refreshScriptures
  };
};

export const useEvents = (status?: EventStatus) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Check if the user is authenticated before fetching
      // This prevents unnecessary Firebase permission errors
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // User is not logged in, return empty array silently
        setEvents([]);
        return;
      }
      
      const fetchedEvents = await ContentService.getEvents(status);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
      setEvents([]); // Set empty array on error
      // Don't show toast for permission errors to avoid spamming
      if (!(err instanceof Error) || !err.message.includes('permission')) {
        toast.error('Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [status]);

  return {
    events,
    loading,
    error,
    refreshEvents: fetchEvents
  };
};

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      // Check if the user is authenticated before fetching
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // User is not logged in, return null silently
        setEvent(null);
        return;
      }
      
      const fetchedEvent = await ContentService.getEvent(id);
      setEvent(fetchedEvent);
      setError(null);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err as Error);
      setEvent(null);
      // Don't show toast for permission errors to avoid spamming
      if (!(err instanceof Error) || !err.message.includes('permission')) {
        toast.error('Failed to load event');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  return {
    event,
    loading,
    error,
    refreshEvent: fetchEvent
  };
};

export const useEventOperations = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async (status?: EventStatus) => {
    try {
      setLoading(true);
      const fetchedEvents = await ContentService.getEvents(status);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
    imageFile?: File
  ) => {
    try {
      setSubmitting(true);
      // Ensure date is a valid Timestamp
      if (!(event.date instanceof Timestamp)) {
        console.error('Invalid date format:', event.date);
        toast.error('Invalid date format. Please try again.');
        return false;
      }
      
      await ContentService.saveEvent(event, imageFile);
      fetchEvents();
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event: ' + (error as Error).message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateEvent = async (
    id: string,
    event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>,
    imageFile?: File
  ) => {
    try {
      setSubmitting(true);
      // Ensure date is a valid Timestamp if provided
      if (event.date && !(event.date instanceof Timestamp)) {
        console.error('Invalid date format:', event.date);
        toast.error('Invalid date format. Please try again.');
        return false;
      }
      
      await ContentService.updateEvent(id, event, imageFile);
      fetchEvents();
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event: ' + (error as Error).message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setSubmitting(true);
      await ContentService.deleteEvent(id);
      fetchEvents();
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateEventStatus = async (id: string, status: EventStatus) => {
    try {
      setSubmitting(true);
      await ContentService.updateEventStatus(id, status);
      fetchEvents();
      return true;
    } catch (error) {
      console.error('Error updating event status:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEventHighlight = async (id: string, isHighlighted: boolean) => {
    try {
      setSubmitting(true);
      await ContentService.toggleEventHighlight(id, isHighlighted);
      fetchEvents();
      return true;
    } catch (error) {
      console.error('Error highlighting event:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    events,
    loading,
    submitting,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    toggleEventHighlight,
    refreshEvents: fetchEvents
  };
};

