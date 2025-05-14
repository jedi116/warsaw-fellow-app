'use client';

import { 
  Container, 
  Title, 
  Group, 
  Button, 
  Input, 
  Skeleton, 
  Card, 
  Paper, 
  Text,
  SimpleGrid,
  Box,
  ThemeIcon,
  Badge,
  Stack,
  Divider,
  Select,
  Avatar,
  ActionIcon
} from '@mantine/core';
import { 
  IconSearch, 
  IconPlus, 
  IconRefresh, 
  IconFilter,
  IconDots,
  IconMail,
  IconPhone,
  IconCalendar,
  IconBrandTelegram
} from '@tabler/icons-react';

export default function MembersLoading() {
  // Generate arrays to simulate member cards
  const dummyDesktopMembers = Array(8).fill(null);
  const dummyMobileMembers = Array(4).fill(null);
  
  return (
    <Container size="xl" pb={60} px={{ base: 12, sm: 'lg' }}>
      <Title order={2} mb="xl" ta="center" mt="md">
        Fellowship Members
      </Title>
      
      <Paper p="md" radius="md" mb="xl" withBorder>
        {/* Desktop layout */}
        <Group position="apart" mb="md" visibleFrom="md">
          <Group>
            <Input
              icon={<IconSearch size={16} />}
              placeholder="Search members..."
              radius="xl"
              size="md"
              disabled
            />
            
            <Select
              placeholder="Filter by team"
              data={[
                { value: '', label: 'All Teams' },
                { value: 'worship', label: 'Worship' },
                { value: 'prayer', label: 'Prayer' }
              ]}
              icon={<IconFilter size={16} />}
              radius="xl"
              size="md"
              disabled
            />
          </Group>
          
          <Group>
            <Button 
              variant="light"
              radius="xl"
              disabled
            >
              <Group spacing={6}>
                <IconRefresh size={16} />
                <span>Refresh</span>
              </Group>
            </Button>
            
            <Button 
              color="indigo"
              radius="xl"
              disabled
            >
              <Group spacing={6}>
                <IconPlus size={16} />
                <span>Add Member</span>
              </Group>
            </Button>
          </Group>
        </Group>
        
        {/* Mobile layout */}
        <Stack spacing="md" hiddenFrom="md" mb="md">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="Search members..."
            radius="xl"
            size="md"
            disabled
          />
          
          <Select
            placeholder="Filter by team"
            data={[{ value: '', label: 'All Teams' }]}
            icon={<IconFilter size={16} />}
            radius="xl"
            size="md"
            disabled
          />
          
          <Group grow>
            <Button 
              variant="light"
              radius="xl"
              size="md"
              disabled
            >
              <Group spacing={6} position="center">
                <IconRefresh size={16} />
                <span>Refresh</span>
              </Group>
            </Button>
            
            <Button 
              color="indigo"
              radius="xl"
              size="md"
              disabled
            >
              <Group spacing={6} position="center">
                <IconPlus size={16} />
                <span>Add</span>
              </Group>
            </Button>
          </Group>
        </Stack>
        
        <Text c="dimmed" size="sm" mb="md">
          <Skeleton height={18} width={100} radius="xl" />
        </Text>
      </Paper>
      
      <Box>
        {/* Desktop and tablet view: grid layout */}
        <SimpleGrid 
          cols={4}
          breakpoints={[
            { maxWidth: 'lg', cols: 3, spacing: 'md' },
            { maxWidth: 'md', cols: 2, spacing: 'sm' },
          ]}
          spacing="lg"
          visibleFrom="sm"
        >
          {dummyDesktopMembers.map((_, index) => (
            <Card 
              key={index} 
              withBorder 
              p={{ base: "md", xs: "lg" }}
              radius="md" 
            >
              <Card.Section p={{ base: "xs", xs: "md" }}>
                <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                  <Skeleton height={20} width="70%" radius="xl" />
                  
                  <ActionIcon disabled>
                    <IconDots size={16} />
                  </ActionIcon>
                </Group>
              </Card.Section>
              
              <Box mt="md" style={{ textAlign: 'center' }}>
                <Skeleton height={100} circle mx="auto" mb="sm" />
                
                <Skeleton height={22} width={100} radius="xl" mx="auto" />
              </Box>
              
              <Divider my="sm" style={{ margin: '0.75rem 0' }} />
              
              {/* Desktop contact info */}
              <Box visibleFrom="md" style={{ flexGrow: 1 }}>
                <Group spacing={10} position="apart" mt="md">
                  <Group spacing={6} wrap="nowrap">
                    <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                      <IconMail size={14} />
                    </ThemeIcon>
                    <Skeleton height={14} width={120} radius="xl" />
                  </Group>
                  
                  <Group spacing={6} wrap="nowrap">
                    <ThemeIcon size="sm" radius="xl" variant="light" color="grape">
                      <IconCalendar size={14} />
                    </ThemeIcon>
                    <Skeleton height={14} width={60} radius="xl" />
                  </Group>
                </Group>
                
                <Group spacing={10} position="apart" mt="sm">
                  <Group spacing={6} wrap="nowrap">
                    <ThemeIcon size="sm" radius="xl" variant="light" color="green">
                      <IconPhone size={14} />
                    </ThemeIcon>
                    <Skeleton height={14} width={80} radius="xl" />
                  </Group>
                  
                  <Group spacing={6} wrap="nowrap">
                    <ThemeIcon size="sm" radius="xl" variant="light" color="cyan">
                      <IconBrandTelegram size={14} />
                    </ThemeIcon>
                    <Skeleton height={14} width={60} radius="xl" />
                  </Group>
                </Group>
              </Box>
              
              <Box mt="md" style={{ marginTop: '0.75rem' }}>
                <Text size="xs" fw={500} mb={5}>
                  Teams:
                </Text>
                <Group spacing={5} style={{ flexWrap: 'wrap' }}>
                  <Skeleton height={18} width={60} radius="xl" />
                  <Skeleton height={18} width={70} radius="xl" />
                  <Skeleton height={18} width={50} radius="xl" />
                </Group>
              </Box>
              
              <Skeleton height={36} radius="md" mt="md" />
            </Card>
          ))}
        </SimpleGrid>
        
        {/* Mobile view: vertical list layout */}
        <Stack spacing="md" hiddenFrom="sm">
          {dummyMobileMembers.map((_, index) => (
            <Card 
              key={`mobile-${index}`} 
              withBorder 
              p="md"
              radius="md" 
            >
              <Group position="apart" noWrap align="flex-start">
                <Skeleton height={50} circle />
                
                <Box style={{ flex: 1, marginLeft: 12 }}>
                  <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                    <Skeleton height={18} width="70%" radius="xl" />
                    
                    <ActionIcon disabled>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <Skeleton height={22} width={80} radius="xl" mt={5} />
                </Box>
              </Group>
              
              <Divider my="sm" />
              
              <Stack spacing={8}>
                <Group spacing={6} noWrap>
                  <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                    <IconMail size={14} />
                  </ThemeIcon>
                  <Skeleton height={16} width="80%" radius="xl" />
                </Group>
                
                <Group spacing={6} noWrap>
                  <ThemeIcon size="sm" radius="xl" variant="light" color="green">
                    <IconPhone size={14} />
                  </ThemeIcon>
                  <Skeleton height={16} width="50%" radius="xl" />
                </Group>
              </Stack>
              
              <Box mt="md">
                <Text size="xs" fw={500} mb={5}>
                  Teams:
                </Text>
                <Group spacing={5} style={{ flexWrap: 'wrap' }}>
                  <Skeleton height={18} width={60} radius="xl" />
                  <Skeleton height={18} width={70} radius="xl" />
                </Group>
              </Box>
              
              <Skeleton height={36} radius="md" mt="md" />
            </Card>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}