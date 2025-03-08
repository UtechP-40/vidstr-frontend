import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import {signIn,googleSignIn} from "../redux/features/user.slice"
// import {useNavigate} from "react-router-dom"
const SignIn = ({ onClose,showSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignIn = (e) => {
    e.preventDefault();
    // Add sign in logic here
    if(email&&password){
      dispatch(signIn({email,password}))
    }
  };

  const handleGoogleSignIn = () => {
    // Add Google sign in logic here
    dispatch(googleSignIn())
  };

  const handleSignUpClick = () => {
    onClose();
    // navigate("/signup");
    showSignUp()
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 w-full max-w-md relative shadow-lg border border-border">
        <button 
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-accent transition-colors hover:cursor-pointer"
          onClick={onClose}
        >
          <IoMdClose className="text-xl" />
        </button>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2 text-foreground">Sign in</h1>
          <p className="text-muted-foreground">Login using your Email Id
          </p>
        </div>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone"
              required
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-accent transition-colors text-foreground hover:cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors hover:cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground inline">Don't have an account? </p>
          <button 
            onClick={handleSignUpClick}
            className="text-primary hover:text-primary/80 transition-colors ml-1 hover:cursor-pointer"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;