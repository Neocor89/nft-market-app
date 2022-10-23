// import Image from 'next/image'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
function NFTDropPage() {

  //: Auth  
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  //: --->

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="mt-2 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 p-2 lg:mt-0">
            <img
              src="https://res.cloudinary.com/dwoifuutn/image/upload/v1666529141/bored-king_yksqps.png"
              className="w-32 rounded-xl object-cover lg:h-80 md:w-56 lg:w-72" alt="monkey APE King"
            />
          </div>
        <div className=" space-y-2 p-5 text-center">
          <h1 className="text-2xl lg:text-[2rem] font-bold text-white">BENDEVWEB Apes</h1>
          <h2 className="text-[1rem] md:text-xl text-gray-300">A collection of BENDEVWEB who live & breathe React</h2>
        </div>
      </div>
      </div>
   
      <div className="flex flex-1 flex-col lg:p-12 md:p-10 p-6 lg:col-span-6">
      {/*  Header  */}
      <header className="flex items-center justify-between">
        <h1 className="w-44 cursor-pointer md:text-2xl text-[1.rem] font-extralight sm:w-80">
          The{' '}
          <span className="font-extrabold underline decoration-pink-600/50">
            BENDEVWEB
          </span>{' '} 
          NFT Market Place
        </h1>
        <button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white md:px-7 md:py-2 md:text-base">
          {address ? "Sign Out" : "Sign In"}
        </button>
      </header>

      <hr className="my-2 border" />
      {address && <p className="text-center text-sm text-rose-500">yYou are logged with wallet {address.substring(0,5)}...{address.substring(address.length - 5)}</p>}

      {/* Main Content  */}
      <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
      <img className="object-contain pb-10 lg:h-72 w-80" src="https://res.cloudinary.com/dwoifuutn/image/upload/v1666536960/bored-landing-page_jgaklg.png" alt="multiple Bored monkey" />
      <h1 className=" text-lg font-bold md:text-3xl lg:text-[2.rem] lg:font-extrabold">The BENDEVWEB Ape Coding Club
      NFT Project</h1>
      <p className="pt-2 text-[1rem] text-pink-600/90">13 /21 NFT's Claimed</p>
      </div>

      <button className="h-12 font-bold md:h-16 w-full rounded-full text-white bg-gradient-to-br from-purple-500 to-orange-500 mt-5 md:mt-10 mb-1 outline-none">Mint NTF (0.01 ETH)</button>

      </div>
    </div>
  )
}

export default NFTDropPage