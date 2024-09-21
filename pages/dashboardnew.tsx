import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import {useFundWallet} from '@privy-io/react-auth';
import Head from "next/head";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}




export default function DashboardPage() {
  const [verifyResult, setVerifyResult] = useState();
  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  const { fundWallet } = useFundWallet();
  const fundWalletHook = useFundWallet();
  console.log("fundWalletHook:", fundWalletHook); // Debug log



  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const handleFundWallet = async () => {
    if (user?.wallet?.address) {
      try {
        await fundWallet(user.wallet.address);
        console.log("Wallet funded successfully");
      } catch (error) {
        console.error("Error funding wallet:", error);
      }
    } else {
      console.error("No wallet address found for the user.");
    }
  };
  

  return (
    <>
      <Head>
        <title>Mint Your Pet Friend</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
          <div className="mb-6">
            <Image
              src="/logos/petfriends.png"  // Replace with the actual path to your PNG image
              alt="Pet Friend Logo"
              width={150}
              height={150}
              className="mx-auto w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Mint your first pet friend and start playing</h1>
          <button
            onClick={handleFundWallet}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out text-sm sm:text-base"
          >
            Fund My Wallet
          </button>
        
        </div>
      </main>
    </>
  );
}