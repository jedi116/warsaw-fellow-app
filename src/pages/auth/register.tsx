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
    Divider
  } from '@mantine/core';
import { DateInput } from '@mantine/dates'
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import {registerWithEmailAndPassword} from '@/service/UI/firebaseUiClient'
import { FellowTeam } from '@/interface/user';
import { useEffect, useState } from 'react';
import CommonService from '@/service/UI/common';
import { ConfirmRegistrationCodeForm } from '@/components/registerCodeForm';

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
export default function Register () {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
    const router = useRouter()
    const _form = useForm({
        initialValues: {
          email: '',
          password: '',
          repeatPassword: '',
          firstName: '',
          lastName: '',
          phonenumber: '',
          birthday: '',
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
          password: (value) => value.length > 5 ? null: 'Password to short',
          repeatPassword: (value, values) => values.password === value ? null : 'Error does not match password',
          phonenumber: (value) => /^[A-Za-z]*$/.test(value) || value.length < 9   ? 'Phone number format is not correct' : null
        },
    });
    const handleRegistration = (formData: RegistrationFormData) => {
      const fellowTeam: FellowTeam[] = []
      Object.keys(formData).forEach (key  => {
        const keyy = key as keyof RegistrationFormData
        if (typeof formData[keyy] === 'boolean' && formData[keyy]) {
          fellowTeam.push(keyy as FellowTeam)
        }
      })

      registerWithEmailAndPassword({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phonenumber: formData.phonenumber,
        birthday: new Date(formData.birthday).toISOString(),
        team: fellowTeam,
        telegram: formData.telegram
      })
      router.push('/')
    }
    return isConfirmed ? (
        <Container size='sm' >
          <Title
            align="center"
            sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          >
            Create new Account
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Already have an account?{' '}
            <Anchor size="sm" component="button" onClick={()=>router.push('/auth/login')}>
              login
            </Anchor>
          </Text>
    
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={_form.onSubmit(values => handleRegistration(values))}>
                <TextInput 
                    label="Email" 
                    placeholder="you@mantine.dev" 
                    required 
                    {..._form.getInputProps('email')}
                />
                <PasswordInput 
                    label="Password" 
                    placeholder="Your password" 
                    required 
                    mt="md" 
                    {..._form.getInputProps('password')}
                />
                <PasswordInput 
                    label="Repeat Password" 
                    placeholder="Repeat password" 
                    required 
                    mt="md"
                    {..._form.getInputProps('repeatPassword')}  
                />
                <TextInput 
                    label="First Name" 
                    placeholder="First Name" 
                    required 
                    {..._form.getInputProps('firstName')}
                />
                <TextInput 
                    label="Last Name" 
                    placeholder="Last name" 
                    required 
                    {..._form.getInputProps('lastName')}
                />
                <TextInput
                        label="Phone number" 
                        placeholder="+48..." 
                        required 
                        {..._form.getInputProps('phonenumber')}
                />
                <DateInput
                    label="Birthday"
                    placeholder="Birthday"
                    {..._form.getInputProps('birthday')}
                />
                <Divider my="xs" label="Team" />
                <Checkbox  
                  label="worship" 
                  {..._form.getInputProps('worship')}
                  />
                <Checkbox  
                  label="prayer" 
                  {..._form.getInputProps('prayer')}
                  />
                  <Checkbox  
                  label="literature" 
                  {..._form.getInputProps('literature')}
                  />
                  <Checkbox  
                  label="evangelism" 
                  {..._form.getInputProps('evangelism')}
                  /> 
                  <Checkbox  
                  label="Holistic team" 
                  {..._form.getInputProps('holisticteam')}
                  />
                  <Checkbox  
                  label="Event Organization" 
                  {..._form.getInputProps('eventOrganization')}
                  />
                <Divider my="xs" label="Team" />
                <TextInput
                        label="Telegram" 
                        placeholder="username or number" 
                        required 
                        {..._form.getInputProps('telegram')}
                />
                <Button fullWidth mt="xl" type='submit'>
                    Sign up
                </Button>
            </form>
          </Paper>
        </Container>
    ) : <ConfirmRegistrationCodeForm confirm={() => setIsConfirmed(true)}/>
}