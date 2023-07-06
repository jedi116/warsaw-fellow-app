import { useContext } from 'react';
import {
  AppShell,
  Header,
  Footer,
  Text,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import { _Navbar } from './navbar';
import { _Header } from './header';
import { AppComponentsContext } from '@/context/AppComponentsContext';

type AppShellProps = {
    children: JSX.Element
}

export default function _AppShell(props: AppShellProps) {
  const {children} = props  
  const theme = useMantineTheme();
  const {isNavbarOpen, setNavbarState } = useContext(AppComponentsContext)
  const getNavbar = () => {
    if (isNavbarOpen) {
      return {
        navbar: <_Navbar/>,
        navbarOffsetBreakpoint:"sm"
      }
    } else {

    } 
  } 
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      header={<_Header/>}
      padding={1}
      {...getNavbar()}
    >
      {children}
    </AppShell>
  );
}