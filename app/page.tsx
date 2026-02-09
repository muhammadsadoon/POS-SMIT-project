import useAuthRedux from '@/utils/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const Home = () => {
  const { isAuthenticaion } = useAuthRedux();

  return (
    <div>
      <h1>Home page</h1>
    </div>
  )
}

export default Home;