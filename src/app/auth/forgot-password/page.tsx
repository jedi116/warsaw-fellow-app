'use client';

import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Box,
  ThemeIcon,
  Stack,
  useMantineColorScheme,
  Divider,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconHeart, IconMail, IconShieldCheck } from '@tabler/icons-react';
import { css } from '@emotion/react';
import Link from 'next/link';
import { useState } from 'react';
import { sendPasswordReset } from '@/service/UI/firebaseUiClient';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  });
  
  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      await sendPasswordReset(values.email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
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
          Reset your password
        </Title>
        <Text c="dimmed" size="sm">
          Enter your email address to receive a reset link
        </Text>
      </Box>
      
      <Paper withBorder shadow="md" p={30} radius="md" css={cardStyles}>
        {submitted ? (
          <Alert 
            radius="md" 
            icon={<IconShieldCheck size={16} />} 
            title="Password Reset Email Sent" 
            color="green"
            mb="md"
          >
            If an account exists with this email address, you will receive a password reset link.
            Please check your inbox and follow the instructions in the email.
          </Alert>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <TextInput 
                label="Email Address"
                placeholder="your@email.com" 
                required 
                icon={<IconMail size={16} />}
                radius="md"
                size="md"
                {...form.getInputProps('email')}
              />
              
              <Button 
                fullWidth 
                mt="md" 
                size="md"
                type="submit"
                radius="md"
                gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
                variant="gradient"
                loading={loading}
              >
                Send Reset Link
              </Button>
            </Stack>
          </form>
        )}
        
        <Divider my="lg" />
        
        <Button
          component={Link}
          href="/auth/login"
          variant="default"
          radius="md"
          fullWidth
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
}