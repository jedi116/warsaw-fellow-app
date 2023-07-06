import MemberList from '@/components/members/memberList'
import UserService from '@/service/User'
import { User } from '@/interface/user'
import { Modal, Button, Group } from '@mantine/core';
import MemberForm from '@/components/members/form';
import { useLoginRedirect } from '@/hooks/user';
import { useContext } from 'react';
import { MemberContext, MemberContextWrapper } from '@/context/MemberContext';
import Delete from '@/components/members/delete';
import UserView from '../components/members/user'

const modalTitles = {
    Add: 'Add User',
    Modify: 'Modify User',
    Delete: 'Delete User',
    View: 'User Data'
}
const modalChild = {
    Add:(<MemberForm/>),
    Modify:(<MemberForm/>),
    Delete: (<Delete />),
    View: (<UserView />)
}
export async function getServerSideProps() {
    const users = await UserService.getUsers()
    const formatData = users?.map(data => {
        data.birthday = data.birthday.toString()
        data.role = data.role ? data.role : ''
        return data
    })
    return {
      props: {
        data: formatData
      }, // will be passed to the page component as props
    }
  }

interface Props {
    data: User[]
}
function Members ({data}: Props) {
    const { closeModal, opened, modalType} = useContext(MemberContext)
    
    useLoginRedirect()
    return (
        <>
            <Modal opened={opened} onClose={()=>closeModal()} title={ modalType && modalTitles[modalType]}>
                {modalType && modalChild[modalType] } 
            </Modal>
            <MemberList data={data} />
        </>
    )

}

export default function WrappedMember ({data}: Props) {
    return (
        <MemberContextWrapper>
            <Members data={data}/>
        </MemberContextWrapper>
    )
}