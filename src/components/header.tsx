import {
    createStyles,
    Header,
    HoverCard,
    Group,
    Button,
    MediaQuery,
    Text,
    Box,
    Burger,
    rem,
  } from '@mantine/core';
import { useContext } from 'react';
import { AppComponentsContext } from '@/context/AppComponentsContext';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { useRouter } from 'next/router'
  const useStyles = createStyles((theme) => ({
    hiddenMobile: {
      [theme.fn.smallerThan('sm')]: {
        display: 'none',
      },
    },
  
    hiddenDesktop: {
      [theme.fn.largerThan('sm')]: {
        display: 'none',
      },
    },
  }));
  export function _Header() {
    const { classes, theme } = useStyles();
    const {isNavbarOpen, setNavbarState} = useContext(AppComponentsContext)
    const router = useRouter()
    const [user, loading, error] = useAuthState(auth)
    return (
      <Box pb={100}>
        <Header height={70} px="sm">
          <Group position="apart" sx={{ height: '100%' }}>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
                opened={isNavbarOpen}
                onClick={() => setNavbarState && setNavbarState(!isNavbarOpen)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
            />
          </MediaQuery>
            <Group>
              <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                <Burger
                      opened={isNavbarOpen}
                      onClick={() => setNavbarState && setNavbarState(!isNavbarOpen)}
                      size="sm"
                      color={theme.colors.gray[6]}
                      mr="xl"
                  />
              </MediaQuery>
              <Text>Warsaw FellowShip</Text><Text fz={10}>beta</Text>
            </Group>
            {
              !user && 
              <Group className={classes.hiddenMobile}>
                <Button variant="default" onClick={()=>router.push('/auth/login')}>Log in</Button>
                <Button onClick={()=>router.push('/auth/register')}>Sign up</Button>
              </Group>
            }
          </Group>
        </Header>
      </Box>
    );
  }

  