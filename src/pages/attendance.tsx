import React from "react";
import { Center, Text, Tabs, Stack } from "@mantine/core";
import AttendanceView from '../components/attendance/view';
import AttendanceAdd from '../components/attendance/add';

export default function attendance () {
    return (
    <Center>
        <Stack w='85%'>
            <Text fz={25}>Attendance</Text>
            <Tabs defaultValue="view">
                <Tabs.List defaultValue="view">
                    <Tabs.Tab value="view" w='50%'>View past attendance list</Tabs.Tab>
                    <Tabs.Tab value="take" w='50%'>Take new Attendance</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="view">
                    <AttendanceView />
                </Tabs.Panel>
                <Tabs.Panel value="take">
                    <AttendanceAdd />
                </Tabs.Panel>
            </Tabs>
        </Stack>
    </Center>)
}