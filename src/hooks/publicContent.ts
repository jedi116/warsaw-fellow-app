'use client';

import { useEffect, useState } from 'react';
import { Event, EventStatus, GalleryImage, Program, Scripture } from '@/interface/content';
import PublicContentService from '@/service/UI/publicContent';

export const usePublicPrograms = (activeOnly = false) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const fetchedPrograms = await PublicContentService.getPrograms(activeOnly);
      setPrograms(fetchedPrograms);
      setError(null);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err as Error);
      setPrograms([]);
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

export const usePublicGalleryImages = (activeOnly = false) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const fetchedImages = await PublicContentService.getGalleryImages(activeOnly);
      setImages(fetchedImages);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(err as Error);
      setImages([]);
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

export const usePublicScriptures = (activeOnly = false) => {
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScriptures = async () => {
    try {
      setLoading(true);
      const fetchedScriptures = await PublicContentService.getScriptures(activeOnly);
      setScriptures(fetchedScriptures);
      setError(null);
    } catch (err) {
      console.error('Error fetching scriptures:', err);
      setError(err as Error);
      setScriptures([]);
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

export const usePublicEvents = (status?: EventStatus) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await PublicContentService.getEvents(status);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
      setEvents([]);
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

export const usePublicEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const fetchedEvent = await PublicContentService.getEvent(id);
      setEvent(fetchedEvent);
      setError(null);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err as Error);
      setEvent(null);
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