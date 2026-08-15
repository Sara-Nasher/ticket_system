import React, { useState } from 'react';
import { Form, Input, Alert, message } from 'antd';
import { MailOutlined, KeyOutlined, CrownOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { AuthShell } from '../components/Layouts';

const AdminLogin: React.FC = () => {
  const { i, navigate, setAuth, isRTL } = useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const inSt: React.CSSProperties = {
    background: "var(--av-border2)",
    border: "1px solid rgba(255,255,255,.09)",
    color: "var(--av-text)",
    borderRadius: 10,
  };

  const lbSt: React.CSSProperties = {
    color: "var(--av-text3)",
    fontSize: 12.5,
    fontWeight: 600,
  };

  const submit = async (v: any) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setAuth({
      id: "u2",
      name: "Karim Mansouri",
      nameFa: "کریم منصوری",
      email: v.email,
      role: "admin",
      dept: "IT",
    });
    message.success(isRTL ? "پورتال ادمین 👑" : "Admin portal 👑");
    navigate("admin-dash");
    setLoading(false);
  };

  return (
    <AuthShell title={i.adminT} sub={i.restrictedNote} gold>
      <Alert
        title={i.demoNote}
        type="info"
        showIcon
        style={{
          marginBottom: 18,
          background: "rgba(217,119,6,.08)",
          border: "1px solid rgba(217,119,6,.2)",
          color: "#fcd34d",
          borderRadius: 10,
        }}
      />
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item
          label={<span style={lbSt}>{i.email}</span>}
          name="email"
          rules={[{ required: true, message: i.fieldRequired }]}
        >
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder="admin@avesta.io"
            style={inSt}
          />
        </Form.Item>
        <Form.Item
          label={<span style={lbSt}>{i.password}</span>}
          name="password"
          rules={[{ required: true, message: i.fieldRequired }]}
        >
          <Input.Password
            size="large"
            prefix={<KeyOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder="••••••••"
            style={inSt}
          />
        </Form.Item>
        <button
          className="av-btn-gold"
          style={{
            padding: "10px 22px",
            fontSize: 14,
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "linear-gradient(135deg,#92400e,#d97706,#f59e0b)",
            border: "none",
            color: "#fff",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
            fontFamily: "var(--av-font-display)",
            boxShadow: "0 6px 28px rgba(217,119,6,.4)",
          }}
          disabled={loading}
          onClick={() => form.submit()}
        >
          {loading ? <span className="anticon anticon-loading anticon-spin">⟳</span> : <CrownOutlined />}
          {i.adminSignIn}
        </button>
      </Form>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button
          onClick={() => navigate("login")}
          style={{
            background: "none",
            border: "none",
            color: "var(--av-text4)",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {i.signIn}
        </button>
      </div>
    </AuthShell>
  );
};

export default AdminLogin;