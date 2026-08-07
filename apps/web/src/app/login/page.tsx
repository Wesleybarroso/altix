'use client';

import React, { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { Mail, Lock, ShieldCheck, Github, Globe, ArrowRight, ShieldAlert, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, upsertSocialUser } from '@/lib/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [is2FA, setIs2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const router = useRouter();

  // Redirect to Dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password) {
      setErrorMsg('Por favor, informe sua senha de acesso.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (email.includes('error') || password === 'error') {
        setErrorMsg('E-mail ou senha incorretos. Por favor, verifique suas credenciais.');
        return;
      }

      if (!is2FA) {
        setIs2FA(true);
      } else {
        localStorage.setItem('altix_token', `jwt_user_session_${Date.now()}`);
        localStorage.setItem('altix_user', JSON.stringify({
          name: 'Wesley Santos',
          company: 'Acme Cloud Corp',
          email,
          createdAt: '07/08/2026',
        }));
        router.push('/');
      }
    }, 600);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setErrorMsg('');
    setSocialLoading(provider);

    setTimeout(() => {
      setSocialLoading(null);
      const socialUser = provider === 'google'
        ? { name: 'Wesley Santos (Google)', email: 'wesley.google@altix.io', avatarUrl: 'https://lh3.googleusercontent.com/a/default-user' }
        : { name: 'Wesley Santos (GitHub)', email: 'wesley.github@altix.io', avatarUrl: 'https://avatars.githubusercontent.com/u/1000' };

      upsertSocialUser(provider, socialUser);
      router.push('/');
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
          <h2 className="text-xl font-bold tracking-tight">Acessar a Plataforma ALTIX</h2>
          <p className="text-xs text-altix-muted">Monitoramento inteligente. Disponibilidade em tempo real.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-altix-offline/10 border border-altix-offline/30 text-altix-offline text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {!is2FA ? (
            <>
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
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-altix-muted">Senha</label>
                  <Link href="/forgot-password" className="text-[11px] text-altix-green hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
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
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(socialLoading)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar para o Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 rounded-xl bg-altix-green/10 border border-altix-green/30 text-xs text-altix-green flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>Autenticação de Dois Fatores (2FA / TOTP) requerida para esta conta.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-altix-muted block mb-1">Código de 6 dígitos do Authenticator</label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  autoFocus
                  required
                  className="w-full text-center tracking-widest font-mono text-lg py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-altix-green"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-altix-green text-black font-bold text-xs hover:bg-altix-green-light transition-all shadow-glow disabled:opacity-50"
              >
                {loading ? <span>Verificando...</span> : <span>Verificar Código e Entrar</span>}
              </button>
            </div>
          )}
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] text-altix-muted font-mono uppercase">ou autentique via SSO</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Social Login Buttons (Google & GitHub) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin('github')}
            disabled={loading || Boolean(socialLoading)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-altix-green/40 text-xs text-white transition-all disabled:opacity-50"
          >
            {socialLoading === 'github' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-altix-green" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            <span>Entrar com GitHub</span>
          </button>

          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loading || Boolean(socialLoading)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-altix-green/40 text-xs text-white transition-all disabled:opacity-50"
          >
            {socialLoading === 'google' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-altix-green" />
            ) : (
              <Globe className="w-4 h-4 text-emerald-400" />
            )}
            <span>Entrar com Google</span>
          </button>
        </div>

        <div className="text-center text-xs text-altix-muted pt-2 border-t border-white/10">
          Não tem uma conta ainda?{' '}
          <Link href="/register" className="text-altix-green font-bold hover:underline">
            Criar conta grátis
          </Link>
        </div>
      </div>
    </div>
  );
}
