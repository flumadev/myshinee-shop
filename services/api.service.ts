import axios from "axios";

const auth = btoa(process.env.AUTH ? `${process.env.AUTH}:` : "")

const api = axios.create({
    url: 'https://api.pagar.me/core/v5/orders',
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
    },
});

export default api