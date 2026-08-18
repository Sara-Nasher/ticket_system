// src/app/pages/AdminTickets.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Pagination,
  Empty,
  Tooltip,
  App,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  EyeOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { AdminLayout, Panel, PgHeader, StTag, PrTag } from '../components/Layouts';
import { ticketService } from '../../services/ticket';
import { fDate, fNum } from '../utils/helpers';
import type { TicketRec, TicketStatus, Priority } from '../types';

const AdminTickets: React.FC = () => {
  const { message } = App.useApp();
  const { i, navigate, isRTL, calMode } = useApp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TicketRec[]>([]);
  const [total, setTotal] = useState(0);
  const [pg, setPg] = useState(1);
  const [pgSz, setPgSz] = useState(8);
  const [search, setSearch] = useState("");
  const [stF, setStF] = useState<string | null>(null);
  const [priF, setPriF] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ticketService.getTicketsPaginated({
        page: pg,
        pageSize: pgSz,
        search: search || undefined,
        status: stF || undefined,
        priority: priF || undefined,
      });
      
      setTotal(result.total);
      setData(result.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [search, stF, priF, pg, pgSz]);

  useEffect(() => {
    fetchData();
  }, [pg, pgSz]);

  const doSearch = () => {
    setPg(1);
    fetchData();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  const handleStatusChange = (value: string | null) => {
    setStF(value);
    setPg(1);
    fetchData();
  };

  const handlePriorityChange = (value: string | null) => {
    setPriF(value);
    setPg(1);
    fetchData();
  };

  const handleReset = () => {
    setSearch("");
    setStF(null);
    setPriF(null);
    setPg(1);
    fetchData();
  };

  const cols: TableColumnsType<TicketRec> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 108,
      render: v => (
        <span
          style={{
            fontFamily: "var(--av-font-mono)",
            fontSize: 11,
            color: "#3b82f6",
            background: "rgba(59,130,246,.1)",
            padding: "2px 7px",
            borderRadius: 5,
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: i.subject,
      dataIndex: "subject",
      render: (v, r) => (
        <Button
          type="link"
          style={{ padding: 0, color: "#93c5fd", fontWeight: 600, fontSize: 13 }}
          onClick={() => navigate("admin-ticket-detail", { ticket: r })}
        >
          {isRTL ? r.subjectFa : v}
        </Button>
      ),
    },
    {
      title: i.user,
      dataIndex: "userName",
      render: (v, r) => <span style={{ color: "var(--av-text2)", fontSize: 12 }}>{isRTL ? r.userNameFa : v}</span>,
    },
    {
      title: i.status,
      dataIndex: "status",
      sorter: true,
      render: v => <StTag status={v} i={i} />,
    },
    {
      title: i.priority,
      dataIndex: "priority",
      sorter: true,
      render: v => <PrTag priority={v} i={i} />,
    },
    {
      title: i.assignee,
      dataIndex: "assignee",
      render: v =>
        v ? (
          <span style={{ color: "#14b8a6", fontSize: 12 }}>{v}</span>
        ) : (
          <span style={{ color: "var(--av-text4)", fontSize: 12 }}>—</span>
        ),
    },
    {
      title: i.replies,
      dataIndex: "replies",
      sorter: true,
      render: v => (
        <span
          style={{
            fontFamily: "var(--av-font-mono)",
            fontSize: 13,
            color: "#93c5fd",
          }}
        >
          {fNum(v, isRTL)}
        </span>
      ),
    },
    {
      title: i.created,
      dataIndex: "created",
      sorter: true,
      render: v => <span style={{ color: "var(--av-text4)", fontSize: 12 }}>{fDate(v, calMode, isRTL)}</span>,
    },
    {
      title: "",
      key: "a",
      fixed: "right",
      width: 72,
      render: (_, r) => (
        <div style={{ display: "flex", gap: 2 }}>
          <Tooltip title={i.view}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              style={{ color: "#3b82f6" }}
              onClick={() => navigate("admin-ticket-detail", { ticket: r })}
            />
          </Tooltip>
          <Tooltip title={i.closeTicket}>
            <Button
              type="text"
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => message.success(i.closeTicket)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PgHeader
        crumbs={[{ label: i.adminDash, page: "admin-dash" }, { label: i.ticketMgmt }]}
        title={i.ticketMgmt}
        sub={`${fNum(total, isRTL)} ${i.total} · ${fNum(
          data.filter(t => t.status === "open").length, 
          isRTL
        )} ${i.open}`}
        extra={null}
      />
      <Panel>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <Input
              placeholder={`${i.search}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ width: 200, borderRadius: '8px 0 0 8px' }}
              size="middle"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={doSearch}
              style={{ borderRadius: '0 8px 8px 0', height: 32 }}
            />
          </div>
          <Select
            placeholder={i.status}
            allowClear
            value={stF}
            onChange={handleStatusChange}
            style={{ width: 148 }}
            options={["open", "in_progress", "resolved", "closed"].map(s => ({
              value: s,
              label: i[s as TicketStatus],
            }))}
          />
          <Select
            placeholder={i.priority}
            allowClear
            value={priF}
            onChange={handlePriorityChange}
            style={{ width: 138 }}
            options={["low", "medium", "high", "urgent"].map(p => ({
              value: p,
              label: i[p as Priority],
            }))}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            style={{
              background: "var(--av-border2)",
              border: "1px solid var(--av-border)",
              color: "var(--av-text2)",
            }}
          />
        </div>
        <Table
          columns={cols}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
          size="small"
          locale={{
            emptyText: <Empty description={<span style={{ color: "var(--av-text4)" }}>{i.noTickets}</span>} />,
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination
            current={pg}
            pageSize={pgSz}
            total={total}
            showSizeChanger
            showTotal={t => `${fNum(t, isRTL)} ${i.total}`}
            pageSizeOptions={[5, 8, 10, 20]}
            onChange={(p, s) => {
              setPg(p);
              setPgSz(s);
              fetchData();
            }}
          />
        </div>
      </Panel>
    </AdminLayout>
  );
};

export default AdminTickets;