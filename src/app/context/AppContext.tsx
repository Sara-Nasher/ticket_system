import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Lang, Page, AuthUser, CalMode, ThemeMode, I18n } from '../types';
import { T } from '../i18n/translations';
import { authService } from '../../services/auth';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  i: I18n;
  isRTL: boolean;
  page: Page;
  navigate: (p: Page, params?: any) => void;
  params: any;
  auth: AuthUser | null;
  setAuth: (u: AuthUser | null) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  calMode: CalMode;
  setCalMode: (c: CalMode) => void;
  themeMode: ThemeMode;
  setThemeMode: (t: ThemeMode) => void;
  resolvedTheme: "dark" | "light";
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<AuthUser>) => Promise<void>;
  updateProfile: (userData: Partial<AuthUser>) => Promise<void>;
  loading: boolean;
}

const AppCtx = createContext<Ctx>({} as Ctx);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>("fa");
  const [page, setPage] = useState<Page>("landing");
  const [params, setParams] = useState<any>(null);
  const [auth, setAuth] = useState<AuthUser | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calMode, setCalModeState] = useState<CalMode>(() => (localStorage.getItem("av-cal") as CalMode | null) ?? "jalali");
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => (localStorage.getItem("av-theme") as ThemeMode | null) ?? "dark");

  const [osDark, setOsDark] = useState(() => window.matchMedia?.("(prefers-color-scheme:dark)").matches ?? true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setAuth(user);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme:dark)");
    const handler = (e: MediaQueryListEvent) => setOsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: "dark" | "light" = themeMode === "system" ? (osDark ? "dark" : "light") : themeMode;

  const setThemeMode = useCallback((t: ThemeMode) => {
    setThemeModeState(t);
    localStorage.setItem("av-theme", t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const isRTL = lang === "fa";
  const i = T[lang] as I18n;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.setAttribute("dir", l === "fa" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
    document.documentElement.style.fontFamily = l === "fa" ? "'Vazirmatn',sans-serif" : "'Inter',sans-serif";
  }, []);

  const setCalMode = useCallback((c: CalMode) => {
    setCalModeState(c);
    localStorage.setItem("av-cal", c);
  }, []);

  const navigate = useCallback((p: Page, prms?: any) => {
    setPage(p);
    setParams(prms ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 [AppContext.login] Attempting login with:', email);
      const { user, token } = await authService.login(email, password);
      console.log('✅ [AppContext.login] Login successful for:', user.email);
      setAuth(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(user.role === 'admin' ? 'admin-dash' : 'dashboard');
      console.log('✅ [AppContext.login] Navigated to:', user.role === 'admin' ? 'admin-dash' : 'dashboard');
    } catch (error: any) {
      console.error('❌ [AppContext.login] Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setAuth(null);
    navigate('landing');
  }, [navigate]);

  const register = useCallback(async (userData: Partial<AuthUser>) => {
    setLoading(true);
    try {
      const user = await authService.register(userData);
      setAuth(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('dashboard');
    } catch (error: any) {
      console.error('❌ [AppContext.register] Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateProfile = useCallback(async (userData: Partial<AuthUser>) => {
    setLoading(true);
    try {
      const user = await authService.updateProfile(userData);
      setAuth(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      console.error('❌ [AppContext.updateProfile] Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    lang,
    setLang,
    i,
    isRTL,
    page,
    navigate,
    params,
    auth,
    setAuth,
    collapsed,
    setCollapsed,
    searchOpen,
    setSearchOpen,
    calMode,
    setCalMode,
    themeMode,
    setThemeMode,
    resolvedTheme,
    login,
    logout,
    register,
    updateProfile,
    loading,
  }), [lang, page, params, auth, collapsed, searchOpen, calMode, themeMode, resolvedTheme, loading, navigate, setLang, setCalMode, setThemeMode, login, logout, register, updateProfile]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};

export const useApp = () => {
  const context = useContext(AppCtx);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};