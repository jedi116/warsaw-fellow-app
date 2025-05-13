'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Title,
  Alert,
  Paper,
  Divider,
  Text,
  Loader,
  Center
} from '@mantine/core';
import { IconSettings, IconPhoto, IconInfoCircle, IconBook } from '@tabler/icons-react';
import { useLoginRedirect } from '@/hooks/user';
import { useProfile } from '@/hooks/profile';
import ProgramManager from '@/components/admin/ProgramManager';
import GalleryManager from '@/components/admin/GalleryManager';
import ScriptureManager from '@/components/admin/ScriptureManager';

export default function AdminPage() {
  useLoginRedirect();
  const { profile, user } = useProfile();
  const [activeTab, setActiveTab] = useState<string | null>('programs');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set loading false once profile is loaded
    if (profile) {
      setLoading(false);
    }
  }, [profile]);

  // If not authenticated or not an admin, show access denied
  if (!loading && (!profile || profile.role !== 'admin')) {
    return (
      <Container size="lg" py="xl">
        <Alert 
          icon={<IconInfoCircle size={16} />} 
          title="Access Denied" 
          color="red"
          variant="filled"
        >
          This page is only accessible to administrators. If you believe you should have access,
          please contact the fellowship administration.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">Website Administration</Title>
      <Text c="dimmed" mb="xl">
        Manage homepage content, including programs and gallery images.
      </Text>
      <Divider mb="xl" />

      {loading ? (
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      ) : (
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          radius="md"
          defaultValue="programs"
        >
          <Tabs.List mb="md">
            <Tabs.Tab value="programs" leftSection={<IconSettings size={16} />}>
              Programs & Schedule
            </Tabs.Tab>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto size={16} />}>
              Gallery Images
            </Tabs.Tab>
            <Tabs.Tab value="scripture" leftSection={<IconBook size={16} />}>
              Scripture of the Day
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="programs">
            <ProgramManager />
          </Tabs.Panel>

          <Tabs.Panel value="gallery">
            <GalleryManager />
          </Tabs.Panel>
          
          <Tabs.Panel value="scripture">
            <ScriptureManager />
          </Tabs.Panel>
        </Tabs>
      )}
    </Container>
  );
}