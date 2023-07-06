import React from "react"
import { useMounted } from "."
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { toast } from "react-toastify"
import { useRouter } from 'next/router'
export const useLoginRedirect = () => {
    const mounted = useMounted()
    const [user, loading, error] = useAuthState(auth)
    const router = useRouter()
    React.useEffect(() => {
      if (!user && mounted && !loading) {
        toast.warning('Needs Login to access this page')
        router.push('/auth/login')
      }
    }, [user, mounted, loading])
}
