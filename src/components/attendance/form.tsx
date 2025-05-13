'use client';

import React from "react";
import { useForm } from '@mantine/form';
import { Attendance, AttendanceUser } from "@/interface/attendance";
import { 
    Checkbox, 
    Group, 
    Text, 
    Button, 
    Box, 
    Card, 
    Stack, 
    useMantineColorScheme,
    ScrollArea,
    Divider,
    Badge,
    ThemeIcon
} from "@mantine/core";
import CommonService from "@/service/UI/common";
import { css } from '@emotion/react';
import { IconCheck, IconUsers } from "@tabler/icons-react";
 
const formatForForm = (users: AttendanceUser []) => {
    let formData: Record<string,boolean> = {};
    users.forEach(data => {
        formData[data.uid] = data.present || false;
    });
    return formData;
};

interface FormProps {
    disableEdit: boolean;
    formData: Attendance | undefined;
    date?: string;
}

export default function Form({
    disableEdit,
    formData,
    date
}: FormProps) {
    // Use fixed dark colorScheme for now to avoid hydration issues
    const colorScheme = 'dark';
    const _form = useForm({
        initialValues: formData ? formatForForm(formData.users) : {}
    });

    const handleSubmit = async (data: Record<string, boolean>) => {
        if (date && formData) {
            const usersAttended: AttendanceUser[] = formData.users.map(userData => {
                return {
                    uid: userData.uid,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    present: !!data[userData.uid]
                };
            });
            await CommonService.saveAttendance({date, users: usersAttended});
        }
    };
    
    const cardStyles = css`
        position: relative;
        border: 1px solid ${colorScheme === 'dark'
            ? 'rgba(92, 124, 250, 0.15)'
            : 'rgba(92, 124, 250, 0.1)'
        };
        transition: all 0.2s ease;
        margin-bottom: 8px;
        
        &:hover {
            border-color: ${colorScheme === 'dark'
                ? 'rgba(92, 124, 250, 0.3)'
                : 'rgba(92, 124, 250, 0.2)'
            };
            background: ${colorScheme === 'dark'
                ? 'rgba(66, 99, 235, 0.05)'
                : 'rgba(66, 99, 235, 0.02)'
            };
        }
    `;
    
    if (!formData || !formData.users || formData.users.length === 0) {
        return (
            <Box p="lg" ta="center">
                <ThemeIcon size={50} radius="xl" mx="auto" mb="md" color="gray">
                    <IconUsers size={26} />
                </ThemeIcon>
                <Text fw={500}>No members found</Text>
                <Text c="dimmed" size="sm">
                    There are no members to display for attendance tracking
                </Text>
            </Box>
        );
    }
    
    // Check if any members are marked as present
    const presentCount = Object.values(_form.values).filter(Boolean).length;
    const totalMembers = formData.users.length;
    
    return (
        <Box>
            <form onSubmit={_form.onSubmit(values => handleSubmit(values))}>
                <Group position="apart" mb="md">
                    <Text fw={600} size="sm">
                        Mark attendance for {totalMembers} members
                    </Text>
                    <Badge size="md" color={presentCount > 0 ? "blue" : "gray"}>
                        {presentCount} / {totalMembers} present
                    </Badge>
                </Group>
                
                <Divider mb="md" />
                
                <ScrollArea h={400} offsetScrollbars scrollbarSize={6}>
                    <Stack spacing="xs">
                        {formData.users.map((data, index) => (
                            <Card key={index} p="xs" radius="md" css={cardStyles} withBorder>
                                <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                                    <Text fw={500} size="sm" lineClamp={1}>
                                        {data.firstName} {data.lastName}
                                    </Text>
                                    <Checkbox
                                        size="md"
                                        radius="sm"
                                        disabled={disableEdit}
                                        checked={!!_form.values[data.uid]}
                                        {..._form.getInputProps(data.uid, { type: 'checkbox' })}
                                    />
                                </Group>
                            </Card>
                        ))}
                    </Stack>
                </ScrollArea>
                
                <Button 
                    fullWidth 
                    mt="lg" 
                    type='submit' 
                    disabled={disableEdit}
                    color="indigo"
                    radius="md"
                >
                    <Group spacing={6}>
                        <IconCheck size={16} />
                        <span>Save Attendance</span>
                    </Group>
                </Button>
            </form>
        </Box>
    );
}