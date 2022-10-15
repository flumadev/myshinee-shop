// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "GET") {
        res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { id } = req.query

    console.log(id);

    const data = await fetch(`${process.env.BASE_URL}/products`)

    if (data.status === 200) {
        let response: Array<any> = await data.json();
        const product = response.filter(item => item.product_id == id)
        res.status(200).json(product)
    }

}


