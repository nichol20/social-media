import type { AppProps } from 'next/app'

import { AuthProvider } from '../Contexts/AuthContext'

import '../styles/globals.css'
import '../styles/login.css'
import '../styles/register.css'
import '../styles/settings.css'
import '../styles/userpage.css'

import '../components/UserAvatar/style.css'
import '../components/Feed/style.css'
import '../components/NewPostInput/style.css'
import '../components/Post/style.css'
import '../components/MainHeader/style.css'
import '../components/FeelingsPicker/style.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
