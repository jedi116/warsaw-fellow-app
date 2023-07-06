import { Center, Button, Flex } from "@mantine/core"
import { useProfile } from "@/hooks/profile"
export default function Settings () {
    const {profile} = useProfile()
    return (
        <Center>
            <Flex direction='column' gap='xl'>
                <div>
                    Want to delete account and personal data ?
                    <Button style={{marginLeft:'10px'}} color="red">
                        Yes, delete account
                    </Button>
                </div>
                <div>
                    Reset Password ? 
                    <Button style={{marginLeft:'10px'}} color="green">
                        Yes, Reset
                    </Button>
                </div> 
                {
                    profile && profile.role !== 'admin' && (
                        <div>
                            Request Admin Access ? 
                            <Button style={{marginLeft:'10px'}} color="green">
                                Yes, request access
                            </Button>
                        </div>
                    )
                }
            </Flex>
        </Center>
    )
}