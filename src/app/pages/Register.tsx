import React, { useState } from 'react';
import { Form, Input, Checkbox, App, Modal } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { AuthShell } from '../components/Layouts';

const Register: React.FC = () => {
  const { message } = App.useApp();
  const { i, navigate, register, isRTL, loading } = useApp();
  const [form] = Form.useForm();
  const [successModal, setSuccessModal] = useState(false);

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
    try {
      await register({
        name: v.name,
        nameFa: v.name,
        email: v.email,
        phone: v.phone,
        password: v.password,
        role: 'user',
        dept: 'Engineering',
      });
      setSuccessModal(true);
    } catch (error: any) {
      message.error(error.message || (isRTL ? 'خطا در ثبت‌نام' : 'Registration failed'));
    }
  };

  return (
    <AuthShell title={i.regT} sub={i.trialNote}>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item
          label={<span style={lbSt}>{i.fullName}</span>}
          name="name"
          rules={[{ required: true, min: 2, message: i.fieldRequired }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder={isRTL ? "نام و نام خانوادگی" : "Full name"}
            style={inSt}
          />
        </Form.Item>

        <Form.Item
          label={<span style={lbSt}>{i.email}</span>}
          name="email"
          rules={[{ required: true, type: "email", message: i.emailInvalid }]}
        >
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder="you@company.com"
            style={inSt}
          />
        </Form.Item>

        <Form.Item
          label={<span style={lbSt}>{i.phone}</span>}
          name="phone"
          rules={[
            { required: true, message: i.fieldRequired },
            { pattern: /^[0-9+\-\s()]{10,15}$/, message: isRTL ? "شماره تلفن معتبر وارد کنید" : "Please enter a valid phone number" }
          ]}
        >
          <Input
            size="large"
            prefix={<PhoneOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder={isRTL ? "۰۹۱۲ XXX XXXX" : "0912 XXX XXXX"}
            style={inSt}
          />
        </Form.Item>

        <Form.Item
          label={<span style={lbSt}>{i.password}</span>}
          name="password"
          rules={[{ required: true, min: 8, message: i.minChars.replace("{n}", "8") }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder={isRTL ? "حداقل ۸ کاراکتر" : "Min. 8 characters"}
            style={inSt}
          />
        </Form.Item>

        <Form.Item
          label={<span style={lbSt}>{i.confirmPass}</span>}
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: i.fieldRequired },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(i.pwMismatch));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: "var(--av-text4)" }} />}
            placeholder={isRTL ? "تکرار رمز عبور" : "Confirm password"}
            style={inSt}
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(i.termsRequired)) }]}
        >
          <Checkbox style={{ color: "var(--av-text3)", fontSize: 12 }}>{i.termsAgree}</Checkbox>
        </Form.Item>

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
          }}
          disabled={loading}
        >
          {loading ? <span className="anticon anticon-loading anticon-spin">⟳</span> : null}
          {i.signUp} <ArrowRightOutlined />
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12.5, color: "var(--av-text4)" }}>
          {i.haveAcc}{" "}
          <button
            onClick={() => navigate("login")}
            style={{
              background: "none",
              border: "none",
              color: "#2b6cb0",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12.5,
            }}
          >
            {i.signIn}
          </button>
        </div>
      </Form>

      <Modal
        open={successModal}
        onOk={() => {
          setSuccessModal(false);
          navigate('login');
        }}
        okText={isRTL ? 'ورود به سیستم' : 'Login'}
        cancelText={isRTL ? 'بستن' : 'Close'}
        onCancel={() => setSuccessModal(false)}
        title={isRTL ? '✅ ثبت‌نام موفق' : '✅ Registration Successful'}
        footer={[
          <button
            key="login"
            className="av-btn-p"
            style={{
              padding: "8px 20px",
              fontSize: 13,
              width: "auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={() => {
              setSuccessModal(false);
              navigate('login');
            }}
          >
            {isRTL ? 'ورود به سیستم' : 'Login'}
          </button>,
          <button
            key="close"
            className="av-btn-g"
            style={{
              padding: "8px 20px",
              fontSize: 13,
            }}
            onClick={() => setSuccessModal(false)}
          >
            {isRTL ? 'بستن' : 'Close'}
          </button>,
        ]}
      >
        <p style={{ fontSize: 16, color: 'var(--av-text2)' }}>
          {isRTL 
            ? 'حساب کاربری شما با موفقیت ایجاد شد. لطفاً برای ورود به سیستم، روی دکمه "ورود به سیستم" کلیک کنید.'
            : 'Your account has been created successfully. Please click "Login" to sign in.'}
        </p>
      </Modal>
    </AuthShell>
  );
};

export default Register;