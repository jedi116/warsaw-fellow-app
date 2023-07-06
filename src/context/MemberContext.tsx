import React, {FC, createContext, use, useEffect, useState} from 'react'
import { UserWithPic } from '@/interface/user'
import { useDisclosure } from '@mantine/hooks';
import { User } from '@/interface/user';
import ProfileService from '@/service/UI/profile';
import UserService from '@/service/UI/user-ui';

interface MemberContextType {
    selectedMember: UserWithPic | null,
    openModal: () => void,
    closeModal: () => void,
    opened: boolean,
    setSelectedMember: (data: UserWithPic | null)  => void,
    modalType: ModalTypes,
    setModalType: (data: ModalTypes) => void,
    refreshUsers: () => Promise<void>,
    formatUsers: (data: User[]) => Promise<void>,
    users: UserWithPic[] | undefined
}
type ModalTypes = 'Add' | 'Modify' | 'Delete' | 'View' |null
const defaultValue : MemberContextType = {
    selectedMember : null,
    openModal: () =>{},
    closeModal: () => {},
    opened: false,
    setSelectedMember: () => {},
    modalType: null,
    setModalType: () => {},
    refreshUsers: async () => {},
    formatUsers: async () => {},
    users: undefined
    

}
export const MemberContext = createContext<MemberContextType>(defaultValue)

type Props = {
    children: JSX.Element
}

export const MemberContextWrapper: FC<Props> = ({children}) => {
    const [user, setUser] = useState<UserWithPic | null>(null)
    const [users, setUsers] = useState<UserWithPic[] | undefined>()
    const [modalType, setModalType] = useState<ModalTypes>(null)
    const [opened, { open, close }] = useDisclosure(false);
    const formatUsers = async (data: User[]) => {
        const formattedUserData =  data.map(async (user) => {
          const pic = await ProfileService.getProfilePicture(user.uid)
          return {
            ...user,
            profilePicture: pic || undefined
          }
        })
        const usersData = await Promise.all(formattedUserData)
        setUsers(usersData)
      }
      const refreshUsers = async () =>  {
          const usersData = await UserService.getUsers()
          if (usersData) {
            formatUsers(usersData)
          }
      }
      useEffect(() => {
        refreshUsers()
      },[])
    return (
        <MemberContext.Provider value={{
            selectedMember:user,
            openModal: open,
            closeModal: close,
            opened,
            setSelectedMember: (data: UserWithPic | null) => {
                setUser(data)
            },
            modalType,
            setModalType: (data: ModalTypes) => {
                setModalType(data)
            },
            refreshUsers,
            formatUsers,
            users

        }}>
            {children}
        </MemberContext.Provider>
    )
}