import React, { useState, useEffect } from 'react';
import { Form, Input, Avatar, Button, Upload, Row, Col, App } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { UserLayout, Panel, PgHeader, StTag, PrTag, Btn, GBtn, inSt } from '../components/Layouts';
import { ticketService } from '../../services/ticket';
import { fDate } from '../utils/helpers';
import type { TicketRec } from '../types';

const TicketDetail: React.FC = () => {
  const { message } = App.useApp();
  const { i, navigate, params, auth, isRTL, calMode } = useApp();
  const [ticket, setTicket] = useState<TicketRec | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [form] = Form.useForm();
  const isAdmin = auth?.role === "admin";
  const ff = "var(--av-font-display)";

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const ticketId = params?.ticketId || params?.ticket?.id || 1;
        const data = await ticketService.getTicketById(ticketId);
        setTicket(data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        message.error('خطا در دریافت اطلاعات تیکت');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [params]);

  const handleReply = async () => {
    if (!ticket) return;
    setReplyLoading(true);
    try {
      const msg = form.getFieldValue('msg');
      await ticketService.addResponse(ticket.id, msg);
      message.success(i.replySent);
      form.resetFields();
      const updated = await ticketService.getTicketById(ticket.id);
      setTicket(updated);
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error('خطا در ارسال پاسخ');
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading || !ticket) {
    return (
      <UserLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid var(--av-border)', 
            borderTop: '3px solid #2b6cb0', 
            borderRadius: '50%', 
            animation: 'spin 0.8s linear infinite' 
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </UserLayout>
    );
  }

  const replies = [
    {
      author: isRTL ? ticket.userNameFa : ticket.userName,
      staff: false,
      text: isRTL ? ticket.descFa : ticket.desc,
      time: fDate(ticket.created, calMode, isRTL),
    },
    ...(ticket.responses || []).map(r => ({
      author: r.userName,
      staff: r.userId === 2 || r.userId === 10,
      text: r.message,
      time: new Date(r.createdAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })),
  ];

  return (
    <UserLayout>
      <PgHeader
        crumbs={[
          { label: isAdmin ? i.adminDash : i.dashboard, page: isAdmin ? "admin-dash" : "dashboard" },
          { label: isAdmin ? i.ticketMgmt : i.myTickets, page: isAdmin ? "admin-tickets" : "my-tickets" },
          { label: ticket.id.toString() },
        ]}
        title={isRTL ? ticket.subjectFa : ticket.subject}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <StTag status={ticket.status} i={i} />
            <PrTag priority={ticket.priority} i={i} />
          </div>
        }
      />
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={17}>
          <Panel style={{ marginBottom: 14 }}>
            {replies.map((r, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 20,
                  flexDirection: r.staff ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  size={38}
                  style={{
                    background: r.staff
                      ? "linear-gradient(135deg,#92400e,#d97706)"
                      : "linear-gradient(135deg,#1a365d,#2b6cb0)",
                    flexShrink: 0,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {r.author.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 7,
                      justifyContent: r.staff ? "flex-end" : "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "var(--av-text)",
                        fontFamily: ff,
                      }}
                    >
                      {r.author}
                    </span>
                    {r.staff && (
                      <span
                        style={{
                          fontSize: 9,
                          background: "rgba(217,119,6,.1)",
                          border: "1px solid rgba(217,119,6,.25)",
                          color: "#fbbf24",
                          borderRadius: 4,
                          padding: "1px 5px",
                          fontWeight: 800,
                        }}
                      >
                        SUPPORT
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: "var(--av-text4)" }}>{r.time}</span>
                  </div>
                  <div
                    style={{
                      background: r.staff ? "rgba(59,130,246,.06)" : "rgba(255,255,255,.03)",
                      border: `1px solid ${r.staff ? "rgba(59,130,246,.15)" : "var(--av-border2)"}`,
                      borderRadius: 14,
                      padding: "11px 15px",
                      fontSize: 13.5,
                      color: "var(--av-text2)",
                      lineHeight: 1.7,
                      maxWidth: 460,
                    }}
                  >
                    {r.text}
                  </div>
                </div>
              </div>
            ))}
          </Panel>
          <Panel>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--av-text)",
                marginBottom: 13,
                fontFamily: ff,
              }}
            >
              {i.addReply}
            </h4>
            <Form form={form} onFinish={handleReply}>
              <Form.Item name="msg" rules={[{ required: true, min: 5, message: i.fieldRequired }]}>
                <Input.TextArea rows={4} placeholder={i.typeReply} style={{ ...inSt, resize: "none" }} />
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Upload>
                  <Button
                    size="small"
                    icon={<UploadOutlined />}
                    style={{
                      background: "var(--av-border2)",
                      border: "1px solid var(--av-border)",
                      color: "var(--av-text2)",
                    }}
                  >
                    {i.attachBtn}
                  </Button>
                </Upload>
                <Btn htmlType="submit" loading={replyLoading} icon={<SendOutlined />}>
                  {i.sendReply}
                </Btn>
              </div>
            </Form>
          </Panel>
        </Col>
        <Col xs={24} lg={7}>
          <Panel>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--av-text)",
                marginBottom: 13,
                fontFamily: ff,
              }}
            >
              {i.ticketInfo}
            </h4>
            {[
              { l: i.status, v: <StTag status={ticket.status} i={i} /> },
              { l: i.priority, v: <PrTag priority={ticket.priority} i={i} /> },
              { l: i.category, v: <span style={{ color: "var(--av-text2)", fontSize: 12 }}>{ticket.category}</span> },
              {
                l: i.assignee,
                v: (
                  <span style={{ color: ticket.assignee ? "#93c5fd" : "var(--av-text4)", fontSize: 12 }}>
                    {ticket.assignee || i.unassigned}
                  </span>
                ),
              },
              {
                l: i.replies,
                v: (
                  <span
                    style={{
                      color: "#3b82f6",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "var(--av-font-mono)",
                    }}
                  >
                    {ticket.replies || 0}
                  </span>
                ),
              },
              {
                l: i.created,
                v: (
                  <span style={{ color: "var(--av-text4)", fontSize: 12 }}>
                    {fDate(ticket.created, calMode, isRTL)}
                  </span>
                ),
              },
            ].map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: "1px solid var(--av-border2)",
                }}
              >
                <span style={{ fontSize: 11.5, color: "var(--av-text4)", fontWeight: 600 }}>{it.l}</span>
                {it.v}
              </div>
            ))}
          </Panel>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default TicketDetail;