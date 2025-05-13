'use client';

import { useContext } from "react"
import { MemberContext } from "@/context/MemberContext"
import { Button, Group, Text, Stack, ThemeIcon, Avatar, Paper, Box, Divider, Alert } from "@mantine/core"
import { IconAlertTriangle, IconTrash, IconUser, IconX } from "@tabler/icons-react"
import UserService from "@/service/UI/user-ui"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/service/UI/firebaseUiClient"
import profilePlacholder from '../../../public/profile_placeholder.jpeg'

export default function Delete() {
  const { closeModal, selectedMember, refreshUsers } = useContext(MemberContext)
  const [user, loading, error] = useAuthState(auth)
  
  const onDelete = async () => {
    await UserService.deleteUser(selectedMember?.uid || '', user)
    closeModal()
    setTimeout(() => {
      refreshUsers && refreshUsers()
    }, 200)
  }
  
  if (!selectedMember) return null;
  
  return (
    <Stack spacing="lg">
      <Alert 
        icon={<IconAlertTriangle size={24} />} 
        title="Confirm Member Deletion" 
        color="red" 
        radius="md"
      >
        This action cannot be undone. This will permanently delete the member account
        and remove all associated data.
      </Alert>
      
      <Divider my="xs" />
      
      <Paper p="md" withBorder radius="md">
        <Group spacing="md">
          <Avatar 
            src={selectedMember.profilePicture || profilePlacholder.src} 
            size={60} 
            radius={60}
            color="red"
            alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
          >
            {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Text fw={700}>
              {selectedMember.firstName} {selectedMember.lastName}
            </Text>
            <Text size="sm" c="dimmed">{selectedMember.email}</Text>
          </Box>
        </Group>
      </Paper>
      
      <Group position="apart" mt="lg">
        <Button 
          variant="default" 
          leftIcon={<IconX size={16} />} 
          onClick={closeModal}
          radius="md"
        >
          Cancel
        </Button>
        <Button 
          color="red" 
          leftIcon={<IconTrash size={16} />} 
          onClick={onDelete}
          radius="md"
        >
          Delete Member
        </Button>
      </Group>
    </Stack>
  )
}