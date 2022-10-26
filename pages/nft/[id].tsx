import { useAddress, useDisconnect, useMetamask, useContract } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  collection: Collection
}

function NFTDropPage({collection}: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [priceInEth, setPriceInEth] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const nftDrop = useContract(collection.address, "nft-drop").contract;

  //: Auth  
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  //: --->

  useEffect(() => {
    if(!nftDrop) return;
  
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }
    fetchPrice()
  }, [nftDrop])
  
  useEffect(() => {
    if(!nftDrop) return;
  
    const fetchNftDropData = async () => {
      setLoading(true);

      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setLoading(false);
    }

    fetchNftDropData()
  }, [nftDrop])

  const mintNft = () => {
    if(!nftDrop || !address) return;

    const quantity = 1; //: Maximum NFTs to claim

    setLoading(true);
    const notification = toast.loading("Minting...", {
      style: {
        background: "#d8f3dc",
        color: "#2c6e49",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      }
    })

    nftDrop.claimTo(address, quantity).then(async (tx) => {
      const receipt = tx[0].receipt //: Receipt transition
      const claimedTokenId = tx[0].id //: Id of the NFT to claim
      const claimedNFT = await tx[0].data() //: Option get NFT metadata

      toast("You Successfully Minted!", {
        duration: 5000,
        style: {
          background: "linear-gradient(90deg, hsla(289, 87%, 63%, 1) 0%, hsla(34, 66%, 61%, 1) 100%)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "14px",
          padding: "20px",
        }
      })

      console.log(receipt)
      console.log(claimedTokenId)
      console.log(claimedNFT)
    }).catch(err => {
      console.log(err);
      toast("Whooops... Insufficient funds or something went wrong!", {
        style: {
          background: "#e5383b",
          color: "white",
          fontWeight: "bolder",
          fontSize: "14px",
          padding: "20px",
        }
      }) 
    }).finally(() => {
      setLoading(false);
      toast.dismiss(notification);
    })
  }
  
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
      <div>
        <Toaster position="top-left" />
      </div>
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="mt-2 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 p-2 lg:mt-0">
            <img
              src={urlFor(collection.previewImage).url()}
              className="w-32 rounded-xl object-cover lg:h-80 md:w-56 lg:w-72" 
              alt="monkey APE King"
            />
          </div>
        <div className=" space-y-2 p-5 text-center">
          <h1 className="text-2xl lg:text-[2rem] font-bold text-white">
            {collection.nftCollectionName}
          </h1>
          <h2 className="text-[1rem] md:text-xl text-gray-300">
            {collection.description}
          </h2>
        </div>
      </div>
      </div>
   
      <div className="flex flex-1 flex-col lg:p-12 md:p-10 p-6 lg:col-span-6">

      <header className="flex items-center justify-between">
        <Link href={`/`}>
        <h1 className="w-44 cursor-pointer md:text-2xl text-[1.rem] font-extralight sm:w-80">
          The{' '}
          <span className="font-extrabold underline decoration-pink-600/50">
            BENDEVWEB
          </span>{' '} 
          NFT Market Place
        </h1>
        </Link>

        <button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white md:px-7 md:py-2 md:text-base">
          {address ? "Sign Out" : "Sign In"}
        </button>
      </header>

      <hr className="my-2 border" />
      {address && <p className="text-center text-sm text-rose-500">You are logged with wallet {address.substring(0,5)}...{address.substring(address.length - 5)}</p>}

      {/* Main Content  */}
      <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
      <img className="object-contain sm:pb-4 pb-2 lg:h-72 w-80" src={urlFor(collection.mainImage).url()} alt="multiple Bored monkey" />
      <h1 className="text-lg font-bold md:text-3xl lg:text-[2.rem] lg:font-extrabold">{collection.title}</h1>

      {loading ? (
        <p className="pt-2 text-[1rem] text-pink-600/90 animate-pulse">
          Loading Supply Count...🐵 
        </p>
      ): (
      <p className="pt-2 text-[1rem] text-pink-600/90">
        {claimedSupply} /{totalSupply?.toString()} NFT's Claimed
      </p>
      )}

      {loading && (
        <img className="h-40 w-40 object-contain" src={"https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"} alt="loader animation" />
      )}
      </div>

      <button
        onClick={mintNft} 
        disabled={loading || claimedSupply === totalSupply?.toNumber() || !address} className="h-12 font-bold md:h-14 w-full rounded-full text-white bg-gradient-to-br from-purple-500 to-orange-500 mt-5 md:mt-10 mb-1 outline-none disabled:bg-gray-400"
      >
        {loading ? (
          <>Loading</>
        ) : claimedSupply === totalSupply?.toNumber() ? (
          <>SOLD OUT</>
        ) : !address ? (
          <>Sign in to Mint</>
        ) : (
          <span className="font-bold">Mint NTF ({priceInEth} ETH)</span>
        )}
      </button>

      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0] {
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if(!collection) {
    return {
      notFound: true,
    }
  };

  return {
    props: {
      collection
    }
  }
}