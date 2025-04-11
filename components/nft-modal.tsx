"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { NFTData } from "@/lib/types"
import { ExternalLink, X } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface NFTModalProps {
  isOpen: boolean
  onClose: () => void
  nftData: NFTData
}

export function NFTModal({ isOpen, onClose, nftData }: NFTModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="absolute right-4 top-4 z-10">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">NFT Information</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Policy ID</h3>
            <div className="p-3 bg-gray-50 rounded-md text-sm font-mono break-all select-all">{nftData.policyId}</div>
          </div>

          {nftData.assetName && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Asset Name</h3>
              <div className="p-3 bg-gray-50 rounded-md text-sm font-mono break-all select-all">
                {nftData.assetName}
              </div>
            </div>
          )}

          {nftData.displayName && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Course Title</h3>
              <div className="p-3 bg-gray-50 rounded-md text-sm select-all">{nftData.displayName}</div>
            </div>
          )}

          {nftData.transaction && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Mint Transaction</h3>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Transaction Hash:</h4>
                <div className="p-3 bg-gray-50 rounded-md text-sm font-mono break-all select-all">
                  {nftData.transaction.hash}
                </div>
              </div>

              {nftData.transaction.block && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Block:</h4>
                  <div className="p-3 bg-gray-50 rounded-md text-sm select-all">{nftData.transaction.block}</div>
                </div>
              )}

              {nftData.transaction.timestamp && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Timestamp:</h4>
                  <div className="p-3 bg-gray-50 rounded-md text-sm select-all">
                    {formatDate(nftData.transaction.timestamp)}
                  </div>
                </div>
              )}
            </div>
          )}

          {nftData.metadata && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Metadata (CIP-721)</h3>
              <pre className="p-3 bg-gray-50 rounded-md text-xs font-mono overflow-x-auto select-all">
                {JSON.stringify(nftData.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-gray-50 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {nftData.explorerUrl && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.open(nftData.explorerUrl, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
