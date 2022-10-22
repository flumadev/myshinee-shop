interface IProduct {
    max_price: number
    post_title: string
    product_id: number
}

interface ICupom {
    ID: number,
    coupon_code: string,
    coupon_description: string,
    discount_type: "percent" | "fixed_cart" | "fixed_product",
    coupon_amount: string,
    date_expires: string
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
    cupomCode?: string
    cardData?: ICardData
}

interface ICardData {
    cardCVV: string
    cardExpire: string
    cardHolder: string
    cardNumber: string
    installments?: number
}
