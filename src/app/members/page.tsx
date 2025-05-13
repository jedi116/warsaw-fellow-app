'use client';

import { useState, useEffect, useContext } from 'react';
import MemberList from '@/components/members/memberList';
import { User } from '@/interface/user';
import { Modal, Button, Group, Loader, Center } from '@mantine/core';
import MemberForm from '@/components/members/form';
import { useLoginRedirect } from '@/hooks/user';
import { MemberContext, MemberContextWrapper } from '@/context/MemberContext';
import Delete from '@/components/members/delete';
import UserView from '@/components/members/user';
import CommonService from '@/service/UI/common';

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

function Members() {
    const { closeModal, opened, modalType } = useContext(MemberContext);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    useLoginRedirect();
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const userData = await CommonService.getUsers();
                const formattedData = userData?.map(data => {
                    data.birthday = data.birthday.toString();
                    data.role = data.role ? data.role : '';
                    return data;
                }) || [];
                
                setUsers(formattedData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);
    
    if (loading) {
        return (
            <Center style={{ height: '50vh' }}>
                <Loader size="xl" />
            </Center>
        );
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

export default function WrappedMember() {
    return (
        <MemberContextWrapper>
            <Members />
        </MemberContextWrapper>
    );
}