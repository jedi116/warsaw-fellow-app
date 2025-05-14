'use client';

import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  rem,
  Skeleton,
  ThemeIcon,
  Alert,
} from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { 
  IconCalendarEvent, 
  IconMapPin, 
  IconBook, 
  IconUsers, 
  IconHeart,
  IconStar,
  IconMicrophone,
  IconMusic,
  IconAlertCircle
} from '@tabler/icons-react';
import backgroundImage from '../../public/photo1.jpeg';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/service/UI/firebaseUiClient';
import { usePublicPrograms, usePublicGalleryImages, usePublicScriptures } from '@/hooks/publicContent';
import { IconType } from '@/interface/content';

// Map icon strings to actual components
const getIconComponent = (iconName: string, size = 40) => {
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

// Sample data (fallbacks)
const SCRIPTURE_OF_THE_DAY = {
  verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
  reference: "John 3:16",
};

const LOCATION = {
  address: "Nadnieprzańska 7, 04-205 Warsaw, Poland",
  description: "Our fellowship meets at the community center. Parking is available nearby.",
  mapLink: "https://www.google.com/maps?q=Nadnieprzańska+7,+04-205+Warsaw+Poland",
  mapEmbedSrc: "https://maps.google.com/maps?q=Nadnieprzańska+7,+04-205+Warsaw+Poland&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

// Error boundary component
function ErrorFallback({ error, resetErrorBoundary, children }: { error: Error, resetErrorBoundary: () => void, children: React.ReactNode }) {
  return (
    <Alert
      icon={<IconAlertCircle size={18} />}
      title="An error occurred"
      color="red"
      mb="lg"
    >
      <Text size="sm" mb="md">Something went wrong loading this section.</Text>
      <Button size="xs" onClick={resetErrorBoundary} variant="outline">Try again</Button>
      {children}
    </Alert>
  );
}

// Wrapper component with error handling
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Add error handler for unhandled promise rejections
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const resetErrorBoundary = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError && error) {
    return (
      <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary}>
        {children}
      </ErrorFallback>
    );
  }

  return <>{children}</>;
}

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  // Set initial loading state to prevent premature Firebase access
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Wait for auth state to be determined before initializing
  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  // Use public content hooks that don't require authentication
  const { programs, loading: programsLoading } = usePublicPrograms(true);
  const { images, loading: imagesLoading } = usePublicGalleryImages(true);
  const { scriptures, loading: scripturesLoading } = usePublicScriptures(true);
  
  // Refs for scroll animations
  const programsRef = useRef<HTMLDivElement>(null);
  const scriptureRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  // Intersection observers for animations
  const { ref: programsIntersectionRef, entry: programsEntry } = useIntersection({
    root: null,
    threshold: 0.2,
  });
  
  const { ref: scriptureIntersectionRef, entry: scriptureEntry } = useIntersection({
    root: null,
    threshold: 0.2,
  });
  
  const { ref: locationIntersectionRef, entry: locationEntry } = useIntersection({
    root: null,
    threshold: 0.2,
  });
  
  const { ref: galleryIntersectionRef, entry: galleryEntry } = useIntersection({
    root: null,
    threshold: 0.2,
  });
  
  const { ref: aboutIntersectionRef, entry: aboutEntry } = useIntersection({
    root: null,
    threshold: 0.2,
  });
  
  // Set up refs
  useEffect(() => {
    if (programsRef.current) programsIntersectionRef(programsRef.current);
    if (scriptureRef.current) scriptureIntersectionRef(scriptureRef.current);
    if (locationRef.current) locationIntersectionRef(locationRef.current);
    if (galleryRef.current) galleryIntersectionRef(galleryRef.current);
    if (aboutRef.current) aboutIntersectionRef(aboutRef.current);
  }, [
    programsRef, programsIntersectionRef,
    scriptureRef, scriptureIntersectionRef,
    locationRef, locationIntersectionRef,
    galleryRef, galleryIntersectionRef,
    aboutRef, aboutIntersectionRef,
  ]);
  
  // CSS styles for animation
  const fadeInUpAnimation = css`
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
    
    &.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  
  const heroSectionStyles = css`
    height: 80vh;
    min-height: 600px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage.src});
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    margin-bottom: 80px;
  `;
  
  const sectionStyles = css`
    padding: 80px 0;
    
    @media (max-width: 768px) {
      padding: 50px 0;
    }
  `;
  
  const cardHoverStyles = css`
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
  `;

  return (
    <Box>
      {/* Hero Section */}
      <Box css={heroSectionStyles}>
        <Container size="md">
          <Stack spacing="xl" align="center">
            <Title order={1} size={60} fw={900} ta="center">
              Warsaw Ethiopian Christian Fellowship
            </Title>
            <Text size="xl" maw={600} ta="center" my="lg">
              A welcoming community of believers gathering to worship, learn, and grow together in faith.
            </Text>
            <Button 
              size="lg" 
              radius="xl"
              onClick={() => user ? router.push('/members') : router.push('/auth/login')}
            >
              {user ? 'Access Member Area' : 'Join Our Community'}
            </Button>
          </Stack>
        </Container>
      </Box>
      
      {/* Scripture of the Day */}
      <Box bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'} py={50} ref={scriptureRef} className={scriptureEntry?.isIntersecting ? 'visible' : ''} css={fadeInUpAnimation}>
        <Container size="lg">
          <Stack align="center" spacing="lg">
            <Title order={2} ta="center" c="indigo.3">Scripture of the Day</Title>
            
            <ErrorBoundary>
              {!isInitialized || scripturesLoading ? (
                <>
                  <Skeleton height={120} width="80%" radius="sm" />
                  <Skeleton height={20} width="30%" radius="sm" />
                </>
              ) : scriptures.length === 0 || !user ? (
                <>
                  <Text fz={24} ta="center" maw={700} fw={300} fs="italic">
                    "{SCRIPTURE_OF_THE_DAY.verse}"
                  </Text>
                  <Text c="dimmed" ta="center">
                    {SCRIPTURE_OF_THE_DAY.reference}
                  </Text>
                </>
              ) : (
                <>
                  <Text fz={24} ta="center" maw={700} fw={300} fs="italic">
                    "{scriptures[0].verse}"
                  </Text>
                  <Text c="dimmed" ta="center">
                    {scriptures[0].reference}
                  </Text>
                </>
              )}
            </ErrorBoundary>
          </Stack>
        </Container>
      </Box>
      
      {/* Programs Section */}
      <Container size="lg" py={80} ref={programsRef} className={programsEntry?.isIntersecting ? 'visible' : ''} css={fadeInUpAnimation}>
        <Stack spacing="xl">
          <Title order={2} ta="center" mb="xl">Our Programs & Schedule</Title>
          
          <ErrorBoundary>
            {!isInitialized || programsLoading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {[1, 2, 3].map((_, index) => (
                  <Card key={index} withBorder padding="xl" radius="md">
                    <Skeleton height={40} circle mb="xl" />
                    <Skeleton height={30} width="70%" mb="sm" />
                    <Skeleton height={20} width="40%" mb="lg" />
                    <Skeleton height={50} mb="md" />
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {programs.map((program) => (
                  <Card 
                    key={program.id} 
                    withBorder 
                    padding="xl"
                    radius="md"
                    css={cardHoverStyles}
                  >
                    <ThemeIcon size={40} radius="md" color="indigo.6" mb="md">
                      {getIconComponent(program.icon)}
                    </ThemeIcon>
                    <Title order={3} mb="xs">{program.title}</Title>
                    <Text fw={600} c="indigo.5" mb="md">{program.time}</Text>
                    <Text c="dimmed">{program.description}</Text>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </ErrorBoundary>
        </Stack>
      </Container>
      
      {/* Location Section */}
      <Box bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'} py={80} ref={locationRef} className={locationEntry?.isIntersecting ? 'visible' : ''} css={fadeInUpAnimation}>
        <Container size="lg">
          <Grid gutter={40}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack spacing="lg">
                <Title order={2}>Our Location</Title>
                <Group align="flex-start">
                  <IconMapPin size={24} color="var(--mantine-color-indigo-5)" />
                  <Box>
                    <Text fw={700} size="lg">{LOCATION.address}</Text>
                    <Text c="dimmed" mt="xs">{LOCATION.description}</Text>
                  </Box>
                </Group>
                <Button 
                  component="a" 
                  href={LOCATION.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variant="light"
                  leftSection={<IconMapPin size={18} />}
                  mt="md"
                >
                  View on Google Maps
                </Button>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ErrorBoundary>
                {/* Map iframe with error handling */}
                <Box pos="relative">
                  <iframe
                    src={LOCATION.mapEmbedSrc}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: 'var(--mantine-radius-md)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps - Warsaw Ethiopian Fellowship Location"
                    onError={(e) => {
                      // Handle iframe loading error (likely due to ad blocker)
                      const target = e.target as HTMLIFrameElement;
                      if (target) {
                        target.style.display = 'none';
                      }
                      const mapErrorEl = document.getElementById('map-error');
                      if (mapErrorEl) {
                        mapErrorEl.style.display = 'flex';
                      }
                    }}
                  />
                  <Box 
                    id="map-error"
                    display="none"
                    p="lg"
                    ta="center"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'var(--mantine-color-dark-6)',
                      borderRadius: 'var(--mantine-radius-md)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <IconMapPin size={48} opacity={0.5} />
                    <Text mt="md">Map could not be loaded. Please visit our location on Google Maps directly.</Text>
                    <Button 
                      component="a" 
                      href={LOCATION.mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      variant="light"
                      mt="md"
                    >
                      Open in Google Maps
                    </Button>
                  </Box>
                </Box>
              </ErrorBoundary>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      
      {/* Gallery Section */}
      <Container size="lg" py={80} ref={galleryRef} className={galleryEntry?.isIntersecting ? 'visible' : ''} css={fadeInUpAnimation}>
        <Stack spacing="xl">
          <Title order={2} ta="center" mb="xl">Events Gallery</Title>
          
          <ErrorBoundary>
            {!isInitialized || imagesLoading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <Skeleton key={index} height={200} radius="md" />
                ))}
              </SimpleGrid>
            ) : images.length === 0 ? (
              <Text c="dimmed" ta="center" py={30}>No gallery images available at the moment.</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {images.map((image) => (
                  <Image
                    key={image.id}
                    src={image.imageUrl}
                    alt={image.title}
                    radius="md"
                    h={200}
                    style={{ objectFit: 'cover' }}
                    css={cardHoverStyles}
                    placeholder={<Skeleton height={200} radius="md" />}
                  />
                ))}
              </SimpleGrid>
            )}
          </ErrorBoundary>
        </Stack>
      </Container>
      
      {/* About Section */}
      <Box bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'} py={80} ref={aboutRef} className={aboutEntry?.isIntersecting ? 'visible' : ''} css={fadeInUpAnimation}>
        <Container size="lg">
          <Grid gutter={40} align="center">
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
              <Image 
                src={backgroundImage.src}
                alt="About our fellowship"
                radius="md"
                w="100%"
                h={350}
                style={{ objectFit: 'cover' }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
              <Stack spacing="lg">
                <Title order={2}>About Our Fellowship</Title>
                <Text>
                  The Warsaw Ethiopian Christian Fellowship was established to create a spiritual home for Ethiopian Christians living in Warsaw and the surrounding areas. Our fellowship is a place where members can worship in their native language, celebrate their cultural heritage, and grow in their faith together.
                </Text>
                <Text>
                  We welcome everyone regardless of background or nationality. Our diverse community is united by our shared faith and commitment to serving one another and the wider community.
                </Text>
                <Button variant="outline" mt="md" onClick={() => router.push('/about')}>Learn More About Us</Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      
      {/* Contact/CTA Section */}
      <Container size="md" py={100} ta="center">
        <Stack spacing="xl" align="center">
          <Title order={2}>Join Us This Saturday</Title>
          <Text size="lg" maw={600} ta="center">
            We'd love to welcome you to our fellowship. Join us this Sunday for worship, fellowship, and spiritual growth.
          </Text>
          <Group mt="xl">
            <Button size="lg" variant="light" radius="md" onClick={() => router.push('/events')}>View All Events</Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}