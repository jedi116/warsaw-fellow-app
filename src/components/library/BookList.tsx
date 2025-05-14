'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Box,
  Pagination,
  SimpleGrid,
  UnstyledButton,
  Title,
  Stack,
  Loader,
  Center,
  Divider,
  TextInput,
  Select,
  Button,
  MultiSelect,
  Grid,
  Skeleton,
  ActionIcon,
  ThemeIcon,
  Indicator,
} from '@mantine/core';
import { BookStatus, BookWithDetails, Genre } from '@/interface/library';
import { useBooks } from '@/hooks/library';
import { 
  IconBook, 
  IconSearch, 
  IconFilter, 
  IconUser, 
  IconCalendar, 
  IconAlertCircle,
  IconTag,
  IconArrowRight
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/profile';
import { css } from '@emotion/react';

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export default function BookList() {
  const router = useRouter();
  const { profile } = useProfile();

  // Filter and search states
  const [statusFilter, setStatusFilter] = useState<BookStatus[]>([]);
  const [genreFilter, setGenreFilter] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPendingRequests, setShowPendingRequests] = useState<boolean>(false);

  // Book data
  const { books, loading, hasMore, loadMore, refreshBooks, pendingRequestBooks } = useBooks(
    statusFilter,
    genreFilter,
    searchQuery,
    12,
    showPendingRequests
  );

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setGenreFilter([]);
    setSearchTerm('');
    setSearchQuery('');
    setShowPendingRequests(false);
  };

  const navigateToBook = (id: string) => {
    router.push(`/library/${id}`);
  };

  // Card styles
  const cardStyles = css`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }
  `;

  const coverStyles = css`
    height: 200px;
    object-fit: cover;
    background-color: #f0f0f0;
  `;

  const statusStyles = {
    [BookStatus.AVAILABLE]: 'green',
    [BookStatus.BORROWED]: 'blue',
    [BookStatus.RESERVED]: 'yellow',
    [BookStatus.MAINTENANCE]: 'red'
  };

  const statusLabels = {
    [BookStatus.AVAILABLE]: 'Available',
    [BookStatus.BORROWED]: 'Borrowed',
    [BookStatus.RESERVED]: 'Reserved',
    [BookStatus.MAINTENANCE]: 'Maintenance'
  };

  // Generate genre options for filter
  const genreOptions = Object.values(Genre).map(genre => ({
    value: genre,
    label: genre
  }));

  // Generate status options for filter
  const statusOptions = Object.values(BookStatus).map(status => ({
    value: status,
    label: statusLabels[status]
  }));

  return (
    <Box>
      {/* Search and filter section */}
      <Card withBorder mb="xl" p="md">
        <Title order={4} mb="md">Search & Filter</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              icon={<IconSearch size={16} />}
              placeholder="Search by title, author or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb="sm"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <MultiSelect
              data={statusOptions}
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              mb="sm"
              icon={<IconTag size={16} />}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <MultiSelect
              data={genreOptions}
              placeholder="Filter by genre"
              value={genreFilter}
              onChange={setGenreFilter}
              mb="sm"
              icon={<IconFilter size={16} />}
            />
          </Grid.Col>
        </Grid>
        
        {profile?.role === 'admin' && (
          <Card.Section withBorder inheritPadding py="xs" mt="md" mb="md">
            <Group position="apart">
              <Text fw={500}>Admin Filters</Text>
              <Button 
                size="xs" 
                variant={showPendingRequests ? "filled" : "outline"}
                color={showPendingRequests ? "yellow" : "blue"}
                onClick={() => setShowPendingRequests(!showPendingRequests)}
              >
                {showPendingRequests ? "Showing Pending Approvals" : "Show Books With Pending Requests"}
              </Button>
            </Group>
          </Card.Section>
        )}
        
        <Group position="right">
          <Button variant="subtle" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </Group>
      </Card>

      {/* Book list */}
      {loading && books.length === 0 ? (
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      ) : books.length === 0 ? (
        <Center p="xl">
          <Stack align="center" spacing="md">
            <ThemeIcon size={50} radius={50} variant="light" color="blue">
              <IconBook size={30} />
            </ThemeIcon>
            <Title order={3}>No books found</Title>
            <Text c="dimmed">Try adjusting your search criteria</Text>
            {profile?.role === 'admin' && (
              <Button onClick={() => router.push('/library/add')}>
                Add a new book
              </Button>
            )}
          </Stack>
        </Center>
      ) : (
        <>
          <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="lg"
          >
            {books.map((book) => (
              <Card 
                key={book.id} 
                withBorder 
                p={0} 
                onClick={() => navigateToBook(book.id)}
                css={cardStyles}
                component={UnstyledButton}
                pos="relative"
              >
                <Card.Section>
                  {profile?.role === 'admin' && pendingRequestBooks && pendingRequestBooks.has(book.id) && (
                    <Badge 
                      color="yellow" 
                      pos="absolute" 
                      top={10} 
                      right={10} 
                      style={{ zIndex: 2 }}
                    >
                      Pending Approval
                    </Badge>
                  )}
                  <Image
                    src={book.coverImageUrl || '/placeholder_book.png'}
                    alt={book.title}
                    fallbackSrc="/placeholder_book.png"
                    css={coverStyles}
                    height={200}
                  />
                </Card.Section>

                <Box p="md" style={{ flex: 1 }}>
                  <Badge 
                    color={statusStyles[book.status]} 
                    mb="sm"
                  >
                    {statusLabels[book.status]}
                  </Badge>
                  
                  <Text fw={600} lineClamp={2}>{book.title}</Text>
                  <Text size="sm" c="dimmed" mb="xs">by {book.author}</Text>
                  <Divider my="xs" />
                  
                  <Group position="apart">
                    <Badge variant="outline" color="blue">
                      {book.genre}
                    </Badge>
                    <Text size="xs">{book.year}</Text>
                  </Group>
                </Box>
                
                {/* Show borrower info if borrowed */}
                {(book as BookWithDetails).currentBorrower && (
                  <Box bg="rgba(0,0,0,0.03)" p="xs">
                    <Group position="apart" noWrap>
                      <Group noWrap spacing={6}>
                        <IconUser size={14} />
                        <Text size="xs" lineClamp={1}>{(book as BookWithDetails).currentBorrower?.firstName} {(book as BookWithDetails).currentBorrower?.lastName}</Text>
                      </Group>
                      <ActionIcon 
                        size="sm" 
                        variant="transparent" 
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToBook(book.id);
                        }}
                      >
                        <IconArrowRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Box>
                )}
              </Card>
            ))}
          </SimpleGrid>

          {hasMore && (
            <Center my="xl">
              <Button onClick={loadMore} loading={loading} variant="outline">
                Load More
              </Button>
            </Center>
          )}
        </>
      )}
    </Box>
  );
}