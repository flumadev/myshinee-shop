import { decode } from "jsonwebtoken"
import { emails } from "./mail.service"




    interface User {
        name: string;
        picture: string;
        iss: string;
        aud: string;
        auth_time: number;
        user_id: string;
        sub: string;
        iat: number;
        exp: number;
        email: string;
        email_verified: boolean;
    }

    

async function checkLogin() {
   const savedUser = localStorage.getItem('@user:id')
   if (savedUser === null) {
        return null
   }
   const user = decode(savedUser) as User
    console.log(emails.includes(user.email));
   if (!emails.includes(user.email)) {
    console.error("Usuario invalido");
    localStorage.clear()
    return null
   }
   return true
}

export default checkLogin