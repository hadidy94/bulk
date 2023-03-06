import type { ReactElement } from 'react'
import AuthLayout from '../components/Layout/AuthLayout';
import AuthForm from '../components/Auth/AuthForm';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next'



const Login = () => {
  return <AuthForm />
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>{page}</AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Login