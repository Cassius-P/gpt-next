import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { auth, onAuthStateChanged, signOut, signInWithGoogle, connectWithEmailAndPassword, type UserCredential } from "@/utils/firebase";


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
}

export const AuthContext = createContext<any>({});
AuthContext.displayName = "AuthContext";

export const AuthProvider= ({children} : {children: ReactNode}) =>{


  const [user, setUser] = useState<UserType>({ email: null, uid: null });
  const [loading, setLoading] = useState<boolean>(true);

  

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          email: user.email,
          uid: user.uid,
        });
      } else {
        setUser({ email: null, uid: null });
      }
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);


  const signinGoogle = async () => {
    return await signInWithGoogle();
  };

  const connectEmailAndPassword = async (isSignIn: boolean, email: string, password: string) => {
    return await connectWithEmailAndPassword(isSignIn, email, password);
  };

  const signout = async () => {
    setUser({ email: null, uid: null });
    await signOut();
  };


  return <AuthContext.Provider value={{user, signinGoogle, connectEmailAndPassword, signout, loading}}>{loading ? null : children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);