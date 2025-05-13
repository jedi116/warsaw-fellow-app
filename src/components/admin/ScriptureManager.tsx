'use client';

import React, { useState } from 'react';
import {
  Paper,
  Title,
  Button,
  Group,
  Text,
  ActionIcon,
  TextInput,
  Textarea,
  Switch,
  Box,
  Modal,
  Card,
  Badge,
  Loader,
  SimpleGrid,
  ThemeIcon,
  Menu,
  Divider
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCheck,
  IconBook
} from '@tabler/icons-react';
import { useScriptureOperations } from '@/hooks/content';
import { Scripture } from '@/interface/content';
import { useForm } from '@mantine/form';
import { css } from '@emotion/react';

export default function ScriptureManager() {
  const { scriptures, submitting, addScripture, updateScripture, deleteScripture, toggleScriptureActive } = useScriptureOperations();
  const [opened, setOpened] = useState(false);
  const [editingScripture, setEditingScripture] = useState<Scripture | null>(null);
  
  const form = useForm({
    initialValues: {
      verse: '',
      reference: '',
      isActive: true,
    },
    validate: {
      verse: (value) => value.trim().length < 10 ? 'Verse must be at least 10 characters' : null,
      reference: (value) => value.trim().length < 3 ? 'Reference must be specified' : null,
    }
  });
  
  const handleOpenModal = (scripture?: Scripture) => {
    if (scripture) {
      // Edit mode
      setEditingScripture(scripture);
      form.setValues({
        verse: scripture.verse,
        reference: scripture.reference,
        isActive: scripture.isActive,
      });
    } else {
      // Create mode
      setEditingScripture(null);
      form.setValues({
        verse: '',
        reference: '',
        isActive: true,
      });
    }
    setOpened(true);
  };
  
  const handleSubmit = async (values: typeof form.values) => {
    if (editingScripture) {
      // Update existing scripture
      await updateScripture(editingScripture.id, values);
    } else {
      // Create new scripture
      await addScripture(values);
    }
    setOpened(false);
    form.reset();
  };
  
  const handleToggleActive = async (scripture: Scripture) => {
    await toggleScriptureActive(scripture.id, !scripture.isActive);
  };

  const handleDelete = async (scripture: Scripture) => {
    const confirmed = window.confirm(`Are you sure you want to delete this scripture (${scripture.reference})?`);
    if (confirmed) {
      await deleteScripture(scripture.id);
    }
  };
  
  const cardStyles = css`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    }
  `;
  
  return (
    <Paper p="md" radius="md" withBorder>
      <Group position="apart" mb="lg">
        <Title order={3}>Scripture Management</Title>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={() => handleOpenModal()}
          loading={submitting}
          radius="md"
        >
          Add Scripture
        </Button>
      </Group>
      
      {scriptures.length === 0 ? (
        <Text c="dimmed" ta="center" py={30}>No scriptures found. Add a new scripture to get started.</Text>
      ) : (
        <SimpleGrid
          cols={1}
          spacing="lg"
        >
          {scriptures.map((scripture) => (
            <Card key={scripture.id} withBorder p="md" radius="md" css={cardStyles}>
              <Group position="apart" mb="xs">
                <Group>
                  <ThemeIcon size={32} radius="md" color="indigo">
                    <IconBook size={18} />
                  </ThemeIcon>
                  <Text fw={600}>{scripture.reference}</Text>
                </Group>
                
                <Menu position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  
                  <Menu.Dropdown>
                    <Menu.Item 
                      icon={<IconEdit size={16} />} 
                      onClick={() => handleOpenModal(scripture)}
                    >
                      Edit Scripture
                    </Menu.Item>
                    
                    <Menu.Item 
                      icon={scripture.isActive ? <IconCheck size={16} /> : undefined} 
                      onClick={() => handleToggleActive(scripture)}
                    >
                      {scripture.isActive ? 'Mark as Inactive' : 'Mark as Active'}
                    </Menu.Item>
                    
                    <Menu.Divider />
                    
                    <Menu.Item 
                      color="red" 
                      icon={<IconTrash size={16} />}
                      onClick={() => handleDelete(scripture)}
                    >
                      Delete Scripture
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
              
              <Text c="dimmed" fz="sm" fs="italic">"{scripture.verse}"</Text>
              
              <Group position="apart" mt="lg">
                <Text size="xs" c="dimmed">
                  Added: {scripture.createdAt.toDate().toLocaleDateString()}
                </Text>
                <Badge color={scripture.isActive ? 'green' : 'gray'}>
                  {scripture.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={editingScripture ? "Edit Scripture" : "Add New Scripture"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Textarea
            label="Scripture Verse"
            placeholder="For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
            required
            minRows={3}
            {...form.getInputProps('verse')}
            mb="md"
          />
          
          <TextInput
            label="Reference"
            placeholder="John 3:16"
            required
            {...form.getInputProps('reference')}
            mb="md"
          />
          
          <Box mb="md">
            <Text size="sm" mb={6}>Status</Text>
            <Switch
              label="Active"
              checked={form.values.isActive}
              onChange={(event) => form.setFieldValue('isActive', event.currentTarget.checked)}
            />
          </Box>
          
          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Save Scripture</Button>
          </Group>
        </form>
      </Modal>
    </Paper>
  );
}