// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "GET") {
        res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { id } = req.query

    const response = await axios.get(`${process.env.BASE_URL}/cupons/all`)

    

    if (response.status !== 200) {
        return res.status(422)
    }

    if (id === undefined) {
        return res.status(422).json({ message: 'You must provide the cupom ID' })
    }

    if (typeof id !== "string") {
        return res.status(422).json({ message: 'You must provide only one cupom ID' })

    }


    const cupom = response.data.filter((item: ICupom) => item.coupon_code == id.toUpperCase().replaceAll(" ", ""))
    
    return res.status(200).json(cupom)



}


