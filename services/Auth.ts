import { auth, signInWithGoogle, connectWithEmailandPassword   } from '../utils/firebase';


const logout = async () => {
    return await auth.signOut();
}



const connect = async (isSignin: boolean, email: string, password: string) => {
   return await 
}

const googleConnect = async () => {
    let user = signInWithGoogle();

}
