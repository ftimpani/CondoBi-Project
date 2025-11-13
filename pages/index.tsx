import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: '',
    condominio: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Lead capturado:', formData)
    alert('✅ Obrigado! Entraremos em contato em até 24 horas.')
    setFormData({ nome: '', email: '', telefone: '', tipo: '', condominio: '' })
  }

  return (
    <>
      <Head>
        <title>CondoBI + SíndicoAI: A Revolução da Gestão Condominial com Inteligência Artificial</title>
        <meta name="description" content="A primeira e única plataforma no Brasil que une BI e IA Jurídica para eliminar a ineficiência, reduzir a inadimplência e garantir a paz no seu condomínio." />
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              CondoBI + SíndicoAI: A Revolução da Gestão Condominial com Inteligência Artificial
            </h1>
            <p className="text-2xl italic mb-4 opacity-95">
              "Deixe o caos para trás. O SíndicoAI cuida do que ninguém vê: a saúde financeira e jurídica do seu condomínio."
            </p>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              A primeira e única plataforma no Brasil que une Business Intelligence (CondoBI) e Inteligência Artificial Jurídica e Preditiva (SíndicoAI) para eliminar a ineficiência, reduzir a inadimplência e garantir a paz no seu condomínio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#form"
                className="bg-accent text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                Solicitar Demonstração Gratuita
              </a>
              <Link
                href="/portal"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition-all"
              >
                Acessar Portal (Para Clientes)
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white py-8 px-4 shadow-lg -mt-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600">+350 mil</div>
                <div className="text-gray-600 text-sm font-semibold">Condomínios no Brasil (Mercado Total)</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">68%</div>
                <div className="text-gray-600 text-sm font-semibold">de Sucesso na Recuperação de Inadimplência</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">R$ 2,1bi</div>
                <div className="text-gray-600 text-sm font-semibold">em Mercado Potencial (TAM)</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">15h/sem</div>
                <div className="text-gray-600 text-sm font-semibold">Economizadas por Síndico</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                O Custo Oculto da Ineficiência: Por que a Gestão Condominial Custa Milhões ao Ano?
              </h2>
              <p className="text-xl text-gray-600">
                Síndicos e administradoras enfrentam problemas que custam milhões por ano
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: '😰', title: 'Sobrecarga de Tempo', desc: '15 horas perdidas por semana em burocracia. O seu tempo vale mais.' },
                { icon: '💸', title: 'Inadimplência Crônica', desc: '12% de inadimplência que drena R$ 8 bilhões do mercado. Recupere o que é seu.' },
                { icon: '⚖️', title: 'Risco Jurídico e Financeiro', desc: 'Cada processo judicial custa, em média, R$ 15 mil. Previna-se com IA.' },
                { icon: '📊', title: 'Conflitos e Desconfiança', desc: 'Dados confusos e falta de clareza geram atritos constantes entre moradores. Construa confiança.' },
                { icon: '🔄', title: 'Fragmentação de Dados', desc: 'Sistemas que não se comunicam, transformando dados valiosos em ruído. Centralize a inteligência.' },
                { icon: '🤖', title: 'Decisões no Escuro', desc: 'Gestão baseada em "achismos" e intuição, sem o poder da análise preditiva. Decida com precisão.' }
              ].map((problem, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-5xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
                  <p className="text-gray-600">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Layers */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                O Sistema Nervoso Central da Gestão Condominial: A Solução Completa para Síndicos e Administradoras
              </h2>
              <p className="text-xl text-gray-600">
                Uma plataforma que pensa, prevê e age em nome do síndico
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: '📱',
                  title: '1. Apps Operacionais (Sensores): Integração Total',
                  desc: 'Conectamos todos os seus sistemas (portaria, reservas, ocorrências) para alimentar a IA com dados em tempo real.',
                  color: 'border-blue-500'
                },
                {
                  icon: '🧠',
                  title: '2. SíndicoAI (Cérebro Inteligente): Ação Preditiva e Jurídica',
                  desc: 'Nossa IA interpreta contratos, prevê riscos, e executa a cobrança de inadimplência de forma automática e legalmente segura.',
                  color: 'border-purple-500'
                },
                {
                  icon: '📊',
                  title: '3. CondoBI (Governança): Transparência e Controle',
                  desc: 'Dashboards intuitivos, alertas automáticos e relatórios gerenciais que centralizam indicadores e garantem total transparência para síndicos e moradores.',
                  color: 'border-green-500'
                }
              ].map((layer, idx) => (
                <div key={idx} className={`flex items-start gap-6 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border-l-8 ${layer.color}`}>
                  <div className="text-6xl flex-shrink-0">{layer.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{layer.title}</h3>
                    <p className="text-gray-700 text-lg">{layer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Escolha o Plano que Revoluciona a Sua Gestão
              </h2>
              <p className="text-xl text-gray-600">
                Investimento Transparente e Focado em Resultado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'CondoBI Base',
                  subtitle: 'O Essencial para a Transparência',
                  price: 'R$ 150',
                  period: '/mês',
                  features: ['Dashboard Power BI', 'Alertas automáticos', 'Transparência total', 'Relatórios mensais', 'Suporte por email'],
                  featured: false,
                  cta: 'Começar Agora'
                },
                {
                  name: 'SíndicoAI Premium',
                  subtitle: 'A Gestão Completa com IA',
                  price: 'R$ 400',
                  period: '/mês',
                  features: ['Tudo do Base +', 'IA Jurídica completa', 'Integração operacional', 'Análise preditiva', 'Suporte 24/7'],
                  featured: true,
                  cta: 'Começar Agora'
                },
                {
                  name: 'Cobrança Inteligente',
                  subtitle: 'Recuperação de Inadimplência (Risco Zero)',
                  price: '15%',
                  period: 'do recuperado',
                  features: ['Custo Zero Fixo: Você só paga se houver recuperação', 'Comissão de Sucesso: Apenas 15% do valor efetivamente recuperado', 'IA Jurídica Personalizada: Estratégias de cobrança otimizadas pela nossa IA', '68% de Taxa de Sucesso Comprovada', 'Parceria Ganha-Ganha: Nosso sucesso é o seu sucesso'],
                  featured: false,
                  cta: 'Recuperar Inadimplência Agora'
                }
              ].map((plan, idx) => (
                <div key={idx} className={`bg-white rounded-2xl p-8 ${plan.featured ? 'ring-4 ring-primary-500 shadow-2xl scale-105' : 'shadow-lg'} relative`}>
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{plan.subtitle}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-primary-600">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-1">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#form"
                    className={`block text-center py-3 rounded-lg font-bold transition-all ${
                      plan.featured
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form" className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-900">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Solicite uma Demonstração Gratuita
              </h2>
              <p className="text-xl opacity-90">
                Preencha o formulário e nossa equipe entrará em contato
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-6">
              <div>
                <label className="block font-semibold mb-2">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Telefone *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Você é: *</label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sindico">Síndico</option>
                  <option value="administradora">Administradora</option>
                  <option value="gestor">Gestor Condominial</option>
                  <option value="morador">Morador</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Nome do Condomínio (opcional)</label>
                <input
                  type="text"
                  value={formData.condominio}
                  onChange={(e) => setFormData({...formData, condominio: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Residencial..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
              >
                ✨ Solicitar Demonstração
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">CondoBI + SíndicoAI</h3>
            <p className="text-gray-400 mb-4">Inteligência Condominial</p>
            <p className="text-gray-500">© 2025 - Todos os direitos reservados</p>
            <p className="text-gray-600 mt-4">contato@condobi.com.br | Araraquara, São Paulo</p>
          </div>
        </footer>
      </div>
    </>
  )
}
