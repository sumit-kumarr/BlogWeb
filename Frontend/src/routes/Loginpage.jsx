import React from 'react';
import { SignIn } from '@clerk/clerk-react'



const Loginpage = () => {
  return (
    <div className='flex items-center p-4 justify-center m-4 h-[cal[100vh - 88px]]'>
      <SignIn signUpUrl='/register'/>
    </div>
  );
}

export default Loginpage;
