
import '@/styles/globals.css';
import type { AppProps } from 'next/app'

import Layout from '@/components/Layout'
import { AuthProvider } from '@/components/auth/AuthContext';
import { ManagedUIContext } from '@/components/UIContext';
import { ConversationProvider } from '@/components/utils/ConversationContext';


function MyApp({ Component, pageProps }: AppProps) {



  return (
    <AuthProvider>
      <ManagedUIContext>
        <ConversationProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ConversationProvider>
        <div id="portal">

        </div>
      </ManagedUIContext>
    </AuthProvider>

  )
}

export default MyApp