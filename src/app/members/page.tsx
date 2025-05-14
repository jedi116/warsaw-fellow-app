'use client';

import { useState, useEffect, useContext, Suspense } from 'react';
import dynamic from 'next/dynamic';
import MemberList from '@/components/members/memberList';
import { User } from '@/interface/user';
import { Modal, Button, Group, Loader, Center } from '@mantine/core';
import MemberForm from '@/components/members/form';
import { useLoginRedirect } from '@/hooks/user';
import { MemberContext, MemberContextWrapper } from '@/context/MemberContext';
import Delete from '@/components/members/delete';
import UserView from '@/components/members/user';
import CommonService from '@/service/UI/common';

// Loading component imported for Suspense fallback
// Using dynamic import with no SSR to ensure client-side only rendering
// This helps avoid hydration issues with loading animations
const Loading = dynamic(() => import('./loading'), { 
  ssr: false,
  loading: () => null // Prevents flash of loading component during dynamic import
});

const modalTitles = {
    Add: 'Add User',
    Modify: 'Modify User',
    Delete: 'Delete User',
    View: 'User Data'
};

const modalChild = {
    Add: (<MemberForm/>),
    Modify: (<MemberForm/>),
    Delete: (<Delete />),
    View: (<UserView />)
};

function MembersContent() {
    const { closeModal, opened, modalType } = useContext(MemberContext);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    useLoginRedirect();
    
    useEffect(() => {
        // Set a flag to prevent memory leaks if component unmounts
        let isActive = true;
        
        const fetchUsers = async () => {
            try {
                
                const userData = await CommonService.getUsers();

                
                // Format the data
                const formattedData = userData?.map(data => {
                    data.birthday = data.birthday.toString();
                    data.role = data.role ? data.role : '';
                    return data;
                }) || [];

                if (isActive) {
                    setUsers(formattedData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                if (isActive) {
                    setLoading(false);
                }
            }
        };
        
        // Force loading animation to show for at least a short period
        // This ensures a smoother user experience when navigating
        const loadingTimer = setTimeout(() => {
            fetchUsers();
        }, 500);
        
        // Cleanup function
        return () => {
            isActive = false;
            clearTimeout(loadingTimer);
        };
    }, []);
    
    if (loading) {
        return null; // Return null to keep showing the Suspense fallback
    }
    
    return (
        <>
            <Modal 
                opened={opened} 
                onClose={() => closeModal()} 
                title={modalType && modalTitles[modalType]}
                size="lg"
                radius="md"
                centered
                overlayProps={{
                    blur: 3,
                    opacity: 0.55,
                }}
            >
                {modalType && modalChild[modalType]}
            </Modal>
            <MemberList data={users} />
        </>
    );
}

function Members() {
    return (
        <Suspense fallback={<Loading />}>
            <MembersContent />
        </Suspense>
    );
}

export default function WrappedMember() {
    return (
        <MemberContextWrapper>
            <Members />
        </MemberContextWrapper>
    );
}