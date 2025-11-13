/**
 * Pricing Configuration
 * Define os planos e valores do sistema CondoBI
 */

export interface PricingPlan {
  name: string;
  type: 'unit-based' | 'commission-based';
  pricePerUnit?: number;
  minimumAmount: number;
  currency: string;
  features: string[];
  featured: boolean;
  description: string;
}

export const PRICING_PLANS = {
  basic: {
    name: 'CondoBI Base',
    type: 'unit-based' as const,
    pricePerUnit: 2.00,        // R$ 2,00 por unidade
    minimumAmount: 150.00,     // R$ 150,00 mínimo por mês
    currency: 'BRL',
    features: [
      'Dashboard Power BI',
      'Alertas automáticos',
      'Transparência total',
      'Relatórios mensais',
      'Suporte por email'
    ],
    featured: false,
    description: 'Para condomínios pequenos e médios'
  },
  premium: {
    name: 'SíndicoAI Premium',
    type: 'unit-based' as const,
    pricePerUnit: 5.00,        // R$ 5,00 por unidade
    minimumAmount: 400.00,     // R$ 400,00 mínimo por mês
    currency: 'BRL',
    features: [
      'Tudo do Base +',
      'IA Jurídica completa',
      'Integração operacional',
      'Análise preditiva',
      'Suporte 24/7'
    ],
    featured: true,
    description: 'Para condomínios grandes com necessidades avançadas'
  },
  smartBilling: {
    name: 'Cobrança Inteligente',
    type: 'commission-based' as const,
    commissionPercentage: 15,   // 15% do valor recuperado
    minimumAmount: 0,           // Sem mínimo
    currency: 'BRL',
    features: [
      'Sem custo fixo',
      'Só paga se recuperar',
      'IA personalizada',
      '68% taxa de sucesso',
      'Win-win total'
    ],
    featured: false,
    description: 'Pagamento por performance'
  }
};

/**
 * Calcula o preço baseado no número de unidades
 * @param plan - Nome do plano (basic, premium, smartBilling)
 * @param numberOfUnits - Número de unidades do condomínio
 * @returns Valor a ser cobrado em reais
 */
export const calculatePrice = (
  plan: keyof typeof PRICING_PLANS,
  numberOfUnits: number
): number => {
  const planConfig = PRICING_PLANS[plan];

  if (planConfig.type === 'unit-based' && planConfig.pricePerUnit) {
    const calculatedPrice = numberOfUnits * planConfig.pricePerUnit;
    return Math.max(calculatedPrice, planConfig.minimumAmount);
  }

  return planConfig.minimumAmount;
};

/**
 * Formata o valor em reais
 * @param value - Valor numérico
 * @returns String formatada (ex: "R$ 150,00")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Retorna a descrição de preço formatada para exibição
 * @param plan - Nome do plano
 * @param numberOfUnits - Número de unidades (opcional)
 * @returns String formatada para exibição
 */
export const getPriceDisplay = (
  plan: keyof typeof PRICING_PLANS,
  numberOfUnits?: number
): { price: string; period: string; details?: string } => {
  const planConfig = PRICING_PLANS[plan];

  if (planConfig.type === 'unit-based' && planConfig.pricePerUnit) {
    if (numberOfUnits) {
      const totalPrice = calculatePrice(plan, numberOfUnits);
      const isMinimum = totalPrice === planConfig.minimumAmount;

      return {
        price: formatCurrency(totalPrice),
        period: '/mês',
        details: isMinimum
          ? `Valor mínimo (${formatCurrency(planConfig.pricePerUnit)}/unidade)`
          : `${numberOfUnits} unidades × ${formatCurrency(planConfig.pricePerUnit)}`
      };
    }

    return {
      price: `${formatCurrency(planConfig.pricePerUnit)}`,
      period: '/unidade',
      details: `Mínimo ${formatCurrency(planConfig.minimumAmount)}/mês`
    };
  }

  if (planConfig.type === 'commission-based') {
    return {
      price: `${(planConfig as any).commissionPercentage}%`,
      period: 'do recuperado',
      details: 'Sem custo fixo'
    };
  }

  return {
    price: formatCurrency(planConfig.minimumAmount),
    period: '/mês'
  };
};
