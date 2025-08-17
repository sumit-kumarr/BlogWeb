import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div className='flex items-center justify-center p-7 m-4 h-[cal[100vh - 88px]]'>
      <SignUp signInUrl='/login' />
    </div>
  );
}

export default Register;
