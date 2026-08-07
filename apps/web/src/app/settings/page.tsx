'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import {
  User,
  Shield,
  CreditCard,
  Sliders,
  Bell,
  Key,
  Save,
  CheckCircle2,
  Lock,
  Copy,
  Download,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Laptop,
  Check
} from 'lucide-react';
import {
  getStoredUser,
  saveStoredUser,
  getStoredPreferences,
  saveStoredPreferences,
  getStoredNotifications,
  saveStoredNotifications,
  UserProfile,
  UserPreferences,
  NotificationSettings
} from '@/lib/authStore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('PERFIL');
  const [savedSuccess, setSavedSuccess] = useState('');

  // 1. Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUser());

  // 2. Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [invalidateOtherSessions, setInvalidateOtherSessions] = useState(true);
  const [securityError, setSecurityError] = useState('');

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  // 3. Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedAccountId, setCopiedAccountId] = useState(false);

  // 4. Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences());

  // 5. Notifications State
  const [notifications, setNotifications] = useState<NotificationSettings>(getStoredNotifications());

  const showSuccessFeedback = (msg: string) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredUser(userProfile);
    showSuccessFeedback('Perfil atualizado com sucesso!');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');

    if (!currentPassword) {
      setSecurityError('Por favor, informe a sua senha atual.');
      return;
    }

    if (passwordScore < 5) {
      setSecurityError('A nova senha não preenche todos os requisitos de segurança.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSecurityError('A nova senha e a confirmação não coincidem.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    showSuccessFeedback('Senha alterada com sucesso! Suas outras sessões foram atualizadas.');
  };

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    saveStoredPreferences(newPrefs);
    showSuccessFeedback('Preferências salvas com sucesso!');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredNotifications(notifications);
    showSuccessFeedback('Configurações de notificação salvas!');
  };

  const menuItems = [
    { id: 'PERFIL', label: 'Perfil', icon: User },
    { id: 'SEGURANCA', label: 'Segurança', icon: Shield },
    { id: 'CONTA', label: 'Conta', icon: CreditCard },
    { id: 'PREFERENCIAS', label: 'Preferências', icon: Sliders },
    { id: 'NOTIFICACOES', label: 'Notificações', icon: Bell },
    { id: 'API', label: 'API Keys', icon: Key },
  ];

  return (
    <div className="flex min-h-screen bg-altix-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Top Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Configurações da Conta</h1>
              <p className="text-sm text-altix-muted">
                Gerencie seus dados pessoais, segurança, preferências de exibição e canais de notificação.
              </p>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-altix-green/20 text-altix-green border border-altix-green/30 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{savedSuccess}</span>
              </div>
            )}
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Sidebar Menu */}
            <div className="glass-card p-2 rounded-2xl space-y-1 border border-white/10">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-altix-green text-black shadow-glow font-bold'
                        : 'text-altix-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Content View */}
            <div className="lg:col-span-3">
              {/* TAB 1: PERFIL */}
              {activeTab === 'PERFIL' && (
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-altix-green to-emerald-400 p-[2px]">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-extrabold text-xl text-altix-green">
                        WS
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{userProfile.name}</h3>
                      <p className="text-xs text-altix-muted">{userProfile.role} • {userProfile.company}</p>
                      <span className="text-[10px] font-mono text-altix-green">Cadastrado em {userProfile.createdAt}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Nome Completo</label>
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Empresa / Organização</label>
                        <input
                          type="text"
                          value={userProfile.company}
                          onChange={(e) => setUserProfile({ ...userProfile, company: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">E-mail Corporativo</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Telefone de Contato</label>
                        <input
                          type="text"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Cargo / Função</label>
                        <input
                          type="text"
                          value={userProfile.role}
                          onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Fuso Horário</label>
                        <select
                          value={userProfile.timezone}
                          onChange={(e) => setUserProfile({ ...userProfile, timezone: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                        >
                          <option value="America/Sao_Paulo (GMT-3)">America/Sao_Paulo (GMT-3)</option>
                          <option value="UTC">UTC (Universal Time)</option>
                          <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Alterações do Perfil</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SEGURANÇA */}
              {activeTab === 'SEGURANCA' && (
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                  <div>
                    <h3 className="font-bold text-base text-white">Alteração de Senha & Segurança da Conta</h3>
                    <p className="text-xs text-altix-muted">Crie uma nova senha forte para proteger sua conta e serviços.</p>
                  </div>

                  {securityError && (
                    <div className="p-3 rounded-xl bg-altix-offline/10 border border-altix-offline/30 text-altix-offline text-xs font-semibold">
                      {securityError}
                    </div>
                  )}

                  <form onSubmit={handleSaveSecurity} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-altix-muted block mb-1">Senha Atual</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-altix-muted block mb-1">Nova Senha</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                      />

                      {/* Visual Strength Indicator */}
                      {newPassword && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-1.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordScore <= 2
                                  ? 'w-1/3 bg-altix-offline'
                                  : passwordScore <= 4
                                  ? 'w-2/3 bg-altix-warning'
                                  : 'w-full bg-altix-green'
                              }`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-altix-muted">
                            <span className={hasMinLength ? 'text-altix-green font-semibold' : ''}>✓ Mínimo 8 caracteres</span>
                            <span className={hasUpper ? 'text-altix-green font-semibold' : ''}>✓ Letra maiúscula</span>
                            <span className={hasLower ? 'text-altix-green font-semibold' : ''}>✓ Letra minúscula</span>
                            <span className={hasNumber ? 'text-altix-green font-semibold' : ''}>✓ Número</span>
                            <span className={hasSpecial ? 'text-altix-green font-semibold' : ''}>✓ Caractere especial</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-altix-muted block mb-1">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="inv-sess"
                        checked={invalidateOtherSessions}
                        onChange={(e) => setInvalidateOtherSessions(e.target.checked)}
                        className="w-4 h-4 rounded bg-white/10 border-white/20 text-altix-green focus:ring-altix-green"
                      />
                      <label htmlFor="inv-sess" className="text-xs text-altix-muted">
                        Invalidar todas as outras sessões ativas após a alteração de senha.
                      </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Atualizar Senha de Segurança</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: CONTA */}
              {activeTab === 'CONTA' && (
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-mono text-altix-muted uppercase">Plano da Empresa</span>
                      <h3 className="text-xl font-extrabold text-altix-green">Plano Business Enterprise</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-altix-green/20 text-altix-green text-xs font-mono font-bold">
                      R$ 299 / mês
                    </span>
                  </div>

                  {/* Quotas Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-altix-muted">Uso de Monitores</span>
                      <span className="font-mono text-altix-green font-bold">5 / 1.000 Monitores Utilizados</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-1/12 bg-altix-green rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-altix-muted uppercase font-mono block">ID Único da Conta</span>
                      <span className="font-mono text-xs text-white">acc_altix_9012481029</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('acc_altix_9012481029');
                        setCopiedAccountId(true);
                        setTimeout(() => setCopiedAccountId(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedAccountId ? 'Copiado!' : 'Copiar ID'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                      <Download className="w-4 h-4" />
                      <span>Exportar Todos os Dados (JSON/CSV)</span>
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-altix-offline/20 text-altix-offline hover:bg-altix-offline/30 border border-altix-offline/30 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir Conta Permanentemente</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: PREFERÊNCIAS */}
              {activeTab === 'PREFERENCIAS' && (
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                  <div>
                    <h3 className="font-bold text-base text-white">Preferências Globais de Interface</h3>
                    <p className="text-xs text-altix-muted">Personalize o tema visual, formato de data e idioma.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Theme Picker */}
                    <div>
                      <label className="text-xs font-semibold text-altix-muted block mb-2">Tema da Aplicação</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'dark', name: 'Escuro (Dark)', icon: Moon },
                          { id: 'light', name: 'Claro (Light)', icon: Sun },
                          { id: 'system', name: 'Sistema', icon: Laptop },
                        ].map((t) => {
                          const Icon = t.icon;
                          const isSelected = preferences.theme === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleSavePreferences({ ...preferences, theme: t.id as any })}
                              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                                isSelected
                                  ? 'bg-altix-green/20 border-altix-green text-altix-green shadow-glow'
                                  : 'bg-white/5 border-white/10 text-altix-muted hover:text-white'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{t.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Formato de Data</label>
                        <select
                          value={preferences.dateFormat}
                          onChange={(e) => handleSavePreferences({ ...preferences, dateFormat: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY (Ex: 07/08/2026)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY (US standard)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-altix-muted block mb-1">Formato de Hora</label>
                        <select
                          value={preferences.timeFormat}
                          onChange={(e) => handleSavePreferences({ ...preferences, timeFormat: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                        >
                          <option value="24h">24 Horas (Ex: 15:52:00)</option>
                          <option value="12h">12 Horas AM/PM (Ex: 03:52:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: NOTIFICAÇÕES */}
              {activeTab === 'NOTIFICACOES' && (
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                  <div>
                    <h3 className="font-bold text-base text-white">Canais de Notificação de Quedas</h3>
                    <p className="text-xs text-altix-muted">Ative ou desative o envio simultâneo para cada canal de comunicação.</p>
                  </div>

                  <form onSubmit={handleSaveNotifications} className="space-y-4">
                    {/* Channel 1: WhatsApp */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">WhatsApp Instant Alert</span>
                        <input
                          type="checkbox"
                          checked={notifications.whatsApp.enabled}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            whatsApp: { ...notifications.whatsApp, enabled: e.target.checked }
                          })}
                          className="w-4 h-4 text-altix-green rounded"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Ex: +55 11 99999-8888"
                        value={notifications.whatsApp.recipients}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          whatsApp: { ...notifications.whatsApp, recipients: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono"
                      />
                    </div>

                    {/* Channel 2: Telegram */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Telegram Bot API</span>
                        <input
                          type="checkbox"
                          checked={notifications.telegram.enabled}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            telegram: { ...notifications.telegram, enabled: e.target.checked }
                          })}
                          className="w-4 h-4 text-altix-green rounded"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Chat / Group ID (-100192847291)"
                        value={notifications.telegram.chatId}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          telegram: { ...notifications.telegram, chatId: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono"
                      />
                    </div>

                    {/* Channel 3: Discord */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Discord Webhook</span>
                        <input
                          type="checkbox"
                          checked={notifications.discord.enabled}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            discord: { ...notifications.discord, enabled: e.target.checked }
                          })}
                          className="w-4 h-4 text-altix-green rounded"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={notifications.discord.webhookUrl}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          discord: { ...notifications.discord, webhookUrl: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Notificações</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: API KEYS */}
              {activeTab === 'API' && (
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-bold text-base text-white">Chaves de API para Desenvolvedores</h3>
                      <p className="text-xs text-altix-muted">Chaves de acesso para automação CI/CD e Terraform.</p>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all">
                      + Gerar Nova Chave
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="text-altix-green font-bold mb-1">altix_live_pk_99281038472910</div>
                      <div className="text-[10px] text-altix-muted">Criado em 07/08/2026 • Acesso Total</div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-md glass-card p-6 rounded-2xl space-y-4 border border-altix-offline/40">
                <div className="flex items-center gap-3 text-altix-offline">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="font-extrabold text-base">Excluir Conta Permanentemente?</h3>
                </div>
                <p className="text-xs text-altix-muted leading-relaxed">
                  Esta ação é irreversível. Todos os seus monitores, históricos de incidentes, logs e alertas serão excluídos.
                </p>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-altix-muted hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      showSuccessFeedback('Sua solicitação de exclusão foi processada.');
                    }}
                    className="px-4 py-2 rounded-xl bg-altix-offline text-white text-xs font-bold hover:bg-red-600 transition-all"
                  >
                    Confirmar Exclusão
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
