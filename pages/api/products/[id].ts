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

    const response = await axios.get(`${process.env.BASE_URL}/products`)


    if (response.status !== 200) {
        return res.status(422)
    }

    if (id === undefined) {
        return res.status(422).json({ message: 'You must provide the product ID' })
    }

    if (typeof id !== "string") {
        return res.status(422).json({ message: 'You must provide only one product ID' })

    }


    const product = response.data.filter((item: IProduct) => item.product_id == parseInt(id))
    return res.status(200).json(product)



}


