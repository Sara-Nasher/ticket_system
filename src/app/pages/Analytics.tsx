import React from 'react';
import { Row, Col } from 'antd';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell  
} from 'recharts';
import { useApp } from '../context/AppContext';
import { AdminLayout, Panel, PgHeader, TT } from '../components/Layouts';
import { C_USR, C_CAT } from '../data/mockData';

const Analytics: React.FC = () => {
  const { i, isRTL } = useApp();
  const ff = "var(--av-font-display)";

  return (
    <AdminLayout>
      <PgHeader
        crumbs={[{ label: i.adminDash, page: "admin-dash" }, { label: i.analytics }]}
        title={i.analytics}
        sub={isRTL ? "بررسی عمیق معیارهای پلتفرم" : "Deep dive into your platform metrics"}
      />
      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} lg={12}>
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
              {i.userAcquisition}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={C_USR}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="m" tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...TT} />
                <Area type="monotone" dataKey="n" stroke="#14b8a6" fill="url(#ag)" strokeWidth={2.5} name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </Col>
        <Col xs={24} lg={12}>
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
              {i.byCat}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={C_CAT}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="cat" tick={{ fill: "var(--av-text4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...TT} />
                <Bar dataKey="n" name="Tickets" radius={[6, 6, 0, 0]}>
                  {C_CAT.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={["#3b82f6", "#14b8a6", "#d97706", "#8b5cf6", "#10b981"][idx]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Col>
      </Row>
      <Row gutter={[14, 14]}>
        {[
          { l: i.avgTicketsPerUser, v: "1.7", c: "#3b82f6" },
          { l: i.resolutionRate, v: "85%", c: "#10b981" },
          { l: i.reopenedRate, v: "4.2%", c: "#d97706" },
          { l: i.firstContactRes, v: "71%", c: "#8b5cf6" },
        ].map((kpi, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Panel style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  fontFamily: ff,
                  color: kpi.c,
                  textShadow: `0 0 24px ${kpi.c}40`,
                }}
              >
                {kpi.v}
              </div>
              <div style={{ fontSize: 13, color: "var(--av-text3)", marginTop: 8 }}>{kpi.l}</div>
            </Panel>
          </Col>
        ))}
      </Row>
    </AdminLayout>
  );
};

export default Analytics;