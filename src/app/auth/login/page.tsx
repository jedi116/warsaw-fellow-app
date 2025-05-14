'use client';

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  ThemeIcon,
  Box,
  Divider,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { logInWithEmailAndPassword } from '@/service/UI/firebaseUiClient';
import { IconHeart, IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { css } from '@emotion/react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const _form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => value.length < 1 ? 'Password is required' : null,
    }
  });
  
  const handleLogin = async (values: {
    email: string;
    password: string;
  }) => {
    const success = await logInWithEmailAndPassword(values.email, values.password);
    success && router.push('/');
  };

  const authContainerStyles = css`
    padding: 40px 0;
    min-height: calc(100vh - 240px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  `;
  
  const cardStyles = css`
    position: relative;
    border: 1px solid ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.2)'
      : 'rgba(92, 124, 250, 0.1)'
    };
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

  return (
    <Container size={450} css={authContainerStyles}>
      <Box style={{ textAlign: 'center' }} mb={30}>
        <ThemeIcon 
          size={70} 
          radius={70} 
          mb={20}
          variant="gradient" 
          gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
        >
          <IconHeart size={34} style={{ fill: 'white', stroke: 'white', strokeWidth: 1.5 }} />
        </ThemeIcon>
        
        <Title order={2} mb={5}>
          Welcome to Warsaw Fellowship
        </Title>
        <Text c="dimmed" size="sm">
          Sign in to your account to access member features
        </Text>
      </Box>
      
      <Paper withBorder shadow="md" p={30} radius="md" css={cardStyles}>
        <form onSubmit={_form.onSubmit(values => handleLogin(values))}>
          <Stack spacing="md">
            <TextInput 
              label="Email Address"
              placeholder="your@email.com" 
              required 
              icon={<IconMail size={16} />}
              radius="md"
              size="md"
              {..._form.getInputProps('email')}
            />
            
            <PasswordInput 
              label="Password" 
              placeholder="Your password" 
              required 
              icon={<IconLock size={16} />}
              radius="md"
              size="md"
              {..._form.getInputProps('password')} 
            />
            
            <Group position="apart" mt="sm">
              <Checkbox label="Remember me" radius="xs" />
              <Anchor 
                component={Link} 
                href="/auth/forgot-password" 
                size="sm" 
                fw={500}
                aria-label="Reset your password"
              >
                Forgot password?
              </Anchor>
            </Group>
            
            <Button 
              fullWidth 
              mt="md" 
              size="md"
              type="submit"
              radius="md"
              gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
              variant="gradient"
            >
              Sign In
            </Button>
          </Stack>
        </form>
        
        <Divider
          my="lg"
          label={
            <Text size="sm" fw={500} c="dimmed">
              Don't have an account?
            </Text>
          }
          labelPosition="center"
        />
        
        <Button
          component={Link}
          href="/auth/register"
          variant="default"
          radius="md"
          fullWidth
          leftIcon={<IconUser size={16} />}
        >
          Create a New Account
        </Button>
      </Paper>
    </Container>
  );
}