"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"

interface SearchFormProps {
  onSearch: (policyId: string, txHash?: string) => void
  isLoading: boolean
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [policyId, setPolicyId] = useState("")
  const [txHash, setTxHash] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const trimmedPolicyId = policyId.trim()
    const trimmedTxHash = txHash.trim()

    if (!trimmedPolicyId) {
      setValidationError("Policy ID is required")
      return
    }

    // Basic validation for Policy ID format (hexadecimal string)
    if (!/^[0-9a-fA-F]+$/.test(trimmedPolicyId)) {
      setValidationError("Policy ID must be a valid hexadecimal string")
      return
    }

    // If transaction hash is provided, validate it
    if (trimmedTxHash && !/^[0-9a-fA-F]+$/.test(trimmedTxHash)) {
      setValidationError("Transaction Hash must be a valid hexadecimal string")
      return
    }

    onSearch(trimmedPolicyId, trimmedTxHash || undefined)
  }

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-2xl text-gray-800">Cardano NFT Explorer</CardTitle>
        <CardDescription>Enter a Policy ID and optional Transaction Hash to view NFT details</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="policyId" className="text-sm font-medium text-gray-700">
              Policy ID <span className="text-red-500">*</span>
            </label>
            <Input
              id="policyId"
              placeholder="e.g. 947d7977f82be68eff8811020aa7d8b2532e99a10a83fd586e2745a1"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              className="w-full font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="txHash" className="text-sm font-medium text-gray-700">
              Transaction Hash (optional)
            </label>
            <Input
              id="txHash"
              placeholder="e.g. e2848a456a460365bd6ddb0c47f875e78c7adfb0fd73237f57eecc790d1d722"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full font-mono text-sm"
            />
          </div>

          {validationError && <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">{validationError}</div>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
