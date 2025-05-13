'use client';

import { useEffect, useState } from 'react';
import { GalleryImage, Program, Scripture } from '@/interface/content';
import ContentService from '@/service/UI/content';
import { toast } from 'react-toastify';

export const usePrograms = (activeOnly = false) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const fetchedPrograms = await ContentService.getPrograms(activeOnly);
      setPrograms(fetchedPrograms);
      setError(null);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err as Error);
      toast.error('Failed to load programs');
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
      const fetchedImages = await ContentService.getGalleryImages(activeOnly);
      setImages(fetchedImages);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(err as Error);
      toast.error('Failed to load gallery images');
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
      const fetchedScriptures = await ContentService.getScriptures(activeOnly);
      setScriptures(fetchedScriptures);
      setError(null);
    } catch (err) {
      console.error('Error fetching scriptures:', err);
      setError(err as Error);
      toast.error('Failed to load scriptures');
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

