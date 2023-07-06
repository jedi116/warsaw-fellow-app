import React, { FC, useState } from "react";
import { Center, Stack, Button, Flex } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import Form from "./form";
import { useAttendance } from "@/hooks";
import dayjs from "dayjs";

export default function View () {
    const [date, setDate] = useState<string>(dayjs().format("MM-DD-YYYY"))
    const {attendance, reloadAttendance} = useAttendance(date)
    return (
    <Center>
        <Stack w='100%'>
                <Flex
                    gap="md"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                >
                    <DateInput
                        value={new Date(date)}
                        onChange={(val) => {
                            setDate(dayjs(val).format("MM-DD-YYYY"))
                        }}
                        label="Attendance For"
                        placeholder="Date input"
                        maw={400}
                        mx="auto"
                    />   
                </Flex>
                {attendance ? 
                attendance.users.map((user,index) => {
                    return (
                        <Flex
                            gap="md"
                            justify="space-between"
                            align="flex-start"
                            direction="row"
                            key={index}
                        >
                            <span>{user.firstName} {user.lastName}</span>
                            <span>{user.present ? 'Present' : 'Absent'}</span>
                        </Flex>
                    )
                }) : 'no data found for date'
        }
        </Stack>
        
    </Center>
    )
}