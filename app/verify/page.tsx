"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Copy, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNftInfo } from "@/lib/blockfrost"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const [policyId, setPolicyId] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [nftData, setNftData] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const policyParam = searchParams.get("policyId")
    const txHashParam = searchParams.get("txHash")

    if (policyParam) setPolicyId(policyParam)
    if (txHashParam) setTxHash(txHashParam)

    if (policyParam && txHashParam) {
      fetchNftData(policyParam, txHashParam)
    }
  }, [searchParams])

  const fetchNftData = async (policy: string, hash: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getNftInfo(policy, hash)
      setNftData(response)
    } catch (err: any) {
      console.error("Error fetching NFT data:", err)
      setError(err.message || "Không thể lấy thông tin NFT. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (policyId && txHash) {
      fetchNftData(policyId, txHash)
    } else {
      setError("Please enter both Policy ID and Transaction Hash")
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-[#e8f7f1] flex flex-col items-center py-10 px-4">
      <Link href="/">
        <Button variant="ghost" >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to home page
        </Button>
      </Link>

      <div className="min-h-screen bg-[#e8f7f1] flex flex-col items-center py-10 px-4">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
        Welcome to Lms - Cardano
      </h1>
      <div className="w-full max-w-3xl border-t-4 border-teal-500 mb-12"></div>
        <Card>
          <CardHeader>
            <CardTitle>Verify NFT Certificate</CardTitle>
            <CardDescription>Enter Policy ID and Transaction Hash or scan QR code to verify certificate</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="policyId">Policy ID</Label>
                <Input
                  id="policyId"
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  placeholder="Enter Policy ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash</Label>
                <Input
                  id="txHash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter Transaction Hash"
                />
              </div>
              <Button className="w-full py-4 text-lg bg-gradient-to-r from-[#00b894] to-[#0984e3] text-white rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:hover:opacity-100 transition-all font-medium flex items-center justify-center shadow-md" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading && (
              <div className="mt-8 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            )}

            {!loading && nftData && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">NFT Information</h2>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Basic Information</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Policy ID</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(nftData.policyId, "policyId")}
                          className="h-6 px-2"
                        >
                          {copied === "policyId" ? "Copied!" : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">{nftData.policyId}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Asset Name</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(nftData.assetName, "assetName")}
                          className="h-6 px-2"
                        >
                          {copied === "assetName" ? "Copied!" : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">{nftData.assetName}</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Course Title</Label>
                      <div className="bg-muted p-3 rounded-md">{nftData.courseTitle}</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Mint Transaction</Label>
                      <div className="bg-muted p-3 rounded-md space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Transaction Hash:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(nftData.mintTransaction.txHash, "txHash")}
                            className="h-6 px-2"
                          >
                            {copied === "txHash" ? "Copied!" : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="font-mono text-sm break-all">{nftData.mintTransaction.txHash}</div>

                        <div className="pt-2">
                          <span className="font-semibold">Block:</span>
                          <span className="font-mono ml-2">{nftData.mintTransaction.block}</span>
                        </div>

                        <div>
                          <span className="font-semibold">Timestamp:</span>
                          <span className="ml-2">{formatDate(nftData.mintTransaction.timestamp * 1000)}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="pt-4">
                    <div className="space-y-2">
                      <Label>Metadata (CIP-721)</Label>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-96 font-mono">
                        {JSON.stringify(nftData.metadata, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
          {!loading && nftData && (
            <CardFooter className="flex justify-between">
           
              <a
                href={`https://preprod.cardanoscan.io/token/${nftData.policyId}${nftData.assetName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full py-4 text-lg bg-gradient-to-r from-[#00b894] to-[#0984e3] text-white rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:hover:opacity-100 transition-all font-medium flex items-center justify-center shadow-md">
                  View on Explorer
                  <ExternalLink/>
                </Button>
              </a>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
