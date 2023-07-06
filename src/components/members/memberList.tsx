import {
    Avatar,
    Badge,
    Table,
    Group,
    Text,
    ActionIcon,
    Anchor,
    ScrollArea,
    useMantineTheme,
    Button,
  } from '@mantine/core';
  import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import UserService from '@/service/UI/user-ui';
import ProfileService from '@/service/UI/profile';
import { User, UserWithPic } from '@/interface/user';
import profilePlacholder from '../../../public/profile_placeholder.jpeg'
import { MemberContext } from '@/context/MemberContext';
import { useProfile } from '@/hooks/profile';
  
  interface UsersTableProps {
    data?: User []
  }

  
  
  export default function UsersList({ data }: UsersTableProps) {
    const [users, setUsers] = useState<UserWithPic[] | undefined>()
    const {openModal, closeModal, setSelectedMember, modalType, setModalType} = useContext(MemberContext)
    const {profile} = useProfile()
    useEffect(() => {
      if (data) {
        formatUsers(data)
      }
    },[data])
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
    const refresh = async () =>  {
        const usersData = await UserService.getUsers()
        if (usersData) {
          formatUsers(usersData)
        }
    }
    const theme = useMantineTheme();
    const rows = users?.map((item) => (
      <tr key={item.uid}>
        <td>
          <Group spacing="sm" onClick={() => {
            setModalType('View')
            setSelectedMember(item)
            openModal()
          }}>
            <Avatar size={30} src={item.profilePicture || profilePlacholder.src} radius={30} />
            <Text fz="sm" fw={500}>
              {item.firstName}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text fz="sm" fw={500}>
              {item.lastName}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text fz="sm" fw={500}>
              {item.team.join(',')}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text fz="sm" fw={500}>
              {typeof item.birthday ==='object' ? new Date(item.birthday).toISOString() : item.birthday}
            </Text>
          </Group>
        </td>
        <td>
          <Anchor component="button" size="sm">
            {item.email}
          </Anchor>
        </td>
        <td>
          <Text fz="sm" c="dimmed">
            {item.phonenumber}
          </Text>
        </td>
        <td>
          <Group spacing={0} position="right">
            {
              profile?.role === 'admin' && (
                <ActionIcon onClick={() => {
                  setModalType('Modify')
                  setSelectedMember(item)
                  openModal()
              }}>
                <IconPencil size="1rem" stroke={1.5} />
              </ActionIcon>
              )
            }
            {
              profile?.role === 'admin' && (
                <ActionIcon color="red" onClick={() => {
                  setModalType('Delete')
                  setSelectedMember(item)
                  openModal()      
                  }}
                >
                  <IconTrash size="1rem" stroke={1.5} />
                </ActionIcon>
              )
            }
          </Group>
        </td>
      </tr>
    ));
  
    return (
      <ScrollArea>
        <Group position="center">
            {profile?.role === 'admin' && <Button onClick={() =>{
              setModalType('Add')
              setSelectedMember(null)
              openModal()
            }}>Add User</Button>}
            <Button onClick={refresh}>Refresh</Button>
        </Group>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Team</th>
              <th>BirthDay</th>
              <th>Email</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    );
  }