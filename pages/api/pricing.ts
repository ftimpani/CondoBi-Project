import type { NextApiRequest, NextApiResponse } from 'next'
import { PRICING_PLANS, calculatePrice, formatCurrency, getPriceDisplay } from '../../config/pricing'

type PricingRequest = {
  plan: 'basic' | 'premium' | 'smartBilling'
  numberOfUnits?: number
}

type PricingResponse = {
  plan: string
  numberOfUnits?: number
  calculatedPrice: number
  formattedPrice: string
  pricePerUnit?: number
  minimumAmount: number
  details: string
  breakdown?: {
    baseCalculation: number
    appliedMinimum: boolean
    pricePerUnit: number
  }
}

type ErrorResponse = {
  error: string
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PricingResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Use POST method' })
  }

  const { plan, numberOfUnits }: PricingRequest = req.body

  // Validate plan
  if (!plan || !PRICING_PLANS[plan]) {
    return res.status(400).json({
      error: 'Invalid plan',
      message: 'Plan must be one of: basic, premium, smartBilling'
    })
  }

  const planConfig = PRICING_PLANS[plan]

  // For unit-based plans
  if (planConfig.type === 'unit-based' && planConfig.pricePerUnit) {
    if (!numberOfUnits || numberOfUnits <= 0) {
      return res.status(400).json({
        error: 'Invalid numberOfUnits',
        message: 'numberOfUnits must be a positive number for unit-based plans'
      })
    }

    const baseCalculation = numberOfUnits * planConfig.pricePerUnit
    const calculatedPrice = calculatePrice(plan, numberOfUnits)
    const appliedMinimum = calculatedPrice === planConfig.minimumAmount

    return res.status(200).json({
      plan: planConfig.name,
      numberOfUnits,
      calculatedPrice,
      formattedPrice: formatCurrency(calculatedPrice),
      pricePerUnit: planConfig.pricePerUnit,
      minimumAmount: planConfig.minimumAmount,
      details: appliedMinimum
        ? `Valor mínimo aplicado (${formatCurrency(planConfig.pricePerUnit)}/unidade)`
        : `${numberOfUnits} unidades × ${formatCurrency(planConfig.pricePerUnit)}`,
      breakdown: {
        baseCalculation,
        appliedMinimum,
        pricePerUnit: planConfig.pricePerUnit
      }
    })
  }

  // For commission-based plans (smartBilling)
  if (planConfig.type === 'commission-based') {
    return res.status(200).json({
      plan: planConfig.name,
      calculatedPrice: 0,
      formattedPrice: 'Sem custo fixo',
      minimumAmount: planConfig.minimumAmount,
      details: `${(planConfig as any).commissionPercentage}% do valor recuperado`
    })
  }

  return res.status(500).json({
    error: 'Unexpected error',
    message: 'Unable to calculate pricing'
  })
}
