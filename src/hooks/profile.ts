
'use client';

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { useLoginRedirect } from './user';
import { useEffect, useState } from 'react';
import { UserWithPic } from '@/interface/user';
import ProfileService from '@/service/UI/profile';
import { useForm } from '@mantine/form';
export const useProfile = () => {
    useLoginRedirect()
    const [user, loading, error] = useAuthState(auth)
    const [profile, setProfile] = useState<UserWithPic>()

    const getProfile = async () => {
        if (user) {
            const response = await ProfileService.getProfile(user.uid)
            setProfile(response)
        }
    }
    useEffect(() => {
        getProfile()
    }, [user])
    return {
        profile,
        getProfile,
        user
    }
}


export const useProfileForm = () => {
    const _form = useForm({
        initialValues: {
          email: '',
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
    const {profile, user} = useProfile()
    useEffect(() => {
        if (profile) {
            _form.setValues({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phonenumber: profile.phonenumber,
                birthday: new Date(profile?.birthday),
                worship: profile.team.includes('worship'),
                prayer: profile.team.includes('prayer'),
                literature: profile.team.includes('literature'),
                evangelism: profile.team.includes('evangelism'),
                holisticteam: profile.team.includes('holisticteam'),
                eventOrganization: profile.team.includes('eventOrganization'),
                telegram: profile.telegram
            })
        }
    }, [profile])

    return {
        _form, profile, user
    }
}