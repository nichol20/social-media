import type { AppProps } from 'next/app'

import '../styles/globals.css'
import '../components/Header/style.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
