'use client';

import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Group, 
  Paper, 
  Text, 
  Stack,
  Badge,
  Divider,
  ThemeIcon,
  Table,
  ScrollArea,
  Center,
  Card,
  useMantineColorScheme,
  ActionIcon
} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useAttendance } from "@/hooks";
import dayjs from "dayjs";
import { IconCalendar, IconCheck, IconRefresh, IconX } from "@tabler/icons-react";
import { css } from '@emotion/react';

export default function View() {
  const [date, setDate] = useState<Date>(new Date());
  const { attendance, reloadAttendance } = useAttendance(dayjs(date).format("MM-DD-YYYY"));
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const containerStyles = css`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  `;
  
  const cardStyles = css`
    position: relative;
    border: 1px solid ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.15)'
      : 'rgba(92, 124, 250, 0.1)'
    };
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  `;
  
  const dateFormatted = dayjs(date).format("MMMM D, YYYY");
  const totalPresent = attendance?.users.filter(user => user.present).length || 0;
  const totalMembers = attendance?.users.length || 0;
  const attendanceRate = totalMembers > 0 ? Math.round((totalPresent / totalMembers) * 100) : 0;

  return (
    <Box css={containerStyles}>
      <Paper p="md" withBorder radius="md" mb="md">
        <Group position="apart" align="flex-end" mb="xs">
          <DateInput
            value={date}
            onChange={(val) => {
              if (val) {
                // Safely handle the date value
                try {
                  // Create a new date to ensure we're working with a fresh instance
                  const newDate = new Date(val);
                  // Validate that it's a proper date
                  if (!isNaN(newDate.getTime())) {
                    setDate(newDate);
                  }
                } catch (e) {
                  console.error("Error handling date:", e);
                }
              }
            }}
            label="Select Date"
            placeholder="MM/DD/YYYY"
            icon={<IconCalendar size={16} />}
            clearable={false}
            valueFormat="MMMM D, YYYY"
            size="md"
            radius="md"
            style={{ flexGrow: 1, maxWidth: 250 }}
          />
          
          <Button 
            onClick={reloadAttendance}
            variant="light"
            radius="md"
          >
            <Group spacing={6}>
              <IconRefresh size={16} />
              <span>Refresh</span>
            </Group>
          </Button>
        </Group>
        
        <Group position="apart" mt="md">
          <Box>
            <Text size="sm" fw={500} c="dimmed">Date</Text>
            <Text fw={700}>{dateFormatted}</Text>
          </Box>
          
          <Box>
            <Text size="sm" fw={500} c="dimmed" ta="center">Attendance Rate</Text>
            <Group position="center">
              <Badge 
                size="lg" 
                radius="sm" 
                variant="filled"
                color={attendanceRate > 70 ? 'teal' : attendanceRate > 40 ? 'yellow' : 'red'}
              >
                {attendanceRate}%
              </Badge>
            </Group>
          </Box>
          
          <Box>
            <Text size="sm" fw={500} c="dimmed" ta="right">Present</Text>
            <Text fw={700} ta="right">{totalPresent} / {totalMembers}</Text>
          </Box>
        </Group>
      </Paper>
      
      {!attendance || attendance.users.length === 0 ? (
        <Center py={50}>
          <Stack align="center" spacing="md">
            <ThemeIcon size={60} radius="xl" color="gray">
              <IconCalendar size={30} />
            </ThemeIcon>
            <Text fw={500} size="lg">No attendance data found</Text>
            <Text c="dimmed" size="sm" maw={400} ta="center">
              There's no attendance record for this date. Please select a different date or take attendance if you're an admin.
            </Text>
          </Stack>
        </Center>
      ) : (
        <>
          {/* Desktop view */}
          <Box visibleFrom="sm">
            <ScrollArea>
              <Table striped highlightOnHover withBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Member Name</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {attendance.users.map((user, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text fw={500}>{user.firstName} {user.lastName}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        {user.present ? (
                          <Badge color="teal" size="sm" radius="sm" variant="filled">
                            Present
                          </Badge>
                        ) : (
                          <Badge color="red" size="sm" radius="sm" variant="filled">
                            Absent
                          </Badge>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Box>
          
          {/* Mobile view */}
          <Stack spacing="md" hiddenFrom="sm">
            {attendance.users.map((user, index) => (
              <Card key={index} p="sm" radius="md" withBorder css={cardStyles}>
                <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                  <Text fw={500} lineClamp={1}>
                    {user.firstName} {user.lastName}
                  </Text>
                  
                  {user.present ? (
                    <ActionIcon color="teal" radius="xl" variant="light" size="lg">
                      <IconCheck size={20} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon color="red" radius="xl" variant="light" size="lg">
                      <IconX size={20} />
                    </ActionIcon>
                  )}
                </Group>
              </Card>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}