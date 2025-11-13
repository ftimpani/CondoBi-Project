import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="CondoBI + SíndicoAI - A primeira plataforma de gestão condominial com IA do Brasil" />
        <meta name="keywords" content="condominio, gestão, business intelligence, inteligência artificial, síndico, administradora" />
        <meta name="author" content="CondoBI" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CondoBI + SíndicoAI - Gestão Condominial Inteligente" />
        <meta property="og:description" content="A primeira plataforma de gestão condominial com IA do Brasil" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CondoBI + SíndicoAI" />
        <meta name="twitter:description" content="A primeira plataforma de gestão condominial com IA do Brasil" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <title>CondoBI + SíndicoAI - Gestão Condominial com IA</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
