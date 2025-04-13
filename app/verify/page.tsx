"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, Loader2, Search, Lock, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Blockfrost API key
const BLOCKFROST_API_KEY = "preprodwAoQrS3Nc0RhHqm8awt9yISNlW9Z6TW6"
const BLOCKFROST_BASE_URL = "https://cardano-preprod.blockfrost.io/api/v0"

interface NFTData {
  policyId: string
  assetName: string
  courseTitle: string
  metadata: any
  mintTransaction: {
    txHash: string
    blockHeight?: number
    blockTime?: number
  }
}

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const policyId = searchParams.get("policyId")
  const txHash = searchParams.get("txHash")

  // Use session storage to store verification data securely
  // This prevents sensitive data from being exposed in the URL after initial load
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nftData, setNftData] = useState<NFTData | null>(null)

  // Form state for manual checking
  const [manualPolicyId, setManualPolicyId] = useState("")
  const [manualTxHash, setManualTxHash] = useState("")

  useEffect(() => {
    // Check if we have parameters in the URL
    if (policyId && txHash) {
      // Store in session storage and remove from URL
      sessionStorage.setItem("verifyPolicyId", policyId)
      sessionStorage.setItem("verifyTxHash", txHash)

      // Clean the URL by removing the query parameters
      router.replace("/verify", { scroll: false })

      // Fetch data with the parameters
      fetchNFTData(policyId, txHash)
    } else {
      // Check if we have stored parameters
      const storedPolicyId = sessionStorage.getItem("verifyPolicyId")
      const storedTxHash = sessionStorage.getItem("verifyTxHash")

      if (storedPolicyId && storedTxHash) {
        fetchNFTData(storedPolicyId, storedTxHash)
      } else {
        // Reset state when no parameters are available
        setNftData(null)
        setError(null)
        setLoading(false)
      }
    }
  }, [policyId, txHash, router])

  const fetchNFTData = async (pId: string, tHash: string) => {
    if (!pId || !tHash) {
      setError("Missing policy ID or transaction hash")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1. Fetch transaction details
      console.log(`Fetching transaction details for hash: ${tHash}`)
      const txResponse = await fetch(`${BLOCKFROST_BASE_URL}/txs/${tHash}`, {
        headers: {
          project_id: BLOCKFROST_API_KEY,
          "Content-Type": "application/json",
        },
      })

      if (!txResponse.ok) {
        const errorText = await txResponse.text()
        throw new Error(`Failed to fetch transaction: ${txResponse.status} ${txResponse.statusText} - ${errorText}`)
      }

      const txData = await txResponse.json()
      console.log("Transaction data:", txData)

      // Create a basic NFT data structure with what we have so far
      const basicNftData: NFTData = {
        policyId: pId,
        assetName: "Unknown",
        courseTitle: "Unknown",
        metadata: {},
        mintTransaction: {
          txHash: tHash,
          blockHeight: txData.block_height,
          blockTime: txData.block_time,
        },
      }

      // 2. Fetch transaction metadata first (often contains the most useful NFT data)
      let txMetadata = null
      try {
        console.log(`Fetching transaction metadata for: ${tHash}`)
        const txMetadataResponse = await fetch(`${BLOCKFROST_BASE_URL}/txs/${tHash}/metadata`, {
          headers: {
            project_id: BLOCKFROST_API_KEY,
            "Content-Type": "application/json",
          },
        })

        if (txMetadataResponse.ok) {
          const metadataArray = await txMetadataResponse.json()
          console.log("Raw transaction metadata:", metadataArray)

          if (metadataArray && metadataArray.length > 0) {
            // Convert the array to an object for easier access
            txMetadata = metadataArray.reduce((acc: any, item: any) => {
              acc[item.label] = item.json_metadata || item.metadata
              return acc
            }, {})
            console.log("Processed transaction metadata:", txMetadata)
          }
        } else {
          console.log("No transaction metadata found")
        }
      } catch (txMetadataError) {
        console.error("Error fetching transaction metadata:", txMetadataError)
      }

      try {
        // 3. Search for assets by policy ID
        console.log(`Fetching assets for policy ID: ${pId}`)
        const assetsResponse = await fetch(`${BLOCKFROST_BASE_URL}/assets/policy/${pId}`, {
          headers: {
            project_id: BLOCKFROST_API_KEY,
            "Content-Type": "application/json",
          },
        })

        if (!assetsResponse.ok) {
          const errorText = await assetsResponse.text()
          console.error(
            `Failed to fetch assets by policy: ${assetsResponse.status} ${assetsResponse.statusText} - ${errorText}`,
          )

          // If we have transaction metadata, we can still try to extract NFT info
          if (txMetadata && txMetadata["721"]) {
            const nftData = extractNFTDataFromMetadata(txMetadata, pId, basicNftData)
            setNftData(nftData)
            return
          }

          setNftData(basicNftData)
          return
        }

        const assets = await assetsResponse.json()
        console.log("Assets by policy:", assets)

        if (!assets || assets.length === 0) {
          console.log(`No assets found with policy ID ${pId}`)

          // If we have transaction metadata, we can still try to extract NFT info
          if (txMetadata && txMetadata["721"]) {
            const nftData = extractNFTDataFromMetadata(txMetadata, pId, basicNftData)
            setNftData(nftData)
            return
          }

          setNftData(basicNftData)
          return
        }

        // 4. For each asset, check if it was minted in the specified transaction
        let assetDetails = null
        let assetMetadata = null

        // We'll check up to 15 assets to improve chances of finding the right one
        const assetsToCheck = assets.slice(0, 15)

        for (const asset of assetsToCheck) {
          console.log(`Checking asset: ${asset.asset}`)
          const assetResponse = await fetch(`${BLOCKFROST_BASE_URL}/assets/${asset.asset}`, {
            headers: {
              project_id: BLOCKFROST_API_KEY,
              "Content-Type": "application/json",
            },
          })

          if (!assetResponse.ok) {
            console.log(`Failed to fetch details for asset ${asset.asset}`)
            continue
          }

          const assetData = await assetResponse.json()
          console.log("Asset data:", assetData)

          // Check if this asset was minted in the specified transaction
          if (assetData.initial_mint_tx_hash === tHash) {
            console.log(`Found matching asset: ${asset.asset}`)
            assetDetails = assetData

            // Try to fetch asset metadata
            try {
              const assetMetadataResponse = await fetch(`${BLOCKFROST_BASE_URL}/assets/${asset.asset}/metadata`, {
                headers: {
                  project_id: BLOCKFROST_API_KEY,
                  "Content-Type": "application/json",
                },
              })

              if (assetMetadataResponse.ok) {
                assetMetadata = await assetMetadataResponse.json()
                console.log("Asset metadata:", assetMetadata)
              }
            } catch (metadataError) {
              console.error("Error fetching asset metadata:", metadataError)
            }

            break
          }
        }

        // Extract asset name from hex - handle this carefully
        let assetName = "Unknown"
        try {
          if (assetDetails && assetDetails.asset_name) {
            assetName = formatAssetName(assetDetails.asset_name)
            console.log(`Formatted asset name: ${assetName}`)
          } else if (assetDetails) {
            // If asset_name is missing, try to extract it from the asset identifier
            const fullAsset = assetDetails.asset || ""
            if (fullAsset.length > pId.length) {
              const hexName = fullAsset.substring(pId.length)
              assetName = formatAssetName(hexName)
              console.log(`Extracted asset name from asset ID: ${assetName}`)
            }
          } else if (txMetadata && txMetadata["721"] && txMetadata["721"][pId]) {
            // Try to extract from transaction metadata
            const assetKeys = Object.keys(txMetadata["721"][pId])
            if (assetKeys.length > 0) {
              const assetKey = assetKeys[0]
              assetName = assetKey
              console.log(`Extracted asset name from tx metadata: ${assetName}`)
            }
          }
        } catch (nameError) {
          console.error("Error formatting asset name:", nameError)
        }

        // Determine the course title with multiple fallbacks
        let courseTitle = "Unknown"
        let combinedMetadata = {}

        // First priority: Transaction metadata (721 standard)
        if (txMetadata && txMetadata["721"] && txMetadata["721"][pId]) {
          const assetKeys = Object.keys(txMetadata["721"][pId])
          if (assetKeys.length > 0) {
            const assetKey = assetKeys[0]
            const assetData = txMetadata["721"][pId][assetKey]

            if (assetData) {
              if (assetData.name) {
                courseTitle = assetData.name
                console.log(`Found course title in tx metadata: ${courseTitle}`)
              }

              // Add this metadata to our combined metadata
              combinedMetadata = { ...combinedMetadata, ...assetData }
            }
          }
        }

        // Second priority: Asset metadata
        if (courseTitle === "Unknown" && assetMetadata && assetMetadata.name) {
          courseTitle = assetMetadata.name
          console.log(`Found course title in asset metadata: ${courseTitle}`)
          combinedMetadata = { ...combinedMetadata, ...assetMetadata }
        }

        // Third priority: On-chain metadata
        if (
          courseTitle === "Unknown" &&
          assetDetails &&
          assetDetails.onchain_metadata &&
          assetDetails.onchain_metadata.name
        ) {
          courseTitle = assetDetails.onchain_metadata.name
          console.log(`Found course title in onchain metadata: ${courseTitle}`)
          combinedMetadata = { ...combinedMetadata, ...assetDetails.onchain_metadata }
        }

        // Fourth priority: Use asset name
        if (courseTitle === "Unknown" && assetName !== "Unknown") {
          courseTitle = assetName
          console.log(`Using asset name as course title: ${courseTitle}`)
        }

        // Combine all metadata sources
        if (assetDetails && assetDetails.onchain_metadata) {
          combinedMetadata = { ...combinedMetadata, ...assetDetails.onchain_metadata }
        }

        if (assetMetadata) {
          combinedMetadata = { ...combinedMetadata, ...assetMetadata }
        }

        if (txMetadata) {
          combinedMetadata = {
            ...combinedMetadata,
            transaction_metadata: txMetadata,
          }
        }

        // Format the NFT data according to the requested structure
        const formattedNFTData: NFTData = {
          policyId: pId,
          assetName: assetName,
          courseTitle: courseTitle,
          metadata: combinedMetadata,
          mintTransaction: {
            txHash: tHash,
            blockHeight: txData.block_height,
            blockTime: txData.block_time,
          },
        }

        setNftData(formattedNFTData)
      } catch (assetError) {
        console.error("Error processing asset data:", assetError)

        // If we have transaction metadata, we can still try to extract NFT info
        if (txMetadata && txMetadata["721"]) {
          const nftData = extractNFTDataFromMetadata(txMetadata, pId, basicNftData)
          setNftData(nftData)
          return
        }

        // If we encounter an error with asset data, still show the transaction info
        setNftData(basicNftData)
      }
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract NFT data from transaction metadata
  const extractNFTDataFromMetadata = (txMetadata: any, policyId: string, basicData: NFTData): NFTData => {
    if (!txMetadata["721"] || !txMetadata["721"][policyId]) {
      return basicData
    }

    const policyData = txMetadata["721"][policyId]
    const assetKeys = Object.keys(policyData)

    if (assetKeys.length === 0) {
      return basicData
    }

    const assetKey = assetKeys[0]
    const assetData = policyData[assetKey]

    return {
      ...basicData,
      assetName: assetKey,
      courseTitle: assetData.name || assetKey,
      metadata: { ...assetData, transaction_metadata: txMetadata },
    }
  }

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualPolicyId && manualTxHash) {
      // Store in session storage instead of URL
      sessionStorage.setItem("verifyPolicyId", manualPolicyId)
      sessionStorage.setItem("verifyTxHash", manualTxHash)

      // Fetch data directly without changing URL
      fetchNFTData(manualPolicyId, manualTxHash)
    }
  }

  const formatAssetName = (hexName: string) => {
    if (!hexName) return "Unknown"

    try {
      // First check if it's actually hex
      if (/^[0-9A-Fa-f]+$/.test(hexName)) {
        return Buffer.from(hexName, "hex").toString()
      } else {
        // If not hex, return as is
        return hexName
      }
    } catch (e) {
      console.error("Error formatting asset name:", e)
      return hexName
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Manual verification form */}
        <Card className="border-secondary/20">
          <CardHeader className="bg-accent rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Lock className="h-5 w-5 text-secondary" />
              Verify Certificate
            </CardTitle>
            <CardDescription>Enter the Policy ID and Transaction Hash to verify an NFT certificate</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleManualCheck} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyId">Policy ID</Label>
                  <Input
                    id="policyId"
                    placeholder="Enter Policy ID"
                    value={manualPolicyId}
                    onChange={(e) => setManualPolicyId(e.target.value)}
                    required
                    className="border-secondary/20 focus-visible:ring-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="txHash">Transaction Hash</Label>
                  <Input
                    id="txHash"
                    placeholder="Enter Transaction Hash"
                    value={manualTxHash}
                    onChange={(e) => setManualTxHash(e.target.value)}
                    required
                    className="border-secondary/20 focus-visible:ring-secondary"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-4 w-4" />
                Verify
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* NFT verification results */}
        <Card className="border-secondary/20">
          <CardHeader className="bg-accent rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Award className="h-6 w-6 text-primary" />
              Certificate Verification Results
            </CardTitle>
            <CardDescription>
              {nftData
                ? `Verifying certificate with Policy ID: ${nftData.policyId.substring(0, 8)}...`
                : "Enter details above or scan a QR code to verify a certificate"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Loading certificate data...</p>
              </div>
            ) : error ? (
              <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            ) : nftData ? (
              <Tabs defaultValue="details">
                <TabsList className="mb-4 bg-accent">
                  <TabsTrigger value="details" className="data-[state=active]:bg-white">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="metadata" className="data-[state=active]:bg-white">
                    Metadata
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-secondary">Policy ID</h3>
                      <p className="font-mono text-xs break-all">{nftData.policyId}</p>
                    </div>

                    {/* <div className="space-y-2">
                      <h3 className="text-sm font-medium text-secondary">Asset Name</h3>
                      <p>{nftData.assetName}</p>
                    </div> */}

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-secondary">Course Title</h3>
                      <p className="font-medium">{nftData.courseTitle}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-secondary">Transaction Hash</h3>
                      <p className="font-mono text-xs break-all">{nftData.mintTransaction.txHash}</p>
                    </div>
                  </div>

                  {nftData.mintTransaction.blockTime && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-secondary">Mint Date</h3>
                      <p>{formatDate(nftData.mintTransaction.blockTime)}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="metadata">
                  {Object.keys(nftData.metadata).length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent rounded-md">
                        <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-[400px]">
                          {JSON.stringify(nftData.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No metadata available for this certificate.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No certificate data to display. Please enter verification details or scan a QR code.
              </div>
            )}
          </CardContent>

          {nftData && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-secondary/20 hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <a
                href={`https://preprod.cardanoscan.io/transaction/${nftData.mintTransaction.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-secondary/20 hover:bg-accent">
                  View on Explorer
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
