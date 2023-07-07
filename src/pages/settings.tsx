import { Center, Button, Flex } from "@mantine/core"
import { useProfile } from "@/hooks/profile"
import ThemeToggle from "@/components/themeToggle"
import { useLoginRedirect } from "@/hooks/user"
export default function Settings () {
    const {profile} = useProfile()
    useLoginRedirect()
    return (
        <Center>
            <Flex direction='column' gap='xl'>
                <div>
                   Change Theme:  <ThemeToggle />
                </div>
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