'use client';

import { 
  Avatar, 
  Text, 
  Group, 
  Box, 
  Paper, 
  Stack, 
  ThemeIcon, 
  Grid, 
  Badge, 
  Button, 
  useMantineColorScheme,
  Divider
} from '@mantine/core';
import { 
  IconPhone, 
  IconMail, 
  IconBrandTelegram, 
  IconCalendar, 
  IconUsers,
  IconId 
} from '@tabler/icons-react';
import profilePlacholder from '../../../public/profile_placeholder.jpeg'
import { useContext } from 'react';
import { MemberContext } from '@/context/MemberContext';
import { css } from '@emotion/react';

function formatDate(dateString: string | object): string {
  try {
    const date = typeof dateString === 'object' ? dateString : new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date as Date);
  } catch (error) {
    return 'Invalid date';
  }
}

export default function UserInfoAction() {
  const { selectedMember } = useContext(MemberContext);
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  if (!selectedMember) return null;
  
  const profileHeaderStyles = css`
    position: relative;
    background: ${colorScheme === 'dark' 
      ? 'linear-gradient(135deg, rgba(66, 99, 235, 0.1), rgba(92, 124, 250, 0.05))'
      : 'linear-gradient(135deg, rgba(66, 99, 235, 0.05), rgba(92, 124, 250, 0.02))'
    };
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.2)'
      : 'rgba(92, 124, 250, 0.1)'
    };
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(to right, #4263EB, #748FFC);
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  `;
  
  const infoItemStyles = css`
    display: flex;
    align-items: center;
    padding: 12px;
    background: ${colorScheme === 'dark'
      ? 'rgba(44, 46, 51, 0.5)'
      : 'rgba(241, 243, 245, 0.7)'
    };
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid ${colorScheme === 'dark'
      ? 'rgba(55, 58, 64, 1)'
      : 'rgba(222, 226, 230, 1)'
    };
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  `;
  
  return (
    <Box>
      <Paper css={profileHeaderStyles}>
        <Grid gutter={{ base: "md", sm: "xl" }}>
          <Grid.Col span={12} md={4}>
            <Box style={{ textAlign: 'center' }}>
              <Avatar 
                src={selectedMember.profilePicture || profilePlacholder.src} 
                size={{ base: 140, sm: 180 }} 
                radius={180} 
                mx="auto" 
                mb="md"
                style={{
                  border: `3px solid ${colorScheme === 'dark' ? 'rgba(92, 124, 250, 0.3)' : 'rgba(92, 124, 250, 0.2)'}`,
                }}
                color="indigo"
                alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
              >
                {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
              </Avatar>
              {selectedMember.role === 'admin' ? (
                <Badge color="indigo" size="lg" radius="sm" variant="filled">Administrator</Badge>
              ) : (
                <Badge color="gray" size="lg" radius="sm" variant="filled">Member</Badge>
              )}
            </Box>
          </Grid.Col>
          
          <Grid.Col span={12} md={8}>
            <Stack spacing="xs">
              <Text size="xl" fw={700}>
                {selectedMember.firstName} {selectedMember.lastName}
              </Text>
              
              <Group spacing={8} mb="md">
                <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                  <IconId size={16} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Member ID: {selectedMember.uid.slice(0, 8)}...
                </Text>
              </Group>
              
              <Divider my="xs" label="Contact Information" labelPosition="center" />
              
              <Group css={infoItemStyles}>
                <ThemeIcon size={36} radius="xl" color="blue" variant="light">
                  <IconMail size={20} />
                </ThemeIcon>
                <Box ml="md">
                  <Text size="xs" c="dimmed">Email Address</Text>
                  <Text size="sm">{selectedMember.email}</Text>
                </Box>
              </Group>
              
              <Group css={infoItemStyles}>
                <ThemeIcon size={36} radius="xl" color="green" variant="light">
                  <IconPhone size={20} />
                </ThemeIcon>
                <Box ml="md">
                  <Text size="xs" c="dimmed">Phone Number</Text>
                  <Text size="sm">{selectedMember.phonenumber}</Text>
                </Box>
              </Group>
              
              <Group css={infoItemStyles}>
                <ThemeIcon size={36} radius="xl" color="cyan" variant="light">
                  <IconBrandTelegram size={20} />
                </ThemeIcon>
                <Box ml="md">
                  <Text size="xs" c="dimmed">Telegram</Text>
                  <Text size="sm">{selectedMember.telegram}</Text>
                </Box>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
      
      <Grid gutter={{ base: "sm", md: "md" }}>
        <Grid.Col span={12} md={6}>
          <Paper p={{ base: "sm", md: "md" }} radius="md" withBorder>
            <Group mb="md">
              <ThemeIcon size={36} radius="xl" color="grape" variant="light">
                <IconCalendar size={20} />
              </ThemeIcon>
              <Text fw={600}>Personal Information</Text>
            </Group>
            
            <Stack spacing="xs">
              <Box>
                <Text size="xs" c="dimmed">Birthday</Text>
                <Text>{formatDate(selectedMember.birthday)}</Text>
              </Box>
              
              <Box mt="sm">
                <Text size="xs" c="dimmed">Authentication Method</Text>
                <Badge>{selectedMember.authProvider || 'Email/Password'}</Badge>
              </Box>
            </Stack>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={12} md={6}>
          <Paper p={{ base: "sm", md: "md" }} radius="md" withBorder>
            <Group mb="md">
              <ThemeIcon size={36} radius="xl" color="indigo" variant="light">
                <IconUsers size={20} />
              </ThemeIcon>
              <Text fw={600}>Team Memberships</Text>
            </Group>
            
            {selectedMember.team.length > 0 ? (
              <Stack spacing="xs">
                {selectedMember.team.map((team) => (
                  <Group 
                    key={team} 
                    position="apart" 
                    p="xs" 
                    style={{ 
                      backgroundColor: colorScheme === 'dark' ? 'rgba(44, 46, 51, 0.5)' : 'rgba(241, 243, 245, 0.7)',
                      borderRadius: '6px'
                    }}
                    spacing={8}
                    wrap="nowrap"
                  >
                    <Text size="sm" lineClamp={1}>{team}</Text>
                    <Badge color="indigo" variant="light" style={{ flexShrink: 0 }}>Active</Badge>
                  </Group>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed" size="sm" ta="center" py="lg">
                Not a member of any teams
              </Text>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
      
      <Button 
        component="a"
        href={`mailto:${selectedMember.email}`}
        variant="light"
        color="blue"
        fullWidth
        mt="xl"
        radius="md"
        leftSection={<IconMail size={16} />}
      >
        Contact {selectedMember.firstName}
      </Button>
    </Box>
  );
}