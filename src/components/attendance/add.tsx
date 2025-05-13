'use client';

import React, { useState } from "react";
import { DateInput } from '@mantine/dates';
import { Box, Paper, Text, ThemeIcon, Group, useMantineColorScheme } from "@mantine/core";
import Form from "./form";
import { useAttendance } from "@/hooks";
import dayjs from "dayjs";
import { useProfile } from "@/hooks/profile";
import { IconCalendar } from "@tabler/icons-react";
import { css } from '@emotion/react';

export default function Add() {
    const [date, setDate] = useState<Date>(new Date());
    const { newAttendance } = useAttendance(dayjs(date).format("MM-DD-YYYY"));
    const { profile } = useProfile();
    // Use fixed dark colorScheme for now to avoid hydration issues
    const colorScheme = 'dark';
    
    const containerStyles = css`
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    `;
    
    const formattedDate = dayjs(date).format("MMMM D, YYYY");
    
    return (
        <Box css={containerStyles}>
            <Paper p="md" withBorder radius="md" mb="md">
                <Group mb="md">
                    <ThemeIcon 
                        size={36} 
                        radius="md" 
                        variant="light" 
                        color="indigo"
                    >
                        <IconCalendar size={20} />
                    </ThemeIcon>
                    <Box>
                        <Text fw={600}>Record Attendance</Text>
                        <Text size="sm" c="dimmed">
                            For: {formattedDate}
                        </Text>
                    </Box>
                </Group>
                
                <DateInput
                    value={date}
                    onChange={(val) => {
                        if (val) {
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
                    label="Select Date for Attendance"
                    placeholder="MM/DD/YYYY"
                    clearable={false}
                    valueFormat="MMMM D, YYYY"
                    size="md"
                    radius="md"
                    icon={<IconCalendar size={16} />}
                    style={{ maxWidth: 300 }}
                />
            </Paper>
            
            <Paper p="md" withBorder radius="md">
                {profile?.role !== 'admin' && (
                    <Text c="dimmed" mb="md" size="sm">
                        Note: Only administrators can modify attendance records.
                    </Text>
                )}
                <Form 
                    disableEdit={profile?.role !== 'admin'} 
                    formData={newAttendance} 
                    date={dayjs(date).format("MM-DD-YYYY")}
                />
            </Paper>
        </Box>
    );
}