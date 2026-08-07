'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Mail, Lock, CheckCircle2, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  // Password strength meter
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Por favor, informe um e-mail válido.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`Instruções de redefinição enviadas para ${email}!`);
      setStep(2);
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (passwordScore < 5) {
      setErrorMsg('A nova senha não preenche todos os requisitos de segurança.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Sua senha foi redefinida com sucesso!');
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-altix-bg text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-altix-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 rounded-3xl space-y-6 border border-white/10 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size={44} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Recuperação de Senha</h2>
          <p className="text-xs text-altix-muted">Redefina o acesso à sua conta ALTIX com segurança.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-altix-offline/10 border border-altix-offline/30 text-altix-offline text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-altix-green/10 border border-altix-green/30 text-altix-green text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-altix-muted block mb-1">Informe seu e-mail cadastrado</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow disabled:opacity-50"
            >
              {loading ? <span>Enviando...</span> : (
                <>
                  <span>Enviar Link de Redefinição</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-altix-muted block mb-1">Nova Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-altix-muted absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-altix-green"
                />
              </div>

              {/* Password strength meter */}
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow disabled:opacity-50"
            >
              {loading ? <span>Redefinindo...</span> : <span>Salvar Nova Senha</span>}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-altix-muted pt-2 border-t border-white/10">
          Lembrou a senha?{' '}
          <Link href="/login" className="text-altix-green font-bold hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
