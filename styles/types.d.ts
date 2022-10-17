interface IProduct {
    max_price: number
    post_title: string
    product_id: number
}


interface IFormValues {
    cpf: string
    phone: string
    name: string
    email: string
    zip_code: string
    street: string
    number: string
    district: string
    complement?: string
    city: string
    state: string
}

interface IPix {
    "id": string,
    "name": string,
    "email": string,
    "document": "18590537773",
    "document_type": "cpf",
    "type": "individual",
    "delinquent": false,
    "address": {
        "id": "addr_k0D3mb4uzu5RPlWZ",
        "line_1": "85,Rua Engenheiro Jacinto Lameira Filho,undefined",
        "zip_code": "27511-630",
        "city": "Resende",
        "state": "RJ",
        "country": "BR",
        "status": "active",
        "created_at": "2022-10-16T16:47:48Z",
        "updated_at": "2022-10-16T16:47:48Z"
    },
    "created_at": "2022-10-13T12:46:57Z",
    "updated_at": "2022-10-16T16:47:48Z",
    "phones": {
        "mobile_phone": {
            "country_code": "55",
            "number": "936185656",
            "area_code": "21"
        }
    }
}