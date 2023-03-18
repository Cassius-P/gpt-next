
import '@/styles/globals.css';
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import { Session } from 'inspector';
import { AuthProvider, useAuth } from '../components/auth/AuthContext';
import { ManagedUIContext, useUI } from '../components/UIContext';
import { useEffect } from 'react';


function MyApp({ Component, pageProps }: AppProps) {

 

  return (
    <AuthProvider>
      <ManagedUIContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <div id="portal">

        </div>
      </ManagedUIContext>
    </AuthProvider>
    
  )
}

export default MyApp