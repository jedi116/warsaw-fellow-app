'use client';

import { useForm } from '@mantine/form';
import {
  TextInput,
  Checkbox,
  Button,
  Divider,
  Select,
  Paper,
  Grid,
  Stack,
  Title,
  Group,
  Box,
  ThemeIcon,
  Text,
  SimpleGrid,
  Alert,
} from '@mantine/core';
import { DateInput } from '@mantine/dates'
import { FellowTeam } from '@/interface/user';
import UserServiceUI from '@/service/UI/user-ui';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { useContext, useEffect } from 'react';
import { MemberContext } from '@/context/MemberContext';
import { IconCalendar, IconCheck, IconInfoCircle, IconMail, IconPhone, IconUser, IconUsers } from '@tabler/icons-react';

type FormData = {
  email: string;
  role?: string;
  firstName: string;
  lastName: string;
  phonenumber: string;
  birthday: string | Date;
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

export default function MemberForm() {
  const [user, loading, error] = useAuthState(auth)
  const { closeModal, selectedMember, modalType, refreshUsers } = useContext(MemberContext)
  
  const _form = useForm({
    initialValues: {
      email: '',
      role: 'user',
      firstName: '',
      lastName: '',
      phonenumber: '',
      birthday: new Date(),
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
      firstName: (value) => (value && value.trim().length < 2 ? 'First name is too short' : null),
      lastName: (value) => (value && value.trim().length < 2 ? 'Last name is too short' : null),
      phonenumber: (value) => value && value.length < 6 ? 'Phone number is too short' : null,
      telegram: (value) => (value && value.length < 3 ? 'Telegram username is too short' : null),
    },
  })
  
  const handleSubmit = async (data: FormData) => {
    const fellowTeam: FellowTeam[] = []
    Object.keys(data).forEach(key => {
      const keyy = key as keyof FormData
      if (typeof data[keyy] === 'boolean' && data[keyy]) {
        fellowTeam.push(keyy as FellowTeam)
      }
    })
    
    if (modalType === 'Add') {
      await UserServiceUI.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phonenumber: data.phonenumber,
        birthday: new Date(data.birthday).toISOString(),
        team: fellowTeam,
        telegram: data.telegram
      }, user)
    } else if (modalType === 'Modify') {
      await UserServiceUI.updateUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phonenumber: data.phonenumber,
        birthday: new Date(data.birthday).toISOString(),
        team: fellowTeam,
        telegram: data.telegram,
        uid: selectedMember?.uid,
        role: data.role
      }, user)
    }
    
    closeModal && closeModal()
    setTimeout(() => {
      refreshUsers()
    }, 200)
  }
  
  useEffect(() => {
    if (selectedMember) {
      _form.setValues({
        email: selectedMember.email,
        role: selectedMember.role,
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        phonenumber: selectedMember.phonenumber,
        birthday: new Date(selectedMember?.birthday),
        worship: selectedMember.team.includes('worship'),
        prayer: selectedMember.team.includes('prayer'),
        literature: selectedMember.team.includes('literature'),
        evangelism: selectedMember.team.includes('evangelism'),
        holisticteam: selectedMember.team.includes('holisticteam'),
        eventOrganization: selectedMember.team.includes('eventOrganization'),
        telegram: selectedMember.telegram
      })
    }
  }, [selectedMember])
  
  // Check if at least one field has an error
  const hasErrors = Object.keys(_form.errors).length > 0;
  
  return (
    <Box>
      <form onSubmit={_form.onSubmit(values => handleSubmit(values))}>
        <Title order={4} mb="lg">
          {modalType === 'Add' ? 'Add New Member' : 'Modify Member'}
        </Title>
        
        {modalType === 'Add' && (
          <Alert 
            icon={<IconInfoCircle size={18} />} 
            color="blue" 
            radius="md"
            mb="lg"
          >
            <Text size="sm">
              Users added here will receive an email invitation to complete their registration.
            </Text>
          </Alert>
        )}
        
        <Stack spacing="lg">
          <Paper withBorder p="md" radius="md">
            <Group mb="md">
              <ThemeIcon size={36} radius="xl" variant="light" color="indigo">
                <IconUser size={20} />
              </ThemeIcon>
              <Text fw={600}>Personal Information</Text>
            </Group>
            
            <Grid>
              <Grid.Col span={12} sm={6}>
                <TextInput 
                  label="First Name" 
                  placeholder="John" 
                  required={true}
                  {..._form.getInputProps('firstName')}
                />
              </Grid.Col>
              
              <Grid.Col span={12} sm={6}>
                <TextInput 
                  label="Last Name" 
                  placeholder="Doe" 
                  required={true}
                  {..._form.getInputProps('lastName')}
                />
              </Grid.Col>
              
              <Grid.Col span={12}>
                <DateInput
                  label="Birthday"
                  placeholder="Select date"
                  valueFormat="MMMM D, YYYY"
                  required
                  icon={<IconCalendar size={16} />}
                  {..._form.getInputProps('birthday')}
                />
              </Grid.Col>
            </Grid>
          </Paper>
          
          <Paper withBorder p="md" radius="md">
            <Group mb="md">
              <ThemeIcon size={36} radius="xl" variant="light" color="blue">
                <IconMail size={20} />
              </ThemeIcon>
              <Text fw={600}>Contact Information</Text>
            </Group>
            
            <Grid>
              <Grid.Col span={12} sm={6}>
                <TextInput 
                  label="Email" 
                  placeholder="example@email.com" 
                  required={true}
                  disabled={modalType === 'Modify'}
                  {..._form.getInputProps('email')}
                />
              </Grid.Col>
              
              <Grid.Col span={12} sm={6}>
                <TextInput
                  label="Phone Number" 
                  placeholder="+48 123 456 789" 
                  required={true}
                  {..._form.getInputProps('phonenumber')}
                />
              </Grid.Col>
              
              <Grid.Col span={12}>
                <TextInput
                  label="Telegram" 
                  placeholder="@username or phone number" 
                  required={true}
                  {..._form.getInputProps('telegram')}
                />
              </Grid.Col>
            </Grid>
          </Paper>
          
          <Paper withBorder p="md" radius="md">
            <Group mb="md">
              <ThemeIcon size={36} radius="xl" variant="light" color="green">
                <IconUsers size={20} />
              </ThemeIcon>
              <Text fw={600}>Team Membership</Text>
            </Group>
            
            <Text size="sm" color="dimmed" mb="md">
              Select the teams this member will participate in:
            </Text>
            
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
              <Checkbox  
                label={formatTeamName('worship')}
                {..._form.getInputProps('worship', { type: 'checkbox' })}
              />
              <Checkbox  
                label={formatTeamName('prayer')}
                {..._form.getInputProps('prayer', { type: 'checkbox' })}
              />
              <Checkbox  
                label={formatTeamName('literature')}
                {..._form.getInputProps('literature', { type: 'checkbox' })}
              />
              <Checkbox  
                label={formatTeamName('evangelism')}
                {..._form.getInputProps('evangelism', { type: 'checkbox' })}
              />
              <Checkbox  
                label={formatTeamName('holisticteam')}
                {..._form.getInputProps('holisticteam', { type: 'checkbox' })}
              />
              <Checkbox  
                label={formatTeamName('eventOrganization')}
                {..._form.getInputProps('eventOrganization', { type: 'checkbox' })}
              />
            </SimpleGrid>
          </Paper>
          
          {modalType === 'Modify' && (
            <Paper withBorder p="md" radius="md">
              <Group mb="md">
                <ThemeIcon size={36} radius="xl" variant="light" color="grape">
                  <IconUser size={20} />
                </ThemeIcon>
                <Text fw={600}>Account Settings</Text>
              </Group>
              
              <Select
                label="User Role"
                placeholder="Select role"
                data={[
                  { value: 'admin', label: 'Administrator' },
                  { value: 'user', label: 'Regular Member' }
                ]}
                disabled={selectedMember?.role === 'admin'}
                {..._form.getInputProps('role')}
              />
            </Paper>
          )}
        </Stack>
        
        <Group position="right" mt="xl">
          <Button variant="default" onClick={closeModal} radius="md">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={hasErrors}
            color="indigo"
            radius="md"
            leftIcon={<IconCheck size={16} />}
          >
            {modalType === 'Add' ? 'Add Member' : 'Save Changes'}
          </Button>
        </Group>
      </form>
    </Box>
  )
}