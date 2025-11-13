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
        <title>CondoBI + SíndicoAI - A Primeira Plataforma de Gestão Condominial com IA do Brasil</title>
        <meta name="description" content="Transforme dados em decisões. IA que interpreta contratos, recupera inadimplência e conecta apps operacionais." />
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              CondoBI + SíndicoAI
            </h1>
            <p className="text-2xl italic mb-4 opacity-95">
              "Apps operacionais cuidam do dia a dia. O SíndicoAI cuida do que ninguém vê."
            </p>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              A primeira plataforma de gestão condominial com Inteligência Artificial do Brasil.
              Transforme dados em decisões, transparência em confiança, e gestão em resultado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portal"
                className="bg-accent text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                🚀 Acessar Portal
              </Link>
              <a
                href="#form"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition-all"
              >
                📊 Solicitar Demo
              </a>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white py-8 px-4 shadow-lg -mt-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600">350 mil</div>
                <div className="text-gray-600 text-sm font-semibold">Condomínios no Brasil</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">68%</div>
                <div className="text-gray-600 text-sm font-semibold">Taxa de Recuperação</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">R$ 2,1bi</div>
                <div className="text-gray-600 text-sm font-semibold">Mercado Total (TAM)</div>
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
                A Gestão Condominial no Brasil É Ineficiente
              </h2>
              <p className="text-xl text-gray-600">
                Síndicos e administradoras enfrentam problemas que custam milhões por ano
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: '😰', title: 'Sobrecarga Operacional', desc: 'Síndicos perdem 15h/semana com tarefas burocráticas' },
                { icon: '💸', title: 'Inadimplência Alta', desc: '12% de inadimplência desperdiça R$ 8 bilhões/ano' },
                { icon: '⚖️', title: 'Processos Judiciais', desc: 'Cada processo custa R$ 15 mil em média' },
                { icon: '📊', title: 'Falta de Transparência', desc: 'Dados confusos geram conflitos entre moradores' },
                { icon: '🔄', title: 'Sistemas Isolados', desc: 'Apps não conversam, perdendo inteligência valiosa' },
                { icon: '🤖', title: 'Sem Inteligência Artificial', desc: 'Decisões baseadas em intuição, não em dados' }
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
                O Sistema Nervoso Central da Gestão Condominial
              </h2>
              <p className="text-xl text-gray-600">
                Uma plataforma que pensa, prevê e age em nome do síndico
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: '📱',
                  title: '1. Apps Operacionais (Sensores)',
                  desc: 'Integração com seus apps existentes - Conectamos com portaria digital, gestão de entregas, reservas e ocorrências.',
                  color: 'border-blue-500'
                },
                {
                  icon: '🧠',
                  title: '2. SíndicoAI (Cérebro Inteligente)',
                  desc: 'IA Jurídica + Cobrança + Preditiva - Interpreta contratos, identifica riscos, recupera inadimplência automaticamente.',
                  color: 'border-purple-500'
                },
                {
                  icon: '📊',
                  title: '3. CondoBI (Governança)',
                  desc: 'Dashboards + Alertas + Automação - Centraliza indicadores, gera relatórios e torna toda gestão transparente.',
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
                Investimento Transparente e Justo
              </h2>
              <p className="text-xl text-gray-600">
                Escolha o plano ideal para o seu condomínio
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'CondoBI Base',
                  price: 'R$ 150',
                  period: '/mês',
                  features: ['Dashboard Power BI', 'Alertas automáticos', 'Transparência total', 'Relatórios mensais', 'Suporte por email'],
                  featured: false
                },
                {
                  name: 'SíndicoAI Premium',
                  price: 'R$ 400',
                  period: '/mês',
                  features: ['Tudo do Base +', 'IA Jurídica completa', 'Integração operacional', 'Análise preditiva', 'Suporte 24/7'],
                  featured: true
                },
                {
                  name: 'Cobrança Inteligente',
                  price: '15%',
                  period: 'do recuperado',
                  features: ['Sem custo fixo', 'Só paga se recuperar', 'IA personalizada', '68% taxa de sucesso', 'Win-win total'],
                  featured: false
                }
              ].map((plan, idx) => (
                <div key={idx} className={`bg-white rounded-2xl p-8 ${plan.featured ? 'ring-4 ring-primary-500 shadow-2xl scale-105' : 'shadow-lg'} relative`}>
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      🔥 MAIS POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-primary-600">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>{feature}</span>
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
                    Começar Agora
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
