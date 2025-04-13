import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container mx-auto min-h-screen bg-[#e8f7f1] flex flex-col items-center py-10 px-4">
      <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
        Welcome to Lms - Cardano
      </h1>
      <div className="w-full max-w-3xl border-t-4 border-teal-500 mb-12"></div>
      
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/verify">
            <Button className="w-full py-4 text-lg bg-gradient-to-r from-[#00b894] to-[#0984e3] text-white rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:hover:opacity-100 transition-all font-medium flex items-center justify-center shadow-md" size="lg">Verify</Button>
          </Link>
          <Link href="#">
            <Button className="w-full py-4 text-lg bg-gradient-to-r from-[#00b894] to-[#0984e3] text-white rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:hover:opacity-100 transition-all font-medium flex items-center justify-center shadow-md" size="lg">
              LMS - Cardano
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
