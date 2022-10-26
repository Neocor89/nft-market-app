import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { sanityClient, urlFor } from '../sanity';
import { Collection } from '../typings';

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-orange-500 mx-auto flex min-h-screen max-w7xl flex-col py-16 px-6 sm:px-10 2xl:px-0">
      <Head>
        <title>NFT App Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-5 cursor-pointer sm:text-3xl text-md text-[1.rem] font-extralight">
          The{' '}
          <span className="font-extrabold underline decoration-white">
            BENDEVWEB
          </span>{' '} 
          NFT Market Place
        </h1>

        <main className="bg-slate-100 p-6 lg:p-10 shadow-xl shadow-rose-300/20">
          <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {collections.map(collection => (
              <Link href={`/nft/${collection.slug.current}`}>
              <div className="flex flex-col cursor-pointer items-center transition-all duration-200 hover:scale-105">
                <img 
                  className="h-50 lg:h-56 w-80 rounded-2xl object-cover mb-2" 
                  src={urlFor(collection.mainImage).url()} 
                  alt="BENDEVWEB image collection" />

                <div>
                  {/* Adding text-center to h1 & h2 for mobile screen devices */}
                  <h2 className="text-[0.9rem] lg:text-xl font-semibold">{collection.title}</h2>
                  <p className="mt-2 text-sm text-rose-600">{collection.description}</p>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"] {
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
    asset
  },
  previewImage {
    asset
  },
  slug {
    current
  },
  creator-> {
    _id,
    name,
    address,
    slug {
    current
  },
  },
  }`

  const collections = await sanityClient.fetch(query);
  

  return {
    props: {
      collections
    }
  }
  
}