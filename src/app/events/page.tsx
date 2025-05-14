'use client';

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import {
  Container,
  Title,
  Text,
  Tabs,
  Card,
  Badge,
  Group,
  Image,
  SimpleGrid,
  Box,
  ActionIcon,
  Center,
  Loader,
  Button,
  Divider
} from '@mantine/core';
import { 
  IconCalendarEvent, 
  IconLocation, 
  IconClock,
  IconStarFilled
} from '@tabler/icons-react';
import { usePublicEvents } from '@/hooks/publicContent';
import { Event, EventStatus } from '@/interface/content';
import { css } from '@emotion/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/service/UI/firebaseUiClient';
import { Timestamp } from 'firebase/firestore';


const EventsPageContent = () => {
  const [user, authLoading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<string | null>('upcoming');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get events data based on active tab
  const status = activeTab === 'upcoming' 
    ? EventStatus.UPCOMING 
    : activeTab === 'past' 
      ? EventStatus.PAST 
      : undefined;
  
  // Use public events hook that doesn't require authentication
  const { events, loading: eventsLoading } = usePublicEvents(status);

  // Wait for auth state to be determined before initializing
  useEffect(() => {
    if (!authLoading) {
      setIsInitialized(true);
    }
  }, [authLoading]);
  
  // Loading state combines auth loading and events loading
  const loading = !isInitialized || authLoading || (user && eventsLoading);
  
  // Filter highlighted events for special display
  const highlightedEvents = events.filter(event => event.isHighlighted);
  const regularEvents = events.filter(event => !event.isHighlighted);
  
  const cardStyles = css`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    }
  `;
  
  const getStatusColor = (status: EventStatus) => {
    switch(status) {
      case EventStatus.UPCOMING: return 'teal';
      case EventStatus.PAST: return 'blue';
      case EventStatus.CANCELLED: return 'red';
      default: return 'gray';
    }
  };
  
  // Format date as string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Container size="lg" py="xl">
      <Box ta="center" mb="xl">
        <Title order={1} mb="md">Fellowship Events</Title>
        <Text maw={700} mx="auto" size="lg" c="dimmed">
          Join us for our upcoming events and gatherings. We welcome everyone to be part of our community.
        </Text>
      </Box>
      
      <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
        <Tabs.List grow position="center">
          <Tabs.Tab value="upcoming">Upcoming Events</Tabs.Tab>
          <Tabs.Tab value="past">Past Events</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {loading ? (
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      ) : events.length === 0 ? (
        <Center py={50}>
          <Text size="lg" c="dimmed">No events found in this category.</Text>
        </Center>
      ) : (
        <Box>
          {/* Show highlighted events first */}
          {highlightedEvents.length > 0 && (
            <>
              <Title order={3} mb="lg">
                <Group spacing={8}>
                  <IconStarFilled size={20} style={{ color: 'var(--mantine-color-yellow-5)' }} /> 
                  Featured Events
                </Group>
              </Title>
              
              <SimpleGrid
                cols={highlightedEvents.length === 1 ? 1 : 2}
                spacing="xl"
                mb="xl"
                breakpoints={[
                  { maxWidth: 'md', cols: 1 },
                ]}
              >
                {highlightedEvents.map((event) => (
                  <Card key={event.id} withBorder shadow="sm" p={0} radius="md" css={cardStyles}>
                    <Card.Section>
                      <Image
                        src={event.imageUrl || '/placeholder_book.png'}
                        height={300}
                        alt={event.title}
                        fallbackSrc="/placeholder_book.png"
                      />
                    </Card.Section>
                    
                    <Box p="lg" style={{ flex: 1 }}>
                      <Group position="apart" mb="md">
                        <Title order={3}>{event.title}</Title>
                        <Badge 
                          color={getStatusColor(event.status)}
                          leftSection={event.status === EventStatus.CANCELLED ? <IconStarFilled size={14} /> : undefined}
                        >
                          {event.status === EventStatus.UPCOMING ? 'Upcoming' : 
                           event.status === EventStatus.PAST ? 'Past' : 'Cancelled'}
                        </Badge>
                      </Group>
                      
                      <Group spacing={10} mb="xs">
                        <IconCalendarEvent size={18} />
                        <Text fw={500}>{formatDate(event.date.toDate())}</Text>
                      </Group>
                      
                      <Group spacing={10} mb="xs">
                        <IconClock size={18} />
                        <Text>{event.time}</Text>
                      </Group>
                      
                      <Group spacing={10} mb="md">
                        <IconLocation size={18} />
                        <Text>{event.location}</Text>
                      </Group>
                      
                      <Text size="md" mb="lg">{event.description}</Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
              
              {regularEvents.length > 0 && <Divider mb="xl" />}
            </>
          )}
          
          {/* Show regular events */}
          {regularEvents.length > 0 && (
            <>
              <Title order={3} mb="lg">
                {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </Title>
              
              <SimpleGrid
                cols={3}
                spacing="lg"
                breakpoints={[
                  { maxWidth: 'md', cols: 2, spacing: 'md' },
                  { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                ]}
              >
                {regularEvents.map((event) => (
                  <Card key={event.id} withBorder shadow="sm" p={0} radius="md" css={cardStyles}>
                    <Card.Section>
                      <Image
                        src={event.imageUrl || '/placeholder_book.png'}
                        height={200}
                        alt={event.title}
                        fallbackSrc="/placeholder_book.png"
                      />
                    </Card.Section>
                    
                    <Box p="md" style={{ flex: 1 }}>
                      <Badge 
                        color={getStatusColor(event.status)}
                        mb="xs"
                      >
                        {event.status === EventStatus.UPCOMING ? 'Upcoming' : 
                         event.status === EventStatus.PAST ? 'Past' : 'Cancelled'}
                      </Badge>
                      
                      <Text fw={700} size="lg" mb="xs" lineClamp={1}>{event.title}</Text>
                      
                      <Group spacing={6} mb="xs">
                        <IconCalendarEvent size={14} />
                        <Text size="sm">{formatDate(event.date.toDate())}</Text>
                      </Group>
                      
                      <Group spacing={6} mb="xs">
                        <IconClock size={14} />
                        <Text size="sm">{event.time}</Text>
                      </Group>
                      
                      <Group spacing={6} mb="md">
                        <IconLocation size={14} />
                        <Text size="sm" lineClamp={1}>{event.location}</Text>
                      </Group>
                      
                      <Text size="sm" lineClamp={2} mb="md">{event.description}</Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}
        </Box>
      )}
    </Container>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}