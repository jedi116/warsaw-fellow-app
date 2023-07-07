import React, { FC, useState } from "react";
import { Center, Stack, Button, Flex } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useAttendance } from "@/hooks";
import dayjs from "dayjs";

export default function View () {
    const [date, setDate] = useState<Date>(new Date())
    const {attendance, reloadAttendance} = useAttendance(dayjs(date).format("MM-DD-YYYY"))
    return (
    <Center>
        <Stack w='100%'>
                <Flex
                    gap="md"
                    justify="center"
                    align="flex-start"
                    direction="row"
                >
                        <DateInput
                            value={date}
                            onChange={(val) => {
                                val && setDate(new Date(val.toDateString()))
                            }}
                            label="Attendance For"
                            placeholder="Date input"
                        />
                        <Button style={{marginTop:'25px'}} onClick={reloadAttendance}>reload</Button>
                    
                </Flex>
                {attendance ? 
                attendance.users?.map((user,index) => {
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