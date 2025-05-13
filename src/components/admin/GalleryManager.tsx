'use client';

import React, { useRef, useState } from 'react';
import {
  Paper,
  Title,
  Button,
  Group,
  Text,
  ActionIcon,
  TextInput,
  NumberInput,
  Switch,
  Box,
  Modal,
  Card,
  Badge,
  Image,
  SimpleGrid,
  Menu,
  Divider,
  FileButton,
  Progress,
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconUpload,
  IconCheck,
  IconPhoto,
  IconX
} from '@tabler/icons-react';
import { useGalleryOperations } from '@/hooks/content';
import { GalleryImage } from '@/interface/content';
import { useForm } from '@mantine/form';
import { css } from '@emotion/react';

export default function GalleryManager() {
  const { images, submitting, uploadImage, updateImage, deleteImage, toggleImageActive } = useGalleryOperations();
  const [opened, setOpened] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const resetRef = useRef<() => void>(null);
  
  const form = useForm({
    initialValues: {
      title: '',
      isActive: true,
      order: 0,
    },
    validate: {
      title: (value) => value.trim().length < 3 ? 'Title must be at least 3 characters' : null,
    }
  });
  
  const handleOpenModal = (image?: GalleryImage) => {
    // Reset any previous file selection
    if (resetRef.current) {
      resetRef.current();
    }
    setSelectedFile(null);
    
    if (image) {
      // Edit mode
      setEditingImage(image);
      form.setValues({
        title: image.title,
        isActive: image.isActive,
        order: image.order,
      });
    } else {
      // Create mode
      setEditingImage(null);
      form.setValues({
        title: '',
        isActive: true,
        order: images.length + 1,
      });
    }
    setOpened(true);
  };
  
  const handleSubmit = async (values: typeof form.values) => {
    if (editingImage) {
      // Update existing image
      await updateImage(editingImage.id, values);
    } else if (selectedFile) {
      // Upload new image
      // Set an interval to simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      try {
        await uploadImage(selectedFile, values.title, values.isActive, values.order);
        clearInterval(interval);
        setUploadProgress(100);
      } catch (error) {
        clearInterval(interval);
        setUploadProgress(0);
        console.error('Upload failed:', error);
      }
    }
    
    setOpened(false);
    form.reset();
    setSelectedFile(null);
    setUploadProgress(0);
  };
  
  const handleToggleActive = async (image: GalleryImage) => {
    await toggleImageActive(image.id, !image.isActive);
  };

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${image.title}"?`);
    if (confirmed) {
      await deleteImage(image.id);
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
        <Title order={3}>Gallery Management</Title>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={() => handleOpenModal()}
          loading={submitting}
          radius="md"
        >
          Add Image
        </Button>
      </Group>
      
      {images.length === 0 ? (
        <Text c="dimmed" ta="center" py={30}>No gallery images found. Add a new image to get started.</Text>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2, spacing: 'md' },
            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
          ]}
        >
          {images.map((image) => (
            <Card key={image.id} withBorder radius="md" p={0} css={cardStyles}>
              <Card.Section>
                <Image
                  src={image.imageUrl}
                  height={200}
                  alt={image.title}
                  withPlaceholder
                  placeholder={<IconPhoto size={48} opacity={0.5} />}
                />
              </Card.Section>
              
              <Box p="md">
                <Group position="apart" mb="xs">
                  <Text fw={600} lineClamp={1}>{image.title}</Text>
                  
                  <Menu position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon>
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    
                    <Menu.Dropdown>
                      <Menu.Item 
                        icon={<IconEdit size={16} />} 
                        onClick={() => handleOpenModal(image)}
                      >
                        Edit Image
                      </Menu.Item>
                      
                      <Menu.Item 
                        icon={image.isActive ? <IconCheck size={16} /> : undefined} 
                        onClick={() => handleToggleActive(image)}
                      >
                        {image.isActive ? 'Mark as Inactive' : 'Mark as Active'}
                      </Menu.Item>
                      
                      <Menu.Divider />
                      
                      <Menu.Item 
                        color="red" 
                        icon={<IconTrash size={16} />}
                        onClick={() => handleDelete(image)}
                      >
                        Delete Image
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
                
                <Group position="apart">
                  <Badge mt="xs" color="indigo" variant="outline">
                    Order: {image.order}
                  </Badge>
                  
                  <Badge color={image.isActive ? 'green' : 'gray'}>
                    {image.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={editingImage ? "Edit Gallery Image" : "Add New Gallery Image"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Image Title"
            placeholder="Fellowship Gathering"
            required
            {...form.getInputProps('title')}
            mb="md"
          />
          
          {!editingImage && (
            <Box mb="md">
              <Text size="sm" mb={6}>Upload Image</Text>
              <Group position="center" mb="md">
                <FileButton 
                  resetRef={resetRef} 
                  accept="image/png,image/jpeg,image/webp"
                  onChange={setSelectedFile}
                >
                  {(props) => (
                    <Button 
                      {...props} 
                      variant="outline" 
                      leftSection={<IconUpload size={16} />}
                    >
                      {selectedFile ? 'Change image' : 'Choose image'}
                    </Button>
                  )}
                </FileButton>
                
                {selectedFile && (
                  <Button 
                    variant="subtle" 
                    color="red" 
                    onClick={() => {
                      setSelectedFile(null);
                      if (resetRef.current) {
                        resetRef.current();
                      }
                    }}
                    leftSection={<IconX size={16} />}
                  >
                    Remove
                  </Button>
                )}
              </Group>
              
              {selectedFile && (
                <Box mb="md">
                  <Text size="sm" mb={5}>Selected file: {selectedFile.name}</Text>
                  {uploadProgress > 0 && (
                    <Progress value={uploadProgress} size="sm" radius="sm" />
                  )}
                </Box>
              )}
            </Box>
          )}
          
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
            <Button 
              type="submit" 
              loading={submitting}
              disabled={!editingImage && !selectedFile}
            >
              {editingImage ? 'Update Image' : 'Upload Image'}
            </Button>
          </Group>
        </form>
      </Modal>
    </Paper>
  );
}