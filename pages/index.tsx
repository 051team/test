import Head from 'next/head'
import { Inter } from '@next/font/google'
import Homie from '../components/Homie'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Casa de papel</title>
        <meta name="description" content="Casa de papel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/casa.png" />
      </Head>
      <main>
        <Homie />
      </main>
    </>
  )
}
