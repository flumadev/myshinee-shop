// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "GET") {
        res.status(405).json({ message: 'Method Not Allowed' })
    }


    var con = mysql.createConnection({
        host: "ns1.fluma.com.br",
        user: "myshinee_shop",
        password: "Luis@081220",
        database: "myshinee_db"
    });


    con.connect(function (err) {
        if (err) if (err) return res.status(500).json(err);;
        con.query(`SELECT wp_wc_product_meta_lookup.product_id,wp_wc_product_meta_lookup.max_price , wp_posts.post_title FROM wp_wc_product_meta_lookup INNER JOIN  wp_posts ON ( wp_posts.ID = wp_wc_product_meta_lookup.product_id)`, function (err, result) {
            if (err) {
                console.log({ err });
                return res.status(500).json(err);
            }
            con.end()
            console.log({ err });
            console.log({ result });

            return res.status(200).json(result)
        });

    });

    return res.status(500)

}


