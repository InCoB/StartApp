import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { DeepgramContextProvider } from '../lib/contexts/DeepgramContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DeepgramContextProvider>
        <Component {...pageProps} />
      </DeepgramContextProvider>
    </ThemeProvider>
  )
}

export default MyApp