import { useState } from "react";
import Input from "../forms/Inputs";
import Button from "../button/Button";
import { useUI } from "@/contexts/UIContext";
import Image from 'next/image'
import { useAuth } from "@/contexts/AuthContext";

interface AuthFormProps {
  isSignIn: boolean;
}

export default function AuthForm({ isSignIn }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");

  const {setModalView, closeModal} = useUI()
  const {connectEmailAndPassword, signinGoogle} = useAuth()

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if(!isSignIn && password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    
    try{
      let result = await connectEmailAndPassword(isSignIn, email, password)
      if(!isSignIn) {
        //await sendVerifEmail();
        setModalView("CONFIRMED_REGISTER_VIEW");
      }
      else{
        closeModal();
        console.log("User",result.user)
      }

    }catch(error: any){
      console.error(error)
      setError(error);
    }
  };



  const handleGoogleAuth = async () => {
    try {
      const result = await signinGoogle();
      const user = result.user;
      if(user){
        closeModal();
      }else{
        setError("Something went wrong. Try again later");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtherAuth = () => {
    let otherView = isSignIn ? "REGISTER_VIEW" : "LOGIN_VIEW";
    setModalView(otherView);
  };

  const title = isSignIn ? "Login to your account" : "Create an account";
  const subtitle1 = isSignIn ? "Dont have account?" : "Already have an account?";
  const subtitle2 = isSignIn ? "Sign up here" : "Sign in here";
  const button = isSignIn ? "Sign in" : "Sign up";

  return (
    <form onSubmit={handleSubmit}>
      
            <p tabIndex={0} className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800 dark:text-white">{title}</p>
            <p tabIndex={0} className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500 dark:text-gray-300">{subtitle1}
              <a className="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none text-gray-800 dark:text-gray-100 cursor-pointer" onClick={handleOtherAuth}> {subtitle2}</a>
              </p>
            <button type="button" onClick={handleGoogleAuth} aria-label="Continue with google" role="button" className="dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10 hover:bg-black/5">
              <Image src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" width={30} height={30}/>
              <p className="text-base font-medium ml-4">Continue with Google</p>
            </button>
            
            <div className="w-full flex items-center justify-between py-5">
              <hr className="w-full bg-gray-400" />
              <p className="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
              <hr className="w-full bg-gray-400  " />
            </div>
            <div>
              <Input onChange={setEmail} type={"email"} name={"Email"} label={"Email"} color={'blue'} placeholder={"exemple@mail.com"}/>
            </div>
            <div className="mt-4 w-full">
              <Input onChange={setPassword} type={"password"} name={"password"} label={"Password"} color={'blue'} placeholder={"mypass123"}/>
            </div>

            {!isSignIn && (
              <div className="mt-4 w-full">
                <Input onChange={setPasswordConfirmation} type={"password"} name={"passwordConfirmation"} label={"Password confirmation"} color={'blue'} placeholder={"mypass123"}/>
              </div>
            )}

            {error && (
              <div className="py-2 w-full transition-all">
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button text={button} color={"blue"} type={'submit'}/>
            </div>
    </form>
  );
}