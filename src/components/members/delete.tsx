import { useContext } from "react"
import { MemberContext } from "@/context/MemberContext"
import { Button } from "@mantine/core"
import UserService from "@/service/UI/user-ui"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/service/UI/firebaseUiClient"
export default function Delete () {

    const {closeModal, selectedMember} = useContext(MemberContext)
    const [user, loading, error] = useAuthState(auth)
    const onDelete = async () => {
        await UserService.deleteUser(selectedMember?.uid || '', user)
        closeModal()
    }
    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <span> Are you sure you want to delete user</span>
            <div style={{display:'flex', flexDirection:'row'}}>
                <Button style={{margin:'10px'}} onClick={onDelete}>Yes</Button>
                <Button style={{margin:'10px'}} onClick={closeModal}>No</Button>
            </div>
        </div>
    )
}