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
        <div style={{width:'40%'}}>
            <Avatar src={(picture && URL.createObjectURL(picture)) || (!pictureChanged && profile?.profilePicture) || profilePlacholder.src} size={165} radius={165} mx="auto" />
            <Center>
                <Group style={{marginTop:'10px'}}>
                    <Button color='green' onClick={onUpdatePictureClick}>Update Picture</Button>
                    <Button color='red' onClick={()=> {
                        setPicture(null)
                        setPictureChanged(true)
                        }}
                    >
                        Delete Picture
                    </Button>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={onFileChange}
                        style={{display: 'none'}}
                    />
                </Group>
            </Center>
            <form onSubmit={_form.onSubmit(values => handleSubmit(values))}>
                <TextInput 
                    label="Email" 
                    placeholder="you@mantine.dev"  
                    {..._form.getInputProps('email')}
                    disabled
                />
                <TextInput 
                    label="Role" 
                    placeholder="you@mantine.dev"
                    defaultValue={profile?.role}
                    disabled
                />
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
                <TextInput
                        label="Phone number" 
                        placeholder="+48..."  
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
                        {..._form.getInputProps('telegram')}
                />
                <Button fullWidth mt="xl" type='submit'>
                    Update
                </Button>
            </form>
 
        </div>
    )
}