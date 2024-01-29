import Head from 'next/head'
import { Inter } from '@next/font/google'
import Homie from '../components/Homie'
import Wrapper from '../components/wrapper'
import Cases from '../components/cases'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Wrapper title="Casa de Papel">
        <Cases />
      </Wrapper>
    </>
  )
}
