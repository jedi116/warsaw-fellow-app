import { Center, Stack, Group, Button, ActionIcon, TextInput } from "@mantine/core"
import { useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import { useCodes } from "@/hooks";
import { useLoginRedirect } from "@/hooks/user";
import CodesService from '@/service/codes'
import { CodesType } from "@/interface/common";
import CommonService from "@/service/UI/common";
import { useProfile } from "@/hooks/profile";

export async function getServerSideProps () {
    try {
        const adminCodes = await CodesService.getAdminCodes()
        const registrationCodes = await CodesService.getRegistrationCodes()
        if (adminCodes && registrationCodes) {
            return {
                props: {
                    originalCodes: {
                        admin: adminCodes[0].value,
                        registration: registrationCodes[0].value
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

interface CodesInputType {
    registration: boolean;
    admin: boolean;
}

type Props = {
    originalCodes: CodesType
}
export default function Codes ({
    originalCodes
}: Props) {
    useLoginRedirect()
    const [showInput, setShowInput] = useState<CodesInputType>({
        registration: false,
        admin: false
    })
    const {profile} = useProfile()
    const {codes, getCodes, setCodes } =  useCodes(originalCodes)
    const onSubmitClick = async (type: 'admin' | 'register') => {
        try {
            if (type ==='register') CommonService.updateCode(codes.registration, type)
            else CommonService.updateCode(codes.admin, type)
        } catch (error) {
            console.log(error)
        } finally {
            setShowInput({
                registration: false,
                admin: false
            })
            setTimeout(() => getCodes(),500)
        }
    }
    return (
        <Center>
            <Stack>
                <Button onClick={() => getCodes()} >Refresh</Button>
                <Group style={{borderColor:'gray'}}>
                    <Stack>
                        <h1>Registration Code</h1>
                        <Group>
                            <TextInput
                                placeholder="Enter new Code"
                                label="Registration code"
                                required
                                disabled={!showInput.registration}
                                value={codes?.registration}
                                onChange={val => {
                                    setCodes(prev =>({ ...prev, registration: val.target.value}))
                                }}
                            />
                            {profile?.role === 'admin' && <ActionIcon
                                onClick={() => {
                                    setShowInput(prev => ({
                                        ...prev,
                                        registration: !prev.registration
                                    }))
                                }}
                            >
                                <IconPencil size="1rem" stroke={1.5}/>
                            </ActionIcon>}
                        </Group>
                        <Button disabled={!showInput.registration} onClick={() => onSubmitClick('register')}>Update Code</Button>
                    </Stack>
                </Group>
                <Group>
                {profile?.role ==='admin' && <Stack>
                        <h1>Admin Code</h1>
                        <Group>
                            <TextInput
                                placeholder="Enter new Code"
                                label="Admin code"
                                required
                                disabled={!showInput.admin}
                                value={codes?.admin}
                                onChange={val => {
                                    setCodes(prev =>({ ...prev, admin: val.target.value}))
                                }}
                            />
                            <ActionIcon
                                onClick={() => {
                                    setShowInput(prev => ({
                                        ...prev,
                                        admin: !prev.admin
                                    }))
                                }}
                            >
                                <IconPencil size="1rem" stroke={1.5}/>
                            </ActionIcon>
                        </Group>
                        <Button onClick={() => onSubmitClick('admin')} disabled={!showInput.admin}>Update Code</Button>
                    </Stack>}
                </Group>
            </Stack>
        </Center>
    )
}