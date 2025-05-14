'use client';

import { 
  Container, 
  Box, 
  Card, 
  Group, 
  Skeleton, 
  Image, 
  Button, 
  Divider, 
  Stack, 
  Text, 
  Title,
  Badge,
  Grid
} from '@mantine/core';

export default function BookDetailLoading() {
  return (
    <Container size="xl">
      <Box>
        <Card p="xl" radius="md" withBorder>
          <Grid>
            {/* Book cover and actions */}
            <Grid.Col span={{ base: 12, md: 4 }} py="lg">
              <Skeleton height={300} mb="lg" />
              
              <Stack spacing="md">
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
              </Stack>
            </Grid.Col>
            
            {/* Book details */}
            <Grid.Col span={{ base: 12, md: 8 }} py="lg">
              <Skeleton height={24} width={100} radius="xl" mb="md" />
              
              <Skeleton height={36} width="70%" radius="md" mb="md" />
              <Group mb="md">
                <Skeleton height={22} width={80} radius="xl" />
                <Skeleton height={22} width={60} radius="xl" />
              </Group>
              
              <Divider my="md" />
              
              <Title order={4} mb="sm">
                <Skeleton height={22} width={120} />
              </Title>
              <Skeleton height={20} mb={8} />
              <Skeleton height={20} mb={8} />
              <Skeleton height={20} mb={8} />
              <Skeleton height={20} mb={8} />
              <Skeleton height={20} mb={8} width="80%" />

              <Divider my="md" />

              <Group mb="xs" position="apart">
                <Title order={5}>
                  <Skeleton height={18} width={100} />
                </Title>
                <Skeleton height={18} width={120} />
              </Group>
              
              <Grid mb="md">
                <Grid.Col span={6}>
                  <Group spacing={4}>
                    <Skeleton height={16} width={80} />
                    <Skeleton height={16} width={120} />
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group spacing={4}>
                    <Skeleton height={16} width={80} />
                    <Skeleton height={16} width={120} />
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group spacing={4}>
                    <Skeleton height={16} width={80} />
                    <Skeleton height={16} width={120} />
                  </Group>
                </Grid.Col>
              </Grid>
              
              <Divider my="md" />
              
              {/* Borrow history */}
              <Title order={4} mb="md">
                <Skeleton height={22} width={150} />
              </Title>
              
              <Stack spacing="md">
                {[1, 2].map((_, index) => (
                  <Card key={index} withBorder p="sm">
                    <Group position="apart">
                      <Group>
                        <Skeleton height={40} circle />
                        <Stack spacing={4}>
                          <Skeleton height={18} width={120} />
                          <Skeleton height={14} width={80} />
                        </Stack>
                      </Group>
                      <Skeleton height={22} width={80} radius="xl" />
                    </Group>
                    <Divider my="xs" />
                    <Grid>
                      <Grid.Col span={6}>
                        <Group spacing={4}>
                          <Skeleton height={14} width={60} />
                          <Skeleton height={14} width={80} />
                        </Group>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Group spacing={4}>
                          <Skeleton height={14} width={60} />
                          <Skeleton height={14} width={80} />
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </Card>
                ))}
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
}