import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { SearchOutlined, FileTextOutlined, UserOutlined, RightOutlined, HistoryOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { TICKETS, USERS } from '../data/mockData';
import type { Page } from '../types';

const SEARCH_STORAGE_KEY = "av-recent-searches";

const GlobalSearch: React.FC = () => {
  const { searchOpen, setSearchOpen, i, navigate, isRTL } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "tickets" | "users" | "pages">("all");
  const [selected, setSelected] = useState(0);
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const inputRef = useRef<any>(null);

  const PAGES_INDEX = [
    { label: i.dashboard, page: "dashboard" as Page },
    { label: i.myTickets, page: "my-tickets" as Page },
    { label: i.createTicket, page: "create-ticket" as Page },
    { label: i.profile, page: "profile" as Page },
    { label: i.settings, page: "settings" as Page },
    { label: i.adminDash, page: "admin-dash" as Page },
    { label: i.userMgmt, page: "admin-users" as Page },
    { label: i.ticketMgmt, page: "admin-tickets" as Page },
    { label: i.reports, page: "reports" as Page },
    { label: i.analytics, page: "analytics" as Page },
  ];

  const ticketResults = useMemo(() => {
    if (!query.trim() || filter === "users" || filter === "pages") return [];
    const q = query.toLowerCase();
    return TICKETS.filter(t =>
      t.subject.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, filter]);

  const userResults = useMemo(() => {
    if (!query.trim() || filter === "tickets" || filter === "pages") return [];
    const q = query.toLowerCase();
    return USERS.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, filter]);

  const pageResults = useMemo(() => {
    if (!query.trim() || filter === "tickets" || filter === "users") return [];
    const q = query.toLowerCase();
    return PAGES_INDEX.filter(p => p.label.toLowerCase().includes(q)).slice(0, 5);
  }, [query, filter]);

  const allResults: Array<{ type: "ticket" | "user" | "page"; item: any }> = [
    ...ticketResults.map(t => ({ type: "ticket" as const, item: t })),
    ...userResults.map(u => ({ type: "user" as const, item: u })),
    ...pageResults.map(p => ({ type: "page" as const, item: p })),
  ];

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const saveRecent = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 8);
    setRecent(updated);
    localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSelect = (result: { type: "ticket" | "user" | "page"; item: any }) => {
    saveRecent(query);
    setSearchOpen(false);
    if (result.type === "ticket") navigate("ticket-detail", { ticketId: result.item.id });
    else if (result.type === "user") navigate("admin-users");
    else navigate(result.item.page);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && allResults[selected]) {
      handleSelect(allResults[selected]);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const statusColor: Record<string, string> = {
    open: "#52c41a",
    closed: "#ff4d4f",
    pending: "#faad14",
    "in_progress": "#1890ff",
    resolved: "#10b981"
  };

  return (
    <Modal
      open={searchOpen}
      onCancel={() => setSearchOpen(false)}
      footer={null}
      closable={false}
      width={640}
      centered
      styles={{
        content: {
          padding: 0,
          background: "#141414",
          border: "1px solid #303030",
          borderRadius: 12,
          overflow: "hidden"
        }
      }}
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #303030", display: "flex", alignItems: "center", gap: 10 }}>
        <SearchOutlined style={{ color: "#888", fontSize: 18 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(0); }}
          onKeyDown={handleKeyDown}
          placeholder={i.searchPlaceholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 16,
            direction: isRTL ? "rtl" : "ltr"
          }}
        />
        <kbd style={{ background: "#222", color: "#888", padding: "2px 8px", borderRadius: 4, fontSize: 12, border: "1px solid #444" }}>Esc</kbd>
      </div>
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #262626", display: "flex", gap: 8 }}>
        {(["all", "tickets", "users", "pages"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "3px 12px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: filter === f ? "#1677ff" : "#333",
              background: filter === f ? "rgba(22,119,255,0.15)" : "transparent",
              color: filter === f ? "#1677ff" : "#888",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {f === "all" ? i.searchAll : f === "tickets" ? i.searchTicketsLabel : f === "users" ? i.searchUsersLabel : i.searchPagesLabel}
          </button>
        ))}
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto", padding: "8px 0" }}>
        {!query.trim() && recent.length > 0 && (
          <div>
            <div style={{ padding: "4px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{i.recentSearches}</span>
              <button
                onClick={() => { setRecent([]); localStorage.removeItem(SEARCH_STORAGE_KEY); }}
                style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}
              >
                {i.clearRecent}
              </button>
            </div>
            {recent.map(r => (
              <button
                key={r}
                onClick={() => setQuery(r)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 16px",
                  background: "none",
                  border: "none",
                  color: "#ccc",
                  cursor: "pointer",
                  textAlign: isRTL ? "right" : "left",
                  fontSize: 14,
                }}
              >
                <HistoryOutlined style={{ color: "#555", fontSize: 13 }} />
                {r}
              </button>
            ))}
          </div>
        )}
        {query.trim() && allResults.length === 0 && (
          <div style={{ padding: "40px 16px", textAlign: "center", color: "#555" }}>
            <SearchOutlined style={{ fontSize: 32, marginBottom: 12, display: "block" }} />
            {i.noResults}
          </div>
        )}
        {query.trim() && ticketResults.length > 0 && (filter === "all" || filter === "tickets") && (
          <div>
            <div style={{ padding: "4px 16px 4px", color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{i.searchTicketsLabel}</div>
            {ticketResults.map((t, idx) => {
              const globalIdx = idx;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect({ type: "ticket", item: t })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 16px",
                    background: selected === globalIdx ? "rgba(22,119,255,0.1)" : "none",
                    border: "none",
                    borderLeft: selected === globalIdx ? "2px solid #1677ff" : "2px solid transparent",
                    color: "#ddd",
                    cursor: "pointer",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  <FileTextOutlined style={{ color: "#1677ff", fontSize: 15, flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{t.id} · <span style={{ color: statusColor[t.status] ?? "#888" }}>{t.status}</span></div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {query.trim() && userResults.length > 0 && (filter === "all" || filter === "users") && (
          <div>
            <div style={{ padding: "4px 16px 4px", color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{i.searchUsersLabel}</div>
            {userResults.map((u, idx) => {
              const globalIdx = ticketResults.length + idx;
              return (
                <button
                  key={u.id}
                  onClick={() => handleSelect({ type: "user", item: u })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 16px",
                    background: selected === globalIdx ? "rgba(22,119,255,0.1)" : "none",
                    border: "none",
                    borderLeft: selected === globalIdx ? "2px solid #1677ff" : "2px solid transparent",
                    color: "#ddd",
                    cursor: "pointer",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  <UserOutlined style={{ color: "#52c41a", fontSize: 15, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{u.email} · {u.role}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {query.trim() && pageResults.length > 0 && (filter === "all" || filter === "pages") && (
          <div>
            <div style={{ padding: "4px 16px 4px", color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{i.searchPagesLabel}</div>
            {pageResults.map((p, idx) => {
              const globalIdx = ticketResults.length + userResults.length + idx;
              return (
                <button
                  key={p.page}
                  onClick={() => handleSelect({ type: "page", item: p })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 16px",
                    background: selected === globalIdx ? "rgba(22,119,255,0.1)" : "none",
                    border: "none",
                    borderLeft: selected === globalIdx ? "2px solid #1677ff" : "2px solid transparent",
                    color: "#ddd",
                    cursor: "pointer",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  <RightOutlined style={{ color: "#faad14", fontSize: 13, flexShrink: 0 }} />
                  <div style={{ fontSize: 14 }}>{p.label}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {query.trim() && allResults.length > 0 && (
        <div style={{ padding: "8px 16px", borderTop: "1px solid #262626", color: "#555", fontSize: 11, display: "flex", gap: 16 }}>
          <span>↑↓ {i.navigate}</span>
          <span>↵ {i.select}</span>
          <span>Esc {i.close}</span>
        </div>
      )}
    </Modal>
  );
};

export default GlobalSearch;