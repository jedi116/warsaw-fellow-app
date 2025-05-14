'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Box,
  Grid,
  Title,
  Stack,
  Button,
  Loader,
  Center,
  Divider,
  Alert,
  Tabs,
  Modal,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  useMantineColorScheme,
  ThemeIcon,
  ActionIcon,
  Paper,
  FileInput,
  Switch,
  LoadingOverlay,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { BookStatus, BookWithDetails, BorrowRequestStatus, Genre } from '@/interface/library';
import { useBook, useBookOperations, useAdminBorrowOperations, useBorrowOperations, useBorrowRequests } from '@/hooks/library';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/service/UI/firebaseUiClient';
import { useProfile } from '@/hooks/profile';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { 
  IconBook, 
  IconUser, 
  IconCalendar, 
  IconAlertCircle,
  IconClockHour4,
  IconHistory,
  IconEdit,
  IconTrash,
  IconUpload,
  IconCheck,
  IconX,
  IconArrowBack
} from '@tabler/icons-react';
import { css } from '@emotion/react';
import Link from 'next/link';

interface BookDetailProps {
  id: string;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export default function BookDetail({ id }: BookDetailProps) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { profile } = useProfile();
  const { book, loading, refreshBook } = useBook(id);
  const { submitting: bookSubmitting, updateBook, deleteBook } = useBookOperations();
  const { submitting: borrowSubmitting, createBorrowRequest } = useBorrowOperations();
  const { submitting: adminSubmitting, approveBorrowRequest, rejectBorrowRequest, returnBook } = useAdminBorrowOperations();
  
  // Get borrow requests for this book
  const { requests, loading: requestsLoading, refreshRequests } = useBorrowRequests(
    undefined, // All statuses
    undefined, // All users
    id // This book
  );
  
  // UI state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('details');
  
  // Form for editing book
  const editForm = useForm({
    initialValues: {
      title: '',
      author: '',
      description: '',
      genre: '' as Genre,
      year: 2023,
      status: '' as BookStatus,
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title must be at least 3 characters long' : null),
      author: (value) => (value.length < 3 ? 'Author must be at least 3 characters long' : null),
      year: (value) => (value < 1000 || value > new Date().getFullYear() ? 'Enter a valid year' : null),
    },
  });
  
  // Form for borrowing book
  const borrowForm = useForm({
    initialValues: {
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
    validate: {
      dueDate: (value) => (value <= new Date() ? 'Due date must be in the future' : null),
    },
  });
  
  // Upload state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  // Set form values when book data is loaded
  useEffect(() => {
    if (book) {
      editForm.setValues({
        title: book.title,
        author: book.author,
        description: book.description || '',
        genre: book.genre,
        year: book.year,
        status: book.status,
      });
    }
  }, [book]);
  
  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (editForm.validate().hasErrors) return;
    
    const result = await updateBook(id, editForm.values, coverImage || undefined);
    
    if (result) {
      setEditModalOpen(false);
      refreshBook();
    }
  };
  
  // Handle borrow form submission
  const handleBorrowSubmit = async () => {
    if (borrowForm.validate().hasErrors) return;
    
    const result = await createBorrowRequest(id, borrowForm.values.dueDate);
    
    if (result) {
      setBorrowModalOpen(false);
      refreshRequests();
      refreshBook();
    }
  };
  
  // Handle book deletion
  const handleDeleteBook = async () => {
    const result = await deleteBook(id);
    
    if (result) {
      setDeleteModalOpen(false);
      router.push('/library');
    }
  };
  
  // Handle borrow request approval
  const handleApproveRequest = async (requestId: string) => {
    const result = await approveBorrowRequest(requestId);
    
    if (result) {
      refreshRequests();
      refreshBook();
    }
  };
  
  // Handle borrow request rejection
  const handleRejectRequest = async (requestId: string) => {
    const result = await rejectBorrowRequest(requestId);
    
    if (result) {
      refreshRequests();
    }
  };
  
  // Handle book return
  const handleReturnBook = async (requestId: string) => {
    const result = await returnBook(requestId);
    
    if (result) {
      refreshBook();
      refreshRequests();
    }
  };
  
  // Check if user already has a pending request
  const hasPendingRequest = requests.some(
    req => req.userId === user?.uid && req.status === BorrowRequestStatus.PENDING
  );
  
  // Check if user is currently borrowing this book
  const isCurrentBorrower = book?.currentBorrower?.id === user?.uid;
  
  // Format borrow request status
  const formatRequestStatus = (status: BorrowRequestStatus) => {
    switch (status) {
      case BorrowRequestStatus.PENDING:
        return { label: 'Pending', color: 'yellow' };
      case BorrowRequestStatus.APPROVED:
        return { label: 'Approved', color: 'green' };
      case BorrowRequestStatus.REJECTED:
        return { label: 'Rejected', color: 'red' };
      case BorrowRequestStatus.RETURNED:
        return { label: 'Returned', color: 'blue' };
      case BorrowRequestStatus.OVERDUE:
        return { label: 'Overdue', color: 'orange' };
      default:
        return { label: status, color: 'gray' };
    }
  };
  
  // Styling
  const statusStyles = {
    [BookStatus.AVAILABLE]: { color: 'green', label: 'Available' },
    [BookStatus.BORROWED]: { color: 'blue', label: 'Borrowed' },
    [BookStatus.RESERVED]: { color: 'yellow', label: 'Reserved' },
    [BookStatus.MAINTENANCE]: { color: 'red', label: 'Maintenance' }
  };
  
  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }
  
  if (!book) {
    return (
      <Alert color="red" title="Book not found">
        The requested book could not be found. It may have been deleted.
      </Alert>
    );
  }
  
  return (
    <Box>
      <Button 
        component={Link} 
        href="/library" 
        variant="subtle" 
        leftSection={<IconArrowBack size={16} />} 
        mb="lg"
      >
        Back to Library
      </Button>
      
      <Grid gutter="xl">
        {/* Book details */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder shadow="sm">
            <Card.Section>
              <Image
                src={book.coverImageUrl || '/placeholder_book.png'}
                alt={book.title}
                fallbackSrc="/placeholder_book.png"
                height={300}
                styles={{ image: { objectFit: 'cover' } }}
              />
            </Card.Section>
            
            <Stack spacing="xs" mt="md">
              <Badge 
                size="lg" 
                color={statusStyles[book.status].color}
                fullWidth
              >
                {statusStyles[book.status].label}
              </Badge>
              
              <Badge 
                variant="outline" 
                color="blue" 
                size="md"
                fullWidth
              >
                {book.genre}
              </Badge>
              
              <Text size="sm" c="dimmed">Published: {book.year}</Text>
            </Stack>
            
            {/* Admin actions */}
            {profile?.role === 'admin' && (
              <>
                <Divider my="md" label="Admin Actions" labelPosition="center" />
                <Group grow>
                  <Button 
                    variant="outline" 
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setEditModalOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button 
                    color="red" 
                    variant="outline" 
                    leftSection={<IconTrash size={16} />}
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    Delete
                  </Button>
                </Group>
              </>
            )}
            
            {/* Borrow action for all users */}
            {user && book.status === BookStatus.AVAILABLE && !hasPendingRequest && (
              <>
                <Divider my="md" />
                <Button 
                  color="blue" 
                  fullWidth
                  onClick={() => setBorrowModalOpen(true)}
                >
                  Request to Borrow
                </Button>
              </>
            )}
            
            {/* Show pending request status */}
            {hasPendingRequest && (
              <Alert color="yellow" title="Request Pending" mt="md">
                You already have a pending request for this book. Please wait for approval.
              </Alert>
            )}
          </Card>
          
          {/* Display current borrower info */}
          {book.currentBorrower && (
            <Card withBorder mt="md" p="sm">
              <Group position="apart" mb="xs">
                <Text fw={600}>Currently Borrowed</Text>
                {book.isOverdue && (
                  <Badge color="red">Overdue</Badge>
                )}
              </Group>
              
              <Group spacing="xs">
                <ThemeIcon size="md" color="blue" variant="light">
                  <IconUser size={14} />
                </ThemeIcon>
                <Text size="sm">
                  {book.currentBorrower.firstName} {book.currentBorrower.lastName}
                </Text>
              </Group>
              
              <Group spacing="xs" mt="xs">
                <ThemeIcon size="md" color="green" variant="light">
                  <IconCalendar size={14} />
                </ThemeIcon>
                <Text size="sm">
                  Borrowed: {formatDate(book.currentBorrower.borrowDate.toDate())}
                </Text>
              </Group>
              
              <Group spacing="xs" mt="xs">
                <ThemeIcon size="md" color={book.isOverdue ? "red" : "blue"} variant="light">
                  <IconClockHour4 size={14} />
                </ThemeIcon>
                <Text size="sm" color={book.isOverdue ? "red" : undefined}>
                  Due: {formatDate(book.currentBorrower.dueDate.toDate())}
                </Text>
              </Group>
              
              {/* Return action for admin */}
              {profile?.role === 'admin' && (
                <Button 
                  mt="md" 
                  fullWidth 
                  onClick={() => handleReturnBook(book.currentBorrower!.borrowRequestId)}
                  loading={adminSubmitting}
                >
                  Mark as Returned
                </Button>
              )}
            </Card>
          )}
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List mb="md">
              <Tabs.Tab value="details" leftSection={<IconBook size={16} />}>
                Book Details
              </Tabs.Tab>
              {profile?.role === 'admin' && (
                <Tabs.Tab value="requests" leftSection={<IconHistory size={16} />}>
                  Borrow Requests
                </Tabs.Tab>
              )}
            </Tabs.List>
            
            <Tabs.Panel value="details">
              <Title order={1} mb="xs">{book.title}</Title>
              <Text size="xl" c="dimmed" mb="lg">by {book.author}</Text>
              
              <Divider my="md" />
              
              {book.description ? (
                <Text>{book.description}</Text>
              ) : (
                <Text c="dimmed" fs="italic">No description available.</Text>
              )}
            </Tabs.Panel>
            
            <Tabs.Panel value="requests">
              <Title order={3} mb="md">Borrow Requests</Title>
              
              {requestsLoading ? (
                <Center h={200}>
                  <Loader />
                </Center>
              ) : requests.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">No borrow requests for this book.</Text>
              ) : (
                <Stack spacing="md">
                  {requests.map(request => (
                    <Paper key={request.id} withBorder p="md">
                      <Group position="apart">
                        <Box>
                          <Group>
                            <ThemeIcon color="blue" variant="light">
                              <IconUser size={16} />
                            </ThemeIcon>
                            <Text fw={600}>
                              {request.user?.firstName} {request.user?.lastName}
                            </Text>
                          </Group>
                          <Text size="sm" c="dimmed" ml={30}>
                            {request.user?.email}
                          </Text>
                        </Box>
                        
                        <Badge color={formatRequestStatus(request.status).color}>
                          {formatRequestStatus(request.status).label}
                        </Badge>
                      </Group>
                      
                      <Group mt="sm" position="apart">
                        <Group>
                          <ThemeIcon color="cyan" variant="light">
                            <IconCalendar size={16} />
                          </ThemeIcon>
                          <Text size="sm">
                            Requested: {formatDate(request.createdAt.toDate())}
                          </Text>
                        </Group>
                        
                        {request.status === BorrowRequestStatus.APPROVED && (
                          <Group>
                            <ThemeIcon color="green" variant="light">
                              <IconCalendar size={16} />
                            </ThemeIcon>
                            <Text size="sm">
                              Due: {formatDate(request.dueDate.toDate())}
                            </Text>
                          </Group>
                        )}
                      </Group>
                      
                      {/* Admin actions for pending requests */}
                      {profile?.role === 'admin' && request.status === BorrowRequestStatus.PENDING && (
                        <>
                          {request.userId === user?.uid && (
                            <Alert color="yellow" title="Own Request" mt="md" size="sm">
                              You cannot approve your own request. Another admin must approve it.
                            </Alert>
                          )}
                          <Group position="right" mt="md">
                            <Button 
                              variant="outline" 
                              color="red" 
                              leftSection={<IconX size={16} />}
                              onClick={() => handleRejectRequest(request.id)}
                              loading={adminSubmitting}
                            >
                              Reject
                            </Button>
                            <Button 
                              color="green" 
                              leftSection={<IconCheck size={16} />}
                              onClick={() => handleApproveRequest(request.id)}
                              loading={adminSubmitting}
                              disabled={book.status !== BookStatus.AVAILABLE || request.userId === user?.uid}
                              title={request.userId === user?.uid ? "You cannot approve your own request" : ""}
                            >
                              Approve
                            </Button>
                          </Group>
                        </>
                      )}
                    </Paper>
                  ))}
                </Stack>
              )}
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
      
      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Book"
        size="lg"
        closeOnClickOutside={false}
      >
        <LoadingOverlay visible={bookSubmitting} />
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <TextInput
            label="Title"
            placeholder="Book title"
            required
            {...editForm.getInputProps('title')}
            mb="md"
          />
          
          <TextInput
            label="Author"
            placeholder="Author name"
            required
            {...editForm.getInputProps('author')}
            mb="md"
          />
          
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Genre"
                placeholder="Select genre"
                data={Object.values(Genre).map(genre => ({ value: genre, label: genre }))}
                required
                {...editForm.getInputProps('genre')}
                mb="md"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Year"
                placeholder="Publication year"
                min={1000}
                max={new Date().getFullYear()}
                required
                {...editForm.getInputProps('year')}
                mb="md"
              />
            </Grid.Col>
          </Grid>
          
          <Textarea
            label="Description"
            placeholder="Book description"
            minRows={4}
            {...editForm.getInputProps('description')}
            mb="md"
          />
          
          <Select
            label="Status"
            placeholder="Book status"
            data={Object.values(BookStatus).map(status => ({ 
              value: status, 
              label: statusStyles[status].label 
            }))}
            required
            {...editForm.getInputProps('status')}
            mb="md"
          />
          
          <FileInput
            label="Cover Image"
            placeholder="Upload new cover image"
            accept="image/png,image/jpeg,image/gif"
            value={coverImage}
            onChange={setCoverImage}
            icon={<IconUpload size={16} />}
            mb="md"
            clearable
          />
          
          {book.coverImageUrl && (
            <Group position="left" mb="md">
              <Image
                src={book.coverImageUrl}
                alt="Current cover"
                width={100}
                height={150}
                radius="sm"
              />
              <Text size="sm" c="dimmed">Current cover</Text>
            </Group>
          )}
          
          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={bookSubmitting}>
              Save Changes
            </Button>
          </Group>
        </form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Book"
        centered
      >
        <Text mb="lg">
          Are you sure you want to delete "{book.title}"? This action cannot be undone.
        </Text>
        
        {book.status === BookStatus.BORROWED && (
          <Alert color="red" title="Warning" mb="md">
            This book is currently borrowed. It cannot be deleted until it has been returned.
          </Alert>
        )}
        
        <Group position="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleDeleteBook}
            loading={bookSubmitting}
            disabled={book.status === BookStatus.BORROWED}
          >
            Delete
          </Button>
        </Group>
      </Modal>
      
      {/* Borrow Request Modal */}
      <Modal
        opened={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
        title="Request to Borrow"
        centered
      >
        <form onSubmit={borrowForm.onSubmit(handleBorrowSubmit)}>
          <Text mb="md">
            You are requesting to borrow "{book.title}" by {book.author}.
          </Text>
          
          <DatePickerInput
            label="Expected Return Date"
            placeholder="Select date"
            required
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
            {...borrowForm.getInputProps('dueDate')}
            mb="md"
          />
          
          <Text size="sm" c="dimmed" mb="lg">
            Your request will need to be approved by an administrator.
          </Text>
          
          <Group position="right">
            <Button variant="outline" onClick={() => setBorrowModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={borrowSubmitting}
            >
              Submit Request
            </Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
}