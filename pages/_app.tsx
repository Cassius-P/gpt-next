
import '@/styles/globals.css';
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import { Session } from 'inspector';
import { AuthProvider, useAuth } from '../components/auth/AuthContext';
import { ManagedUIContext, useUI } from '../components/UIContext';
import { useEffect } from 'react';


function MyApp({ Component, pageProps, session }: AppProps & {session: Session}) {

 

  return (
    <AuthProvider>
      <ManagedUIContext>
        <Layout>
          <Component {...pageProps} session={session} />
        </Layout>
        <div id="portal">

        </div>
      </ManagedUIContext>
    </AuthProvider>
    
  )
}

export default MyApp