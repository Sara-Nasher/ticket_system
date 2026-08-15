import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Select, Button, Pagination, Empty, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { UserLayout, Panel, PgHeader, Btn, StTag, PrTag } from '../components/Layouts';
import { ticketService } from '../../services/ticket';
import { fDate, fNum } from '../utils/helpers';
import type { TicketRec, TicketStatus } from '../types';

const MyTickets: React.FC = () => {
  const { i, navigate, isRTL, calMode, auth } = useApp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TicketRec[]>([]);
  const [total, setTotal] = useState(0);
  const [pg, setPg] = useState(1);
  const [pgSz, setPgSz] = useState(8);
  const [search, setSearch] = useState("");
  const [stF, setStF] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const allTickets = await ticketService.getAllTickets();
      console.log('📥 All tickets from API:', allTickets);
      
      const userId = Number(auth?.id);
      let filtered = allTickets.filter(t => {
        const tUserId = typeof t.userId === 'number' ? t.userId : Number(t.userId);
        return tUserId === userId;
      });
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.subject.toLowerCase().includes(searchLower) || 
          String(t.id).includes(searchLower)
        );
      }
      
      if (stF) {
        filtered = filtered.filter(t => t.status === stF);
      }
      
      filtered.sort((a, b) => {
        const dateA = new Date(a.created || a.updated || '1970-01-01').getTime();
        const dateB = new Date(b.created || b.updated || '1970-01-01').getTime();
        return dateB - dateA;
      });
      
      const start = (pg - 1) * pgSz;
      const end = start + pgSz;
      
      setTotal(filtered.length);
      setData(filtered.slice(start, end));
      
      console.log(`📊 Showing ${filtered.slice(start, end).length} of ${filtered.length} tickets`);
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [pg, pgSz, search, stF, auth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cols: TableColumnsType<TicketRec> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      render: (v) => (
        <span
          style={{
            fontFamily: "var(--av-font-mono)",
            fontSize: 12,
            color: "#3b82f6",
            background: "rgba(59,130,246,.1)",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: i.subject || "Subject",
      dataIndex: "subject",
      render: (v, r) => (
        <Button
          type="link"
          style={{ padding: 0, color: "#93c5fd", fontWeight: 600 }}
          onClick={() => navigate("ticket-detail", { ticket: r })}
        >
          {isRTL ? (r.subjectFa || v) : (v || 'بدون موضوع')}
        </Button>
      ),
    },
    {
      title: i.category || "Category",
      dataIndex: "category",
      render: (v) => <span style={{ color: "var(--av-text3)", fontSize: 12 }}>{v || '-'}</span>,
    },
    {
      title: i.status || "Status",
      dataIndex: "status",
      render: (v) => <StTag status={v as TicketStatus} i={i} />,
    },
    {
      title: i.priority || "Priority",
      dataIndex: "priority",
      render: (v) => <PrTag priority={v as any} i={i} />,
    },
    {
      title: i.updated || "Updated",
      dataIndex: "updated",
      render: (v, r) => {
        const dateToShow = v || r.created;
        return <span style={{ color: "var(--av-text4)", fontSize: 12 }}>{fDate(dateToShow, calMode, isRTL)}</span>;
      },
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, r) => (
        <Tooltip title={i.view || 'View'}>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            style={{ color: "#3b82f6" }}
            onClick={() => navigate("ticket-detail", { ticket: r })}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <UserLayout>
      <PgHeader
        crumbs={[{ label: i.dashboard, page: "dashboard" }, { label: i.myTickets }]}
        title={i.myTickets}
        extra={
          <Btn sz="sm" onClick={() => navigate("create-ticket")} icon={<PlusOutlined />}>
            {i.newTicket}
          </Btn>
        }
      />
      <Panel>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <Input.Search
            placeholder={`${i.search || 'Search'}…`}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPg(1);
            }}
            onSearch={fetchData}
            style={{ width: 220 }}
          />
          <Select
            placeholder={i.status || 'Status'}
            allowClear
            value={stF}
            onChange={v => {
              setStF(v);
              setPg(1);
            }}
            style={{ width: 148 }}
            options={["open", "in_progress", "resolved", "closed"].map(s => ({
              value: s,
              label: i[s as TicketStatus] || s,
            }))}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
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
          size="small"
          locale={{
            emptyText: <Empty description={<span style={{ color: "var(--av-text4)" }}>{i.noTickets || 'هیچ تیکتی وجود ندارد'}</span>} />,
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination
            current={pg}
            pageSize={pgSz}
            total={total}
            showSizeChanger
            showTotal={t => `${fNum(t, isRTL)} ${i.total || 'total'}`}
            pageSizeOptions={[5, 8, 10, 20]}
            onChange={(p, s) => {
              setPg(p);
              setPgSz(s);
              fetchData();
            }}
          />
        </div>
      </Panel>
    </UserLayout>
  );
};

export default MyTickets;