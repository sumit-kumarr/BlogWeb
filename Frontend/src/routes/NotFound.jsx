import React from 'react';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full '>

        <h1 className='text-4xl font-bold text-gray-700 mb-4'>404 - Page Not Found</h1>
        <img src="404Page.svg" alt="" className='w--97 h-96'/>
      
    </div>
  );
}

export default NotFound;
