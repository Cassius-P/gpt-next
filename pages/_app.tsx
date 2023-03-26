import '@/styles/globals.css';
import type {AppProps} from 'next/app'

import Layout from '@/components/Layout'
import {AuthProvider} from '@/components/auth/AuthContext';
import {ManagedUIContext} from '@/components/UIContext';
import {ConversationProvider} from '@/components/utils/ConversationContext';
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "@/components/dev";


function MyApp({Component, pageProps}: AppProps) {


    return (

        <ConversationProvider>
            <AuthProvider>
                <ManagedUIContext>
                    <Layout>
                        <DevSupport ComponentPreviews={ComponentPreviews}
                                    useInitialHook={useInitial}
                        >
                            <Component {...pageProps} />
                        </DevSupport>
                    </Layout>
                    <div id="portal">

                    </div>
                </ManagedUIContext>
            </AuthProvider>
        </ConversationProvider>

    )
}

export default MyApp