'use client';

import {
  Avatar,
  Badge,
  Card,
  Grid,
  Group,
  Text,
  ActionIcon,
  Button,
  Title,
  Container,
  Flex,
  Paper,
  Menu,
  Tooltip,
  Box,
  useMantineColorScheme,
  Input,
  Select,
  SimpleGrid,
  ThemeIcon,
  Center,
  Divider,
  Stack,
} from '@mantine/core';
import { 
  IconPencil, 
  IconTrash, 
  IconPlus, 
  IconRefresh, 
  IconDots, 
  IconPhone, 
  IconMail, 
  IconBrandTelegram,
  IconCalendar,
  IconSearch,
  IconFilter
} from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { User, UserWithPic } from '@/interface/user';
import profilePlacholder from '../../../public/profile_placeholder.jpeg'
import { MemberContext } from '@/context/MemberContext';
import { useProfile } from '@/hooks/profile';
import { css } from '@emotion/react';

interface UsersTableProps {
  data?: User[]
}

function formatDate(dateString: string | object): string {
  try {
    const date = typeof dateString === 'object' ? dateString : new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date as Date);
  } catch (error) {
    return 'Invalid date';
  }
}

export default function UsersList({ data }: UsersTableProps) {
  const { openModal, closeModal, 
    setSelectedMember, modalType, 
    setModalType, users, formatUsers, refreshUsers: refresh
  } = useContext(MemberContext);
  const { profile } = useProfile();
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('');
  
  useEffect(() => {
    if (data) {
      formatUsers(data)
    }
  }, [data]);

  // Filter the member list based on search and team filter
  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchQuery || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTeam = !filterTeam || filterTeam === '' || user.team.includes(filterTeam as any);
    
    return matchesSearch && matchesTeam;
  });
  
  const teamOptions = [
    { value: '', label: 'All Teams' },
    { value: 'worship', label: 'Worship' },
    { value: 'prayer', label: 'Prayer' },
    { value: 'literature', label: 'Literature' },
    { value: 'evangelism', label: 'Evangelism' },
    { value: 'holisticteam', label: 'Holistic Team' },
    { value: 'eventOrganization', label: 'Event Organization' },
  ];
  
  const cardStyles = css`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
    }
    
    @media (max-width: 576px) {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      transform: none !important;
    }
  `;
  
  const memberCardStyles = css`
    position: relative;
    overflow: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(to right, #4263EB, #748FFC);
    }
  `;
  
  const handleViewMember = (member: UserWithPic) => {
    setModalType('View');
    setSelectedMember(member);
    openModal();
  };
  
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              radius="xl"
              size="md"
            />
            
            <Select
              placeholder="Filter by team"
              data={teamOptions}
              value={filterTeam}
              onChange={setFilterTeam}
              icon={<IconFilter size={16} />}
              radius="xl"
              size="md"
              clearable
            />
          </Group>
          
          <Group>
            <Button 
              onClick={refresh} 
              variant="light"
              radius="xl"
            >
              <Group spacing={6}>
                <IconRefresh size={16} />
                <span>Refresh</span>
              </Group>
            </Button>
            
            {profile?.role === 'admin' && (
              <Button 
                onClick={() => {
                  setModalType('Add');
                  setSelectedMember(null);
                  openModal();
                }} 
                color="indigo"
                radius="xl"
              >
                <Group spacing={6}>
                  <IconPlus size={16} />
                  <span>Add Member</span>
                </Group>
              </Button>
            )}
          </Group>
        </Group>
        
        {/* Mobile layout */}
        <Stack spacing="md" hiddenFrom="md" mb="md">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            radius="xl"
            size="md"
          />
          
          <Select
            placeholder="Filter by team"
            data={teamOptions}
            value={filterTeam}
            onChange={setFilterTeam}
            icon={<IconFilter size={16} />}
            radius="xl"
            size="md"
            clearable
          />
          
          <Group grow>
            <Button 
              onClick={refresh} 
              variant="light"
              radius="xl"
              size="md"
            >
              <Group spacing={6} position="center">
                <IconRefresh size={16} />
                <span>Refresh</span>
              </Group>
            </Button>
            
            {profile?.role === 'admin' && (
              <Button 
                onClick={() => {
                  setModalType('Add');
                  setSelectedMember(null);
                  openModal();
                }} 
                color="indigo"
                radius="xl"
                size="md"
              >
                <Group spacing={6} position="center">
                  <IconPlus size={16} />
                  <span>Add</span>
                </Group>
              </Button>
            )}
          </Group>
        </Stack>
        
        <Text c="dimmed" size="sm" mb="md">
          Showing {filteredUsers?.length || 0} members
        </Text>
      </Paper>
      
      {filteredUsers?.length === 0 ? (
        <Center p={50}>
          <Box ta="center">
            <ThemeIcon size={60} radius="xl" mb="md">
              <IconSearch size={30} stroke={1.5} />
            </ThemeIcon>
            <Text fw={700} size="lg">No members found</Text>
            <Text c="dimmed" size="sm" maw={400} mx="auto" mt="xs">
              Try adjusting your search or filter criteria to find what you're looking for.
            </Text>
          </Box>
        </Center>
      ) : (
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
          {filteredUsers?.map((member) => (
            <Card 
              key={member.uid} 
              withBorder 
              p={{ base: "md", xs: "lg" }}
              radius="md" 
              css={[cardStyles, memberCardStyles]}
            >
              <Card.Section p={{ base: "xs", xs: "md" }}>
                <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                  <Text fw={700} size="md" lineClamp={1} style={{ maxWidth: 'calc(100% - 40px)' }}>
                    {member.firstName} {member.lastName}
                  </Text>
                  
                  <Menu position="bottom-end" shadow="lg" width={200} withinPortal>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    
                    <Menu.Dropdown>
                      <Menu.Item 
                        icon={<IconMail size={16} />}
                        onClick={() => window.open(`mailto:${member.email}`)}
                      >
                        Email {member.firstName}
                      </Menu.Item>
                      
                      <Menu.Divider />
                      
                      <Menu.Item 
                        icon={<IconPencil size={16} />} 
                        onClick={() => {
                          setModalType('Modify');
                          setSelectedMember(member);
                          openModal();
                        }}
                        disabled={profile?.role !== 'admin'}
                      >
                        Edit Member
                      </Menu.Item>
                      
                      <Menu.Item 
                        icon={<IconTrash size={16} />} 
                        color="red"
                        onClick={() => {
                          setModalType('Delete');
                          setSelectedMember(member);
                          openModal();
                        }}
                        disabled={profile?.role !== 'admin'}
                      >
                        Delete Member
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>
              
              <Box mt="md" style={{ textAlign: 'center' }}>
                <Avatar 
                  src={member.profilePicture || profilePlacholder.src} 
                  size={100} 
                  radius={100} 
                  mx="auto"
                  mb="sm"
                  onClick={() => handleViewMember(member)}
                  style={{ cursor: 'pointer' }}
                  color="indigo"
                  alt={`${member.firstName} ${member.lastName}`}
                >
                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                </Avatar>
                
                <Text c="dimmed" size="sm" mb="md">
                  {member.role === 'admin' ? (
                    <Badge color="indigo" variant="light">Administrator</Badge>
                  ) : (
                    <Badge color="gray" variant="light">Member</Badge>
                  )}
                </Text>
              </Box>
              
              <Divider my="sm" style={{ margin: '0.75rem 0' }} />
              
              {/* Desktop contact info */}
              <Box visibleFrom="md" style={{ flexGrow: 1 }}>
                <Group spacing={10} position="apart" mt="md">
                  <Tooltip label="Email" withArrow>
                    <Group spacing={6} wrap="nowrap">
                      <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                        <IconMail size={14} />
                      </ThemeIcon>
                      <Text size="xs" color="dimmed" lineClamp={1} style={{ maxWidth: 150 }}>
                        {member.email}
                      </Text>
                    </Group>
                  </Tooltip>
                  
                  <Tooltip label="Birthday" withArrow>
                    <Group spacing={6} wrap="nowrap">
                      <ThemeIcon size="sm" radius="xl" variant="light" color="grape">
                        <IconCalendar size={14} />
                      </ThemeIcon>
                      <Text size="xs" color="dimmed">
                        {formatDate(member.birthday)}
                      </Text>
                    </Group>
                  </Tooltip>
                </Group>
                
                <Group spacing={10} position="apart" mt="sm">
                  <Tooltip label="Phone" withArrow>
                    <Group spacing={6} wrap="nowrap">
                      <ThemeIcon size="sm" radius="xl" variant="light" color="green">
                        <IconPhone size={14} />
                      </ThemeIcon>
                      <Text size="xs" color="dimmed">
                        {member.phonenumber}
                      </Text>
                    </Group>
                  </Tooltip>
                  
                  <Tooltip label="Telegram" withArrow>
                    <Group spacing={6} wrap="nowrap">
                      <ThemeIcon size="sm" radius="xl" variant="light" color="cyan">
                        <IconBrandTelegram size={14} />
                      </ThemeIcon>
                      <Text size="xs" color="dimmed">
                        {member.telegram}
                      </Text>
                    </Group>
                  </Tooltip>
                </Group>
              </Box>
              
              {/* Mobile contact info - stacked */}
              <Stack spacing={8} mt="md" hiddenFrom="md" style={{ flexGrow: 1 }}>
                <Group spacing={6} noWrap>
                  <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                    <IconMail size={14} />
                  </ThemeIcon>
                  <Text size="xs" color="dimmed" lineClamp={1} style={{ 
                    wordBreak: 'break-word', 
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    maxWidth: "calc(100% - 24px)"
                  }}>
                    {member.email}
                  </Text>
                </Group>
                
                <Group spacing={6} noWrap>
                  <ThemeIcon size="sm" radius="xl" variant="light" color="grape">
                    <IconCalendar size={14} />
                  </ThemeIcon>
                  <Text size="xs" color="dimmed">
                    {formatDate(member.birthday)}
                  </Text>
                </Group>
                
                <Group spacing={6} noWrap>
                  <ThemeIcon size="sm" radius="xl" variant="light" color="green">
                    <IconPhone size={14} />
                  </ThemeIcon>
                  <Text size="xs" color="dimmed">
                    {member.phonenumber}
                  </Text>
                </Group>
                
                <Group spacing={6} noWrap>
                  <ThemeIcon size="sm" radius="xl" variant="light" color="cyan">
                    <IconBrandTelegram size={14} />
                  </ThemeIcon>
                  <Text size="xs" color="dimmed">
                    {member.telegram}
                  </Text>
                </Group>
              </Stack>
              
              <Box mt="md" style={{ marginTop: '0.75rem' }}>
                <Text size="xs" fw={500} mb={5}>
                  Teams:
                </Text>
                <Box>
                  {member.team.length > 0 ? (
                    <Group spacing={5} style={{ flexWrap: 'wrap' }}>
                      {member.team.map((team) => (
                        <Badge 
                          key={team} 
                          variant="light" 
                          color="indigo" 
                          size="xs"
                          style={{ marginBottom: '3px' }}
                        >
                          {team}
                        </Badge>
                      ))}
                    </Group>
                  ) : (
                    <Text size="xs" c="dimmed">No teams assigned</Text>
                  )}
                </Box>
              </Box>
              
              <Button 
                variant="light" 
                color="indigo" 
                fullWidth 
                mt="md" 
                radius="md"
                onClick={() => handleViewMember(member)}
              >
                View Profile
              </Button>
            </Card>
          ))}
          </SimpleGrid>
          
          {/* Mobile view: vertical list layout */}
          <Stack spacing="md" hiddenFrom="sm">
            {filteredUsers?.map((member) => (
              <Card 
                key={`mobile-${member.uid}`} 
                withBorder 
                p="md"
                radius="md" 
                css={[cardStyles, memberCardStyles]}
              >
                <Group position="apart" noWrap align="flex-start">
                  <Avatar 
                    src={member.profilePicture || profilePlacholder.src} 
                    size={50} 
                    radius={50}
                    color="indigo"
                    alt={`${member.firstName} ${member.lastName}`}
                  >
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </Avatar>
                  
                  <Box style={{ flex: 1, marginLeft: 12 }}>
                    <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                      <Text fw={700} lineClamp={1} style={{ flex: 1 }}>
                        {member.firstName} {member.lastName}
                      </Text>
                      
                      <Menu position="bottom-end" shadow="lg" width={200} withinPortal>
                        <Menu.Target>
                          <ActionIcon>
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        
                        <Menu.Dropdown>
                          <Menu.Item 
                            icon={<IconMail size={16} />}
                            onClick={() => window.open(`mailto:${member.email}`)}
                          >
                            Email {member.firstName}
                          </Menu.Item>
                          
                          <Menu.Divider />
                          
                          <Menu.Item 
                            icon={<IconPencil size={16} />} 
                            onClick={() => {
                              setModalType('Modify');
                              setSelectedMember(member);
                              openModal();
                            }}
                            disabled={profile?.role !== 'admin'}
                          >
                            Edit Member
                          </Menu.Item>
                          
                          <Menu.Item 
                            icon={<IconTrash size={16} />} 
                            color="red"
                            onClick={() => {
                              setModalType('Delete');
                              setSelectedMember(member);
                              openModal();
                            }}
                            disabled={profile?.role !== 'admin'}
                          >
                            Delete Member
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                    
                    <Group spacing={6} mt={5}>
                      <Badge size="sm" variant="light" color={member.role === 'admin' ? 'indigo' : 'gray'}>
                        {member.role === 'admin' ? 'Administrator' : 'Member'}
                      </Badge>
                    </Group>
                  </Box>
                </Group>
                
                <Divider my="sm" />
                
                <Stack spacing={8}>
                  <Group spacing={6} noWrap>
                    <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                      <IconMail size={14} />
                    </ThemeIcon>
                    <Text size="sm" color="dimmed" lineClamp={1} style={{ wordBreak: 'break-word' }}>
                      {member.email}
                    </Text>
                  </Group>
                  
                  <Group spacing={6} noWrap>
                    <ThemeIcon size="sm" radius="xl" variant="light" color="green">
                      <IconPhone size={14} />
                    </ThemeIcon>
                    <Text size="sm" color="dimmed">
                      {member.phonenumber}
                    </Text>
                  </Group>
                </Stack>
                
                <Box mt="md">
                  <Text size="xs" fw={500} mb={5}>
                    Teams:
                  </Text>
                  <Box>
                    {member.team.length > 0 ? (
                      <Group spacing={5} style={{ flexWrap: 'wrap' }}>
                        {member.team.map((team) => (
                          <Badge 
                            key={team} 
                            variant="light" 
                            color="indigo" 
                            size="xs"
                            style={{ marginBottom: '3px' }}
                          >
                            {team}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="xs" c="dimmed">No teams assigned</Text>
                    )}
                  </Box>
                </Box>
                
                <Button 
                  variant="light" 
                  color="indigo" 
                  fullWidth 
                  mt="md" 
                  radius="md"
                  onClick={() => handleViewMember(member)}
                >
                  View Profile
                </Button>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
}