import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const policyId = searchParams.get("policyId")
  const txHash = searchParams.get("txHash")

  if (!policyId || !txHash) {
    return NextResponse.json({ error: "Missing required parameters: policyId and txHash" }, { status: 400 })
  }

  try {
    // Trong môi trường thực tế, bạn sẽ gọi API thực tế ở đây
    // Đây chỉ là mô phỏng để hiển thị dữ liệu mẫu
    const nftData = await simulateFetchNftData(policyId, txHash)

    return NextResponse.json({ success: true, data: nftData })
  } catch (error: any) {
    console.error("Error verifying NFT:", error)
    return NextResponse.json({ error: error.message || "Failed to verify NFT" }, { status: 500 })
  }
}

// Hàm mô phỏng gọi API để hiển thị dữ liệu mẫu
async function simulateFetchNftData(policyId: string, txHash: string) {
  // Mô phỏng độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Trả về dữ liệu mẫu
  return {
    policyId,
    assetName: "3433343535323534356633363337363633373566373337353638366633303637",
    courseTitle: "query query Certificate",
    mintTransaction: {
      txHash,
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
