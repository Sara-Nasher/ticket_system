// src/components/Layouts.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Drawer, Breadcrumb, App } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  CustomerServiceOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  CalendarOutlined,
  GlobalOutlined,
  CrownOutlined,
  TeamOutlined,
  LineChartOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HomeOutlined,
  ReloadOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  StarOutlined,
  TrophyOutlined,
  FireOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  HistoryOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { notificationService, type Notification } from '../../services/notification';
import { fDate } from '../utils/helpers';
import type { Page, TicketStatus, Priority, I18n } from '../types';

const { Header, Sider, Content } = Layout;

// ============================================================
// LOGO - Aven Premium Ultra
// ============================================================
export const Logo: React.FC<{ size?: number; text?: boolean; isRTL?: boolean }> = ({
  size = 32,
  text = true,
  isRTL,
}) => (
  <div
    className="logo-container"
    style={{ display: "flex", alignItems: "center", gap: 10 }}
  >
    <div
      className="logo-icon"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        background: "linear-gradient(145deg, #0f2b4f, #1a4a7a, #2b6cb0, #38b2ac)",
        backgroundSize: "300% 300%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `
          0 8px 32px rgba(43, 108, 176, 0.4),
          inset 0 1px 0 rgba(255,255,255,0.15),
          inset 0 -1px 0 rgba(0,0,0,0.2)
        `,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: "av-grad 8s ease infinite",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(56,178,172,0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(43,108,176,0.1) 0%, transparent 40%)
          `,
          pointerEvents: "none",
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 80"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          pointerEvents: "none",
        }}
      >
        <line x1="10" y1="40" x2="70" y2="40" stroke="white" strokeWidth="0.3" />
        <line x1="40" y1="10" x2="40" y2="70" stroke="white" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="25" stroke="white" strokeWidth="0.3" fill="none" />
        <circle cx="40" cy="40" r="15" stroke="white" strokeWidth="0.2" fill="none" />
      </svg>

      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 48 48"
        fill="none"
        style={{ position: "relative", zIndex: 1 }}
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r="14"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="2 3"
        />

        <path
          d="M24 6 L8 40 L16 40 L20 30 L28 30 L32 40 L40 40 L24 6Z"
          fill="white"
          opacity="0.95"
        />
        
        <path
          d="M24 12 L14 36 L19 36 L22 28 L26 28 L29 36 L34 36 L24 12Z"
          fill="rgba(255,255,255,0.12)"
        />

        <path
          d="M18 24 L24 25 L30 24"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19 26 L24 27 L29 26"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <circle cx="24" cy="8" r="2.5" fill="white" opacity="0.95">
          <animate attributeName="opacity" values="0.95;0.4;0.95" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="8" r="5" fill="rgba(255,255,255,0.08)">
          <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.02;0.08" dur="2.5s" repeatCount="indefinite" />
        </circle>

        <path
          d="M6 42 C12 38, 16 44, 22 40 C28 36, 32 42, 38 38 C42 35.5, 44 36.5, 46 38"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 44 C14 40, 18 46, 24 42 C30 38, 34 44, 40 40 C43 38, 45 39, 47 40"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        <circle cx="10" cy="44" r="1" fill="rgba(255,255,255,0.2)" />
        <circle cx="38" cy="44" r="1" fill="rgba(255,255,255,0.2)" />
        <circle cx="16" cy="46" r="0.6" fill="rgba(255,255,255,0.12)" />
        <circle cx="32" cy="46" r="0.6" fill="rgba(255,255,255,0.12)" />
        <circle cx="24" cy="45" r="0.8" fill="rgba(255,255,255,0.08)" />

        <circle cx="6" cy="20" r="0.8" fill="rgba(255,255,255,0.08)">
          <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="42" cy="16" r="0.8" fill="rgba(255,255,255,0.08)">
          <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="12" cy="12" r="0.5" fill="rgba(255,255,255,0.06)">
          <animate attributeName="opacity" values="0.06;0.01;0.06" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="36" cy="10" r="0.5" fill="rgba(255,255,255,0.06)">
          <animate attributeName="opacity" values="0.06;0.01;0.06" dur="3.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle, rgba(56,178,172,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "av-glow-pulse 3s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-60%",
          left: "-60%",
          width: "220%",
          height: "220%",
          background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.06) 50%, transparent 60%)",
          pointerEvents: "none",
          animation: "av-shimmer 4.5s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 1,
          borderRadius: size * 0.25 - 1,
          border: "1px solid rgba(255,255,255,0.08)",
          pointerEvents: "none",
          transition: "border-color 0.3s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          width: "30%",
          height: "30%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
          borderTopRightRadius: size * 0.25 - 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 2,
          left: 2,
          width: "25%",
          height: "25%",
          background: "linear-gradient(225deg, rgba(56,178,172,0.06) 0%, transparent 100%)",
          borderBottomLeftRadius: size * 0.25 - 2,
          pointerEvents: "none",
        }}
      />
    </div>
    
    {text && (
      <div style={{ position: "relative", lineHeight: 1 }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: size * 0.52,
            color: "var(--av-text)",
            fontFamily: "var(--av-font-display)",
            letterSpacing: "-0.025em",
            display: "block",
          }}
        >
          {isRTL ? "آون" : "Aven"}
        </span>
        <span
          style={{
            display: "block",
            fontSize: size * 0.18,
            fontWeight: 500,
            color: "var(--av-text3)",
            fontFamily: "var(--av-font-body)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.6,
            marginTop: -1,
          }}
        >
          {isRTL ? "پشتیبانی · جریان · اعتماد" : "Support · Flow · Trust"}
        </span>
      </div>
    )}
  </div>
);

// ============================================================
// PRIMITIVES
// ============================================================

export const Btn: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  htmlType?: "submit" | "button";
  loading?: boolean;
  disabled?: boolean;
  sz?: "sm" | "md" | "lg";
  block?: boolean;
  icon?: React.ReactNode;
}> = ({ children, onClick, htmlType = "button", loading, disabled, sz = "md", block, icon }) => {
  const p = { sm: "7px 16px", md: "10px 22px", lg: "13px 30px" }[sz];
  const fs = { sm: 12, md: 14, lg: 15 }[sz];
  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled || loading}
      className="av-btn-p"
      style={{ padding: p, fontSize: fs, width: block ? "100%" : undefined }}
    >
      {loading ? <SyncOutlined spin style={{ fontSize: 13 }} /> : icon}
      {children}
    </button>
  );
};

export const GBtn: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  sz?: "sm" | "md" | "lg";
}> = ({ children, onClick, sz = "md" }) => {
  const p = { sm: "6px 14px", md: "9px 20px", lg: "12px 28px" }[sz];
  const fs = { sm: 12, md: 14, lg: 15 }[sz];
  return (
    <button onClick={onClick} className="av-btn-g" style={{ padding: p, fontSize: fs }}>
      {children}
    </button>
  );
};

export const GoldBtn: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  sz?: "sm" | "md" | "lg";
  block?: boolean;
}> = ({ children, onClick, loading, sz = "md", block }) => {
  const p = { sm: "7px 16px", md: "10px 22px", lg: "13px 30px" }[sz];
  const fs = { sm: 12, md: 14, lg: 15 }[sz];
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="av-btn-gold"
      style={{ padding: p, fontSize: fs, width: block ? "100%" : undefined }}
    >
      {loading ? <SyncOutlined spin /> : null}
      {children}
    </button>
  );
};

export const StTag: React.FC<{ status: TicketStatus; i: I18n }> = ({ status, i }) => {
  const cls = {
    open: "av-st-open",
    in_progress: "av-st-progress",
    resolved: "av-st-resolved",
    closed: "av-st-closed",
  }[status];
  const icons = {
    open: <FolderOpenOutlined />,
    in_progress: <SyncOutlined spin />,
    resolved: <CheckCircleOutlined />,
    closed: <CloseCircleOutlined />,
  };
  return (
    <span className={`av-tag ${cls}`}>
      {icons[status]} {i[status as keyof I18n] as string}
    </span>
  );
};

export const PrTag: React.FC<{ priority: Priority; i: I18n }> = ({ priority, i }) => {
  const cls = {
    low: "av-pr-low",
    medium: "av-pr-medium",
    high: "av-pr-high",
    urgent: "av-pr-urgent",
  }[priority];
  return <span className={`av-tag ${cls}`}>{i[priority as keyof I18n] as string}</span>;
};

export const Stat: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}> = ({ title, value, icon, color, trend }) => (
  <div className="av-stat">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: `${color}14`,
          border: `1px solid ${color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color,
        }}
      >
        {icon}
      </div>
      {trend !== undefined && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: trend >= 0 ? "#34d399" : "#f87171",
            background: trend >= 0 ? "rgba(52,211,153,.1)" : "rgba(248,113,113,.1)",
            border: `1px solid ${trend >= 0 ? "rgba(52,211,153,.22)" : "rgba(248,113,113,.22)"}`,
            padding: "2px 8px",
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color: "var(--av-text)",
        fontFamily: "var(--av-font-display)",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 12, color: "var(--av-text3)", marginTop: 4, fontWeight: 500 }}>{title}</div>
  </div>
);

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }> = ({
  children,
  style,
  className,
}) => (
  <div className={`av-panel${className ? " " + className : ""}`} style={{ padding: 24, ...style }}>
    {children}
  </div>
);

export const PgHeader: React.FC<{
  crumbs: { label: string; page?: Page }[];
  title: string;
  sub?: string;
  extra?: React.ReactNode;
}> = ({ crumbs, title, sub, extra }) => {
  const { navigate } = useApp();
  const ff = "var(--av-font-display)";
  return (
    <div style={{ marginBottom: 26 }}>
      <Breadcrumb
        style={{ marginBottom: 10 }}
        items={crumbs.map((c, idx) => ({
          key: `bc-${idx}-${c.label}`,
          title: c.page ? (
            <span style={{ color: "#2b6cb0", cursor: "pointer" }} onClick={() => c.page && navigate(c.page)}>
              {c.label}
            </span>
          ) : (
            <span style={{ color: "var(--av-text3)" }}>{c.label}</span>
          ),
        }))}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--av-text)",
              margin: 0,
              fontFamily: ff,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          {sub && (
            <p style={{ fontSize: 13, color: "var(--av-text3)", margin: "4px 0 0" }}>{sub}</p>
          )}
        </div>
        {extra}
      </div>
    </div>
  );
};

export const inSt: React.CSSProperties = {
  background: "var(--av-border2)",
  border: "1px solid rgba(255,255,255,.09)",
  color: "var(--av-text)",
  borderRadius: 10,
};

export const lbSt: React.CSSProperties = {
  color: "var(--av-text3)",
  fontSize: 12.5,
  fontWeight: 600,
};

export const TT = {
  contentStyle: {
    background: "var(--av-bg3)",
    border: "1px solid rgba(43,108,176,.22)",
    borderRadius: 10,
    color: "var(--av-text)",
  },
};

// ============================================================
// NOTIFICATION BELL COMPONENT
// ============================================================

const NotificationBell: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const { message } = App.useApp();
  const { auth, isRTL, calMode, navigate } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (auth) {
      fetchNotifications();
    }
  }, [auth]);

  const fetchNotifications = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const data = await notificationService.getUserNotifications(Number(auth.id));
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      message.error(isRTL ? 'خطا در علامت‌گذاری' : 'Error marking as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!auth) return;
    try {
      await notificationService.markAllAsRead(Number(auth.id));
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      message.success(isRTL ? 'همه نوتیف‌ها خوانده شدند' : 'All notifications marked as read');
    } catch (error) {
      message.error(isRTL ? 'خطا در علامت‌گذاری' : 'Error marking as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      message.success(isRTL ? 'نوتیف حذف شد' : 'Notification deleted');
    } catch (error) {
      message.error(isRTL ? 'خطا در حذف' : 'Error deleting');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      const linkParts = notification.link.split('/');
      const id = linkParts[linkParts.length - 1];
      if (isAdmin) {
        navigate('admin-ticket-detail' as any, { ticketId: id });
      } else {
        navigate('ticket-detail' as any, { ticketId: id });
      }
    }
    setOpen(false);
  };

  const menuItems = [
    {
      key: 'header',
      label: (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '8px 12px',
          borderBottom: '1px solid var(--av-border2)',
        }}>
          <span style={{ fontWeight: 700, color: 'var(--av-text)', fontSize: 14 }}>
            {isRTL ? 'نوتیف‌ها' : 'Notifications'}
          </span>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAllAsRead();
              }}
              icon={<CheckOutlined />}
              style={{ color: '#3b82f6' }}
            >
              {isRTL ? 'همه را خوانده شده' : 'Mark all read'}
            </Button>
          )}
        </div>
      ),
    },
    {
      key: 'list',
      label: (
        <div style={{ maxHeight: 400, overflowY: 'auto', minWidth: 380 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--av-text4)' }}>
              {isRTL ? 'در حال بارگذاری...' : 'Loading...'}
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--av-text4)' }}>
              {isRTL ? 'هیچ نوتیفی وجود ندارد' : 'No notifications'}
            </div>
          ) : (
            notifications.slice(0, 20).map((item) => (
              <div
                key={item.id}
                style={{
                  cursor: 'pointer',
                  background: item.isRead ? 'transparent' : 'rgba(59,130,246,.05)',
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--av-border2)',
                  transition: 'background 0.2s',
                  position: 'relative',
                }}
                onClick={() => handleNotificationClick(item)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: 'var(--av-text)', 
                      fontWeight: item.isRead ? 400 : 600,
                      fontSize: 13,
                    }}>
                      {isRTL ? item.title : item.titleEn}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--av-text3)', marginTop: 2 }}>
                      {isRTL ? item.message : item.messageEn}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--av-text4)', marginTop: 4 }}>
                      {fDate(item.createdAt, calMode, isRTL)}
                    </div>
                  </div>
                  {!item.isRead && (
                    <Badge dot color="#3b82f6" style={{ marginTop: 4 }} />
                  )}
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    style={{ color: 'var(--av-text4)', marginLeft: 8 }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ 
        background: 'var(--av-bg2)',
        border: '1px solid var(--av-border)',
        borderRadius: 12,
        boxShadow: '0 12px 48px rgba(0,0,0,.4)',
        maxWidth: 420,
      }}
    >
      <Badge 
        count={unreadCount} 
        size="small"
        style={{ 
          backgroundColor: '#3b82f6',
          boxShadow: '0 0 12px rgba(59,130,246,.4)',
        }}
      >
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 20, color: 'var(--av-text2)' }} />}
          style={{ height: 40, width: 40 }}
        />
      </Badge>
    </Dropdown>
  );
};

// ============================================================
// AUTH SHELL
// ============================================================

export const AuthShell: React.FC<{
  children: React.ReactNode;
  title: string;
  sub: string;
  gold?: boolean;
}> = ({ children, title, sub, gold }) => {
  const { lang, setLang, navigate, isRTL } = useApp();
  const ff = "var(--av-font-display)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--av-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--av-font-body)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="av-orb-1" style={{ opacity: 0.45 }} />
      <div className="av-orb-2" style={{ opacity: 0.3 }} />
      <div className="av-grid" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}>
        <button
          onClick={() => setLang(lang === "en" ? "fa" : "en")}
          style={{
            background: "var(--av-border2)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "var(--av-text3)",
            borderRadius: 8,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <GlobalOutlined style={{ marginRight: 4 }} />
          {lang === "en" ? "FA" : "EN"}
        </button>
      </div>
      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div onClick={() => navigate("landing")} style={{ display: "inline-block", cursor: "pointer", marginBottom: 22 }}>
            <Logo size={30} isRTL={isRTL} />
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--av-text)",
              margin: "0 0 6px",
              fontFamily: ff,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--av-text3)", margin: 0 }}>{sub}</p>
        </div>
        <div
          style={{
            background: "var(--av-surface2)",
            border: `1px solid ${gold ? "rgba(217,119,6,.22)" : "var(--av-border)"}`,
            borderRadius: 20,
            padding: "28px 26px",
            backdropFilter: "blur(32px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// USER LAYOUT
// ============================================================

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    i,
    navigate,
    page,
    auth,
    setAuth,
    lang,
    setLang,
    collapsed,
    setCollapsed,
    isRTL,
    setSearchOpen,
    calMode,
    setCalMode,
    resolvedTheme,
    setThemeMode,
  } = useApp();
  const ff = "var(--av-font-display)";

  const sideItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: i.dashboard },
    { key: "my-tickets", icon: <CustomerServiceOutlined />, label: i.myTickets },
    { key: "create-ticket", icon: <PlusOutlined />, label: i.newTicket },
    { key: "profile", icon: <UserOutlined />, label: i.profile },
    { key: "settings", icon: <SettingOutlined />, label: i.settings },
  ];

  const userMenuItems = [
    { key: "profile", label: i.profile, icon: <UserOutlined /> },
    { key: "settings", label: i.settings, icon: <SettingOutlined /> },
    { type: "divider" as const },
    { key: "logout", label: i.logout, icon: <LogoutOutlined />, danger: true },
  ];

  const handleUserMenu = ({ key }: { key: string }) => {
    if (key === "logout") {
      setAuth(null);
      navigate("landing");
    } else {
      navigate(key as Page);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--av-bg)" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        style={{
          overflow: "hidden auto",
          height: "100vh",
          position: "fixed",
          [isRTL ? "right" : "left"]: 0,
          top: 0,
          zIndex: 100,
          background: "var(--av-bg4)",
          borderRight: "1px solid var(--av-border2)",
        }}
      >
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid var(--av-border2)",
            padding: "0 14px",
          }}
        >
          {collapsed ? <Logo size={26} text={false} /> : <Logo size={24} isRTL={isRTL} />}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          items={sideItems}
          onClick={({ key }) => navigate(key as Page)}
          className="av-menu"
          style={{ background: "transparent", border: "none", marginTop: 8, fontFamily: ff }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: isRTL ? 0 : collapsed ? 80 : 220,
          marginRight: isRTL ? (collapsed ? 80 : 220) : 0,
          transition: "all .2s",
          background: "var(--av-bg)",
        }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            height: 52,
            background: "var(--av-header)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid var(--av-border)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: "var(--av-text3)" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setSearchOpen(true)}
              title="Search (Ctrl+K)"
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 12px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <SearchOutlined />
              <span style={{ color: "var(--av-text4)", fontSize: 10 }}>⌘K</span>
            </button>
            <button
              onClick={() => setCalMode(calMode === "gregorian" ? "jalali" : "gregorian")}
              title={i.calendarType}
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <CalendarOutlined style={{ marginRight: 3 }} />
              {calMode === "jalali" ? "شمسی" : "GR"}
            </button>
            <button
              onClick={() => setThemeMode(resolvedTheme === "dark" ? "light" : "dark")}
              title={i.themeMode}
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {resolvedTheme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <GlobalOutlined style={{ marginRight: 3 }} />
              {lang === "en" ? "FA" : "EN"}
            </button>
            
            {/* ✅ Notification Bell با بک‌اند */}
            <NotificationBell isAdmin={false} />
            
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenu }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "3px 8px",
                  borderRadius: 8,
                  background: "var(--av-surface)",
                }}
              >
                <Avatar
                  size={26}
                  style={{
                    background: "linear-gradient(135deg,#1a365d,#2b6cb0)",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {auth?.name?.charAt(0)}
                </Avatar>
                <span style={{ fontSize: 12, color: "var(--av-text2)", fontWeight: 600 }}>
                  {auth?.name?.split(" ")[0]}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: 22, minHeight: "calc(100vh - 52px)" }} className="av-scroll">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

// ============================================================
// ADMIN LAYOUT
// ============================================================

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    i,
    navigate,
    page,
    auth,
    setAuth,
    lang,
    setLang,
    collapsed,
    setCollapsed,
    isRTL,
    setSearchOpen,
    calMode,
    setCalMode,
    resolvedTheme,
    setThemeMode,
  } = useApp();
  const ff = "var(--av-font-display)";

  const items = [
    { key: "admin-dash", icon: <DashboardOutlined />, label: i.adminDash },
    { key: "admin-users", icon: <TeamOutlined />, label: i.userMgmt },
    { key: "admin-tickets", icon: <CustomerServiceOutlined />, label: i.ticketMgmt },
    { key: "analytics", icon: <LineChartOutlined />, label: i.analytics },
    { key: "reports", icon: <BarChartOutlined />, label: i.reports },
    { key: "settings", icon: <SettingOutlined />, label: i.settings },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--av-bg)" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        style={{
          overflow: "hidden auto",
          height: "100vh",
          position: "fixed",
          [isRTL ? "right" : "left"]: 0,
          top: 0,
          zIndex: 100,
          background: "linear-gradient(180deg,var(--av-bg4),#05112a)",
          borderRight: "1px solid var(--av-border2)",
        }}
      >
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderBottom: "1px solid var(--av-border2)",
            padding: "0 12px",
          }}
        >
          {collapsed ? (
            <CrownOutlined style={{ color: "#d97706", fontSize: 18 }} />
          ) : (
            <>
              <Logo size={22} isRTL={isRTL} />
              <span
                style={{
                  fontSize: 9,
                  background: "rgba(217,119,6,.12)",
                  border: "1px solid rgba(217,119,6,.25)",
                  color: "#fbbf24",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontWeight: 800,
                  letterSpacing: ".04em",
                }}
              >
                ADMIN
              </span>
            </>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          items={items}
          onClick={({ key }) => navigate(key as Page)}
          className="av-menu"
          style={{ background: "transparent", border: "none", marginTop: 8, fontFamily: ff }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "1px solid var(--av-border2)",
            padding: 12,
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Avatar
                size={28}
                style={{
                  background: "linear-gradient(135deg,#92400e,#d97706)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {auth?.name?.charAt(0)}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "var(--av-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {auth?.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--av-text4)" }}>{i.administrator}</div>
              </div>
            </div>
          )}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            block
            danger
            size="small"
            onClick={() => {
              setAuth(null);
              navigate("landing");
            }}
            style={{ color: "#ef4444", justifyContent: "flex-start" }}
          >
            {!collapsed && i.logout}
          </Button>
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: isRTL ? 0 : collapsed ? 80 : 220,
          marginRight: isRTL ? (collapsed ? 80 : 220) : 0,
          transition: "all .2s",
          background: "var(--av-bg)",
        }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            height: 52,
            background: "var(--av-header)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid var(--av-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: "var(--av-text3)" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ color: "var(--av-text3)" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setSearchOpen(true)}
              title="Search (Ctrl+K)"
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 12px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <SearchOutlined />
              <span style={{ color: "var(--av-text4)", fontSize: 10 }}>⌘K</span>
            </button>
            <button
              onClick={() => setCalMode(calMode === "gregorian" ? "jalali" : "gregorian")}
              title={i.calendarType}
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <CalendarOutlined style={{ marginRight: 3 }} />
              {calMode === "jalali" ? "شمسی" : "GR"}
            </button>
            <button
              onClick={() => setThemeMode(resolvedTheme === "dark" ? "light" : "dark")}
              title={i.themeMode}
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {resolvedTheme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              style={{
                background: "var(--av-surface)",
                border: "1px solid var(--av-border)",
                color: "var(--av-text3)",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <GlobalOutlined style={{ marginRight: 3 }} />
              {lang === "en" ? "FA" : "EN"}
            </button>
            
            {/* ✅ Notification Bell با بک‌اند */}
            <NotificationBell isAdmin={true} />
          </div>
        </Header>
        <Content style={{ padding: 22, minHeight: "calc(100vh - 52px)" }} className="av-scroll">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};