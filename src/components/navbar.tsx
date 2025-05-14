'use client';

import { useState, useContext, useEffect } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem, Text } from '@mantine/core';
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconUser,
  IconSettings,
  IconLogout,
  IconBarcode,
  IconAddressBook,
  IconDashboard,
  IconBooks
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { AppComponentsContext } from '@/context/AppComponentsContext';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, logout } from "@/service/UI/firebaseUiClient"
import { useProfile } from '@/hooks/profile';
import { css } from '@emotion/react';

// Using emotion css instead of Mantine's createStyles
const useNavbarStyles = () => {
  const linkStyle = css`
    width: 100%;
    height: ${rem(45)};
    border-radius: var(--mantine-radius-md);
    display: flex;
    align-items: center;
    padding: 0 ${rem(16)};
    color: var(--mantine-color-text);
    margin: 8px 0;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      background-color: var(--mantine-color-dark-5);
    }
  `;

  const activeStyle = css`
    &, &:hover {
      background-color: var(--mantine-primary-color-light);
      color: var(--mantine-primary-color);
    }
  `;

  return { linkStyle, activeStyle };
};

interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { linkStyle, activeStyle } = useNavbarStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} css={[linkStyle, active && activeStyle]}>
        <Icon size="1.2rem" stroke={1.5} style={{ marginRight: '10px' }} />
        <span>{label}</span>
      </UnstyledButton>
    </Tooltip>
  );
}

const baseNavItems = [
  { icon: IconHome2, label: 'Home', href: '/' },
  { icon: IconDeviceDesktopAnalytics, label: 'Members', href: '/members' },
  { icon: IconAddressBook, label: 'Attendance' , href: '/attendance'},
  { icon: IconBooks, label: 'Library', href: '/library' },
  { icon: IconUser, label: 'Account', href: '/profile' },
  { icon: IconBarcode, label: 'Codes', href: '/codes' },
  { icon: IconSettings, label: 'Settings', href: '/settings' },
];

// Admin-only nav item
const adminNavItem = { icon: IconDashboard, label: 'Admin', href: '/admin' };

export function _Navbar() {
  const [active, setActive] = useState(2);
  const router = useRouter()
  const {isNavbarOpen, setNavbarState} = useContext(AppComponentsContext)
  const [user, loading, error] = useAuthState(auth)
  const { profile } = useProfile()
  const [navItems, setNavItems] = useState(baseNavItems);
  
  // Add admin link if user has admin role
  useEffect(() => {
    if (profile?.role === 'admin') {
      // Insert Admin item before Settings (which is the last item)
      const newItems = [...baseNavItems];
      newItems.splice(newItems.length - 1, 0, adminNavItem);
      setNavItems(newItems);
    } else {
      setNavItems(baseNavItems);
    }
  }, [profile]);

  const links = navItems.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        router.push(`${link.href}`);
        
        // On mobile, close the navbar after navigation
        if (window.innerWidth < 768) {
          setNavbarState && setTimeout(() => setNavbarState(false), 300);
        }
      }}
    />
  ));

  const navbarStyles = css`
    height: calc(100vh - 70px);
    width: 250px;
    padding: var(--mantine-spacing-md);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 70px;
    background-color: var(--mantine-color-dark-8);
    z-index: 100;
    border-right: 1px solid var(--mantine-color-dark-5);
    transition: all 0.3s ease;
    transform: translateX(${isNavbarOpen ? '0' : '-100%'});
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    
    @media (min-width: 48em) {
      transform: translateX(${isNavbarOpen ? '0' : '-100%'});
    }
    
    @media (max-width: 48em) {
      width: 200px;
    }
  `;

  const sectionStyles = css`
    flex: 1;
    margin-top: 50px;
  `;

  return (
    <div css={navbarStyles}>
      <Center mt={10} mb={20}>
        <Text fw={700} fz="lg">Navigation</Text>
      </Center>
      <div css={sectionStyles}>
        <Stack justify="start" gap={5}>
          {links}
        </Stack>
      </div>
      <div>
        <Stack justify="center" gap={0}>
          {user && <NavbarLink icon={IconLogout} label="Logout" onClick={()=>logout()} />}
        </Stack>
      </div>
    </div>
  );
}