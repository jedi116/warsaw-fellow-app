'use client';

import { 
  Container, 
  Title, 
  Box, 
  Group, 
  Button, 
  Card, 
  Tabs, 
  Skeleton, 
  Table,
  Paper,
  Select
} from '@mantine/core';
import { IconArrowLeft, IconFilter } from '@tabler/icons-react';
import Link from 'next/link';

export default function BorrowRequestsLoading() {
  return (
    <Container size="xl">
      <Group mb="lg">
        <Button 
          component={Link} 
          href="/library" 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Library
        </Button>
      </Group>
      
      <Box>
        <Title order={1} mb="xl">Borrow Requests</Title>
        
        <Paper p="md" withBorder mb="lg">
          <Group position="apart" mb="md">
            <Select
              placeholder="Filter by status"
              icon={<IconFilter size={16} />}
              data={[
                { value: 'all', label: 'All Requests' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'returned', label: 'Returned' },
              ]}
              w={250}
              disabled
            />
            <Skeleton height={36} width={100} radius="md" />
          </Group>
        </Paper>
        
        <Tabs defaultValue="all">
          <Tabs.List mb="md">
            <Skeleton height={36} width={120} radius="md" mr="md" />
            <Skeleton height={36} width={120} radius="md" mr="md" />
            <Skeleton height={36} width={120} radius="md" mr="md" />
          </Tabs.List>
          
          <Card withBorder>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>User</th>
                  <th>Request Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(null).map((_, index) => (
                  <tr key={index}>
                    <td width="25%">
                      <Group noWrap>
                        <Skeleton height={50} width={40} />
                        <Box>
                          <Skeleton height={16} width={160} mb={4} />
                          <Skeleton height={14} width={80} />
                        </Box>
                      </Group>
                    </td>
                    <td width="20%">
                      <Group noWrap>
                        <Skeleton height={30} circle />
                        <Skeleton height={16} width={120} />
                      </Group>
                    </td>
                    <td width="15%">
                      <Skeleton height={16} width={100} />
                    </td>
                    <td width="15%">
                      <Skeleton height={16} width={100} />
                    </td>
                    <td width="10%">
                      <Skeleton height={22} width={80} radius="xl" />
                    </td>
                    <td width="15%">
                      <Group>
                        <Skeleton height={28} width={28} circle />
                        <Skeleton height={28} width={28} circle />
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tabs>
      </Box>
    </Container>
  );
}