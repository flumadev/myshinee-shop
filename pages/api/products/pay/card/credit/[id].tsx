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



    let response: Array<any> = await data.data
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
        customer: {
            address: {
                country: 'BR',
                state: formData.state,
                city: formData.city,
                zip_code: formData.zip_code,
                line_1: `${formData.number},${formData.street},${formData.complement}`
            },
            phones: {
                home_phone: {
                    country_code: '55',
                    area_code: formData.phone.split(" ")[0].replace("(", "").replace(")", ""),
                    number: formData.phone.split(" ")[1].replace("-", "")
                }
            },
            name: formData.name,
            type: 'individual',
            email: formData.email,
            document: formData.cpf.replaceAll(".", "").replaceAll("-", ""),
            document_type: 'CPF'
        },
        items: [{ amount: itemValueToPay, description: product.post_title, quantity: 1, code: product.product_id }],
        payments: [
            {
                credit_card: {
                    card: {
                        redirect_url: "https://myshinee.com.br/obrigado-pela-compra/",
                        billing_address: {
                            line_1: `${formData.number},${formData.street},${formData.complement}`,
                            zip_code: formData.zip_code,
                            city: formData.city,
                            state: formData.state,
                            country: 'BR'
                        },
                        number: formData.cardData.cardNumber.replaceAll(" ", ""),
                        holder_name: formData.cardData.cardHolder,
                        exp_month: parseInt(formData.cardData.cardExpire.split("/")[0]),
                        exp_year: parseInt(formData.cardData.cardExpire.split("/")[1]),
                        holder_document: formData.cpf.replaceAll(".", "").replaceAll("-", ""),
                        cvv: formData.cardData.cardCVV
                    },
                    operation_type: 'auth_and_capture',
                    installments: formData.cardData.installments,
                    statement_descriptor: 'My Shinee'
                },
                payment_method: 'credit_card'
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




const options = {
    method: 'POST',
    url: 'https://api.pagar.me/core/v5/orders',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic c2tfdGVzdF9sOURLZWxOSE5ocnBZN1ZOOg=='
    },

};

axios
    .request(options)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.error(error);
    });