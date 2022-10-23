import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
//: Page center element flex min-h-screen flex-col items-center justify-center py-2

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>NFT App Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold text-red-500">Welcome to NFT Drop APP</h1>

    </div>
  )
}

export default Home
