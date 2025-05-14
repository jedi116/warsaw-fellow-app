'use client';

import React, { useState, useRef } from 'react';
import {
  Paper,
  Title,
  Button,
  Group,
  Text,
  ActionIcon,
  TextInput,
  Textarea,
  Select,
  Box,
  Modal,
  Card,
  Badge,
  SimpleGrid,
  Menu,
  Tabs,
  Image,
  Stack,
  FileInput,
  SegmentedControl,
  Divider,
  Loader,
  Center,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Timestamp } from 'firebase/firestore';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCalendarEvent, 
  IconUpload,
  IconStar,
  IconStarFilled,
  IconArrowUp,
  IconArrowDown,
  IconLocation,
  IconClock,
  IconPhoto
} from '@tabler/icons-react';
import { useEventOperations } from '@/hooks/content';
import { Event, EventStatus } from '@/interface/content';
import { useForm } from '@mantine/form';
import { css } from '@emotion/react';
import { toast } from 'react-toastify';

export default function EventManager() {
  const { events, loading, submitting, addEvent, updateEvent, deleteEvent, updateEventStatus, toggleEventHighlight, refreshEvents } = useEventOperations();
  const [opened, setOpened] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('upcoming');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const resetRef = useRef<() => void>(null);
  
  // Convert activeTab to EventStatus
  const statusFilter = activeTab === 'upcoming' 
    ? EventStatus.UPCOMING 
    : activeTab === 'past' 
      ? EventStatus.PAST 
      : activeTab === 'cancelled' 
        ? EventStatus.CANCELLED 
        : undefined;
  
  // Filter events based on the active tab
  const filteredEvents = events.filter(event => 
    activeTab === 'all' ? true : event.status === statusFilter
  );
  
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      date: new Date(),
      time: '',
      location: '',
      status: EventStatus.UPCOMING,
      isHighlighted: false,
      image: null as File | null,
    },
    validate: {
      title: (value) => value.trim().length < 3 ? 'Title must be at least 3 characters' : null,
      description: (value) => value.trim().length < 10 ? 'Description must be at least 10 characters' : null,
      date: (value) => !value ? 'Date is required' : null,
      time: (value) => value.trim().length < 3 ? 'Time must be specified' : null,
      location: (value) => value.trim().length < 3 ? 'Location must be specified' : null,
    }
  });
  
  const handleOpenModal = (event?: Event) => {
    if (event) {
      // Edit mode
      setEditingEvent(event);
      form.setValues({
        title: event.title,
        description: event.description,
        date: event.date.toDate(),
        time: event.time,
        location: event.location,
        status: event.status,
        isHighlighted: event.isHighlighted,
        image: null,
      });
      setImagePreview(event.imageUrl || null);
    } else {
      // Create mode
      setEditingEvent(null);
      form.setValues({
        title: '',
        description: '',
        date: new Date(),
        time: '',
        location: '',
        status: EventStatus.UPCOMING,
        isHighlighted: false,
        image: null,
      });
      setImagePreview(null);
    }
    setOpened(true);
  };
  
  const handleSubmit = async (values: typeof form.values) => {
    try {
      const { image, date, ...eventData } = values;
      
      // Ensure date is a proper Date object and convert to Firebase Timestamp
      let eventTimestamp;
      if (date instanceof Date && !isNaN(date.getTime())) {
        eventTimestamp = Timestamp.fromDate(date);
      } else {
        // Fallback to current date if we have an invalid date
        console.warn('Invalid date value:', date);
        eventTimestamp = Timestamp.fromDate(new Date());
      }
      
      if (editingEvent) {
        // Update existing event
        await updateEvent(
          editingEvent.id, 
          { ...eventData, date: eventTimestamp },
          image || undefined
        );
      } else {
        // Create new event
        await addEvent(
          { ...eventData, date: eventTimestamp },
          image || undefined
        );
      }
      setOpened(false);
      form.reset();
      setImagePreview(null);
      if (resetRef.current) {
        resetRef.current();
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error('Failed to save event: ' + (error as Error).message);
    }
  };
  
  const handleChangeStatus = async (event: Event, status: EventStatus) => {
    await updateEventStatus(event.id, status);
  };
  
  const handleToggleHighlight = async (event: Event) => {
    await toggleEventHighlight(event.id, !event.isHighlighted);
  };

  const handleDeleteEvent = async (event: Event) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${event.title}"?`);
    if (confirmed) {
      await deleteEvent(event.id);
    }
  };
  
  const handleImageChange = (file: File | null) => {
    form.setFieldValue('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // If editing and there was an existing image
      if (editingEvent && editingEvent.imageUrl) {
        setImagePreview(editingEvent.imageUrl);
      } else {
        setImagePreview(null);
      }
    }
  };
  
  const clearImage = () => {
    form.setFieldValue('image', null);
    if (editingEvent && editingEvent.imageUrl) {
      setImagePreview(editingEvent.imageUrl);
    } else {
      setImagePreview(null);
    }
    if (resetRef.current) {
      resetRef.current();
    }
  };
  
  const cardStyles = css`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
    
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
  
  const getStatusBadge = (status: EventStatus) => {
    switch(status) {
      case EventStatus.UPCOMING: return 'Upcoming';
      case EventStatus.PAST: return 'Past';
      case EventStatus.CANCELLED: return 'Cancelled';
      default: return status;
    }
  };

  // Format date as string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Group position="apart" mb="lg">
        <Title order={3}>Event Management</Title>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={() => handleOpenModal()}
          loading={submitting}
          radius="md"
        >
          Add Event
        </Button>
      </Group>
      
      <Tabs value={activeTab} onChange={setActiveTab} mb="lg">
        <Tabs.List>
          <Tabs.Tab value="all">All Events</Tabs.Tab>
          <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
          <Tabs.Tab value="past">Past</Tabs.Tab>
          <Tabs.Tab value="cancelled">Cancelled</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {loading ? (
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      ) : filteredEvents.length === 0 ? (
        <Text c="dimmed" ta="center" py={30}>No events found. Add a new event to get started.</Text>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2, spacing: 'md' },
            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
          ]}
        >
          {filteredEvents.map((event) => (
            <Card key={event.id} withBorder p={0} radius="md" css={cardStyles}>
              {event.isHighlighted && (
                <Badge 
                  leftSection={<IconStarFilled size={12} />}
                  color="yellow" 
                  size="sm"
                  style={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    zIndex: 2 
                  }}
                >
                  Highlighted
                </Badge>
              )}
              
              <Card.Section>
                <Image
                  src={event.imageUrl || '/placeholder_book.png'}
                  height={200}
                  alt={event.title}
                  fallbackSrc="/placeholder_book.png"
                />
              </Card.Section>
              
              <Box p="md">
                <Group position="apart" mb="xs">
                  <Text fw={600} size="lg" lineClamp={1}>{event.title}</Text>
                  
                  <Menu position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon>
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    
                    <Menu.Dropdown>
                      <Menu.Item 
                        icon={<IconEdit size={16} />} 
                        onClick={() => handleOpenModal(event)}
                      >
                        Edit Event
                      </Menu.Item>
                      
                      <Menu.Item 
                        icon={event.isHighlighted ? <IconStarFilled size={16} /> : <IconStar size={16} />} 
                        onClick={() => handleToggleHighlight(event)}
                      >
                        {event.isHighlighted ? 'Remove Highlight' : 'Highlight Event'}
                      </Menu.Item>
                      
                      <Menu.Divider />
                      
                      <Menu.Label>Change Status</Menu.Label>
                      {event.status !== EventStatus.UPCOMING && (
                        <Menu.Item onClick={() => handleChangeStatus(event, EventStatus.UPCOMING)}>
                          Mark as Upcoming
                        </Menu.Item>
                      )}
                      {event.status !== EventStatus.PAST && (
                        <Menu.Item onClick={() => handleChangeStatus(event, EventStatus.PAST)}>
                          Mark as Past
                        </Menu.Item>
                      )}
                      {event.status !== EventStatus.CANCELLED && (
                        <Menu.Item onClick={() => handleChangeStatus(event, EventStatus.CANCELLED)}>
                          Cancel Event
                        </Menu.Item>
                      )}
                      
                      <Menu.Divider />
                      
                      <Menu.Item 
                        color="red" 
                        icon={<IconTrash size={16} />}
                        onClick={() => handleDeleteEvent(event)}
                      >
                        Delete Event
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
                
                <Badge color={getStatusColor(event.status)} mb="sm">
                  {getStatusBadge(event.status)}
                </Badge>
                
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
      )}
      
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={editingEvent ? "Edit Event" : "Add New Event"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Event Title"
            placeholder="Example: Sunday Worship Service"
            required
            {...form.getInputProps('title')}
            mb="md"
          />
          
          <Textarea
            label="Description"
            placeholder="Provide details about the event..."
            required
            minRows={3}
            {...form.getInputProps('description')}
            mb="md"
          />
          
          <Group grow mb="md">
            <DatePickerInput
              label="Date"
              placeholder="Select event date"
              required
              {...form.getInputProps('date')}
            />
            
            <TextInput
              label="Time"
              placeholder="Example: 10:00 AM - 12:00 PM"
              required
              {...form.getInputProps('time')}
            />
          </Group>
          
          <TextInput
            label="Location"
            placeholder="Example: Community Center, Room 101"
            required
            icon={<IconLocation size={16} />}
            {...form.getInputProps('location')}
            mb="md"
          />
          
          <Group grow mb="md">
            <Box>
              <Text size="sm" fw={500} mb={5}>Event Status</Text>
              <SegmentedControl
                data={[
                  { label: 'Upcoming', value: EventStatus.UPCOMING },
                  { label: 'Past', value: EventStatus.PAST },
                  { label: 'Cancelled', value: EventStatus.CANCELLED },
                ]}
                {...form.getInputProps('status')}
              />
            </Box>
            
            <Box>
              <Text size="sm" fw={500} mb={5}>Highlight on Homepage</Text>
              <SegmentedControl
                data={[
                  { label: 'No', value: 'false' },
                  { label: 'Yes', value: 'true' },
                ]}
                value={form.values.isHighlighted ? 'true' : 'false'}
                onChange={(val) => form.setFieldValue('isHighlighted', val === 'true')}
              />
            </Box>
          </Group>
          
          <Box mb="lg">
            <Text size="sm" fw={500} mb={5}>Event Image</Text>
            <FileInput
              placeholder="Upload event image"
              accept="image/png,image/jpeg,image/webp"
              icon={<IconUpload size={16} />}
              value={form.values.image}
              onChange={handleImageChange}
              clearable
              resetRef={resetRef}
              mb="xs"
            />
            
            {imagePreview && (
              <Box mb="md">
                <Image
                  src={imagePreview}
                  height={200}
                  radius="md"
                  alt="Event image preview"
                  withPlaceholder
                  caption="Image Preview"
                />
              </Box>
            )}
            
            {!form.values.image && editingEvent && editingEvent.imageUrl && (
              <Text size="xs" c="dimmed">Using existing image. Upload a new one to replace it.</Text>
            )}
          </Box>
          
          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Save Event</Button>
          </Group>
        </form>
      </Modal>
    </Paper>
  );
}