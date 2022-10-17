// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../../../../services/api.service'

interface IProduct {
    max_price: number
    post_title: string
    product_id: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "POST") {
        res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { id } = req.query
    const data = await fetch(`${process.env.BASE_URL}/products`)

    if (data.status !== 200) {
        res.status(500)
    }

    let response: Array<any> = await data.json();
    const product: IProduct = response.filter(item => item.product_id == id)[0]

    const formData: IFormValues = req.body
    console.log(product.max_price * 100);


    const customerObject = {
        "items": [
            {
                "amount": product.max_price * 100,
                "description": product.post_title,
                "quantity": 1
            }
        ],
        "customer": {
            "name": formData.name,
            "email": formData.email,
            "document": formData.cpf.replaceAll(".", "").replaceAll("-", ""),
            "document_type": "CPF",
            "type": "individual",
            "phones": {
                "mobile_phone": {
                    "country_code": "55",
                    "number": formData.phone.split(" ")[1].replace("-", ""),
                    "area_code": formData.phone.split(" ")[0].replace("(", "").replace(")", "")
                }
            },
            "address": {
                "line_1": `${formData.number},${formData.street},${formData.complement}`,
                "zip_code": formData.zip_code,
                "city": formData.city,
                "state": formData.state,
                "country": "BR"
            }
        },
        "payments": [
            {
                "payment_method": "pix",
                "pix": {
                    "expires_in": "600",
                    "additional_information": [
                        {
                            "name": "MyShinee",
                            "value": "Kit MyShinee clareamento"
                        }
                    ]
                }
            }
        ]
    }

    const pmResponse = await api.post('https://api.pagar.me/core/v5/orders', customerObject)

    return res.json(pmResponse.data)



}


