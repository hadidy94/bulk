import '@/styles/globals.scss';
import 'antd/dist/reset.css';
import { ReactElement, ReactNode, useState } from 'react';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Layout from '@/components/Layout/Layout';
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { Button, ConfigProvider } from 'antd';

import { appWithTranslation } from 'next-i18next'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}



function App({ Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) {

  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)
  const layoutContainer = getLayout(<Component {...pageProps} />)


  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#d72435',
            borderRadius: 2,
          },
          components: {
            Button: {
              borderRadius: 2,
            },
          },
        }}>
          {layoutContainer}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            pauseOnVisibilityChange
            closeOnClick
            pauseOnHover
          />
        </ConfigProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App);