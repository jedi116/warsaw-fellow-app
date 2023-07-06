import { Avatar, Text, Button, Paper } from '@mantine/core';
import profilePlacholder from '../../../public/profile_placeholder.jpeg'
import { useContext } from 'react';
import { MemberContext } from '@/context/MemberContext';

export default function UserInfoAction() {
    const {closeModal, selectedMember} = useContext(MemberContext)
    
  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      <Avatar src={selectedMember?.profilePicture || profilePlacholder.src} size={220} radius={220} mx="auto" />
      <Text ta="center" fz="lg" weight={500} mt="md">
        {selectedMember?.firstName}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        {selectedMember?.email} • {selectedMember?.team.join(',')}
      </Text>

      {/*<Button variant="default" fullWidth mt="md">Send message</Button>*/}
    </Paper>
  );
}