import React, {useState} from "react";
import { DateInput } from '@mantine/dates';
import { Center, Stack } from "@mantine/core";
import Form from "./form";
import { useAttendance } from "@/hooks";
import dayjs from "dayjs";

export default function Add () {
    const [date, setDate] = useState<string>(dayjs().format("MM-DD-YYYY"))
    const {newAttendance} = useAttendance(date)
    return (
        <Center>
            <Stack w='100%'>
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
                    <Form disableEdit={false} formData={newAttendance} date={date}/>
            </Stack>
        </Center>
    )
}