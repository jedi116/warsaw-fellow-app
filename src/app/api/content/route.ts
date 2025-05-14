import { NextResponse } from 'next/server';
import { db } from '@/service/firebaseAdmin';
import { Event, EventStatus, GalleryImage, Program, Scripture } from '@/interface/content';

// Public API endpoint for fetching programs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get('type') || 'all';
  const activeOnly = searchParams.get('activeOnly') === 'true';
  const status = searchParams.get('status') as EventStatus | null;

  try {
    let responseData: any = {};

    // Fetch programs if requested
    if (contentType === 'programs' || contentType === 'all') {
      let programsQuery = db.collection('programs');
      
      if (activeOnly) {
        programsQuery = programsQuery.where('isActive', '==', true);
      }
      
      const programsSnapshot = await programsQuery
        .orderBy('order', 'asc')
        .get();

      responseData.programs = programsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    }

    // Fetch gallery images if requested
    if (contentType === 'gallery' || contentType === 'all') {
      let galleryQuery = db.collection('gallery');
      
      if (activeOnly) {
        galleryQuery = galleryQuery.where('isActive', '==', true);
      }
      
      const gallerySnapshot = await galleryQuery
        .orderBy('order', 'asc')
        .get();

      responseData.gallery = gallerySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    }

    // Fetch scriptures if requested
    if (contentType === 'scriptures' || contentType === 'all') {
      let scripturesQuery = db.collection('scriptures');
      
      if (activeOnly) {
        scripturesQuery = scripturesQuery.where('isActive', '==', true);
      }
      
      const scripturesSnapshot = await scripturesQuery
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      responseData.scriptures = scripturesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    }

    // Fetch events if requested
    if (contentType === 'events' || contentType === 'all') {
      let eventQuery = db.collection('events');
      
      if (status) {
        eventQuery = eventQuery.where('status', '==', status);
      }
      
      const eventSort = status === EventStatus.PAST ? 'desc' : 'asc';
      const eventsSnapshot = await eventQuery
        .orderBy('date', eventSort)
        .get();

      responseData.events = eventsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}