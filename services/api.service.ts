import axios from "axios";

const api = axios.create({
    url: 'https://api.pagar.me/core/v5/orders',
    headers: {
        'Authorization': 'Basic c2tfdGVzdF9sOURLZWxOSE5ocnBZN1ZOOg==',
        'Content-Type': 'application/json'
    },
});

export default api