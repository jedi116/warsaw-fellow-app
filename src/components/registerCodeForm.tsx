'use client';

import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  ThemeIcon,
  Box,
  Stack,
  useMantineColorScheme,
  ActionIcon,
} from '@mantine/core';
import { IconArrowLeft, IconHeart, IconLockAccess } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CommonService from '@/service/UI/common';
import { useForm } from '@mantine/form';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "@/service/UI/firebaseUiClient";
import { css } from '@emotion/react';
import Link from 'next/link';

type Props = {
  confirm: Function
}

export function ConfirmRegistrationCodeForm({ confirm }: Props) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const handleConfirmation = async (code: string) => {
    try {
      const codes = await CommonService.getRegistrationCodesWCilent();
      if (codes && codes[0].value === code) {
        confirm();
      } else {
        toast.warning('Provided code is not correct. Please contact fellowship leaders to get the correct code.');
      }
    } catch (error) {
      toast.error('Could not validate code');
    }
  };
  
  const _form = useForm({
    initialValues: {
      code: ''
    },
    validate: {
      code: (value) => (!value || value.length < 3) ? 'Please enter a valid registration code' : null,
    }
  });

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
          Registration Code Required
        </Title>
        <Text c="dimmed" size="sm" maw={380} mx="auto">
          To join the Warsaw Fellowship community, please enter the registration code provided by the fellowship leaders.
        </Text>
      </Box>
      
      <Paper withBorder shadow="md" p={30} radius="md" css={cardStyles}>
        <form onSubmit={_form.onSubmit(values => handleConfirmation(values.code))}>
          <Stack spacing="lg">
            <Box mb={10}>
              <ThemeIcon 
                size={48} 
                radius="md" 
                variant="light" 
                color="indigo" 
                mb={15}
              >
                <IconLockAccess size={24} />
              </ThemeIcon>
              
              <Text fw={500} size="sm" mb={5}>
                Enter your registration code
              </Text>
              <Text size="xs" c="dimmed" mb={20}>
                This helps us ensure only authorized members can register
              </Text>
            </Box>
            
            <TextInput 
              label="Registration code" 
              placeholder="Enter your code here" 
              required 
              size="md"
              radius="md"
              {..._form.getInputProps('code')}
            />
            
            <Group position="apart" mt="lg">
              <ActionIcon 
                component={Link}
                href="/auth/login"
                variant="subtle"
                color="gray"
                radius="xl"
                size="lg"
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
              
              <Button 
                type="submit"
                size="md"
                radius="md"
                gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
                variant="gradient"
              >
                Verify & Continue
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}