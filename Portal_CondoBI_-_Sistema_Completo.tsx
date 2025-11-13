import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, MessageSquare, Settings, Users, Home, LogOut, Upload, Download, Bell, TrendingUp, AlertCircle, CheckCircle, Menu, X } from 'lucide-react';

// Simulação de dados de condomínios
const condominiosData = {
  'condo-1': {
    nome: 'Residencial Parque das Flores',
    unidades: 120,
    inadimplencia: 8.5,
    despesaTotal: 45800,
    receita: 42200,
    alertas: 3
  },
  'condo-2': {
    nome: 'Condomínio Vista Verde',
    unidades: 80,
    inadimplencia: 5.2,
    despesaTotal: 32400,
    receita: 30800,
    alertas: 1
  }
};

// Sistema de Autenticação
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    tipo: 'sindico'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de login - em produção, isso seria uma chamada API
    const userData = {
      id: '1',
      nome: formData.nome || 'Felipe Santos',
      email: formData.email,
      tipo: formData.tipo,
      condominio: 'condo-1'
    };
    onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">CondoBI</h1>
          <p className="text-blue-100">Inteligência Condominial</p>
        </div>
        
        <div className="p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md transition-all ${isLogin ? 'bg-white shadow' : ''}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md transition-all ${!isLogin ? 'bg-white shadow' : ''}`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sindico">Síndico</option>
                    <option value="administradora">Administradora</option>
                    <option value="morador">Morador</option>
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">Esqueceu a senha?</a>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => onLogin({
                id: '1',
                nome: 'Demo User',
                email: 'demo@condobi.com',
                tipo: 'sindico',
                condominio: 'condo-1'
              })}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              🚀 Entrar como Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Principal
const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { tipo: 'bot', texto: 'Olá! Como posso ajudar você hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const condominioData = condominiosData[user.condominio];

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: Home },
    { id: 'analytics', label: 'Análises BI', icon: BarChart3 },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'ia-chat', label: 'IA Assistente', icon: MessageSquare },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages, { tipo: 'user', texto: chatInput }]);
    
    // Simulação de resposta da IA
    setTimeout(() => {
      const respostas = [
        'Analisando os dados do seu condomínio... O gasto com energia aumentou 18% este mês.',
        'Com base no histórico, prevejo que a inadimplência pode subir para 10% no próximo mês. Recomendo intensificar a comunicação com os inadimplentes.',
        'Identifiquei uma oportunidade de economia: o gasto com limpeza está 25% acima da média regional. Posso sugerir fornecedores mais eficientes?'
      ];
      const resposta = respostas[Math.floor(Math.random() * respostas.length)];
      setChatMessages(prev => [...prev, { tipo: 'bot', texto: resposta }]);
    }, 1000);

    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">CondoBI</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeTab === item.id ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-700 rounded-lg transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{condominioData.nome}</h2>
            <p className="text-sm text-gray-500">{user.nome} • {user.tipo}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.nome.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Unidades</span>
                    <Home className="text-blue-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{condominioData.unidades}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Inadimplência</span>
                    <AlertCircle className="text-orange-500" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-orange-500">{condominioData.inadimplencia}%</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Receita</span>
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {condominioData.receita.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Alertas</span>
                    <Bell className="text-red-500" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-red-500">{condominioData.alertas}</p>
                </div>
              </div>

              {/* Alertas Inteligentes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-orange-500" />
                  Alertas Inteligentes (IA)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertCircle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-orange-800">Gasto com energia acima do previsto</p>
                      <p className="text-sm text-orange-600 mt-1">Aumento de 18% em relação ao mês anterior. Recomendamos revisar o contrato.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-blue-800">Oportunidade de economia identificada</p>
                      <p className="text-sm text-blue-600 mt-1">Possível economia de R$ 1.250/mês com troca de fornecedor de limpeza.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-red-800">Previsão de déficit no caixa</p>
                      <p className="text-sm text-red-600 mt-1">Com base no histórico, prevemos déficit em 60 dias se a inadimplência não diminuir.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico Simulado */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Despesas vs Receitas (6 meses)</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Power BI Embedded será exibido aqui</p>
                    <p className="text-sm text-gray-500 mt-1">Gráficos interativos com dados reais</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Power BI</h3>
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={64} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 font-semibold">Power BI Embedded</p>
                  <p className="text-gray-500 mt-2">Dashboard interativo será renderizado aqui</p>
                  <p className="text-sm text-gray-400 mt-4">Integração com: Power BI Service API</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Documentos</h3>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Upload size={20} />
                    Upload
                  </button>
                </div>

                <div className="space-y-3">
                  {['Ata da Assembleia - Out/2024', 'Contrato de Limpeza', 'Relatório Mensal - Set/2024', 'Balancete Financeiro'].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={24} />
                        <div>
                          <p className="font-semibold text-gray-800">{doc}</p>
                          <p className="text-sm text-gray-500">Atualizado há {idx + 1} dias</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Download size={20} className="text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ia-chat' && (
            <div className="bg-white rounded-xl shadow-sm p-6 h-[calc(100vh-200px)] flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="text-blue-600" />
                IA Assistente - CondoBI
              </h3>
              
              <div className="flex-1 overflow-auto mb-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.tipo === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.texto}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Pergunte sobre seu condomínio..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Gestão de Usuários</h3>
              <div className="space-y-4">
                {['Felipe Santos (Síndico)', 'Maria Silva (Sub-síndica)', 'João Costa (Morador)'].map((usuario, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {usuario.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{usuario}</p>
                        <p className="text-sm text-gray-500">Último acesso: hoje</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold">
                      Gerenciar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Notificações</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Alertas de inadimplência</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Relatórios semanais</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Atualizações de documentos</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Preferências de Relatório</h4>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Enviar toda segunda-feira</option>
                    <option>Enviar todo dia 1º do mês</option>
                    <option>Não enviar automaticamente</option>
                  </select>
                </div>

                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
                  Salvar Configurações
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// App Principal
export default function CondoBIPortal() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <AuthScreen onLogin={setUser} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}