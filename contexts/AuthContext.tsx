import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { auth, onAuthStateChanged, signOut, signInWithGoogle, connectWithEmailAndPassword, type UserCredential, onIdTokenChanged } from "@/utils/firebase";
import nookies from 'nookies';
import { refreshToken } from "firebase-admin/app";
import {ConversationContext, useConversation} from "@/contexts/ConversationContext";

export interface AuthState {
  authUser : UserCredential | null;
  loading: boolean;
  connectEmailAndPassword: Function;
  signinGoogle: Function;
  signOut: Function;
}

interface UserType {
  email: string | null;
  uid: string | null;
  token: string | null;
}

export const AuthContext = createContext<any>({});
AuthContext.displayName = "AuthContext";

export const AuthProvider= ({children} : {children: ReactNode}) =>{


  const [user, setUser] = useState<UserType | null>({ email: null, uid: null, token: null});
  const [loading, setLoading] = useState<boolean>(true);

  const { getConversations}  = useConversation()
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true)
      if (user) {
        user.getIdToken().then((token) => {
          setUser({
            email: user.email,
            uid: user.uid,
            token
          });
        });

        getConversations()

      } else {
        setUser({ email: null, uid: null, token: null});
      }


      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser({ email: null, uid: null, token: null});
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setUser({
          email: user.email,
          uid: user.uid,
          token : await user.getIdToken()
        });
        nookies.set(undefined, 'token', token, { path: '/' });
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      if (user && auth && auth.currentUser) await auth.currentUser.getIdToken(true);
      
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);


  const signinGoogle = async () => {
    return await signInWithGoogle();
  };

  const connectEmailAndPassword = async (isSignIn: boolean, email: string, password: string) => {
    return await connectWithEmailAndPassword(isSignIn, email, password);
  };

  const signout = async () => {
    setUser({ email: null, uid: null, token: null });
    await signOut();
  };


  return <AuthContext.Provider value={{user, signinGoogle, connectEmailAndPassword, signout, loading}}>{loading ? null : children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);