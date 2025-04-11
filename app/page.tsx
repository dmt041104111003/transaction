"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { NFTModal } from "@/components/nft-modal"
import { fetchNFTData } from "@/lib/api"
import type { NFTData } from "@/lib/types"

export default function Home() {
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (policyId: string, txHash?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchNFTData(policyId, txHash)
      setNftData(data)
      setIsModalOpen(true)
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch NFT data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6f7f1] to-[#f0faf7] flex flex-col items-center">
      <div className="w-full max-w-6xl px-4 py-8">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
            Welcome to Lms - Cardano
          </h1>
          <div className="h-1 w-full max-w-3xl mx-auto mt-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {error && <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

        {nftData && <NFTModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} nftData={nftData} />}
      </div>
    </main>
  )
}
