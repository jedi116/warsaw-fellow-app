import { useState, useContext } from 'react';
import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack, rem } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconBarcode,
  IconAddressBook
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { AppComponentsContext } from '@/context/AppComponentsContext';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, logout } from "@/service/UI/firebaseUiClient"

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon size="1.2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const navItemList = [
  { icon: IconHome2, label: 'Home', href: '/' },
  { icon: IconDeviceDesktopAnalytics, label: 'Members', href: '/members' },
  { icon: IconAddressBook, label: 'Attendance' , href: '/attendance'},
  { icon: IconUser, label: 'Account', href: '/profile' },
  { icon: IconBarcode, label: 'Codes', href: '/codes' },
  { icon: IconSettings, label: 'Settings', href: '/settings' },
];

export function _Navbar() {
  const [active, setActive] = useState(2);
  const router = useRouter()
  const {isNavbarOpen} = useContext(AppComponentsContext)
  const [user, loading, error] = useAuthState(auth)

  const links = navItemList.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index)
        router.push(`${link.href}`)
      }}
    />
  ));

  return (
    <Navbar height='90%' width={{ base: 80 }} p="md" hiddenBreakpoint='sm' hidden={!isNavbarOpen}>
      <Center>
        Go to
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {user && <NavbarLink icon={IconLogout} label="Logout" onClick={()=>logout()} />}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}