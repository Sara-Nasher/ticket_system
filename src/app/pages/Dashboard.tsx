import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Timeline, Button, Skeleton, Empty, App } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  FileTextOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { UserLayout, Panel, PgHeader, Stat, StTag, PrTag, Btn } from '../components/Layouts';
import { ticketService } from '../../services/ticket';
import { userService } from '../../services/user';
import { activityService } from '../../services/activity';
import { fDate, fNum } from '../utils/helpers';
import type { TicketRec } from '../types';

const Dashboard: React.FC = () => {
  const { message } = App.useApp();
  const { i, navigate, auth, isRTL, calMode } = useApp();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketRec[]>([]);
  const [userTickets, setUserTickets] = useState<TicketRec[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    pending: 0,
  });
  const ff = "var(--av-font-display)";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const ticketsData = await ticketService.getAllTickets();
        setTickets(ticketsData);
        
        const userId = Number(auth?.id);
        const userTicketsData = ticketsData.filter(t => t.userId === userId);
        setUserTickets(userTicketsData);

        const total = userTicketsData.length;
        const open = userTicketsData.filter(t => t.status === 'open').length;
        const resolved = userTicketsData.filter(t => t.status === 'resolved').length;
        const pending = userTicketsData.filter(t => t.status === 'in_progress').length;
        
        setStats({ total, open, resolved, pending });
        
        const activities = await activityService.getRecentActivities(5);
        setRecentActivities(activities);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error(isRTL ? 'خطا در دریافت اطلاعات' : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [auth]);

  const cols: TableColumnsType<TicketRec> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
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
          onClick={() => navigate("ticket-detail", { ticket: r })}
        >
          {isRTL ? r.subjectFa : v}
        </Button>
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
      title: i.updated,
      dataIndex: "updated",
      render: v => <span style={{ color: "var(--av-text4)", fontSize: 12 }}>{fDate(v, calMode, isRTL)}</span>,
    },
  ];

  const timelineItems = recentActivities.length > 0 
    ? recentActivities.map((activity, index) => ({
        color: index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#d97706",
        children: (
          <>
            <span style={{ fontSize: 12.5, color: "var(--av-text2)", fontWeight: 600 }}>
              {isRTL ? activity.actionFa : activity.action}
            </span>
            <br />
            <span style={{ fontSize: 11, color: "var(--av-text4)" }}>
              {activity.userName} · {fDate(activity.timestamp, calMode, isRTL)}
            </span>
          </>
        ),
      }))
    : [
        {
          color: "#10b981",
          children: (
            <>
              <span style={{ fontSize: 12.5, color: "var(--av-text2)", fontWeight: 600 }}>
                {isRTL ? 'هیچ فعالیتی وجود ندارد' : 'No activities'}
              </span>
              <br />
              <span style={{ fontSize: 11, color: "var(--av-text4)" }}>
                {isRTL ? 'فعالیت جدیدی ثبت نشده است' : 'No recent activities'}
              </span>
            </>
          ),
        },
      ];

  return (
    <UserLayout>
      <Skeleton active loading={loading}>
        <PgHeader
          crumbs={[{ label: i.dashboard }]}
          title={`${i.welcomeMsg || 'Welcome'}, ${auth?.name?.split(" ")[0] || 'User'}!`}
          sub={i.accountOverview}
          extra={
            <Btn sz="sm" onClick={() => navigate("create-ticket")} icon={<PlusOutlined />}>
              {i.newTicket}
            </Btn>
          }
        />
        <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
          <Col xs={24} sm={12} xl={6}>
            <Stat
              title={i.totalTickets}
              value={fNum(stats.total, isRTL)}
              icon={<FileTextOutlined />}
              color="#3b82f6"
              trend={stats.total > 0 ? 8 : 0}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Stat
              title={i.openTickets}
              value={fNum(stats.open, isRTL)}
              icon={<FolderOpenOutlined />}
              color="#d97706"
              trend={stats.open > 0 ? -12 : 0}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Stat
              title={i.resolvedT}
              value={fNum(stats.resolved, isRTL)}
              icon={<CheckCircleOutlined />}
              color="#10b981"
              trend={stats.resolved > 0 ? 22 : 0}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Stat
              title={i.pendingT}
              value={fNum(stats.pending, isRTL)}
              icon={<ClockCircleOutlined />}
              color="#8b5cf6"
            />
          </Col>
        </Row>
        <Row gutter={[14, 14]}>
          <Col xs={24} lg={17}>
            <Panel>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--av-text)",
                    fontFamily: ff,
                  }}
                >
                  {i.recentTickets}
                </h3>
                <button
                  onClick={() => navigate("my-tickets")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {i.viewAll} <ArrowRightOutlined />
                </button>
              </div>
              <Table
                columns={cols}
                dataSource={userTickets.slice(0, 5)}
                rowKey="id"
                size="small"
                pagination={false}
                locale={{
                  emptyText: <Empty description={<span style={{ color: "var(--av-text4)" }}>{i.noTickets}</span>} />,
                }}
              />
            </Panel>
          </Col>
          <Col xs={24} lg={7}>
            <Panel style={{ marginBottom: 14 }}>
              <h3
                style={{
                  margin: "0 0 13px",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--av-text)",
                  fontFamily: ff,
                }}
              >
                {i.quickActions}
              </h3>
              {[
                { l: i.newTicket, icon: <PlusOutlined />, p: "create-ticket", c: "#3b82f6" },
                { l: i.myTickets, icon: <FileTextOutlined />, p: "my-tickets", c: "#14b8a6" },
                { l: i.profile, icon: <UserOutlined />, p: "profile", c: "#8b5cf6" },
              ].map((a, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(a.p as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 13px",
                    background: `${a.c}0a`,
                    border: `1px solid ${a.c}18`,
                    borderRadius: 10,
                    cursor: "pointer",
                    color: a.c,
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 8,
                    transition: ".2s",
                    fontFamily: "var(--av-font-body)",
                  }}
                >
                  {a.icon}
                  {a.l}
                </button>
              ))}
            </Panel>
            <Panel>
              <h3
                style={{
                  margin: "0 0 13px",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--av-text)",
                  fontFamily: ff,
                }}
              >
                {i.recentActivity}
              </h3>
              <Timeline items={timelineItems} />
            </Panel>
          </Col>
        </Row>
      </Skeleton>
    </UserLayout>
  );
};

export default Dashboard;