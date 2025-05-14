'use client';

import { useState } from 'react';
import {
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Button,
  Group,
  Box,
  Stack,
  Title,
  Card,
  Image,
  FileInput,
  Divider,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Book, Genre } from '@/interface/library';
import { useBookOperations } from '@/hooks/library';
import { IconBook, IconUpload, IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookForm() {
  const router = useRouter();
  const { submitting, addBook } = useBookOperations();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const form = useForm({
    initialValues: {
      title: '',
      author: '',
      description: '',
      genre: '' as Genre,
      year: new Date().getFullYear(),
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title must be at least 3 characters long' : null),
      author: (value) => (value.length < 3 ? 'Author must be at least 3 characters long' : null),
      year: (value) => (value < 1000 || value > new Date().getFullYear() ? 'Enter a valid year' : null),
      genre: (value) => (!value ? 'Please select a genre' : null),
    },
  });
  
  const handleSubmit = async (values: typeof form.values) => {
    if (form.validate().hasErrors) return;
    
    try {
      const result = await addBook(values, coverImage || undefined);
      
      if (result) {
        router.push(`/library/${result.id}`);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      // The toast error is already handled in the hook, no need to add another one
    }
  };
  
  // Generate genre options
  const genreOptions = Object.values(Genre).map(genre => ({
    value: genre,
    label: genre
  }));
  
  return (
    <Box>
      <Card withBorder shadow="sm" mb="xl" p="lg">
        <LoadingOverlay visible={submitting} />
        
        <Title order={2} mb="md">Add New Book</Title>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Title"
            placeholder="Enter book title"
            required
            {...form.getInputProps('title')}
            mb="md"
          />
          
          <TextInput
            label="Author"
            placeholder="Enter author name"
            required
            {...form.getInputProps('author')}
            mb="md"
          />
          
          <Group grow mb="md">
            <Select
              label="Genre"
              placeholder="Select genre"
              data={genreOptions}
              required
              searchable
              {...form.getInputProps('genre')}
            />
            
            <NumberInput
              label="Publication Year"
              placeholder="Enter year"
              min={1000}
              max={new Date().getFullYear()}
              required
              {...form.getInputProps('year')}
            />
          </Group>
          
          <Textarea
            label="Description"
            placeholder="Enter book description (optional)"
            minRows={4}
            {...form.getInputProps('description')}
            mb="md"
          />
          
          <FileInput
            label="Cover Image"
            placeholder="Upload book cover (optional)"
            accept="image/png,image/jpeg,image/webp,image/gif"
            value={coverImage}
            onChange={setCoverImage}
            icon={<IconUpload size={16} />}
            mb="xl"
          />
          
          {coverImage && (
            <Box mb="xl">
              <Alert title="Cover Image Preview" color="blue" icon={<IconBook size={16} />}>
                <Group position="left">
                  <Image
                    src={URL.createObjectURL(coverImage)}
                    width={100}
                    height={150}
                    radius="sm"
                    alt="Cover preview"
                  />
                  <Stack spacing={5}>
                    <Title order={6}>{coverImage.name}</Title>
                    <Title order={6} c="dimmed">{(coverImage.size / 1024).toFixed(2)} KB</Title>
                  </Stack>
                </Group>
              </Alert>
            </Box>
          )}
          
          <Divider my="lg" />
          
          <Group position="right">
            <Button variant="outline" component={Link} href="/library">
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Add Book
            </Button>
          </Group>
        </form>
      </Card>
    </Box>
  );
}