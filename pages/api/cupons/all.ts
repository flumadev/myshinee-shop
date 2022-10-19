// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql'

export default async function handler(
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
        if (err) if (err) return res.status(500).json(err);
        con.query(`
        SELECT p.ID,
        p.post_title   AS coupon_code, 
        p.post_excerpt AS coupon_description, 
        Max(CASE WHEN pm.meta_key = 'discount_type'      AND  p.ID = pm.post_id THEN pm.meta_value END) AS discount_type,        
        Max(CASE WHEN pm.meta_key = 'coupon_amount'      AND  p.ID = pm.post_id THEN pm.meta_value END) AS coupon_amount,          
        Max(CASE WHEN pm.meta_key = 'date_expires'        AND  p.ID = pm.post_id THEN pm.meta_value END) AS date_expires                
 FROM   wp_posts AS p 
        INNER JOIN wp_postmeta AS pm ON  p.ID = pm.post_id 
 WHERE  p.post_type = 'shop_coupon' 
        AND p.post_status = 'publish' 
 GROUP  BY p.ID 
 ORDER  BY p.ID ASC;
        `, function (err, result) {
            if (err) return res.status(500).json(err);

            con.end()
            return res.status(200).json(result)
        });

    });

    return res.status(500)





}
