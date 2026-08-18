// src/app/pages/Reports.tsx
import React from 'react';
import { Row, Col, Tabs, Button, DatePicker, Progress, Table } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ThunderboltOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { AdminLayout, Panel, PgHeader, Stat, StTag, PrTag, TT } from '../components/Layouts';
import { TICKETS, C_TREND, C_PIE, C_CAT } from '../data/mockData';
import { fDate, fNum } from '../utils/helpers';

const Reports: React.FC = () => {
  const { i, isRTL, calMode } = useApp();
  const ff = "var(--av-font-display)";

  const tabs = [
    {
      key: "overview",
      label: i.overview,
      children: (
        <div>
          <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
            {[
              { t: i.totalRequests, v: fNum(1240, isRTL), c: "#3b82f6", icon: <FileTextOutlined />, trend: 12 },
              { t: i.avgRes, v: isRTL ? `۳٫۲ ساعت` : "3.2 hrs", c: "#14b8a6", icon: <ClockCircleOutlined />, trend: -15 },
              { t: i.satisfaction, v: isRTL ? `۹۶٫۴٪` : "96.4%", c: "#d97706", icon: <StarOutlined />, trend: 3 },
              { t: i.agentEfficiency, v: isRTL ? `۸۷٪` : "87%", c: "#8b5cf6", icon: <ThunderboltOutlined />, trend: 5 },
            ].map((s, idx) => (
              <Col xs={24} sm={12} xl={6} key={idx}>
                <Stat title={s.t} value={s.v} icon={s.icon} color={s.c} trend={s.trend} />
              </Col>
            ))}
          </Row>
          <Row gutter={[14, 14]}>
            <Col xs={24} lg={16}>
              <Panel>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--av-text)",
                    marginBottom: 16,
                    fontFamily: ff,
                  }}
                >
                  {i.ticketTrend}
                </h3>
                <ResponsiveContainer width="100%" height={270}>
                  <LineChart data={C_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="m" tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip {...TT} />
                    <Legend wrapperStyle={{ color: "var(--av-text3)" }} />
                    <Line
                      type="monotone"
                      dataKey="open"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#3b82f6" }}
                      name="Open"
                    />
                    <Line
                      type="monotone"
                      dataKey="res"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#10b981" }}
                      name="Resolved"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </Col>
            <Col xs={24} lg={8}>
              <Panel>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--av-text)",
                    marginBottom: 16,
                    fontFamily: ff,
                  }}
                >
                  {i.byStatus}
                </h3>
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie
                      data={C_PIE}
                      cx="50%"
                      cy="46%"
                      outerRadius={88}
                      dataKey="val"
                      label={({ percent }) => `${Math.round(percent * 100)}%`}
                      labelLine={false}
                    >
                      {C_PIE.map((e, idx) => (
                        <Cell key={`cell-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip {...TT} />
                  </PieChart>
                </ResponsiveContainer>
              </Panel>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "perf",
      label: i.perfMetrics,
      children: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { l: i.firstResponseRate, v: 94, c: "#10b981" },
            { l: i.resolutionRate, v: 87, c: "#3b82f6" },
            { l: i.csatScore, v: 96, c: "#8b5cf6" },
            { l: i.agentUtilization, v: 73, c: "#d97706" },
          ].map((m, idx) => (
            <Panel key={idx} style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--av-text)",
                    fontFamily: ff,
                  }}
                >
                  {m.l}
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: m.c,
                    fontFamily: ff,
                  }}
                >
                  {fNum(m.v, isRTL)}%
                </span>
              </div>
              <Progress
                percent={m.v}
                strokeColor={m.c}
                trailColor="var(--av-border2)"
                showInfo={false}
              />
            </Panel>
          ))}
        </div>
      ),
    },
    {
      key: "raw",
      label: i.rawData,
      children: (
        <Panel>
          {/* ❌ بخش CSV حذف شد */}
          <Table
            dataSource={TICKETS}
            rowKey="id"
            size="small"
            scroll={{ x: 900 }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                render: v => (
                  <span
                    style={{
                      fontFamily: "var(--av-font-mono)",
                      fontSize: 11,
                      color: "#3b82f6",
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
                  <span style={{ color: "var(--av-text)", fontSize: 13 }}>
                    {isRTL ? r.subjectFa : v}
                  </span>
                ),
              },
              {
                title: i.user,
                dataIndex: "userName",
                render: (v, r) => (
                  <span style={{ color: "var(--av-text2)" }}>
                    {isRTL ? r.userNameFa : v}
                  </span>
                ),
              },
              {
                title: i.status,
                dataIndex: "status",
                render: v => <StTag status={v} i={i} />,
              },
              {
                title: i.priority,
                dataIndex: "priority",
                render: v => <PrTag priority={v} i={i} />,
              },
              {
                title: i.created,
                dataIndex: "created",
                render: v => (
                  <span style={{ color: "var(--av-text4)", fontSize: 12 }}>
                    {fDate(v, calMode, isRTL)}
                  </span>
                ),
              },
            ]}
          />
        </Panel>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PgHeader
        crumbs={[{ label: i.adminDash, page: "admin-dash" }, { label: i.reports }]}
        title={i.reports}
        sub={isRTL ? "بینش‌ها برای تصمیم‌گیری آگاهانه" : "Insights and analytics for informed decisions"}
        extra={null}
      />
      <Tabs items={tabs} />
    </AdminLayout>
  );
};

export default Reports;