import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Avatar, Upload, Tabs, Row, Col, App, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { UserLayout, Panel, PgHeader, lbSt, inSt, Btn } from '../components/Layouts';
import { userService } from '../../services/user';
import type { AuthUser } from '../types';

const Profile: React.FC = () => {
  const { message: msg } = App.useApp();
  const { i, auth, isRTL, setAuth } = useApp();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const [form] = Form.useForm();
  const [passForm] = Form.useForm();
  const ff = "var(--av-font-display)";

  useEffect(() => {
    if (auth) {
      fetchUserData();
    }
  }, [auth]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const user = await userService.getUserById(Number(auth?.id));
      setUserData(user);
      form.setFieldsValue({
        name: user.name,
        nameFa: user.nameFa,
        email: user.email,
        phone: user.phone || '',
        dept: user.dept || '',
        bio: user.bio || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      msg.error(isRTL ? 'خطا در دریافت اطلاعات' : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (values: any) => {
    setSaving(true);
    try {
      const updated = await userService.updateUser(Number(auth?.id), values);
      setAuth(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      msg.success(i.profileSaved || 'پروفایل با موفقیت ذخیره شد');
      setUserData(updated);
    } catch (error: any) {
      msg.error(error.message || (isRTL ? 'خطا در ذخیره پروفایل' : 'Error saving profile'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      msg.error(isRTL ? 'رمز عبور و تأیید آن مطابقت ندارند' : 'Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await userService.updateUser(Number(auth?.id), { password: values.newPassword });
      msg.success(isRTL ? 'رمز عبور با موفقیت تغییر کرد' : 'Password changed successfully');
      passForm.resetFields();
    } catch (error: any) {
      msg.error(error.message || (isRTL ? 'خطا در تغییر رمز عبور' : 'Error changing password'));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      key: "info",
      label: i.personalInfo,
      children: (
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "1px solid var(--av-border2)",
              }}
            >
              <Avatar
                size={70}
                src={userData?.avatar || undefined}
                style={{
                  background: !userData?.avatar ? "linear-gradient(135deg,#1a365d,#2b6cb0)" : undefined,
                  fontSize: 28,
                  fontWeight: 800,
                  boxShadow: "0 0 28px rgba(43,108,176,.35)",
                }}
              >
                {auth?.name?.charAt(0)}
              </Avatar>
              <div>
                <Upload showUploadList={false}>
                  <Button
                    size="small"
                    style={{
                      background: "rgba(43,108,176,.1)",
                      border: "1px solid rgba(43,108,176,.25)",
                      color: "#93c5fd",
                    }}
                    icon={<UploadOutlined />}
                  >
                    {i.uploadPhoto}
                  </Button>
                </Upload>
                <p style={{ fontSize: 11, color: "var(--av-text4)", marginTop: 5 }}>{i.photoHint}</p>
              </div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label={<span style={lbSt}>{isRTL ? 'نام' : 'Name'}</span>} 
                  name="name"
                  rules={[{ required: true, message: isRTL ? 'لطفاً نام را وارد کنید' : 'Please enter name' }]}
                >
                  <Input style={inSt} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label={<span style={lbSt}>{isRTL ? 'نام فارسی' : 'Persian Name'}</span>} 
                  name="nameFa"
                  rules={[{ required: true, message: isRTL ? 'لطفاً نام فارسی را وارد کنید' : 'Please enter Persian name' }]}
                >
                  <Input style={inSt} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label={<span style={lbSt}>{i.email}</span>} 
                  name="email"
                  rules={[{ required: true, type: 'email', message: isRTL ? 'ایمیل معتبر نیست' : 'Invalid email' }]}
                >
                  <Input style={inSt} size="large" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label={<span style={lbSt}>{i.phone}</span>} 
                  name="phone"
                  rules={[{ required: true, message: isRTL ? 'لطفاً شماره تماس را وارد کنید' : 'Please enter phone' }]}
                >
                  <Input style={inSt} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label={<span style={lbSt}>{i.dept}</span>} 
                  name="dept"
                  rules={[{ required: true, message: isRTL ? 'لطفاً دپارتمان را انتخاب کنید' : 'Please select department' }]}
                >
                  <Select
                    size="large"
                    options={[
                      { value: "Engineering", label: "Engineering" },
                      { value: "Design", label: "Design" },
                      { value: "HR", label: "HR" },
                      { value: "Finance", label: "Finance" },
                      { value: "Sales", label: "Sales" },
                      { value: "IT", label: "IT" },
                      { value: "Product", label: "Product" },
                      { value: "Marketing", label: "Marketing" },
                      { value: "Legal", label: "Legal" },
                      { value: "Operations", label: "Operations" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label={<span style={lbSt}>{isRTL ? 'بیوگرافی' : 'Bio'}</span>} 
                  name="bio"
                >
                  <Input.TextArea rows={3} style={{ ...inSt, resize: 'none' }} />
                </Form.Item>
              </Col>
            </Row>
            <Btn loading={saving} htmlType="submit">
              {i.save}
            </Btn>
          </Form>
        </Spin>
      ),
    },
    {
      key: "security",
      label: i.security,
      children: (
        <Spin spinning={loading}>
          <Form form={passForm} layout="vertical" onFinish={handlePasswordChange}>
            <Form.Item
              label={<span style={lbSt}>{isRTL ? 'رمز عبور فعلی' : 'Current Password'}</span>}
              name="currentPassword"
              rules={[{ required: true, message: isRTL ? 'لطفاً رمز عبور فعلی را وارد کنید' : 'Please enter current password' }]}
            >
              <Input.Password size="large" style={inSt} />
            </Form.Item>
            <Form.Item
              label={<span style={lbSt}>{isRTL ? 'رمز عبور جدید' : 'New Password'}</span>}
              name="newPassword"
              rules={[
                { required: true, message: isRTL ? 'لطفاً رمز عبور جدید را وارد کنید' : 'Please enter new password' },
                { min: 8, message: isRTL ? 'رمز عبور باید حداقل ۸ کاراکتر باشد' : 'Password must be at least 8 characters' }
              ]}
            >
              <Input.Password size="large" style={inSt} />
            </Form.Item>
            <Form.Item
              label={<span style={lbSt}>{isRTL ? 'تأیید رمز عبور' : 'Confirm Password'}</span>}
              name="confirmPassword"
              rules={[
                { required: true, message: isRTL ? 'لطفاً رمز عبور را تأیید کنید' : 'Please confirm password' }
              ]}
            >
              <Input.Password size="large" style={inSt} />
            </Form.Item>
            <Btn loading={saving} htmlType="submit">
              {isRTL ? 'تغییر رمز عبور' : 'Change Password'}
            </Btn>
          </Form>
        </Spin>
      ),
    },
  ];

  return (
    <UserLayout>
      <PgHeader
        crumbs={[{ label: i.dashboard, page: "dashboard" }, { label: i.profile }]}
        title={i.profile}
      />
      <Panel style={{ padding: 0, overflow: "hidden" }}>
        <Tabs items={tabs} style={{ padding: 26 }} />
      </Panel>
    </UserLayout>
  );
};

export default Profile;