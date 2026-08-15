import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Alert, Tabs, Typography, Divider, App } from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  UserOutlined, 
  CrownOutlined, 
  ArrowRightOutlined,
  SafetyOutlined,
  LoginOutlined 
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { AuthShell } from '../components/Layouts';

const { Text, Title } = Typography;

type Role = 'user' | 'admin';

const Login: React.FC = () => {
  const { message } = App.useApp();
  const { i, navigate, login, isRTL, loading } = useApp();
  const [role, setRole] = useState<Role>('user');
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      console.log('🔐 [Login] Submitting login for:', v.email);
      await login(v.email, v.password);
      console.log('✅ [Login] Login completed');
    } catch (error: any) {
      console.error('❌ [Login] Error:', error);
      const errorMessage = error.message || (isRTL ? 'خطا در ورود' : 'Login failed');
      setError(errorMessage);
      message.error(errorMessage);
    }
  };

  return (
    <AuthShell 
      title={isRTL ? 'خوش آمدید' : 'Welcome Back'} 
      sub={isRTL ? 'نوع ورود خود را انتخاب کنید' : 'Select your login type'}
    >
      <Tabs
        activeKey={role}
        onChange={(key) => {
          setRole(key as Role);
          setError(null);
          form.resetFields();
        }}
        centered
        size="large"
        style={{ marginBottom: 8 }}
        items={[
          {
            key: 'user',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined />
                {isRTL ? 'ورود کاربر' : 'User Login'}
              </span>
            ),
            children: (
              <Form form={form} layout="vertical" onFinish={submit}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>
                    <UserOutlined style={{ color: '#2b6cb0' }} />
                  </div>
                  <Title level={4} style={{ margin: 0, color: 'var(--av-text)' }}>
                    {isRTL ? 'ورود کاربر' : 'User Login'}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 13, color: 'var(--av-text3)' }}>
                    {isRTL ? 'به داشبورد کاربری خود وارد شوید' : 'Sign in to your user dashboard'}
                  </Text>
                </div>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 10 }}
                    closable
                    onClose={() => setError(null)}
                  />
                )}

                <Form.Item
                  label={<span style={lbSt}>{i.email}</span>}
                  name="email"
                  rules={[{ required: true, type: "email", message: i.emailInvalid }]}
                  initialValue="user@avesta.io"
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined style={{ color: "var(--av-text4)" }} />}
                    placeholder="user@avesta.io"
                    style={inSt}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={lbSt}>{i.password}</span>}
                  name="password"
                  rules={[{ required: true, message: i.fieldRequired }]}
                  initialValue="user123456"
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: "var(--av-text4)" }} />}
                    placeholder="••••••••"
                    style={inSt}
                  />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <Checkbox style={{ color: "var(--av-text3)", fontSize: 12 }}>{i.remember}</Checkbox>
                  <Button type="link" style={{ color: "#2b6cb0", padding: 0, fontSize: 12 }}>
                    {i.forgot}
                  </Button>
                </div>

                <button
                  type="submit"
                  className="av-btn-p"
                  style={{
                    padding: "10px 22px",
                    fontSize: 14,
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "linear-gradient(135deg,#1a365d,#2b6cb0,#4299e1)",
                    border: "none",
                    color: "#fff",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontFamily: "var(--av-font-display)",
                    boxShadow: "0 6px 28px rgba(43,108,176,.4)",
                  }}
                  disabled={loading}
                >
                  {loading ? <span className="anticon anticon-loading anticon-spin">⟳</span> : <LoginOutlined />}
                  {i.signIn}
                </button>

                <Divider style={{ borderColor: 'var(--av-border2)', margin: '16px 0' }} />
                
                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 12.5, color: "var(--av-text4)" }}>
                    {i.noAcc}{" "}
                    <Button
                      type="link"
                      onClick={() => navigate("register")}
                      style={{ padding: 0, color: "#2b6cb0", fontSize: 12.5 }}
                    >
                      {i.signUp} <ArrowRightOutlined />
                    </Button>
                  </Text>
                </div>
              </Form>
            ),
          },
          {
            key: 'admin',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CrownOutlined style={{ color: '#d97706' }} />
                {isRTL ? 'ورود مدیریت' : 'Admin Login'}
              </span>
            ),
            children: (
              <Form form={form} layout="vertical" onFinish={submit}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>
                    <CrownOutlined style={{ color: '#d97706' }} />
                  </div>
                  <Title level={4} style={{ margin: 0, color: 'var(--av-text)' }}>
                    {isRTL ? 'ورود مدیریت' : 'Administrator Login'}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 13, color: 'var(--av-text3)' }}>
                    {isRTL ? 'دسترسی فقط برای پرسنل مجاز' : 'Authorized Personnel Only'}
                  </Text>
                </div>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 10 }}
                    closable
                    onClose={() => setError(null)}
                  />
                )}

                <Alert
                  title={isRTL ? '⚠️ منطقه امن - دسترسی محدود' : '⚠️ Secure Area - Restricted Access'}
                  description={isRTL ? 'این بخش فقط برای مدیران سیستم مجاز است' : 'This section is only accessible to system administrators'}
                  type="warning"
                  showIcon
                  style={{
                    marginBottom: 18,
                    background: "rgba(217,119,6,.08)",
                    border: "1px solid rgba(217,119,6,.2)",
                    borderRadius: 10,
                  }}
                  icon={<SafetyOutlined />}
                />

                <Form.Item
                  label={<span style={lbSt}>{i.email}</span>}
                  name="email"
                  rules={[{ required: true, type: "email", message: i.emailInvalid }]}
                  initialValue="admin@avesta.io"
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
                  initialValue="admin123456"
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: "var(--av-text4)" }} />}
                    placeholder="••••••••"
                    style={inSt}
                  />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <Checkbox style={{ color: "var(--av-text3)", fontSize: 12 }}>{i.remember}</Checkbox>
                  <Button type="link" style={{ color: "#d97706", padding: 0, fontSize: 12 }}>
                    {i.forgot}
                  </Button>
                </div>

                <button
                  type="submit"
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
                >
                  {loading ? <span className="anticon anticon-loading anticon-spin">⟳</span> : <CrownOutlined />}
                  {i.adminSignIn}
                </button>

                <Divider style={{ borderColor: 'var(--av-border2)', margin: '16px 0' }} />
                
                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 12.5, color: "var(--av-text4)" }}>
                    {isRTL ? 'آیا حساب کاربری دارید؟' : 'Have a user account?'}{" "}
                    <Button
                      type="link"
                      onClick={() => {
                        setRole('user');
                        setError(null);
                        form.resetFields();
                      }}
                      style={{ padding: 0, color: "#2b6cb0", fontSize: 12.5 }}
                    >
                      {isRTL ? 'ورود کاربر' : 'User Login'} <ArrowRightOutlined />
                    </Button>
                  </Text>
                </div>
              </Form>
            ),
          },
        ]}
        tabBarStyle={{
          borderBottom: '2px solid var(--av-border2)',
          marginBottom: 24,
        }}
      />

      <Alert
        title={i.demoNote}
        type="info"
        showIcon
        style={{
          marginTop: 16,
          background: "rgba(43,108,176,.06)",
          border: "1px solid rgba(43,108,176,.15)",
          borderRadius: 10,
          fontSize: 12,
        }}
      />
    </AuthShell>
  );
};

export default Login;