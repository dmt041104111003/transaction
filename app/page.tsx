import Link from "next/link"
import { ArrowRight, QrCode, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-bold tracking-tight gradient-text">Certificate Verification System</h2>
        <p className="text-xl text-muted-foreground">
          Verify the authenticity of blockchain certificates by scanning a QR code or entering details
        </p>

        <Card className="border-secondary/20">
          <CardHeader className="bg-accent rounded-t-lg">
            <CardTitle className="text-secondary">How It Works</CardTitle>
            <CardDescription>
              Our verification system allows you to confirm the authenticity of blockchain certificates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="flex flex-col items-center gap-2 p-4 border border-secondary/20 rounded-lg">
                <div className="bg-accent p-3 rounded-full">
                  <QrCode className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-medium text-secondary">Scan QR Code</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Scan the QR code on your certificate or enter the details manually
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 border border-secondary/20 rounded-lg">
                <div className="bg-accent p-3 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-secondary">Verify Certificate</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Our system verifies the certificate details on the blockchain
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/verify" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Go to Verification Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
