import React, {FC, createContext, use, useState} from 'react'
import { UserWithPic } from '@/interface/user'
import { useDisclosure } from '@mantine/hooks';

interface MemberContextType {
    selectedMember: UserWithPic | null,
    openModal: () => void,
    closeModal: () => void,
    opened: boolean,
    setSelectedMember: (data: UserWithPic | null)  => void,
    modalType: ModalTypes,
    setModalType: (data: ModalTypes) => void
}
type ModalTypes = 'Add' | 'Modify' | 'Delete' | 'View' |null
const defaultValue : MemberContextType = {
    selectedMember : null,
    openModal: () =>{},
    closeModal: () => {},
    opened: false,
    setSelectedMember: () => {},
    modalType: null,
    setModalType: () => {}
}
export const MemberContext = createContext<MemberContextType>(defaultValue)

type Props = {
    children: JSX.Element
}

export const MemberContextWrapper: FC<Props> = ({children}) => {
    const [user, setUser] = useState<UserWithPic | null>(null)
    const [modalType, setModalType] = useState<ModalTypes>(null)
    const [opened, { open, close }] = useDisclosure(false);
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
            }

        }}>
            {children}
        </MemberContext.Provider>
    )
}