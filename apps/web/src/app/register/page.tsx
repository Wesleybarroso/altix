'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Mail, Lock, User, Building2, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passwordScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordValid = passwordScore === 5;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!termsAccepted) {
      setErrorMsg('Você precisa aceitar os termos de serviço para criar a conta.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Sua senha não atende a todos os requisitos de segurança.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate successful account creation
      localStorage.setItem('altix_user', JSON.stringify({
        name,
        company,
        email,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      }));
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-altix-bg text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-altix-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg glass-card p-8 rounded-3xl space-y-6 border border-white/10 shadow-2xl relative z-10 my-8">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size={44} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Criar Conta no ALTIX</h2>
          <p className="text-xs text-altix-muted">Cadastre sua empresa e comece a monitorar em tempo real.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-altix-offline/10 border border-altix-offline/30 text-altix-offline text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-altix-muted block mb-1">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-altix-muted absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-altix-muted block mb-1">Empresa / Organização</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-altix-muted absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Nome da empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-altix-muted block mb-1">E-mail corporativo</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-altix-muted absolute left-3 top-3" />
              <input
                type="email"
                placeholder="seu.nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-altix-muted block mb-1">Senha de Acesso</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-altix-muted absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
              />
            </div>

            {/* Password strength meter */}
            {password && (
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
            <label className="text-xs font-semibold text-altix-muted block mb-1">Confirmar Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-altix-muted absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
              />
            </div>
            {confirmPassword && !passwordsMatch && (
              <span className="text-[10px] text-altix-offline block mt-1">As senhas não coincidem.</span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded bg-white/10 border-white/20 text-altix-green focus:ring-altix-green"
            />
            <label htmlFor="terms" className="text-xs text-altix-muted">
              Li e aceito os <a href="#" className="text-altix-green hover:underline">Termos de Serviço</a> e a <a href="#" className="text-altix-green hover:underline">Política de Privacidade</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow disabled:opacity-50"
          >
            {loading ? <span>Criando sua conta...</span> : (
              <>
                <span>Criar Conta e Iniciar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-altix-muted pt-2 border-t border-white/10">
          Já possui uma conta?{' '}
          <Link href="/login" className="text-altix-green font-bold hover:underline">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
