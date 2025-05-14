'use client';

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconHome, 
  IconUserCircle, 
  IconCalendarEvent, 
  IconUsers, 
  IconSettings,
  IconMenu2,
  IconBarcode,
  IconChevronDown,
  IconLogout,
  IconSun,
  IconMoon,
  IconHeart,
  IconSearch,
  IconDashboard,
  IconBooks
} from '@tabler/icons-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from "@/service/UI/firebaseUiClient";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { css } from '@emotion/react';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/hooks/profile';

// Public links that all users can see
const publicLinks = [
  { label: 'Home', href: '/', icon: IconHome },
  { label: 'About', href: '/about', icon: IconHeart },
  { label: 'Events', href: '/events', icon: IconCalendarEvent },
];

// Links that only authenticated users can see
const authenticatedLinks = [
  { label: 'Members', href: '/members', icon: IconUsers },
  { label: 'Attendance', href: '/attendance', icon: IconCalendarEvent },
  { label: 'Library', href: '/library', icon: IconBooks },
  { label: 'Codes', href: '/codes', icon: IconBarcode },
];

// Admin Menu Item Component
function AdminMenuItem() {
  const { profile } = useProfile();
  const router = useRouter();
  
  if (profile?.role !== 'admin') {
    return null;
  }
  
  return (
    <Menu.Item 
      leftSection={
        <ThemeIcon size={32} radius="xl" variant="light" color="violet">
          <IconDashboard size={16} />
        </ThemeIcon>
      }
      onClick={() => router.push('/admin')}
    >
      <Text size="sm" fw={500}>Admin Dashboard</Text>
      <Text size="xs" c="dimmed">Manage website content</Text>
    </Menu.Item>
  );
}

// Admin Mobile Menu Item
function AdminMobileMenuItem({ handleNavigation }) {
  const { profile } = useProfile();
  
  if (profile?.role !== 'admin') {
    return null;
  }
  
  return (
    <UnstyledButton
      onClick={() => handleNavigation('/admin')}
      style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Group>
        <ThemeIcon size={36} radius="xl" color="violet" variant="light">
          <IconDashboard size={18} />
        </ThemeIcon>
        <div>
          <Text size="lg" fw={600}>Admin Dashboard</Text>
          <Text size="xs" c="dimmed">Manage website content</Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}

export function ModernHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();
  const [user, loading, error] = useAuthState(auth);
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark'; 
  const toggleColorScheme = () => {}; // No-op to avoid errors

  const headerStyles = css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    z-index: 1000;
    background: ${colorScheme === 'dark' 
      ? 'linear-gradient(to right, rgba(20, 21, 23, 0.99), rgba(37, 38, 43, 0.99))'
      : 'linear-gradient(to right, rgba(248, 249, 250, 0.97), rgba(241, 243, 245, 0.97))'
    };
    backdrop-filter: blur(15px);
    box-shadow: ${colorScheme === 'dark'
      ? '0 4px 25px rgba(0, 0, 0, 0.25)'
      : '0 4px 20px rgba(0, 0, 0, 0.07)'
    };
    border-bottom: ${colorScheme === 'dark'
      ? '1px solid rgba(92, 124, 250, 0.15)'
      : '1px solid rgba(92, 124, 250, 0.1)'
    };
    transition: all 0.3s ease;
  `;

  const logoContainerStyles = css`
    position: relative;
    padding: 12px 20px;
    border-radius: 12px;
    overflow: hidden;
    background: ${colorScheme === 'dark'
      ? 'linear-gradient(45deg, rgba(60, 90, 220, 0.08), rgba(90, 120, 250, 0.04))'
      : 'linear-gradient(45deg, rgba(60, 90, 220, 0.06), rgba(90, 120, 250, 0.02))'
    };
    border: 1px solid ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.2)'
      : 'rgba(92, 124, 250, 0.15)'
    };
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      border-color: rgba(92, 124, 250, 0.3);
      background: ${colorScheme === 'dark'
        ? 'linear-gradient(45deg, rgba(60, 90, 220, 0.12), rgba(90, 120, 250, 0.08))'
        : 'linear-gradient(45deg, rgba(60, 90, 220, 0.09), rgba(90, 120, 250, 0.05))'
      };
      box-shadow: ${colorScheme === 'dark'
        ? '0 8px 20px rgba(0, 0, 0, 0.1)'
        : '0 8px 16px rgba(0, 0, 0, 0.05)'
      };
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100px;
      width: 50px;
      height: 100%;
      background: linear-gradient(
        to right,
        transparent,
        ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'},
        transparent
      );
      transform: skewX(-25deg);
      animation: shimmer 8s infinite;
    }
    
    @keyframes shimmer {
      0% {
        left: -100px;
      }
      20% {
        left: 100%;
      }
      100% {
        left: 100%;
      }
    }
  `;

  const navItemStyles = css`
    position: relative;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    font-size: 16px;
    letter-spacing: 0.3px;
    color: ${colorScheme === 'dark' ? 'white' : '#343a40'};
    
    &:hover {
      background: ${colorScheme === 'dark' 
        ? 'rgba(92, 124, 250, 0.08)' 
        : 'rgba(92, 124, 250, 0.05)'
      };
      border-color: ${colorScheme === 'dark'
        ? 'rgba(92, 124, 250, 0.2)'
        : 'rgba(92, 124, 250, 0.15)'
      };
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(1px);
    }
  `;

  const activeNavItemStyles = css`
    background: ${colorScheme === 'dark'
      ? 'linear-gradient(135deg, rgba(66, 99, 235, 0.15), rgba(92, 124, 250, 0.05))'
      : 'linear-gradient(135deg, rgba(66, 99, 235, 0.1), rgba(92, 124, 250, 0.03))'
    };
    border-color: ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.3)'
      : 'rgba(92, 124, 250, 0.2)'
    };
    box-shadow: ${colorScheme === 'dark'
      ? '0 5px 15px rgba(66, 99, 235, 0.1)'
      : '0 5px 15px rgba(66, 99, 235, 0.05)'
    };
    color: ${colorScheme === 'dark' ? 'white' : '#364fc7'};
    
    &:after {
      content: '';
      position: absolute;
      bottom: -13px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 3px;
      background: linear-gradient(to right, #3b5bdb, #748ffc);
      border-radius: 3px;
    }
    
    &:hover {
      background: ${colorScheme === 'dark'
        ? 'linear-gradient(135deg, rgba(66, 99, 235, 0.2), rgba(92, 124, 250, 0.1))'
        : 'linear-gradient(135deg, rgba(66, 99, 235, 0.15), rgba(92, 124, 250, 0.07))'
      };
    }
  `;

  const iconContainerStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(66, 99, 235, 0.2), rgba(92, 124, 250, 0.1));
    box-shadow: 0 2px 8px rgba(66, 99, 235, 0.15);
    margin-right: 10px;
  `;

  // Handler for navigation
  const handleNavigation = (href: string) => {
    router.push(href);
    closeDrawer();
  };

  const isCurrentPath = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <Box css={headerStyles}>
        <Container h="100%" size="xl">
          <Group justify="space-between" h="100%">
            {/* Logo */}
            <UnstyledButton 
              onClick={() => router.push('/')}
              component={Link} 
              href="/"
              css={logoContainerStyles}
            >
              <Group gap={12}>
                <ThemeIcon 
                  size={40} 
                  radius="xl" 
                  variant="gradient" 
                  gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
                >
                  <IconHeart size={22} style={{ fill: 'white', stroke: 'white', strokeWidth: 1 }} />
                </ThemeIcon>
                <div>
                  <Text 
                    fw={800} 
                    size="lg" 
                    style={{ letterSpacing: '0.3px' }} 
                    gradient={{ 
                      from: colorScheme === 'dark' ? '#c5ceff' : '#4263EB', 
                      to: colorScheme === 'dark' ? 'white' : '#748FFC', 
                      deg: 45 
                    }} 
                    variant="gradient"
                  >
                    WARSAW FELLOWSHIP
                  </Text>
                  <Badge 
                    color="indigo" 
                    variant={colorScheme === 'dark' ? 'light' : 'filled'} 
                    size="xs" 
                    radius="sm" 
                    ml={3} 
                    mt={3}
                  >
                    ETHIOPIAN CHRISTIAN COMMUNITY
                  </Badge>
                </div>
              </Group>
            </UnstyledButton>

            {/* Desktop navigation */}
            <Group gap={8} visibleFrom="md">
              {/* Always show public links */}
              {publicLinks.map((link) => (
                <UnstyledButton
                  key={link.label}
                  css={[navItemStyles, isCurrentPath(link.href) && activeNavItemStyles]}
                  onClick={() => handleNavigation(link.href)}
                >
                  <Group gap={8} wrap="nowrap">
                    <Box css={iconContainerStyles}>
                      <link.icon size={16} color="#fff" stroke={1.5} />
                    </Box>
                    <Text>{link.label}</Text>
                  </Group>
                </UnstyledButton>
              ))}
              
              {/* Only show authenticated links if user is logged in */}
              {user && authenticatedLinks.map((link) => (
                <UnstyledButton
                  key={link.label}
                  css={[navItemStyles, isCurrentPath(link.href) && activeNavItemStyles]}
                  onClick={() => handleNavigation(link.href)}
                >
                  <Group gap={8} wrap="nowrap">
                    <Box css={iconContainerStyles}>
                      <link.icon size={16} color="#fff" stroke={1.5} />
                    </Box>
                    <Text>{link.label}</Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Group>

            {/* User menu or auth buttons */}
            <Group gap="md" visibleFrom="md">
              {!user ? (
                <Group gap="sm">
                  <Button 
                    variant="light" 
                    color="gray" 
                    onClick={() => router.push('/auth/login')}
                    size="md"
                    radius="xl"
                    style={{
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => router.push('/auth/register')}
                    size="md"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
                    style={{
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      boxShadow: '0 4px 15px rgba(66, 99, 235, 0.3)',
                    }}
                  >
                    Sign Up
                  </Button>
                </Group>
              ) : (
                <Menu 
                  position="bottom-end" 
                  width={240} 
                  shadow="lg"
                  transitionProps={{
                    transition: 'pop-top-right',
                    duration: 150,
                  }}
                >
                  <Menu.Target>
                    <Button 
                      variant="gradient" 
                      gradient={{ from: 'dark.6', to: 'dark.5', deg: 45 }}
                      rightSection={<IconChevronDown size={16} />}
                      radius="xl"
                      size="md"
                      style={{ 
                        fontWeight: 600,
                        letterSpacing: '0.3px',
                        border: '1px solid rgba(92, 124, 250, 0.2)',
                      }}
                    >
                      <Group gap={10} wrap="nowrap">
                        <Box
                          style={{
                            width: 26, 
                            height: 26, 
                            borderRadius: '50%',
                            backgroundColor: 'rgba(92, 124, 250, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconUserCircle size={18} color="#748ffc" />
                        </Box>
                        <Text>Account</Text>
                      </Group>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown style={{ backdropFilter: 'blur(20px)' }}>
                    <Menu.Label style={{ fontSize: '14px', fontWeight: 600 }}>
                      <Text tt="uppercase" size="xs" fw={700} c="dimmed">
                        Hi, {user.displayName || user.email}
                      </Text>
                    </Menu.Label>
                    
                    <Menu.Divider />
                    
                    <Menu.Item 
                      leftSection={
                        <ThemeIcon size={32} radius="xl" variant="light" color="indigo">
                          <IconUserCircle size={16} />
                        </ThemeIcon>
                      }
                      onClick={() => router.push('/profile')}
                    >
                      <Text size="sm" fw={500}>Profile</Text>
                      <Text size="xs" c="dimmed">Manage your personal information</Text>
                    </Menu.Item>
                    
                    {/* Admin Dashboard MenuItem */}
                    <AdminMenuItem />
                    
                    <Menu.Item 
                      leftSection={
                        <ThemeIcon size={32} radius="xl" variant="light" color="blue">
                          <IconSettings size={16} />
                        </ThemeIcon>
                      }
                      onClick={() => router.push('/settings')}
                    >
                      <Text size="sm" fw={500}>Settings</Text>
                      <Text size="xs" c="dimmed">Configure your preferences</Text>
                    </Menu.Item>
                    
                    <Menu.Divider />
                    
                    <Menu.Item 
                      leftSection={
                        <ThemeIcon size={32} radius="xl" variant="light" color="red">
                          <IconLogout size={16} />
                        </ThemeIcon>
                      }
                      onClick={() => logout()}
                      color="red"
                    >
                      <Text size="sm" fw={500}>Logout</Text>
                      <Text size="xs" c="dimmed">End your current session</Text>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>

            {/* Mobile menu button */}
            <Group gap="md" hiddenFrom="md">
              <Button 
                variant="gradient"
                gradient={{ from: 'dark.6', to: 'dark.5', deg: 45 }}
                onClick={toggleDrawer}
                radius="xl"
                size="md"
                style={{
                  border: '1px solid rgba(92, 124, 250, 0.2)',
                  fontWeight: 600,
                }}
              >
                <Group gap="sm">
                  <IconMenu2 size={20} />
                  <span>Menu</span>
                </Group>
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="xl"
        title={
          <Group>
            <ThemeIcon 
              size={40} 
              radius="xl" 
              variant="gradient" 
              gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
            >
              <IconHeart size={22} style={{ fill: 'white', stroke: 'white', strokeWidth: 1 }} />
            </ThemeIcon>
            <Title order={3}>Warsaw Fellowship</Title>
          </Group>
        }
        zIndex={1000}
        transitionProps={{ duration: 250, transition: 'slide-right' }}
      >
        <Divider my="lg" />
        
        <Stack spacing="md">
          {/* Always show public links in the mobile menu */}
          {publicLinks.map((link) => (
            <UnstyledButton
              key={link.label}
              onClick={() => handleNavigation(link.href)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: isCurrentPath(link.href) ? 'rgba(92, 124, 250, 0.1)' : 'transparent',
                border: isCurrentPath(link.href) ? '1px solid rgba(92, 124, 250, 0.2)' : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <Group>
                <ThemeIcon 
                  size={36} 
                  radius="xl" 
                  variant={isCurrentPath(link.href) ? "gradient" : "light"}
                  gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
                  color={isCurrentPath(link.href) ? undefined : "dark.5"}
                >
                  <link.icon size={18} />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={600}>{link.label}</Text>
                  <Text size="xs" c="dimmed">Navigate to {link.label.toLowerCase()} page</Text>
                </div>
              </Group>
            </UnstyledButton>
          ))}
          
          {/* Only show authenticated links if user is logged in */}
          {user && authenticatedLinks.map((link) => (
            <UnstyledButton
              key={link.label}
              onClick={() => handleNavigation(link.href)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: isCurrentPath(link.href) ? 'rgba(92, 124, 250, 0.1)' : 'transparent',
                border: isCurrentPath(link.href) ? '1px solid rgba(92, 124, 250, 0.2)' : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <Group>
                <ThemeIcon 
                  size={36} 
                  radius="xl" 
                  variant={isCurrentPath(link.href) ? "gradient" : "light"}
                  gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
                  color={isCurrentPath(link.href) ? undefined : "dark.5"}
                >
                  <link.icon size={18} />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={600}>{link.label}</Text>
                  <Text size="xs" c="dimmed">Navigate to {link.label.toLowerCase()} page</Text>
                </div>
              </Group>
            </UnstyledButton>
          ))}
          
          <Divider 
            my="lg" 
            label={
              <Text size="sm" fw={500} c="dimmed">
                Account Options
              </Text>
            } 
            labelPosition="center"
          />
          
          {user ? (
            <>
              <UnstyledButton
                onClick={() => handleNavigation('/profile')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <Group>
                  <ThemeIcon size={36} radius="xl" color="indigo" variant="light">
                    <IconUserCircle size={18} />
                  </ThemeIcon>
                  <div>
                    <Text size="lg" fw={600}>Profile</Text>
                    <Text size="xs" c="dimmed">Manage your personal information</Text>
                  </div>
                </Group>
              </UnstyledButton>
              
              {/* Admin Dashboard Mobile Menu Item */}
              <AdminMobileMenuItem handleNavigation={handleNavigation} />
              
              <UnstyledButton
                onClick={() => handleNavigation('/settings')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <Group>
                  <ThemeIcon size={36} radius="xl" color="blue" variant="light">
                    <IconSettings size={18} />
                  </ThemeIcon>
                  <div>
                    <Text size="lg" fw={600}>Settings</Text>
                    <Text size="xs" c="dimmed">Configure your preferences</Text>
                  </div>
                </Group>
              </UnstyledButton>
              
              <UnstyledButton
                onClick={() => logout()}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 56, 56, 0.05)',
                  border: '1px solid rgba(255, 56, 56, 0.1)',
                  transition: 'all 0.3s ease',
                  marginTop: '10px',
                }}
              >
                <Group>
                  <ThemeIcon size={36} radius="xl" color="red" variant="light">
                    <IconLogout size={18} />
                  </ThemeIcon>
                  <div>
                    <Text size="lg" fw={600} c="red.4">Logout</Text>
                    <Text size="xs" c="dimmed">End your current session</Text>
                  </div>
                </Group>
              </UnstyledButton>
            </>
          ) : (
            <Group grow mt="xl">
              <Button 
                variant="default" 
                onClick={() => handleNavigation('/auth/login')}
                size="lg"
                radius="xl"
              >
                Log In
              </Button>
              <Button 
                onClick={() => handleNavigation('/auth/register')}
                size="lg"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
              >
                Sign Up
              </Button>
            </Group>
          )}
        </Stack>
      </Drawer>
    </>
  );
}