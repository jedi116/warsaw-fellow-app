'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  Image,
  Group,
  ThemeIcon,
  Stack,
  Grid,
  Card,
  Avatar,
  Box,
  Divider,
  Paper,
  Timeline
} from '@mantine/core';
import {
  IconHeart,
  IconUsers,
  IconMap,
  IconCalendarEvent,
  IconBook,
  IconHistory,
  IconTarget,
  IconBuildingChurch
} from '@tabler/icons-react';
import { css } from '@emotion/react';
import backgroundImage from '../../../public/photo1.jpeg';

export default function AboutPage() {
  // Define some values for our fellowship
  const foundedYear = 2021; // Replace with actual founding year
  const missionStatement = "To create a spiritual home for Ethiopian Christians in Warsaw, where members can worship in their native language, celebrate their cultural heritage, and grow in their faith together.";

  const values = [
    { 
      title: "Faith", 
      description: "Deepening our relationship with God through prayer, worship, and study of His Word.", 
      icon: IconBook 
    },
    { 
      title: "Community", 
      description: "Building strong relationships and supporting one another in all aspects of life.", 
      icon: IconUsers 
    },
    { 
      title: "Service", 
      description: "Using our gifts to serve others and extend God's love to those in need.", 
      icon: IconHeart 
    },
    { 
      title: "Cultural Heritage", 
      description: "Honoring and sharing our Ethiopian Christian traditions and culture.", 
      icon: IconBuildingChurch 
    },
  ];

  const historyItems = [
    {
      year: foundedYear,
      title: "Fellowship Founded",
      description: "Our fellowship began with a small group of Ethiopian Christians meeting in a home."
    },
    {
      year: foundedYear + 2,
      title: "First Community Center",
      description: "We moved to our first regular meeting space in a community center."
    },
    {
      year: foundedYear + 5,
      title: "Expanded Programs",
      description: "We started offering more programs including youth activities and Bible studies."
    },
    {
      year: foundedYear + 8,
      title: "Community Outreach",
      description: "Began reaching out to other Ethiopian immigrants arriving in Warsaw."
    },
    {
      year: 2023,
      title: "Present Day",
      description: "Today we continue to grow, welcoming all who wish to worship with us."
    }
  ];

  const leadershipTeam = [
    {
      name: "Pastor Meseret Alemayehu",
      role: "Lead Pastor",
      bio: "Leading our fellowship since its founding, Pastor Meseret brings wisdom and compassionate leadership."
    },
    {
      name: "Abeba Tadesse",
      role: "Worship Leader",
      bio: "Coordinating our worship team and leading the congregation in praising God through music."
    },
    {
      name: "Dawit Bekele",
      role: "Youth Director",
      bio: "Working with our young members to help them grow in faith and community."
    },
    {
      name: "Tigist Abebe",
      role: "Outreach Coordinator",
      bio: "Organizing our community service initiatives and welcoming newcomers."
    }
  ];

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
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
  `;

  return (
    <Container size="lg">
      {/* Hero Section */}
      <Box my={50}>
        <Title order={1} size={48} ta="center" mb="xl">About Our Fellowship</Title>
        
        <Grid gutter={40} align="center">
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <Title order={2} mb="md">Who We Are</Title>
            <Text size="lg" mb="lg">
              The Warsaw Ethiopian Christian Fellowship was established to create a spiritual home for Ethiopian Christians living in Warsaw and the surrounding areas. Our fellowship is a place where members can worship in their native language, celebrate their cultural heritage, and grow in their faith together.
            </Text>
            <Text size="lg">
              We welcome everyone regardless of background or nationality. Our diverse community is united by our shared faith and commitment to serving one another and the wider community.
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
            <Image 
              src={backgroundImage.src}
              alt="Fellowship gathering"
              radius="md"
              w="100%"
              h={350}
              style={{ objectFit: 'cover' }}
            />
          </Grid.Col>
        </Grid>
      </Box>

      <Divider my={40} />

      {/* Our Mission & Values */}
      <Box css={sectionStyles}>
        <Title order={2} ta="center" mb="xl">Our Mission & Values</Title>
        
        <Paper p="xl" radius="md" withBorder mb="xl">
          <Group align="center" position="center" mb="md">
            <ThemeIcon size={40} radius="md" color="indigo">
              <IconTarget size={24} />
            </ThemeIcon>
            <Title order={3}>Mission Statement</Title>
          </Group>
          <Text size="lg" ta="center" italic>
            {missionStatement}
          </Text>
        </Paper>
        
        <Grid>
          {values.map((value, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
              <Card withBorder p="xl" radius="md" css={cardHoverStyles}>
                <Group mb="md">
                  <ThemeIcon size={40} radius="md" color="indigo" variant="light">
                    <value.icon size={20} />
                  </ThemeIcon>
                  <Title order={3}>{value.title}</Title>
                </Group>
                <Text>{value.description}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Divider my={40} />

      {/* Our History

       <Box css={sectionStyles}>
        <Title order={2} ta="center" mb="xl">Our History</Title>

        <Timeline active={historyItems.length - 1} bulletSize={24} lineWidth={2}>
          {historyItems.map((item, index) => (
            <Timeline.Item
              key={index}
              bullet={<IconHistory size={12} />}
              title={`${item.year}: ${item.title}`}
            >
              <Text color="dimmed" size="sm">{item.description}</Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Box>

      <Divider my={40} />
       */}


      {/* Leadership Team

      <Box css={sectionStyles}>
        <Title order={2} ta="center" mb="xl">Our Leadership Team</Title>

        <Grid>
          {leadershipTeam.map((leader, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
              <Card withBorder p="lg" radius="md" css={cardHoverStyles}>
                <Card.Section py="lg" style={{ textAlign: 'center' }}>
                  <Avatar size={120} radius={120} mx="auto" color="indigo" />
                  <Title order={4} mt="md">{leader.name}</Title>
                  <Text size="sm" color="dimmed" mb="xs">{leader.role}</Text>
                </Card.Section>

                <Text>{leader.bio}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Divider my={40} />

      */}


      {/* Location & Meetings */}
      <Box css={sectionStyles} mb={50}>
        <Title order={2} ta="center" mb="xl">Join Us</Title>
        
        <Grid gutter={40}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="md" h="100%">
              <Group mb="md">
                <ThemeIcon size={40} radius="md" color="indigo">
                  <IconCalendarEvent size={20} />
                </ThemeIcon>
                <Title order={3}>Weekly Meetings</Title>
              </Group>
              <Stack spacing="md">
                <Group noWrap align="flex-start">
                  <Box style={{ width: 80 }}>
                    <Text fw={600}>Saturday:</Text>
                  </Box>
                  <Text> Bible Study and Worship 18:00  - 21:00 </Text>
                </Group>
                <Group noWrap align="flex-start">
                  <Box style={{ width: 80 }}>
                    <Text fw={600}> Wednesday: </Text>
                  </Box>
                  <Text>  Prayer, 20:00  - 21:00 </Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="md" h="100%">
              <Group mb="md">
                <ThemeIcon size={40} radius="md" color="indigo">
                  <IconMap size={20} />
                </ThemeIcon>
                <Title order={3}>Location</Title>
              </Group>
              <Text mb="md">Nadnieprzańska 7, 04-205 Warsaw, Poland</Text>
              <Text>
                Our fellowship meets at the community center. Parking is available nearby.
                All are welcome to join us for worship, prayer, and fellowship.
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
}