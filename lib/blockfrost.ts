// Trong môi trường thực tế, bạn sẽ sử dụng API key thực từ biến môi trường
// Đây chỉ là mã mẫu để minh họa cách tích hợp với Blockfrost API

import axios from "axios"

const BLOCKFROST_API_KEY = "preprodwAoQrS3Nc0RhHqm8awt9yISNlW9Z6TW6"
const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0"

export async function getAssetDetails(policyId: string, assetName: string) {
  try {
    const response = await axios.get(`${BLOCKFROST_URL}/assets/${policyId}${assetName}`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching asset details:", error)
    throw new Error("Không thể lấy thông tin tài sản từ blockchain")
  }
}

export async function getTransactionDetails(txHash: string) {
  try {
    const response = await axios.get(`${BLOCKFROST_URL}/txs/${txHash}`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching transaction details:", error)
    throw new Error("Không thể lấy thông tin giao dịch từ blockchain")
  }
}

export async function getTransactionMetadata(txHash: string) {
  try {
    const response = await axios.get(`${BLOCKFROST_URL}/txs/${txHash}/metadata`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching transaction metadata:", error)
    throw new Error("Không thể lấy metadata từ blockchain")
  }
}

export async function getNftInfo(policyId: string, txHash: string) {
  try {
    // Trong môi trường thực tế, bạn sẽ gọi các API thực tế ở đây
    // Đây chỉ là mô phỏng để hiển thị dữ liệu mẫu

    // Lấy thông tin giao dịch
    const txDetails = await getTransactionDetails(txHash)

    // Lấy metadata của giao dịch
    const metadata = await getTransactionMetadata(txHash)

    // Lấy danh sách tài sản trong policy
    const assets = await axios.get(`${BLOCKFROST_URL}/assets/policy/${policyId}`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })

    // Tìm asset đầu tiên trong policy (hoặc bạn có thể lọc theo assetName cụ thể)
    const assetName = assets.data[0]?.asset_name || ""

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
  } catch (error) {
    console.error("Error getting NFT info:", error)
    throw new Error("Không thể lấy thông tin NFT")
  }
}
