'use client';

import { Center } from "@mantine/core";
import ProfileForm from "@/components/profile/form";
import { useLoginRedirect } from "@/hooks/user";

export default function Profile() {
    useLoginRedirect();
    
    return (
        <Center>
            <ProfileForm />
        </Center>
    );
}