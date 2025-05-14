'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  Tabs,
  Card,
  Skeleton,
  Group,
  SimpleGrid,
  Box,
  Center
} from '@mantine/core';

export default function EventsLoading() {
  return (
    <Container size="lg" py="xl">
      <Box ta="center" mb="xl">
        <Title order={1} mb="md">Fellowship Events</Title>
        <Text maw={700} mx="auto" size="lg" c="dimmed">
          Join us for our upcoming events and gatherings. We welcome everyone to be part of our community.
        </Text>
      </Box>
      
      <Tabs value="upcoming" mb="xl">
        <Tabs.List grow position="center">
          <Tabs.Tab value="upcoming">Upcoming Events</Tabs.Tab>
          <Tabs.Tab value="past">Past Events</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      <Box>
        {/* Featured Event Skeletons */}
        <Skeleton height={28} width={180} mb="lg" />
        
        <SimpleGrid
          cols={2}
          spacing="xl"
          mb="xl"
          breakpoints={[
            { maxWidth: 'md', cols: 1 },
          ]}
        >
          {[1, 2].map((index) => (
            <Card key={index} withBorder shadow="sm" p={0} radius="md">
              <Card.Section>
                <Skeleton height={300} />
              </Card.Section>
              
              <Box p="lg">
                <Group position="apart" mb="md">
                  <Skeleton height={24} width="60%" />
                  <Skeleton height={22} width={80} radius="xl" />
                </Group>
                
                <Skeleton height={16} width="80%" mb="sm" />
                <Skeleton height={16} width="50%" mb="sm" />
                <Skeleton height={16} width="70%" mb="md" />
                
                <Skeleton height={16} width="100%" mb={8} />
                <Skeleton height={16} width="90%" mb={8} />
                <Skeleton height={16} width="95%" mb={8} />
              </Box>
            </Card>
          ))}
        </SimpleGrid>
        
        {/* Regular Events Skeletons */}
        <Skeleton height={28} width={180} mb="lg" />
        
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2, spacing: 'md' },
            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
          ]}
        >
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} withBorder shadow="sm" p={0} radius="md">
              <Card.Section>
                <Skeleton height={200} />
              </Card.Section>
              
              <Box p="md">
                <Skeleton height={22} width={80} radius="xl" mb="xs" />
                <Skeleton height={20} width="90%" mb="sm" />
                
                <Skeleton height={14} width="60%" mb="xs" />
                <Skeleton height={14} width="40%" mb="xs" />
                <Skeleton height={14} width="70%" mb="md" />
                
                <Skeleton height={14} width="100%" mb={6} />
                <Skeleton height={14} width="90%" mb={6} />
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}