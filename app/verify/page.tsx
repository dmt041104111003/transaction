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
      // Trong môi trường thực tế, bạn sẽ gọi API của mình ở đây
      // Đây là mô phỏng để hiển thị dữ liệu mẫu
      const response = await simulateFetchNftData(policy, hash)
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
      setError("Vui lòng nhập cả Policy ID và Transaction Hash")
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

  // Hàm mô phỏng gọi API để hiển thị dữ liệu mẫu
  const simulateFetchNftData = async (policy: string, hash: string) => {
    // Mô phỏng độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Trả về dữ liệu mẫu
    return {
      policyId: policy,
      assetName: "3433343535323534356633363337363633373566373337353638366633303637",
      courseTitle: "query query Certificate",
      mintTransaction: {
        txHash: hash,
        block: 3364929,
        timestamp: new Date("2025-04-10T13:15:47").getTime() / 1000,
      },
      metadata: {
        "721": {
          "8200581cd645df7e14033f88dd438e7dfc6aa9539dfa246bde4f9365b100a02a": {
            CERT_67f7_suho0g: {
              name: "query query Certificate",
              image: "bafkreib2xqvtrkgzsivinihbasxl5qghmswa3x7pjy4kzllkgs7pra6mde",
              issuer: {
                name: "Kin So Go",
                address: "addr_test1...54vsearhk6",
              },
              courseId: "67f761977487ee22a8189fa0",
              issuedAt: "2025-04-10",
              mediaType: "image/png",
              recipient: {
                name: "Anh Do",
                address: "addr_test1...7wksl00fz2",
              },
              courseTitle: "query query",
            },
          },
        },
        name: "query query Certificate",
        image: "bafkreib2xqvtrkgzsivinihbasxl5qghmswa3x7pjy4kzllkgs7pra6mde",
        mediaType: "image/png",
        description: "Course completion certificate",
      },
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
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
              <Button type="submit" disabled={loading}>
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
                          {copied === "policyId" ? "Đã sao chép!" : <Copy className="h-4 w-4" />}
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
              <Button className="w-full py-6 text-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600" variant="outline" onClick={() => window.print()}>
                Print information
              </Button>
              <a
                href={`https://preprod.cardanoscan.io/token/${nftData.policyId}${nftData.assetName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full py-6 text-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600" variant="outline">
                  View on Explorer
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
