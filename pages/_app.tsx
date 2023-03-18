
import '../styles/globals.css';
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import { Session } from 'inspector';


function MyApp({ Component, pageProps, session }: AppProps & {session: Session}) {
  return (
    <Layout>
      <Component {...pageProps} session={session} />
    </Layout>
  )
}

export default MyApp