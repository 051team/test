import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {SessionProvider} from 'next-auth/react'
import { bank } from "../redux/databank";
import { Provider } from 'react-redux';



export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return    ( 
    <Provider store={bank}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </Provider>
  )
}
