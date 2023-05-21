import '@/styles/globals.css';
import type {AppProps} from 'next/app'

import Layout from '@/components/layouts/Layout'
import {AuthProvider} from '@/contexts/AuthContext';
import {ManagedUIContext} from '@/contexts/UIContext';
import {ConversationProvider} from '@/contexts/ConversationContext';
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