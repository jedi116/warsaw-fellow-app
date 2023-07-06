import { useForm } from '@mantine/form';
import {
    TextInput,
    Checkbox,
    Button,
    Divider,
    Select
  } from '@mantine/core';

import { DateInput } from '@mantine/dates'
import { FellowTeam } from '@/interface/user';
import UserServiceUI from '@/service/UI/user-ui';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { useContext, useEffect } from 'react';
import { MemberContext } from '@/context/MemberContext';


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

export default function MemberForm () {
    const [user, loading, error] = useAuthState(auth)
    const {closeModal, selectedMember, modalType} = useContext(MemberContext)
    
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
          phonenumber: (value) => /^[A-Za-z]*$/.test(value) || value.length < 9   ? 'Phone number format is not correct' : null
        },
    })
    const handleSubmit = async (data: FormData) => {
        const fellowTeam: FellowTeam[] = []
        Object.keys(data).forEach (key  => {
          const keyy = key as keyof FormData
          if (typeof data[keyy] === 'boolean' && data[keyy]) {
            fellowTeam.push(keyy as FellowTeam)
          }
        })
        if (modalType ==='Add') {
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
    }, [selectedMember, _form])
    return (
        <div>
            <form onSubmit={_form.onSubmit(values => handleSubmit(values))}>
                <TextInput 
                    label="Email" 
                    placeholder="you@mantine.dev" 
                    required={modalType !== 'Modify'}
                    disabled={modalType=== 'Modify'} 
                    {..._form.getInputProps('email')}
                />
                <Select
                    label="Role"
                    placeholder="Pick one"
                    data={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'user', label: 'Normal User' }
                    ]}
                    disabled={selectedMember?.role ==='admin' || modalType ==='Add'}
                    {..._form.getInputProps('role')}
                />
                <TextInput 
                    label="First Name" 
                    placeholder="First Name" 
                    required={modalType !== 'Modify'}
                    disabled={modalType=== 'Modify'} 
                    {..._form.getInputProps('firstName')}
                />
                <TextInput 
                    label="Last Name" 
                    placeholder="Last name" 
                    required={modalType !== 'Modify'}
                    disabled={modalType=== 'Modify'} 
                    {..._form.getInputProps('lastName')}
                />
                <TextInput
                        label="Phone number" 
                        placeholder="+48..." 
                        required={modalType !== 'Modify'}
                        disabled={modalType=== 'Modify'} 
                        {..._form.getInputProps('phonenumber')}
                />
                <DateInput
                    label="Birthday"
                    placeholder="Birthday"
                    disabled={modalType=== 'Modify'}
                    {..._form.getInputProps('birthday')}
                />
                <Divider my="xs" label="Team" />
                <Checkbox  
                  label="worship"
                  {..._form.getInputProps('worship', { type: 'checkbox' })}
                  />
                <Checkbox  
                  label="prayer" 
                  {..._form.getInputProps('prayer', { type: 'checkbox' })}
                  />
                  <Checkbox  
                  label="literature" 
                  {..._form.getInputProps('literature', { type: 'checkbox' })}
                  />
                  <Checkbox  
                  label="evangelism" 
                  {..._form.getInputProps('evangelism', { type: 'checkbox' })}
                  /> 
                  <Checkbox  
                  label="Holistic team" 
                  {..._form.getInputProps('holisticteam', { type: 'checkbox' })}
                  />
                  <Checkbox  
                  label="Event Organization"
                  {..._form.getInputProps('eventOrganization', { type: 'checkbox' })}
                  />
                <Divider my="xs" label="Team" />
                <TextInput
                        label="Telegram" 
                        placeholder="username or number" 
                        required={modalType !== 'Modify'}
                        disabled={modalType=== 'Modify'}
                        {..._form.getInputProps('telegram')}
                />
                <Button fullWidth mt="xl" type='submit'>
                    {modalType === 'Add' ? 'Add' : 'Modify'}
                </Button>
            </form>
 
        </div>
    )
}