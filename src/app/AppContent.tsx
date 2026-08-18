import React from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { useApp } from './context/AppContext';


import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyTickets from './pages/MyTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import AdminDash from './pages/AdminDash';
import UserMgmt from './pages/UserMgmt';
import AdminTickets from './pages/AdminTickets';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';


const AppContent: React.FC = () => {
  const { page, isRTL, resolvedTheme, lang, loading } = useApp();

  const fontFamily = isRTL 
    ? "'Vazirmatn', 'Shabnam', sans-serif" 
    : "'Inter', 'Plus Jakarta Sans', sans-serif";

  const antTokensDark = {
    colorPrimary: "#2b6cb0",
    colorSuccess: "#38b2ac",
    colorWarning: "#d97706",
    colorError: "#ef4444",
    colorInfo: "#2b6cb0",
    borderRadius: 10,
    fontFamily: fontFamily,
    fontSize: isRTL ? 15 : 14,
    colorBgBase: "#03091c",
    colorBgContainer: "#070e24",
    colorBgElevated: "#0a1330",
    colorBorder: "rgba(255,255,255,0.07)",
    colorBorderSecondary: "rgba(255,255,255,0.04)",
    colorText: "#e8eeff",
    colorTextSecondary: "#93a8c4",
    colorTextTertiary: "#546885",
    colorTextQuaternary: "#2d3f5a",
  };

  const antTokensLight = {
    colorPrimary: "#2b6cb0",
    colorSuccess: "#38b2ac",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorInfo: "#2b6cb0",
    borderRadius: 10,
    fontFamily: fontFamily,
    fontSize: isRTL ? 15 : 14,
    colorBgBase: "#eef2ff",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#f5f7ff",
    colorBorder: "rgba(43,108,176,0.15)",
    colorBorderSecondary: "rgba(43,108,176,0.08)",
    colorText: "#1a2744",
    colorTextSecondary: "#3d5a80",
    colorTextTertiary: "#607a9a",
    colorTextQuaternary: "#94a3b8",
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--av-bg)',
      }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          border: '3px solid var(--av-border)',
          borderTop: '3px solid #2b6cb0',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "landing": return <Landing />;
      case "login": return <Login />;
      case "register": return <Register />;
      case "dashboard": return <Dashboard />;
      case "profile": return <Profile />;
      case "my-tickets": return <MyTickets />;
      case "ticket-detail":
      case "admin-ticket-detail": return <TicketDetail />;
      case "create-ticket": return <CreateTicket />;
      case "admin-dash": return <AdminDash />;
      case "admin-users": return <UserMgmt />;
      case "admin-tickets": return <AdminTickets />;
      case "reports": return <Reports />;
      case "analytics": return <Analytics />;
      case "settings": return <Settings />;
      case "not-found": return <NotFound />;
      case "server-error": return <ServerError />;
      default: return <NotFound />;
    }
  };

  return (
    <ConfigProvider
      direction={isRTL ? "rtl" : "ltr"}
      theme={{
        algorithm: resolvedTheme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: resolvedTheme === "dark" ? antTokensDark : antTokensLight,
      }}
    >
      {renderPage()}
    </ConfigProvider>
  );
};

export default AppContent;