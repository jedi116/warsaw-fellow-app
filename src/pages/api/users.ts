// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticate } from '@/helpers'
import UserService from '@/service/User'
import { User } from '@/interface/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    switch(req.method) {
        case 'GET':
            return authenticate(req,res,getHandler)
        case 'POST':
            return authenticate(req,res,postHandler)
        case 'PUT':
            return authenticate(req,res,putHandler)    
        case 'PUT':
            return authenticate(req,res,putHandler)    
        case 'DELETE':
            return authenticate(req,res,deleteHandler)          
        default:
            res.status(405)    

    }
    
}

const getHandler =  async (  
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
    try {
        res.status(200).json({response: 'its working'})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const postHandler = async (  
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
    try {
        const userData = JSON.parse(req.body) as User
        console.log(userData)
        await UserService.createUser({
            ...userData,
            password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || ''
        })
        res.status(200).send('success')
    } catch (error: any) {  
        console.log(error.stack)
        res.status(500).json({response: error.message})
    }
}

const putHandler = async (  
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
    try {
        const userData = JSON.parse(req.body) as User
        console.log(userData)
        await UserService.updateUser({
            ...userData,
        })
        res.status(200).send('sucess')
    } catch (error: any) {
        console.log(error)
        res.status(500).json({response: error.messgae})
    }
}

const deleteHandler = async (  
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
    try {
        const userData = JSON.parse(req.body) as {uid: string}
        await UserService.deleteUser(userData.uid)
        res.status(200).send('sucess')
    } catch (error: any) {
        console.log(error)
        res.status(500).json({response: error.messgae})
    }
}