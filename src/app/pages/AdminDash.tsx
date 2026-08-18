// src/app/pages/AdminDash.tsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Skeleton, App } from 'antd';
import {
  TeamOutlined,
  CustomerServiceOutlined,
  CheckCircleOutlined,
  FolderOpenOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloudOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { AdminLayout, Panel, PgHeader, Stat, GBtn, Btn, TT } from '../components/Layouts';
import { ticketService } from '../../services/ticket';
import { userService } from '../../services/user';
import { activityService } from '../../services/activity';
import { fNum } from '../utils/helpers';

const AdminDash: React.FC = () => {
  const { message } = App.useApp();
  const { i, isRTL } = useApp();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    resolvedTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    satisfaction: 96.4,
    avgResTime: '3.2 hrs',
    activeUsers: 0,
    uptime: 99.98,
  });
  const [ticketTrend, setTicketTrend] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const ff = "var(--av-font-display)";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [users, tickets, activities] = await Promise.all([
          userService.getAllUsers(),
          ticketService.getAllTickets(),
          activityService.getAllActivities(),
        ]);

        const totalUsers = users.length;
        const totalTickets = tickets.length;
        const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
        const openTickets = tickets.filter(t => t.status === 'open').length;
        const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
        const activeUsers = users.filter(u => u.status === 'active').length;

        setStats({
          totalUsers,
          totalTickets,
          resolvedTickets,
          openTickets,
          inProgressTickets,
          satisfaction: 96.4,
          avgResTime: '3.2 hrs',
          activeUsers,
          uptime: 99.98,
        });

        const trendMap = new Map();
        tickets.forEach(t => {
          const month = t.created.substring(0, 7);
          if (!trendMap.has(month)) {
            trendMap.set(month, { open: 0, res: 0 });
          }
          const data = trendMap.get(month);
          if (t.status === 'open' || t.status === 'in_progress') {
            data.open += 1;
          } else if (t.status === 'resolved') {
            data.res += 1;
          }
        });
        const trendData = Array.from(trendMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, data]) => ({
            m: month,
            open: data.open,
            res: data.res,
          }));
        setTicketTrend(trendData);

        const statusCounts = {
          open: tickets.filter(t => t.status === 'open').length,
          in_progress: tickets.filter(t => t.status === 'in_progress').length,
          resolved: tickets.filter(t => t.status === 'resolved').length,
          closed: tickets.filter(t => t.status === 'closed').length,
        };
        setStatusData([
          { name: isRTL ? 'باز' : 'Open', val: statusCounts.open, color: '#3b82f6' },
          { name: isRTL ? 'در حال بررسی' : 'In Progress', val: statusCounts.in_progress, color: '#f59e0b' },
          { name: isRTL ? 'حل شده' : 'Resolved', val: statusCounts.resolved, color: '#10b981' },
          { name: isRTL ? 'بسته شده' : 'Closed', val: statusCounts.closed, color: '#6b7280' },
        ]);

        const catMap = new Map();
        tickets.forEach(t => {
          const cat = t.category || 'other';
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
        });
        const catData = Array.from(catMap.entries()).map(([cat, count]) => ({
          cat: cat,
          n: count,
        }));
        setCategoryData(catData);

        const userGrowthMap = new Map();
        users.forEach(u => {
          const month = u.created?.substring(0, 7) || '2024-01';
          userGrowthMap.set(month, (userGrowthMap.get(month) || 0) + 1);
        });
        let cumulative = 0;
        const growthData = Array.from(userGrowthMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, count]) => {
            cumulative += count;
            return { m: month, n: cumulative };
          });
        setUserGrowth(growthData);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        message.error(isRTL ? 'خطا در دریافت اطلاعات' : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <Skeleton active loading={loading}>
        <PgHeader
          crumbs={[{ label: i.adminDash }]}
          title={i.commandCenter}
          sub={i.overviewSub}
          extra={
            <div style={{ display: "flex", gap: 8 }}>
              <Btn sz="sm" icon={<ReloadOutlined />}>
                {i.refresh}
              </Btn>
            </div>
          }
        />
        <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
          {[
            { t: i.totalUsers, v: fNum(stats.totalUsers, isRTL), icon: <TeamOutlined />, c: "#3b82f6", trend: 12 },
            { t: i.totalTickets, v: fNum(stats.totalTickets, isRTL), icon: <CustomerServiceOutlined />, c: "#8b5cf6", trend: 5 },
            { t: i.resolvedT, v: fNum(stats.resolvedTickets, isRTL), icon: <CheckCircleOutlined />, c: "#10b981", trend: 18 },
            { t: i.openTickets, v: fNum(stats.openTickets, isRTL), icon: <FolderOpenOutlined />, c: "#ef4444", trend: -3 },
            { t: i.satisfaction, v: isRTL ? `۹۶٫۴٪` : "96.4%", icon: <StarOutlined />, c: "#d97706", trend: 2 },
            { t: i.avgRes, v: isRTL ? `۳٫۲ ساعت` : "3.2 hrs", icon: <ClockCircleOutlined />, c: "#14b8a6" },
            { t: i.activeUsers, v: fNum(stats.activeUsers, isRTL), icon: <CheckOutlined />, c: "#10b981", trend: 8 },
            { t: "Uptime", v: isRTL ? `۹۹٫۹۸٪` : "99.98%", icon: <CloudOutlined />, c: "#22d3ee" },
          ].map((s, idx) => (
            <Col xs={24} sm={12} xl={6} key={idx}>
              <Stat title={s.t} value={s.v} icon={s.icon} color={s.c} trend={s.trend} />
            </Col>
          ))}
        </Row>
        <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
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
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={ticketTrend.length > 0 ? ticketTrend : [
                  { m: 'Jan', open: 0, res: 0 },
                  { m: 'Feb', open: 0, res: 0 },
                ]}>
                  <defs>
                    <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                  <XAxis dataKey="m" tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip {...TT} />
                  <Legend wrapperStyle={{ color: "var(--av-text3)" }} />
                  <Area type="monotone" dataKey="open" stroke="#3b82f6" fill="url(#gO)" strokeWidth={2} name="Open" />
                  <Area type="monotone" dataKey="res" stroke="#10b981" fill="url(#gR)" strokeWidth={2} name="Resolved" />
                </AreaChart>
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
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    dataKey="val"
                    paddingAngle={4}
                  >
                    {statusData.map((e, idx) => (
                      <Cell key={`cell-${idx}`} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip {...TT} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {statusData.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: it.color }} />
                      <span style={{ fontSize: 12, color: "var(--av-text3)" }}>{it.name}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--av-text)",
                        fontFamily: "var(--av-font-mono)",
                      }}
                    >
                      {fNum(it.val, isRTL)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </Col>
        </Row>
        <Row gutter={[14, 14]}>
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
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={categoryData.length > 0 ? categoryData : [{ cat: 'No Data', n: 0 }]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="cat"
                    type="category"
                    width={68}
                    tick={{ fill: "var(--av-text3)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...TT} />
                  <Bar dataKey="n" radius={[0, 6, 6, 0]} name="Tickets">
                    {categoryData.map((_, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={["#3b82f6", "#14b8a6", "#d97706", "#8b5cf6", "#10b981"][idx % 5]}
                      />
                    ))}
                  </Bar>
                </BarChart>
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
                {i.userGrowth}
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={userGrowth.length > 0 ? userGrowth : [{ m: 'Jan', n: 0 }, { m: 'Feb', n: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                  <XAxis dataKey="m" tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--av-text4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip {...TT} />
                  <Line
                    type="monotone"
                    dataKey="n"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    dot={{ fill: "#14b8a6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </Col>
        </Row>
      </Skeleton>
    </AdminLayout>
  );
};

export default AdminDash;