"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LandingPage() {
  const searchParams = useSearchParams()
  const [ref, setRef] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const refParam = searchParams.get("ref")
    const infoParam = searchParams.get("info")

    if (!refParam) {
      setError("Missing reference parameter. This page should be accessed via a QR code.")
    } else {
      setRef(refParam)
      setInfo(infoParam ? decodeURIComponent(infoParam) : null)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto py-10">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Generator
        </Button>
      </Link>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Information from QR Code</CardTitle>
            <CardDescription>Reference ID: {ref}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{info}</div>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Create Your Own QR Code
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
