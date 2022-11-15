import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { fbauth } from "./firebase.service";
import { emails } from "./mail.service";


async function signInWithGoogle(): Promise<User | null> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(fbauth, provider)
          .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (!credential) {
              console.log(`credentials vazio`);
              return null;
            }
  
            const user = result.user as any;
            if (!emails.includes(user.email)) {
              console.error("Usuario invalido");
              return null
             }
            localStorage.setItem('@user:id', user.accessToken)
            return user;
          })
          .catch((error) => {
            console.log(error);
            return null;
          });
  }

  export default signInWithGoogle
