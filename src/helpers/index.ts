import type { NextApiRequest, NextApiResponse } from 'next'
import User from '@/service/User'
import { Code } from '@/interface/common'
export const authenticate = async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const token = req.headers.authorization?.split(' ')[1]
    console.log(req.headers.authorization)
    const isValid = await User.isTokenValid(token as string)
    if (isValid) {
       return next(req,res)
    } 
    res.status(401).json({ message: 'Token Invalid.' })
}

export const sortCodesOnCreateTime = (codes: Code []) => {
    return codes.sort((a, b) => {
        if (a.createTime.seconds > b.createTime.seconds) {
          return -1
        }
        if (a.createTime.seconds < b.createTime.seconds) {
            return 1
        }
        return 0
    })
}