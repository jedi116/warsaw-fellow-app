'use client';

import { 
  Container, 
  Title, 
  Group, 
  Button, 
  Card, 
  Box, 
  Skeleton, 
  Center,
  Grid,
  TextInput,
  MultiSelect,
  SimpleGrid,
  ThemeIcon,
  Text,
  Badge,
  Divider,
  ActionIcon,
  Stack
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconFilter, 
  IconTag, 
  IconBook,
  IconUser,
  IconArrowRight
} from '@tabler/icons-react';

export default function LibraryLoading() {
  // Generate dummy book cards
  const dummyBooks = Array(12).fill(null);
  
  return (
    <Container size="xl">
      <Group position="apart" mb="lg">
        <Title order={1}>Library</Title>
        <Skeleton height={36} width={120} radius="md" />
      </Group>
      
      <Box>
        {/* Search and filter section */}
        <Card withBorder mb="xl" p="md">
          <Title order={4} mb="md">Search & Filter</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Skeleton height={36} radius="sm" mb="sm" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Skeleton height={36} radius="sm" mb="sm" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Skeleton height={36} radius="sm" mb="sm" />
            </Grid.Col>
          </Grid>
          <Group position="right">
            <Skeleton height={36} width={110} radius="sm" />
            <Skeleton height={36} width={80} radius="sm" />
          </Group>
        </Card>

        {/* Book list */}
        <SimpleGrid 
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="lg"
        >
          {dummyBooks.map((_, index) => (
            <Card 
              key={index} 
              withBorder 
              p={0}
            >
              <Card.Section>
                <Skeleton height={200} />
              </Card.Section>

              <Box p="md" style={{ flex: 1 }}>
                <Skeleton height={22} width={80} radius="xl" mb="sm" />
                
                <Skeleton height={20} radius="sm" mb={8} />
                <Skeleton height={16} width="60%" radius="sm" mb="xs" />
                <Divider my="xs" />
                
                <Group position="apart">
                  <Skeleton height={22} width={80} radius="xl" />
                  <Skeleton height={16} width={40} radius="sm" />
                </Group>
              </Box>
              
              {index % 3 === 0 && ( // Show borrower info on some cards
                <Box bg="rgba(0,0,0,0.03)" p="xs">
                  <Group position="apart" noWrap>
                    <Group noWrap spacing={6}>
                      <IconUser size={14} />
                      <Skeleton height={14} width={100} radius="sm" />
                    </Group>
                    <ActionIcon 
                      size="sm" 
                      variant="transparent" 
                      color="blue"
                      disabled
                    >
                      <IconArrowRight size={16} />
                    </ActionIcon>
                  </Group>
                </Box>
              )}
            </Card>
          ))}
        </SimpleGrid>

        {/* Load more button */}
        <Center my="xl">
          <Skeleton height={36} width={120} radius="md" />
        </Center>
      </Box>
    </Container>
  );
}