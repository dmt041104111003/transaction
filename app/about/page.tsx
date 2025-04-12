import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Về hệ thống xác minh chứng chỉ NFT</h1>

        <div className="space-y-6">
          <p>
            Hệ thống xác minh chứng chỉ NFT cho phép bạn kiểm tra tính xác thực của các chứng chỉ được phát hành dưới
            dạng NFT trên blockchain Cardano.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Cách sử dụng</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Quét mã QR từ chứng chỉ NFT hoặc nhấp vào liên kết xác minh</li>
            <li>Hệ thống sẽ tự động truy xuất thông tin từ blockchain</li>
            <li>Xem thông tin chi tiết về chứng chỉ, bao gồm người phát hành, người nhận và dữ liệu khóa học</li>
            <li>Kiểm tra tính xác thực bằng cách xem thông tin giao dịch trên blockchain explorer</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8">Thông tin kỹ thuật</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Chứng chỉ được phát hành theo tiêu chuẩn CIP-721 trên blockchain Cardano</li>
            <li>Dữ liệu được truy xuất thông qua Blockfrost API</li>
            <li>Mỗi chứng chỉ có một Policy ID và Asset Name duy nhất</li>
            <li>Metadata chứa thông tin về khóa học, người phát hành và người nhận</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi hoặc gặp vấn đề với hệ thống xác minh, vui lòng liên hệ với chúng tôi qua email:
            support@example.com
          </p>
        </div>
      </div>
    </div>
  )
}
