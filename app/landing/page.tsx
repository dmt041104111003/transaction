"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState({
    ref: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    // Get parameters from URL
    const ref = searchParams.get("ref") || ""
    const title = searchParams.get("title") || ""
    const description = searchParams.get("description") || ""

    setData({ ref, title, description })

    // In a real application, you might want to fetch data from a database using the ref
    // Example: fetchDataFromDatabase(ref).then(data => setData(data))
  }, [searchParams])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{data.title || "Welcome"}</CardTitle>
          <CardDescription>Reference ID: {data.ref}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose">
            <p>{data.description || "No description provided"}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Generator
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
