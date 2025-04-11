export interface NFTData {
  policyId: string
  assetName?: string
  displayName?: string
  transaction?: {
    hash: string
    block?: number
    timestamp?: number
  }
  metadata?: any
  explorerUrl?: string
}
