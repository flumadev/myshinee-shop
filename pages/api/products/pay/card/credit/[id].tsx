// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios, { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../../../../../services/api.service'

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
    const data = await axios.get(`${process.env.BASE_URL}/products`)

    if (data.status !== 200) {
        res.status(500)
    }



    let response: Array<any> = await data.data.json();
    const product: IProduct = response.filter(item => item.product_id == id)[0]

    const formData: IFormValues = req.body
    let itemValueToPay = product.max_price * 100

    if (formData.cardData === undefined) {
        return res.status(422)
    }


    if (formData.cupomCode !== "") {
        const cupomResponseData = await axios.get(`${process.env.BASE_URL}/cupons/${formData.cupomCode}`)
        const cupomData: ICupom = cupomResponseData.data[0]
        console.log(formData);

        if (cupomData === undefined) {
            return res.status(422).json({ message: "cupom invalido" })
        }

        if (cupomData.discount_type === "percent") {
            const value = product.max_price * 100
            const discount = ((parseFloat(cupomData.coupon_amount) / 100) * value)
            itemValueToPay = value - discount;
        }
    }



    const customerObject = {
        "items": [
            {
                "amount": itemValueToPay,
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
                "payment_method": "debit_card",
                "debit_card": {
                    "statement_descriptor": "MyShinee",
                    "recurrence": false,
                    "installments": formData.cardData?.installments,
                    "card": {
                        "number": formData.cardData.cardNumber.replaceAll(" ", ""),
                        "holder_name": formData.cardData.cardHolder,
                        "exp_month": parseInt(formData.cardData.cardExpire.split("/")[0]),
                        "exp_year": parseInt(formData.cardData.cardExpire.split("/")[1]),
                        "cvv": formData.cardData.cardCVV
                    },
                }
            }
        ]
    }

    try {
        const pmResponse = await api.post('https://api.pagar.me/core/v5/orders', customerObject)
        return res.json(pmResponse.data)
    } catch (err) {

        const error = err as unknown as AxiosError
        console.log(error.response?.data);
        return res.status(error.response?.status ? error.response.status : 500).json(error.response?.data)


    }



}
