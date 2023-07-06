import React, { useEffect } from "react";
import { useForm } from '@mantine/form';
import { Attendance, AttendanceUser } from "@/interface/attendance";
import { Checkbox, Flex, Text, Button } from "@mantine/core";
import CommonService from "@/service/UI/common";
 
const formatForForm = (users: AttendanceUser []) => {
    let formData: Record<string,boolean> = {}
    users.forEach(data => {
        formData[data.uid] = false
        return formData
    })
    return formData
}

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
    const _form = useForm({
        initialValues: formData ? formatForForm(formData.users) : {}
    })

    const handleSubmit = async (data: Record<string, boolean>) => {
        if (date && formData) {
            const usersAttended: AttendanceUser[] = formData.users.map(userData => {
                return {
                    uid: userData.uid,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    present: !!data[userData.uid]
                }
            })
            await CommonService.saveAttendance({date, users: usersAttended})
        }
    }
    return (
    <div style={{padding:'10px', margin: '10px'}}>
        <form onSubmit={_form.onSubmit(values => handleSubmit(values))}>
            {
                formData?.users.map((data,index) => {
                    return (
                            <Flex
                                gap="md"
                                justify="space-between"
                                align="flex-start"
                                direction="row"
                                key={index}
                            >
                                <Text>
                                    {data.firstName} {data.lastName}
                                </Text>
                                <Checkbox  
                                    label=""
                                    disabled={disableEdit}
                                    {..._form.getInputProps(data.uid, { type: 'checkbox' })}
                                />
                            </Flex>
                    )
                })
            }
            <Button fullWidth mt="xl" type='submit' disabled={disableEdit}> Save</Button>

        </form>
    </div>
    )
}