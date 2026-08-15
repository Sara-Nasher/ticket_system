import React from 'react';
import {
  Button,
  Avatar,
  Progress,
  Select,
  Input,
  Breadcrumb,
  Empty,
  Upload,
  Switch,
  Radio,
  Steps,
  Timeline,
  Divider,
  Popconfirm,
  Tooltip,
  Badge,
  Dropdown,
  Menu,
  Drawer,
  Modal,
  Skeleton,
  Row,
  Col,
  Tabs,
  Alert,
  Result,
  Table,
  Pagination,
  Form,
  InputNumber,
  Checkbox,
  DatePicker,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  FolderOpenOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UploadOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  LineChartOutlined,
  SafetyOutlined,
  TeamOutlined,
  CloudOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  ReloadOutlined,
  CrownOutlined,
  SearchOutlined,
  CalendarOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  HistoryOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  StarOutlined,
  TrophyOutlined,
  FireOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import type { TicketStatus, Priority, I18n, Page } from '../types';
import { fDate, fNum } from '../utils/helpers';

// ─── Buttons ───────────────────────────────────────────────────────────────────

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

// ─── Logo ─────────────────────────────────────────────────────────────────────

export const Logo: React.FC<{ size?: number; text?: boolean; isRTL?: boolean }> = ({
  size = 32,
  text = true,
  isRTL,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: "linear-gradient(135deg,#1e40af,#3b82f6,#0ea5e9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 20px rgba(59,130,246,.45),inset 0 1px 0 rgba(255,255,255,.2)",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 18 18" fill="none">
        <path d="M9 2.5L3.5 14.5h11L9 2.5z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6.2 11h5.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="10" r=".9" fill="white" />
      </svg>
    </div>
    {text && (
      <span
        style={{
          fontWeight: 800,
          fontSize: size * 0.5,
          color: "var(--av-text)",
          fontFamily: "var(--av-font-display)",
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        {isRTL ? "اوستا" : "Avesta"}
      </span>
    )}
  </div>
);

// ─── Status Tags ─────────────────────────────────────────────────────────────

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
  return (
    <span className={`av-tag ${cls}`}>
      {i[priority as keyof I18n] as string}
    </span>
  );
};

// ─── Stat ────────────────────────────────────────────────────────────────────

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

// ─── Panel ──────────────────────────────────────────────────────────────────

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }> = ({
  children,
  style,
  className,
}) => (
  <div className={`av-panel${className ? " " + className : ""}`} style={{ padding: 24, ...style }}>
    {children}
  </div>
);

// ─── Page Header ────────────────────────────────────────────────────────────

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
            <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => c.page && navigate(c.page)}>
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

// ─── Styles ─────────────────────────────────────────────────────────────────

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
    border: "1px solid rgba(59,130,246,.22)",
    borderRadius: 10,
    color: "var(--av-text)",
  },
};