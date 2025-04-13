// Trong môi trường thực tế, bạn sẽ sử dụng API key thực từ biến môi trường
// Đây chỉ là mã mẫu để minh họa cách tích hợp với Blockfrost API

import axios from "axios"

const BLOCKFROST_API_KEY = "preprodwAoQrS3Nc0RhHqm8awt9yISNlW9Z6TW6"
const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0"

const blockfrostClient = axios.create({
  baseURL: BLOCKFROST_URL,
  headers: {
    'project_id': BLOCKFROST_API_KEY,
  }
})

export async function getAssetDetails(policyId: string, assetName: string) {
  try {
    const response = await blockfrostClient.get(`/assets/${policyId}${assetName}`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching asset details:", error.response?.data || error.message)
    throw new Error("Unable to get asset information from blockchain")
  }
}

export async function getTransactionDetails(txHash: string) {
  try {
    const response = await blockfrostClient.get(`/txs/${txHash}`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching transaction details:", error.response?.data || error.message)
    throw new Error("Không thể lấy thông tin giao dịch từ blockchain")
  }
}

export async function getTransactionMetadata(txHash: string) {
  try {
    const response = await blockfrostClient.get(`/txs/${txHash}/metadata`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching transaction metadata:", error.response?.data || error.message)
    throw new Error("Không thể lấy metadata từ blockchain")
  }
}

export async function getNftInfo(policyId: string, txHash: string) {
  try {
    // Lấy thông tin giao dịch
    const txDetails = await getTransactionDetails(txHash)

    // Lấy metadata của giao dịch
    const metadata = await getTransactionMetadata(txHash)

    // Lấy danh sách tài sản trong policy
    const assets = await blockfrostClient.get(`/assets/policy/${policyId}`)
    
    if (!assets.data || assets.data.length === 0) {
      throw new Error("Không tìm thấy tài sản cho policy ID đã cho")
    }

    // Tìm asset đầu tiên trong policy (hoặc bạn có thể lọc theo assetName cụ thể)
    const assetName = assets.data[0]?.asset_name
    if (!assetName) {
      throw new Error("Tên tài sản không tìm thấy trong policy")
    }

    // Lấy chi tiết tài sản
    const assetDetails = await getAssetDetails(policyId, assetName)

    // Xây dựng và trả về đối tượng thông tin NFT
    return {
      policyId,
      assetName,
      courseTitle: metadata.find((m: any) => m.label === "721")?.json_metadata?.name || "Unknown Certificate",
      mintTransaction: {
        txHash,
        block: txDetails.block_height,
        timestamp: txDetails.block_time,
      },
      metadata: metadata.reduce((acc: any, item: any) => {
        acc[item.label] = item.json_metadata
        return acc
      }, {}),
    }
  } catch (error: any) {
    console.error("Error getting NFT info:", error.response?.data || error.message)
    if (error.response?.status === 404) {
      throw new Error("NFT không tìm thấy. Vui lòng kiểm tra Policy ID và Transaction Hash")
    }
    throw new Error(error.message || "Không thể lấy thông tin NFT")
  }
}
