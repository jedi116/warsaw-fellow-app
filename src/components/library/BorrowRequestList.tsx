'use client';

import { useState } from 'react';
import {
  Card,
  Table,
  Text,
  Badge,
  Group,
  Box,
  Button,
  Title,
  Stack,
  Loader,
  Center,
  Alert,
  Tabs,
  Avatar,
  ActionIcon,
  Tooltip,
  Menu,
  Select,
  Paper,
  ThemeIcon,
} from '@mantine/core';
import { css } from '@emotion/react';
import { BorrowRequestStatus } from '@/interface/library';
import { useBorrowRequests, useAdminBorrowOperations } from '@/hooks/library';
import { 
  IconBook, 
  IconUser, 
  IconCalendar, 
  IconAlertCircle,
  IconHistory,
  IconCheck,
  IconX,
  IconClock,
  IconArrowBack,
  IconFilter,
  IconEye,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/service/UI/firebaseUiClient';

export default function BorrowRequestList() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [statusFilter, setStatusFilter] = useState<BorrowRequestStatus | 'all'>('all');
  const { submitting, approveBorrowRequest, rejectBorrowRequest, returnBook } = useAdminBorrowOperations();
  
  // Create an array of status filters based on the selected filter
  const statusFilters = statusFilter === 'all' 
    ? undefined 
    : [statusFilter as BorrowRequestStatus];
  
  // Get borrow requests
  const { requests, loading, refreshRequests } = useBorrowRequests(statusFilters);
  
  // Handle request approval
  const handleApproveRequest = async (requestId: string) => {
    const result = await approveBorrowRequest(requestId);
    if (result) refreshRequests();
  };
  
  // Handle request rejection
  const handleRejectRequest = async (requestId: string) => {
    const result = await rejectBorrowRequest(requestId);
    if (result) refreshRequests();
  };
  
  // Handle book return
  const handleReturnBook = async (requestId: string) => {
    const result = await returnBook(requestId);
    if (result) refreshRequests();
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get status details
  const getStatusDetails = (status: BorrowRequestStatus) => {
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
  
  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Requests' },
    { value: BorrowRequestStatus.PENDING, label: 'Pending' },
    { value: BorrowRequestStatus.APPROVED, label: 'Approved' },
    { value: BorrowRequestStatus.REJECTED, label: 'Rejected' },
    { value: BorrowRequestStatus.RETURNED, label: 'Returned' },
  ];
  
  // Define styles using emotion
  const bookLinkStyle = css`
    text-decoration: none;
    color: inherit;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  `;

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
      
      <Group position="apart" mb="lg">
        <Title order={2}>Borrow Requests</Title>
        
        <Select
          placeholder="Filter by status"
          data={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as BorrowRequestStatus | 'all')}
          icon={<IconFilter size={16} />}
          clearable={false}
          style={{ width: 200 }}
        />
      </Group>
      
      {loading ? (
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      ) : requests.length === 0 ? (
        <Paper withBorder p="xl" radius="md">
          <Stack align="center" spacing="md">
            <ThemeIcon size={48} radius={48} color="blue" variant="light">
              <IconHistory size={24} />
            </ThemeIcon>
            <Title order={3}>No borrow requests found</Title>
            <Text c="dimmed" ta="center">
              There are no borrow requests matching your search criteria.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <Card withBorder>
          <Table striped>
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td>
                    <Group spacing="xs" noWrap>
                      <IconBook size={16} />
                      <Text 
                        component={Link} 
                        href={`/library/${request.bookId}`} 
                        css={bookLinkStyle}
                      >
                        {request.book?.title}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      by {request.book?.author}
                    </Text>
                  </td>
                  <td>
                    <Group spacing="xs" noWrap>
                      <Avatar 
                        size="sm" 
                        radius="xl" 
                        color="blue" 
                      >
                        {request.user?.firstName?.[0]}{request.user?.lastName?.[0]}
                      </Avatar>
                      <div>
                        <Text size="sm">
                          {request.user?.firstName} {request.user?.lastName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {request.user?.email}
                        </Text>
                      </div>
                    </Group>
                  </td>
                  <td>
                    <Text size="sm">
                      {formatDate(request.createdAt.toDate())}
                    </Text>
                  </td>
                  <td>
                    <Badge color={getStatusDetails(request.status).color}>
                      {getStatusDetails(request.status).label}
                    </Badge>
                  </td>
                  <td>
                    {request.status === BorrowRequestStatus.APPROVED ? (
                      <Text size="sm">
                        {formatDate(request.dueDate.toDate())}
                      </Text>
                    ) : (
                      <Text size="xs" c="dimmed">—</Text>
                    )}
                  </td>
                  <td>
                    <Group spacing="xs" position="right">
                      <Tooltip label="View Book">
                        <ActionIcon 
                          variant="subtle" 
                          color="blue"
                          onClick={() => router.push(`/library/${request.bookId}`)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      
                      {request.status === BorrowRequestStatus.PENDING && (
                        <>
                          <Tooltip label="Reject">
                            <ActionIcon 
                              variant="subtle" 
                              color="red"
                              onClick={() => handleRejectRequest(request.id)}
                              loading={submitting}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={request.userId === user?.uid ? 
                            "You cannot approve your own request" : "Approve"}>
                            <ActionIcon 
                              variant="filled" 
                              color="green"
                              onClick={() => handleApproveRequest(request.id)}
                              loading={submitting}
                              disabled={request.userId === user?.uid}
                              style={request.userId === user?.uid ? { opacity: 0.5 } : {}}
                            >
                              <IconCheck size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </>
                      )}
                      
                      {request.status === BorrowRequestStatus.APPROVED && (
                        <Tooltip label="Mark Returned">
                          <ActionIcon 
                            variant="filled" 
                            color="blue"
                            onClick={() => handleReturnBook(request.id)}
                            loading={submitting}
                          >
                            <IconClock size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Box>
  );
}