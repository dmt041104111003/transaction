import type { NFTData } from "./types"

const BLOCKFROST_API_KEY = "preprodwAoQrS3Nc0RhHqm8awt9yISNlW9Z6TW6"
const BLOCKFROST_BASE_URL = "https://cardano-preprod.blockfrost.io/api/v0"

export async function fetchNFTData(policyId: string, txHash?: string): Promise<NFTData> {
  try {
    // Common headers for all requests
    const headers = {
      project_id: BLOCKFROST_API_KEY,
      "Content-Type": "application/json",
    }

    let assetDetails = null
    let transactionDetails = null

    // Fetch assets under the policy
    const assetsResponse = await fetch(`${BLOCKFROST_BASE_URL}/assets/policy/${policyId}`, {
      headers,
    })

    if (!assetsResponse.ok) {
      const errorData = await assetsResponse.json().catch(() => ({}))
      throw new Error(`Failed to fetch assets: ${errorData.message || assetsResponse.statusText}`)
    }

    const assets = await assetsResponse.json()

    if (assets.length === 0) {
      throw new Error("No assets found for this policy ID")
    }

    // Get the first asset for details
    const assetResponse = await fetch(`${BLOCKFROST_BASE_URL}/assets/${assets[0].asset}`, {
      headers,
    })

    if (!assetResponse.ok) {
      const errorData = await assetResponse.json().catch(() => ({}))
      throw new Error(`Failed to fetch asset details: ${errorData.message || assetResponse.statusText}`)
    }

    assetDetails = await assetResponse.json()

    // If transaction hash is provided, get transaction details
    if (txHash) {
      const txResponse = await fetch(`${BLOCKFROST_BASE_URL}/txs/${txHash}`, {
        headers,
      })

      if (!txResponse.ok) {
        const errorData = await txResponse.json().catch(() => ({}))
        throw new Error(`Failed to fetch transaction details: ${errorData.message || txResponse.statusText}`)
      }

      transactionDetails = await txResponse.json()

      // Get transaction metadata
      const txMetadataResponse = await fetch(`${BLOCKFROST_BASE_URL}/txs/${txHash}/metadata`, {
        headers,
      })

      if (txMetadataResponse.ok) {
        const txMetadata = await txMetadataResponse.json()
        if (txMetadata && txMetadata.length > 0) {
          // Find CIP-721 metadata (label 721)
          const cip721Metadata = txMetadata.find((item: any) => item.label === "721")
          if (cip721Metadata) {
            assetDetails.tx_metadata = cip721Metadata.json_metadata
          }
        }
      }
    }

    // Extract metadata
    let metadata = null
    if (assetDetails.onchain_metadata) {
      metadata = {
        "721": {
          [policyId]: {
            [assetDetails.asset_name]: assetDetails.onchain_metadata,
          },
        },
      }
    } else if (assetDetails.tx_metadata) {
      metadata = {
        "721": assetDetails.tx_metadata,
      }
    }

    // Format the response
    return {
      policyId,
      assetName: assetDetails.asset_name,
      displayName:
        assetDetails.onchain_metadata?.name ||
        (assetDetails.tx_metadata && assetDetails.tx_metadata[policyId]?.[assetDetails.asset_name]?.name) ||
        assetDetails.metadata?.name,
      transaction: transactionDetails
        ? {
            hash: txHash,
            block: transactionDetails.block_height,
            timestamp: transactionDetails.block_time * 1000, // Convert to milliseconds
          }
        : undefined,
      metadata,
      explorerUrl: `https://preprod.cardanoscan.io/${txHash ? `transaction/${txHash}` : `token/${policyId}`}`,
    }
  } catch (error) {
    console.error("Error fetching NFT data:", error)
    throw error
  }
}
