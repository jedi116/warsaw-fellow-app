'use client';

import React, { useEffect, useState } from "react"
import {CodesType} from '@/interface/common'
import CommonService from '../service/UI/common'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/service/UI/firebaseUiClient"
import { toast } from "react-toastify"
import { Attendance } from "@/interface/attendance"

export const useMounted = () => {
    const [mounted, setMounted] = React.useState<boolean>(false)
    React.useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
    }, [])
  
    return mounted
  }

export const useCodes = (originalCodes: CodesType) => {
  const [codes, setCodes] = useState<CodesType>({
    admin: '',
    registration: ''
  })
  const [user, loading, error] = useAuthState(auth)
  useEffect(() => {
    setCodes(originalCodes)
  }, [originalCodes])
  const getCodes = async () => {
    try {
      const adminCodes = await CommonService.getAdminCodes(user)
      const registrationCodes = await CommonService.getRegistrationCodes(user)
      if (adminCodes && registrationCodes) {
        setCodes({
          admin: adminCodes[0].value,
          registration: registrationCodes[0].value
        })
      } else {
        toast.error('Failed to load Codes')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load Codes')
    }
  }

  return {
    codes,
    getCodes,
    setCodes
  }
}

export const useAttendance = (date: string) => {
  const [attendance, setAttendance] = useState<Attendance>()
  const [newAttendance, setNewAttendance] = useState<Attendance>()
  useEffect(() => {
    loadAttendance()
  },[date])
  useEffect(() => {
    loadNewAttendance()
  },[])
  const loadAttendance = async () => {
    const response = await CommonService.getAttendanceByDate(date)
    setAttendance(response)
    
  }

  const loadNewAttendance = async () => {
    const response = await CommonService.getNewAttendance()
    setNewAttendance(response)
  }

  return {
    attendance,
    newAttendance,
    reloadAttendance: loadAttendance
  }
}
  