import '@/styles/globals.css';
import type {AppProps} from 'next/app'

import Layout from '@/components/Layout'
import {AuthProvider} from '@/components/auth/AuthContext';
import {ManagedUIContext} from '@/components/UIContext';
import {ConversationProvider} from '@/components/utils/ConversationContext';
import {KeyboardHandler} from "@/components/utils/KeyboardHandler";


function MyApp({Component, pageProps}: AppProps) {


    return (

        <ConversationProvider>
            <AuthProvider>
                <ManagedUIContext>
                    <KeyboardHandler>
                        <Layout>
                                <Component {...pageProps} />
                        </Layout>
                        <div id="portal">

                        </div>
                    </KeyboardHandler>
                </ManagedUIContext>
            </AuthProvider>
        </ConversationProvider>

    )
}

export default MyApp