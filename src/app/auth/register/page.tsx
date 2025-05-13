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
  Button,
  Divider,
  Grid,
  ThemeIcon,
  Box,
  Group,
  SimpleGrid,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { registerWithEmailAndPassword } from '@/service/UI/firebaseUiClient';
import { FellowTeam } from '@/interface/user';
import { useState } from 'react';
import { ConfirmRegistrationCodeForm } from '@/components/registerCodeForm';
import { css } from '@emotion/react';
import { 
  IconCalendar, 
  IconHeart, 
  IconLock, 
  IconMail, 
  IconPhone, 
  IconUser, 
  IconBrandTelegram, 
  IconUsers 
} from '@tabler/icons-react';
import Link from 'next/link';

type RegistrationFormData = {
  email: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
  phonenumber: string;
  birthday: string;
  worship: boolean;
  prayer: boolean;
  literature: boolean;
  evangelism: boolean;
  holisticteam: boolean;
  eventOrganization: boolean;
  telegram: string
}

// Helper to capitalize team names for display
function formatTeamName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}

export default function Register() {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const router = useRouter();
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const _form = useForm({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      firstName: '',
      lastName: '',
      phonenumber: '',
      birthday: new Date(), // Initialize with current date
      worship: false,
      prayer: false,
      literature: false,
      evangelism: false,
      holisticteam: false,
      eventOrganization: false,
      telegram: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => value.length > 5 ? null : 'Password must be at least 6 characters',
      repeatPassword: (value, values) => values.password === value ? null : 'Passwords do not match',
      firstName: (value) => (value && value.trim().length < 2) ? 'First name is too short' : null,
      lastName: (value) => (value && value.trim().length < 2) ? 'Last name is too short' : null,
      phonenumber: (value) => (!value || value.length < 6) ? 'Please enter a valid phone number' : null,
      telegram: (value) => (!value || value.length < 3) ? 'Please enter a valid Telegram username' : null,
      birthday: (value) => {
        if (!value) return 'Please select your birthday';
        try {
          // Make sure it's a valid date
          const date = new Date(value);
          return isNaN(date.getTime()) ? 'Invalid date' : null;
        } catch (e) {
          return 'Invalid date format';
        }
      },
    },
  });
  
  const handleRegistration = (formData: RegistrationFormData) => {
    const fellowTeam: FellowTeam[] = [];
    Object.keys(formData).forEach(key => {
      const keyy = key as keyof RegistrationFormData;
      if (typeof formData[keyy] === 'boolean' && formData[keyy]) {
        fellowTeam.push(keyy as FellowTeam);
      }
    });

    // Handle the date properly, ensuring it's a valid date
    let birthdayDate: string;
    try {
      // Check if it's already a Date object
      if (formData.birthday instanceof Date) {
        birthdayDate = formData.birthday.toISOString();
      } else if (typeof formData.birthday === 'string') {
        // Attempt to create a valid date from the string
        const dateObj = new Date(formData.birthday);
        if (!isNaN(dateObj.getTime())) { // Check if date is valid
          birthdayDate = dateObj.toISOString();
        } else {
          // Fallback to current date if invalid
          birthdayDate = new Date().toISOString();
          console.warn('Invalid date detected, using current date as fallback');
        }
      } else {
        // Fallback to current date if no valid format
        birthdayDate = new Date().toISOString();
      }
    } catch (error) {
      console.error('Error processing date:', error);
      birthdayDate = new Date().toISOString();
    }

    registerWithEmailAndPassword({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phonenumber: formData.phonenumber,
      birthday: birthdayDate,
      team: fellowTeam,
      telegram: formData.telegram
    });
    
    router.push('/');
  };

  const authContainerStyles = css`
    padding: 40px 0 80px;
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
  
  const teamOptionStyles = css`
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.2)'
      : 'rgba(222, 226, 230, 0.7)'
    };
    transition: all 0.2s ease;
    
    &:hover {
      background: ${colorScheme === 'dark'
        ? 'rgba(66, 99, 235, 0.1)'
        : 'rgba(66, 99, 235, 0.05)'
      };
    }
  `;
  
  if (!isConfirmed) {
    return <ConfirmRegistrationCodeForm confirm={() => setIsConfirmed(true)} />;
  }
  
  return (
    <Container size="md" css={authContainerStyles}>
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
          Join Warsaw Fellowship
        </Title>
        <Text c="dimmed" size="sm" maw={400} mx="auto">
          Create your account to become a member of our community
        </Text>
      </Box>

      <Paper withBorder shadow="md" p={30} radius="md" css={cardStyles}>
        <form onSubmit={_form.onSubmit(values => handleRegistration(values))}>
          <Stack spacing={30}>
            {/* Account Section */}
            <Box>
              <Group mb="md">
                <ThemeIcon size={36} radius="md" variant="light" color="indigo">
                  <IconUser size={20} />
                </ThemeIcon>
                <Text fw={600}>Account Information</Text>
              </Group>
              
              <Grid gutter="md">
                <Grid.Col span={12} md={6}>
                  <TextInput 
                    label="Email Address" 
                    placeholder="your@email.com" 
                    required 
                    icon={<IconMail size={16} />}
                    radius="md"
                    {..._form.getInputProps('email')}
                  />
                </Grid.Col>
                
                <Grid.Col span={12} md={6}>
                  <TextInput 
                    label="First Name" 
                    placeholder="John" 
                    required 
                    icon={<IconUser size={16} />}
                    radius="md"
                    {..._form.getInputProps('firstName')}
                  />
                </Grid.Col>
                
                <Grid.Col span={12} md={6}>
                  <TextInput 
                    label="Last Name" 
                    placeholder="Smith" 
                    required 
                    icon={<IconUser size={16} />}
                    radius="md"
                    {..._form.getInputProps('lastName')}
                  />
                </Grid.Col>
                
                <Grid.Col span={12} md={6}>
                  <DateInput
                    label="Date of Birth"
                    placeholder="Select your birthday"
                    valueFormat="MMMM D, YYYY"
                    required
                    radius="md"
                    icon={<IconCalendar size={16} />}
                    defaultValue={new Date()} // Set default to current date
                    allowDeselect={false} // Prevent null values
                    maxDate={new Date()} // Cannot select future dates
                    {..._form.getInputProps('birthday')}
                  />
                </Grid.Col>
              </Grid>
            </Box>
            
            <Divider />
            
            {/* Password Section */}
            <Box>
              <Group mb="md">
                <ThemeIcon size={36} radius="md" variant="light" color="blue">
                  <IconLock size={20} />
                </ThemeIcon>
                <Text fw={600}>Set Your Password</Text>
              </Group>
              
              <Grid gutter="md">
                <Grid.Col span={12} md={6}>
                  <PasswordInput 
                    label="Password" 
                    placeholder="Choose a strong password" 
                    required 
                    icon={<IconLock size={16} />}
                    radius="md"
                    {..._form.getInputProps('password')}
                  />
                </Grid.Col>
                
                <Grid.Col span={12} md={6}>
                  <PasswordInput 
                    label="Confirm Password" 
                    placeholder="Confirm your password" 
                    required 
                    icon={<IconLock size={16} />}
                    radius="md"
                    {..._form.getInputProps('repeatPassword')}
                  />
                </Grid.Col>
              </Grid>
            </Box>
            
            <Divider />
            
            {/* Contact Section */}
            <Box>
              <Group mb="md">
                <ThemeIcon size={36} radius="md" variant="light" color="green">
                  <IconPhone size={20} />
                </ThemeIcon>
                <Text fw={600}>Contact Information</Text>
              </Group>
              
              <Grid gutter="md">
                <Grid.Col span={12} md={6}>
                  <TextInput
                    label="Phone Number" 
                    placeholder="+48 123 456 789" 
                    required 
                    icon={<IconPhone size={16} />}
                    radius="md"
                    {..._form.getInputProps('phonenumber')}
                  />
                </Grid.Col>
                
                <Grid.Col span={12} md={6}>
                  <TextInput
                    label="Telegram" 
                    placeholder="@username or phone number" 
                    required 
                    icon={<IconBrandTelegram size={16} />}
                    radius="md"
                    {..._form.getInputProps('telegram')}
                  />
                </Grid.Col>
              </Grid>
            </Box>
            
            <Divider />
            
            {/* Team Section */}
            <Box>
              <Group mb="md">
                <ThemeIcon size={36} radius="md" variant="light" color="grape">
                  <IconUsers size={20} />
                </ThemeIcon>
                <Text fw={600}>Fellowship Teams</Text>
              </Group>
              
              <Text size="sm" color="dimmed" mb="md">
                Select the teams you would like to participate in:
              </Text>
              
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} spacing="md">
                <Box css={teamOptionStyles}>
                  <Checkbox
                    label={formatTeamName('worship')}
                    radius="sm"
                    {..._form.getInputProps('worship', { type: 'checkbox' })}
                  />
                </Box>
                
                <Box css={teamOptionStyles}>
                  <Checkbox  
                    label={formatTeamName('prayer')}
                    radius="sm"
                    {..._form.getInputProps('prayer', { type: 'checkbox' })}
                  />
                </Box>
                
                <Box css={teamOptionStyles}>
                  <Checkbox  
                    label={formatTeamName('literature')}
                    radius="sm"
                    {..._form.getInputProps('literature', { type: 'checkbox' })}
                  />
                </Box>
                
                <Box css={teamOptionStyles}>
                  <Checkbox  
                    label={formatTeamName('evangelism')}
                    radius="sm"
                    {..._form.getInputProps('evangelism', { type: 'checkbox' })}
                  />
                </Box>
                
                <Box css={teamOptionStyles}>
                  <Checkbox  
                    label={formatTeamName('holisticteam')}
                    radius="sm"
                    {..._form.getInputProps('holisticteam', { type: 'checkbox' })}
                  />
                </Box>
                
                <Box css={teamOptionStyles}>
                  <Checkbox  
                    label={formatTeamName('eventOrganization')}
                    radius="sm"
                    {..._form.getInputProps('eventOrganization', { type: 'checkbox' })}
                  />
                </Box>
              </SimpleGrid>
            </Box>
            
            <Button 
              fullWidth 
              mt="lg" 
              size="md"
              radius="md"
              type="submit"
              gradient={{ from: 'indigo', to: 'blue', deg: 45 }}
              variant="gradient"
            >
              Create Account
            </Button>
            
            <Text c="dimmed" size="sm" ta="center">
              Already have an account?{' '}
              <Anchor component={Link} href="/auth/login">
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}