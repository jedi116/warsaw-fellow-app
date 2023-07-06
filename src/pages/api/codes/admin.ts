// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import common from '@/service/codes'
import { Code } from '@/interface/common'
import { authenticate } from '@/helpers'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const method = req.method
    switch(method) {
        case 'GET':
            return  authenticate(req,res,getHandler)
        default:
            return res.status(405)
    }
    
}

const getHandler =  async (  
    req: NextApiRequest,
    res: NextApiResponse<Code [] | {error: any}>
  ) => {
    try {
        const data = await common.getAdminCodes()
        res.status(200).json(data || [])
    } catch (error) {
        res.status(500).json({error: error})
    }
}
