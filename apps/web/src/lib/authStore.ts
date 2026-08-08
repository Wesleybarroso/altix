export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  role?: string;
  language?: string;
  timezone?: string;
  avatarUrl?: string;
  provider?: 'credentials' | 'google' | 'github';
  providerId?: string;
  createdAt: string;
  lastAccess: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: string;
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY';
  timeFormat: '24h' | '12h';
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-90124',
  name: 'Wesley Santos',
  email: 'wesley@altix.io',
  company: 'Acme Cloud Corp',
  phone: '+55 11 99999-8888',
  role: 'Software Architect / Admin',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo (GMT-3)',
  createdAt: '07/08/2026',
  lastAccess: 'Agora mesmo (IP 189.40.12.9)',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'pt-BR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('altix_token'));
}

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  const data = localStorage.getItem('altix_user');
  return data ? JSON.parse(data) : DEFAULT_USER;
}

export function saveStoredUser(user: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('altix_user', JSON.stringify(user));
  }
}

export function upsertSocialUser(provider: 'google' | 'github', socialData: { name: string; email: string; avatarUrl: string }): UserProfile {
  const newUser: UserProfile = {
    id: `usr-${provider}-${Date.now()}`,
    name: socialData.name,
    email: socialData.email,
    company: 'Organização Pessoal',
    avatarUrl: socialData.avatarUrl,
    provider,
    providerId: `${provider}_id_${Math.floor(Math.random() * 1000000)}`,
    createdAt: new Date().toLocaleDateString('pt-BR'),
    lastAccess: 'Agora mesmo',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('altix_token', `jwt_${provider}_token_${Date.now()}`);
    localStorage.setItem('altix_user', JSON.stringify(newUser));
  }

  return newUser;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('altix_token');
    localStorage.removeItem('altix_user');
    localStorage.removeItem('altix_session');
    window.location.href = '/login';
  }
}

export function getStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const data = localStorage.getItem('altix_preferences');
  return data ? JSON.parse(data) : DEFAULT_PREFERENCES;
}

export function saveStoredPreferences(prefs: UserPreferences): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('altix_preferences', JSON.stringify(prefs));
  }
}

// New Notification Settings Types and Functions
export interface NotificationChannel {
  enabled: boolean;
  recipients?: string;
  webhookUrl?: string;
  chatId?: string;
}

export interface NotificationSettings {
  whatsApp: { enabled: boolean; recipients: string };
  telegram: { enabled: boolean; chatId: string };
  discord: { enabled: boolean; webhookUrl: string };
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  whatsApp: { enabled: false, recipients: '' },
  telegram: { enabled: false, chatId: '' },
  discord: { enabled: false, webhookUrl: '' },
};

export function getStoredNotifications(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  const data = localStorage.getItem('altix_notifications');
  return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
}

export function saveStoredNotifications(settings: NotificationSettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('altix_notifications', JSON.stringify(settings));
  }
}
