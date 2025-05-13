'use client';

import React from "react";
import { Box, Container, Paper, Text, Tabs, Title, Group, ThemeIcon } from "@mantine/core";
import AttendanceView from '@/components/attendance/view';
import AttendanceAdd from '@/components/attendance/add';
import { useLoginRedirect } from "@/hooks/user";
import { useProfile } from "@/hooks/profile";
import { css } from '@emotion/react';
import { IconCalendar, IconPlus } from "@tabler/icons-react";

export default function Attendance() {
    useLoginRedirect();
    const { profile } = useProfile();
    // Use fixed dark colorScheme for now to avoid hydration issues
    const colorScheme = 'dark';

    const pageStyles = css`
        padding: 20px 0 60px;
    `;

    const cardStyles = css`
        position: relative;
        border: 1px solid ${colorScheme === 'dark'
            ? 'rgba(92, 124, 250, 0.2)'
            : 'rgba(92, 124, 250, 0.1)'
        };
        overflow: hidden;
        margin-bottom: 20px;
        
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(to right, #4263EB, #748FFC);
        }
    `;
    
    const headerStyles = css`
        margin-bottom: 2rem;
    `;

    return (
        <Container size="lg" css={pageStyles}>
            <Box css={headerStyles}>
                <Group mb="xs">
                    <ThemeIcon radius="md" size={40} color="indigo" variant="light">
                        <IconCalendar size={22} />
                    </ThemeIcon>
                    <Title order={2}>Attendance Management</Title>
                </Group>
                <Text c="dimmed" size="sm">
                    Track and record member attendance for fellowship meetings
                </Text>
            </Box>
            
            <Paper withBorder p="md" radius="md" css={cardStyles}>
                <Tabs defaultValue="view" radius="md">
                    <Tabs.List mb="md">
                        <Tabs.Tab 
                            value="view" 
                            leftSection={<IconCalendar size={16} />}
                        >
                            View Records
                        </Tabs.Tab>
                        
                        {profile?.role === 'admin' && (
                            <Tabs.Tab 
                                value="take" 
                                leftSection={<IconPlus size={16} />}
                            >
                                Record Attendance
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                    
                    <Box p="md">
                        <Tabs.Panel value="view">
                            <AttendanceView />
                        </Tabs.Panel>
                        <Tabs.Panel value="take">
                            <AttendanceAdd />
                        </Tabs.Panel>
                    </Box>
                </Tabs>
            </Paper>
        </Container>
    );
}