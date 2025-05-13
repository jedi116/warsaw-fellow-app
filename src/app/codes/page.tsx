'use client';

import { Center, Stack, Group, Button, ActionIcon, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import { IconPencil } from "@tabler/icons-react";
import { useCodes } from "@/hooks";
import { useLoginRedirect } from "@/hooks/user";
import { CodesType } from "@/interface/common";
import CommonService from "@/service/UI/common";
import { useProfile } from "@/hooks/profile";

export default function Codes() {
    useLoginRedirect();
    const [originalCodes, setOriginalCodes] = useState<CodesType | null>(null);
    const [showInput, setShowInput] = useState({
        registration: false,
        admin: false
    });
    
    const { profile } = useProfile();
    const { codes, getCodes, setCodes } = useCodes(originalCodes || { admin: '', registration: '' });
    
    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const adminCodes = await CommonService.getAdminCodesWClient();
                const registrationCodes = await CommonService.getRegistrationCodesWCilent();
                
                if (adminCodes && adminCodes.length > 0 && registrationCodes && registrationCodes.length > 0) {
                    setOriginalCodes({
                        admin: adminCodes[0].value,
                        registration: registrationCodes[0].value
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchCodes();
    }, []);
    
    const onSubmitClick = async (type: 'admin' | 'register') => {
        try {
            if (type === 'register') {
                await CommonService.updateCode(codes.registration, type);
            } else {
                await CommonService.updateCode(codes.admin, type);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setShowInput({
                registration: false,
                admin: false
            });
            setTimeout(() => getCodes(), 500);
        }
    };
    
    return (
        <Center>
            <Stack>
                <Button onClick={() => getCodes()}>Refresh</Button>
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
                                    setCodes(prev => ({ ...prev, registration: val.target.value }));
                                }}
                            />
                            {profile?.role === 'admin' && (
                                <ActionIcon
                                    onClick={() => {
                                        setShowInput(prev => ({
                                            ...prev,
                                            registration: !prev.registration
                                        }));
                                    }}
                                >
                                    <IconPencil size="1rem" stroke={1.5}/>
                                </ActionIcon>
                            )}
                        </Group>
                        <Button 
                            disabled={!showInput.registration} 
                            onClick={() => onSubmitClick('register')}
                        >
                            Update Code
                        </Button>
                    </Stack>
                </Group>
                <Group>
                    {profile?.role === 'admin' && (
                        <Stack>
                            <h1>Admin Code</h1>
                            <Group>
                                <TextInput
                                    placeholder="Enter new Code"
                                    label="Admin code"
                                    required
                                    disabled={!showInput.admin}
                                    value={codes?.admin}
                                    onChange={val => {
                                        setCodes(prev => ({ ...prev, admin: val.target.value }));
                                    }}
                                />
                                <ActionIcon
                                    onClick={() => {
                                        setShowInput(prev => ({
                                            ...prev,
                                            admin: !prev.admin
                                        }));
                                    }}
                                >
                                    <IconPencil size="1rem" stroke={1.5}/>
                                </ActionIcon>
                            </Group>
                            <Button 
                                onClick={() => onSubmitClick('admin')} 
                                disabled={!showInput.admin}
                            >
                                Update Code
                            </Button>
                        </Stack>
                    )}
                </Group>
            </Stack>
        </Center>
    );
}