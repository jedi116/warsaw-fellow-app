import {
    TextInput,
    Checkbox,
    Button,
    Divider,
    Group,
    Center
  } from '@mantine/core';

import { DateInput } from '@mantine/dates'
import { FellowTeam } from '@/interface/user';
import { useProfileForm } from '@/hooks/profile';
import { Avatar } from "@mantine/core";
import profilePlacholder from '../../../public/profile_placeholder.jpeg'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import ProfileService from '@/service/UI/profile';


type FormData = {
    email: string;
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

export default function ProfileForm () {
    const [picture, setPicture] = useState<any>()
    const [pictureChanged, setPictureChanged] = useState<boolean>(false)
    const {_form, profile, user} = useProfileForm()
    const hiddenFileInput = useRef(null)
    const onFileChange : ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.target && event.target.files) {
            setPicture(event.target.files[0])
            setPictureChanged(true)
        }
    }
    const onUpdatePictureClick = () => {
        if (hiddenFileInput && hiddenFileInput.current)  {
            // @ts-ignore 
            hiddenFileInput.current.click()
        }
    }
    const handleSubmit = async (data: FormData) => {
        const fellowTeam: FellowTeam[] = []
        Object.keys(data).forEach (key  => {
          const keyy = key as keyof FormData
          if (typeof data[keyy] === 'boolean' && data[keyy]) {
            fellowTeam.push(keyy as FellowTeam)
          }
        })
        if (user) {
            await ProfileService.updateProfile({
                ...profile,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phonenumber: data.phonenumber,
                birthday: new Date(data.birthday).toISOString(),
                team: fellowTeam,
                telegram: data.telegram,
                uid: user.uid
            })
            if (pictureChanged) {
                if (picture) await ProfileService.updateProfilePicture(picture,user.uid, false)
                else await ProfileService.updateProfilePicture(picture, user.uid, true)
            }
        }
    }
    return (
        <Center>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <Center mb={30}>
                    <Avatar 
                        src={(picture && URL.createObjectURL(picture)) || (!pictureChanged && profile?.profilePicture) || profilePlacholder.src} 
                        size={180} 
                        radius={180} 
                        style={{ 
                            border: '4px solid var(--mantine-color-indigo-6)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                        }}
                    />
                </Center>
                
                <Center>
                    <Group style={{ marginTop: '10px', marginBottom: '30px' }}>
                        <Button 
                            variant="light"
                            color="indigo" 
                            onClick={onUpdatePictureClick}
                            leftSection={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 8h.01M5 21h14a2 2 0 0 0 2-2V7l-5-5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path><path d="M17.21 12a3 3 0 1 1-5.42-2.59A3 3 0 0 1 17.2 12Z"></path></svg>}
                        >
                            Update Picture
                        </Button>
                        
                        <Button 
                            variant="light"
                            color="red" 
                            onClick={() => {
                                setPicture(null)
                                setPictureChanged(true)
                            }}
                            leftSection={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                        >
                            Remove Picture
                        </Button>
                        
                        <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={onFileChange}
                            style={{ display: 'none' }}
                        />
                    </Group>
                </Center>
                
                <form onSubmit={_form.onSubmit(values => handleSubmit(values))}>
                    <Group grow mb="md">
                        <TextInput
                            label="First Name"
                            placeholder="First Name"
                            {..._form.getInputProps('firstName')}
                        />
                        
                        <TextInput
                            label="Last Name"
                            placeholder="Last name"
                            {..._form.getInputProps('lastName')}
                        />
                    </Group>
                    
                    <TextInput
                        label="Email"
                        placeholder="you@example.com"
                        {..._form.getInputProps('email')}
                        disabled
                        mb="md"
                    />
                    
                    <Group grow mb="md">
                        <TextInput
                            label="Role"
                            placeholder="Member role"
                            defaultValue={profile?.role}
                            disabled
                        />
                        
                        <TextInput
                            label="Phone number"
                            placeholder="+48..."
                            {..._form.getInputProps('phonenumber')}
                        />
                    </Group>
                    
                    <Group grow mb="md">
                        <DateInput
                            label="Birthday"
                            placeholder="Select date"
                            clearable
                            {..._form.getInputProps('birthday')}
                        />
                        
                        <TextInput
                            label="Telegram"
                            placeholder="Username or number"
                            {..._form.getInputProps('telegram')}
                        />
                    </Group>
                    
                    <Divider my="xl" label="Team Memberships" labelPosition="center" />
                    
                    <Group grow mb="xl">
                        <Checkbox
                            label="Worship"
                            {..._form.getInputProps('worship', { type: 'checkbox' })}
                        />
                        
                        <Checkbox
                            label="Prayer"
                            {..._form.getInputProps('prayer', { type: 'checkbox' })}
                        />
                        
                        <Checkbox
                            label="Literature"
                            {..._form.getInputProps('literature', { type: 'checkbox' })}
                        />
                    </Group>
                    
                    <Group grow mb="xl">
                        <Checkbox
                            label="Evangelism"
                            {..._form.getInputProps('evangelism', { type: 'checkbox' })}
                        />
                        
                        <Checkbox
                            label="Holistic Team"
                            {..._form.getInputProps('holisticteam', { type: 'checkbox' })}
                        />
                        
                        <Checkbox
                            label="Event Organization"
                            {..._form.getInputProps('eventOrganization', { type: 'checkbox' })}
                        />
                    </Group>
                    
                    <Button 
                        fullWidth 
                        mt="xl" 
                        size="lg" 
                        type="submit"
                    >
                        Update Profile
                    </Button>
                </form>
            </div>
        </Center>
    )
}