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
  Select,
  NumberInput,
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
  IconArrowUp, 
  IconArrowDown,
  IconCalendarEvent,
  IconBook,
  IconUsers,
  IconHeart,
  IconStar,
  IconMicrophone,
  IconMusic,
  IconCheck
} from '@tabler/icons-react';
import { useProgramOperations } from '@/hooks/content';
import { AVAILABLE_ICONS, IconType, Program } from '@/interface/content';
import { useForm } from '@mantine/form';
import { css } from '@emotion/react';

// Map icon strings to actual components
const getIconComponent = (iconName: string, size = 24) => {
  switch(iconName as IconType) {
    case 'calendar': return <IconCalendarEvent size={size} />;
    case 'book': return <IconBook size={size} />;
    case 'users': return <IconUsers size={size} />;
    case 'heart': return <IconHeart size={size} />;
    case 'star': return <IconStar size={size} />;
    case 'microphone': return <IconMicrophone size={size} />;
    case 'music': return <IconMusic size={size} />;
    default: return <IconCalendarEvent size={size} />;
  }
};

export default function ProgramManager() {
  const { programs, submitting, addProgram, updateProgram, deleteProgram, toggleProgramActive } = useProgramOperations();
  const [opened, setOpened] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  
  const form = useForm({
    initialValues: {
      title: '',
      time: '',
      description: '',
      icon: 'calendar',
      isActive: true,
      order: 0,
    },
    validate: {
      title: (value) => value.trim().length < 3 ? 'Title must be at least 3 characters' : null,
      time: (value) => value.trim().length < 3 ? 'Time must be specified' : null,
      description: (value) => value.trim().length < 10 ? 'Description must be at least 10 characters' : null,
    }
  });
  
  const handleOpenModal = (program?: Program) => {
    if (program) {
      // Edit mode
      setEditingProgram(program);
      form.setValues({
        title: program.title,
        time: program.time,
        description: program.description,
        icon: program.icon || 'calendar',
        isActive: program.isActive,
        order: program.order,
      });
    } else {
      // Create mode
      setEditingProgram(null);
      form.setValues({
        title: '',
        time: '',
        description: '',
        icon: 'calendar',
        isActive: true,
        order: programs.length + 1,
      });
    }
    setOpened(true);
  };
  
  const handleSubmit = async (values: typeof form.values) => {
    if (editingProgram) {
      // Update existing program
      await updateProgram(editingProgram.id, values);
    } else {
      // Create new program
      await addProgram(values);
    }
    setOpened(false);
    form.reset();
  };
  
  const handleToggleActive = async (program: Program) => {
    await toggleProgramActive(program.id, !program.isActive);
  };

  const handleDelete = async (program: Program) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${program.title}"?`);
    if (confirmed) {
      await deleteProgram(program.id);
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
        <Title order={3}>Program Management</Title>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={() => handleOpenModal()}
          loading={submitting}
          radius="md"
        >
          Add Program
        </Button>
      </Group>
      
      {programs.length === 0 ? (
        <Text c="dimmed" ta="center" py={30}>No programs found. Add a new program to get started.</Text>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2, spacing: 'md' },
            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
          ]}
        >
          {programs.map((program) => (
            <Card key={program.id} withBorder p="md" radius="md" css={cardStyles}>
              <Group position="apart" mb="xs">
                <Group>
                  <ThemeIcon size={32} radius="md" color="indigo">
                    {getIconComponent(program.icon, 18)}
                  </ThemeIcon>
                  <Text fw={600} lineClamp={1}>{program.title}</Text>
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
                      onClick={() => handleOpenModal(program)}
                    >
                      Edit Program
                    </Menu.Item>
                    
                    <Menu.Item 
                      icon={program.isActive ? <IconCheck size={16} /> : undefined} 
                      onClick={() => handleToggleActive(program)}
                    >
                      {program.isActive ? 'Mark as Inactive' : 'Mark as Active'}
                    </Menu.Item>
                    
                    <Menu.Divider />
                    
                    <Menu.Item 
                      color="red" 
                      icon={<IconTrash size={16} />}
                      onClick={() => handleDelete(program)}
                    >
                      Delete Program
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
              
              <Group position="apart" mb="xs">
                <Text size="sm" c="dimmed">{program.time}</Text>
                <Badge color={program.isActive ? 'green' : 'gray'}>
                  {program.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Group>
              
              <Text size="sm" lineClamp={3}>{program.description}</Text>
              
              <Badge mt="sm" color="indigo" variant="outline">
                Order: {program.order}
              </Badge>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={editingProgram ? "Edit Program" : "Add New Program"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Program Title"
            placeholder="Sunday Service"
            required
            {...form.getInputProps('title')}
            mb="md"
          />
          
          <TextInput
            label="Time"
            placeholder="10:00 AM - 12:00 PM"
            required
            {...form.getInputProps('time')}
            mb="md"
          />
          
          <Textarea
            label="Description"
            placeholder="Weekly worship service with praise, prayer, and teaching from the Bible."
            required
            minRows={3}
            {...form.getInputProps('description')}
            mb="md"
          />
          
          <Select
            label="Icon"
            data={AVAILABLE_ICONS}
            {...form.getInputProps('icon')}
            mb="md"
          />
          
          <Group position="apart" mb="md">
            <NumberInput
              label="Display Order"
              min={1}
              {...form.getInputProps('order')}
              style={{ width: '48%' }}
            />
            
            <Box style={{ width: '48%' }}>
              <Text size="sm" mb={6}>Status</Text>
              <Switch
                label="Active"
                checked={form.values.isActive}
                onChange={(event) => form.setFieldValue('isActive', event.currentTarget.checked)}
              />
            </Box>
          </Group>
          
          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Save Program</Button>
          </Group>
        </form>
      </Modal>
    </Paper>
  );
}