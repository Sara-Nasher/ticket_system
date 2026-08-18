// src/app/pages/UserMgmt.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Pagination,
  Empty,
  Tooltip,
  Popconfirm,
  Avatar,
  Modal,
  Form,
  Drawer,
  App,
  Row,
  Col,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { AdminLayout, Panel, PgHeader, Btn, lbSt, inSt } from '../components/Layouts';
import { userService } from '../../services/user';
import { activityService } from '../../services/activity';
import { fDate, fNum } from '../utils/helpers';
import type { AuthUser, UserStatus } from '../types';

const UserMgmt: React.FC = () => {
  const { message: msg } = App.useApp();
  const { i, isRTL, calMode, auth } = useApp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuthUser[]>([]);
  const [total, setTotal] = useState(0);
  const [pg, setPg] = useState(1);
  const [pgSz, setPgSz] = useState(8);
  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await userService.getUsersPaginated({
        page: pg,
        pageSize: pgSz,
        search: search || undefined,
        role: roleF || undefined,
      });
      
      setTotal(result.total);
      setData(result.data);
    } catch (error) {
      console.error('Search error:', error);
      msg.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  }, [search, roleF, pg, pgSz]);

  useEffect(() => {
    fetchData();
  }, [pg, pgSz]);

  const doSearch = () => {
    setPg(1);
    fetchData();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  const handleRoleFilterChange = (value: string | null) => {
    setRoleF(value);
    setPg(1);
    fetchData();
  };

  const handleReset = () => {
    setSearch("");
    setRoleF(null);
    setPg(1);
    fetchData();
  };

  const [editRec, setEditRec] = useState<AuthUser | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewRec, setViewRec] = useState<AuthUser | null>(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const ff = "var(--av-font-display)";

  const stCls: Record<UserStatus, string> = {
    active: "av-st-active",
    inactive: "av-st-inactive",
    banned: "av-st-banned",
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (newRole !== 'admin' && newRole !== 'user') {
      msg.error(isRTL ? 'Invalid role' : 'Invalid role');
      return;
    }
    try {
      await userService.changeUserRole(userId, newRole as 'admin' | 'user');
      await activityService.createActivity({
        userId: Number(auth?.id),
        userName: auth?.name || 'System',
        action: 'Change Role',
        actionFa: 'Change Role',
        details: `User role changed`,
      });
      msg.success(isRTL ? 'User role changed successfully' : 'User role changed successfully');
      fetchData();
    } catch (error: any) {
      msg.error(error.message || (isRTL ? 'Error changing role' : 'Error changing role'));
    }
  };

  const handleStatusChange = async (userId: number, status: string) => {
    try {
      await userService.changeUserStatus(userId, status);
      await activityService.createActivity({
        userId: Number(auth?.id),
        userName: auth?.name || 'System',
        action: 'Change Status',
        actionFa: 'Change Status',
        details: `User status changed`,
      });
      msg.success(isRTL ? 'User status changed successfully' : 'User status changed successfully');
      fetchData();
    } catch (error: any) {
      msg.error(error.message || (isRTL ? 'Error changing status' : 'Error changing status'));
    }
  };

  const handleEditUser = async (values: any) => {
    try {
      await userService.updateUser(Number(editRec?.id), values);
      await activityService.createActivity({
        userId: Number(auth?.id),
        userName: auth?.name || 'System',
        action: 'Update User',
        actionFa: 'Update User',
        details: `User ${editRec?.name} updated`,
      });
      msg.success(i.userSaved);
      setEditRec(null);
      fetchData();
    } catch (error: any) {
      msg.error(error.message || 'Error updating user');
    }
  };

  const handleAddUser = async (values: any) => {
    try {
      const newUser = {
        ...values,
        password: values.password || 'default123',
        status: 'active',
        tickets: 0,
        created: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
      };
      await userService.createUser(newUser);
      await activityService.createActivity({
        userId: Number(auth?.id),
        userName: auth?.name || 'System',
        action: 'Add User',
        actionFa: 'Add User',
        details: `New user ${values.name} added`,
      });
      msg.success(i.userAdded);
      setAddOpen(false);
      addForm.resetFields();
      fetchData();
    } catch (error: any) {
      msg.error(error.message || 'Error adding user');
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    try {
      await userService.deleteUser(id);
      await activityService.createActivity({
        userId: Number(auth?.id),
        userName: auth?.name || 'System',
        action: 'Delete User',
        actionFa: 'Delete User',
        details: `User ${name} deleted`,
      });
      msg.success(i.userDeleted);
      fetchData();
    } catch (error: any) {
      msg.error(error.message || 'Error deleting user');
    }
  };

  const cols: TableColumnsType<AuthUser> = [
    {
      title: i.name,
      key: "name",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={32}
            style={{
              background: `hsl(${String(r.id).charCodeAt(0) * 38 + 190},58%,44%)`,
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {r.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--av-text)" }}>
              {isRTL ? r.nameFa : r.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--av-text4)" }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: i.dept,
      dataIndex: "dept",
      render: v => <span style={{ color: "var(--av-text3)", fontSize: 12 }}>{v}</span>,
    },
    {
      title: i.role,
      dataIndex: "role",
      render: v => (
        <span className={`av-tag ${v === "admin" ? "av-st-admin" : "av-st-user"}`}>
          {i[v as "user" | "admin"]}
        </span>
      ),
    },
    {
      title: i.status,
      dataIndex: "status",
      render: v => <span className={`av-tag ${stCls[v as UserStatus]}`}>{(i as any)[v]}</span>,
    },
    {
      title: i.ticketCount,
      dataIndex: "tickets",
      sorter: true,
      render: v => (
        <span
          style={{
            fontFamily: "var(--av-font-mono)",
            fontSize: 13,
            color: "#3b82f6",
            fontWeight: 700,
          }}
        >
          {fNum(v || 0, isRTL)}
        </span>
      ),
    },
    {
      title: i.lastLogin,
      dataIndex: "lastLogin",
      sorter: true,
      render: v => <span style={{ color: "var(--av-text4)", fontSize: 12 }}>{fDate(v || "2025-01-01", calMode, isRTL)}</span>,
    },
    {
      title: i.actions,
      key: "a",
      fixed: "right",
      width: 108,
      render: (_, r) => (
        <div style={{ display: "flex", gap: 2 }}>
          <Tooltip title={i.view}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              style={{ color: "#3b82f6" }}
              onClick={() => setViewRec(r)}
            />
          </Tooltip>
          <Tooltip title={i.edit}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              style={{ color: "#14b8a6" }}
              onClick={() => {
                setEditRec(r);
                editForm.setFieldsValue({
                  name: r.name,
                  nameFa: r.nameFa,
                  email: r.email,
                  phone: r.phone,
                  dept: r.dept,
                  role: r.role,
                });
              }}
            />
          </Tooltip>
          <Popconfirm
            title={i.deleteSure}
            onConfirm={() => handleDeleteUser(Number(r.id), r.name)}
            okText={i.confirm}
            cancelText={i.cancel}
          >
            <Tooltip title={i.delete}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PgHeader
        crumbs={[{ label: i.adminDash, page: "admin-dash" }, { label: i.userMgmt }]}
        title={i.userMgmt}
        sub={`${fNum(total, isRTL)} ${i.total}`}
        extra={
          <Btn sz="sm" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
            {i.addUser}
          </Btn>
        }
      />
      <Panel>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <Input
              placeholder={`${i.search}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ width: 200, borderRadius: '8px 0 0 8px' }}
              size="middle"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={doSearch}
              style={{ borderRadius: '0 8px 8px 0', height: 32 }}
            />
          </div>
          <Select
            placeholder={i.role}
            allowClear
            value={roleF}
            onChange={handleRoleFilterChange}
            style={{ width: 138 }}
            options={[
              { value: "user", label: i.user },
              { value: "admin", label: i.admin },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
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
          scroll={{ x: 900 }}
          size="small"
          locale={{
            emptyText: <Empty description={<span style={{ color: "var(--av-text4)" }}>{i.noUsers}</span>} />,
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination
            current={pg}
            pageSize={pgSz}
            total={total}
            showSizeChanger
            showTotal={t => `${fNum(t, isRTL)} ${i.total}`}
            pageSizeOptions={[5, 8, 10, 20]}
            onChange={(p, s) => {
              setPg(p);
              setPgSz(s);
              fetchData();
            }}
          />
        </div>
      </Panel>

      <Modal
        title={<span style={{ color: "var(--av-text)", fontFamily: ff }}>{editRec ? i.editUser : i.addUser}</span>}
        open={!!editRec || addOpen}
        onCancel={() => {
          setEditRec(null);
          setAddOpen(false);
          editForm.resetFields();
          addForm.resetFields();
        }}
        onOk={() => {
          const form = editRec ? editForm : addForm;
          form.validateFields()
            .then(editRec ? handleEditUser : handleAddUser)
            .catch(() => {});
        }}
        okText={i.save}
        cancelText={i.cancel}
        width={520}
      >
        <Form form={editRec ? editForm : addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={lbSt}>{i.fullName}</span>} name="name" rules={[{ required: true }]}>
                <Input style={inSt} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={lbSt}>{isRTL ? 'نام فارسی' : 'Persian Name'}</span>} name="nameFa">
                <Input style={inSt} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={lbSt}>{i.email}</span>} name="email" rules={[{ required: true, type: "email" }]}>
                <Input style={inSt} disabled={!!editRec} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={lbSt}>{i.phone}</span>} name="phone">
                <Input style={inSt} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={lbSt}>{i.dept}</span>} name="dept">
                <Select
                  options={[
                    "Engineering", "Design", "HR", "Finance", "Sales", "IT",
                    "Product", "Marketing", "Legal", "Operations"
                  ].map(d => ({ value: d, label: d }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={lbSt}>{i.role}</span>} name="role" initialValue="user">
                <Select
                  options={[
                    { value: "user", label: i.user },
                    { value: "admin", label: i.admin },
                  ]}
                />
              </Form.Item>
            </Col>
            {addOpen && (
              <Col span={24}>
                <Form.Item label={<span style={lbSt}>{i.password}</span>} name="password" rules={[{ required: true, min: 8 }]}>
                  <Input.Password style={inSt} />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item label={<span style={lbSt}>{isRTL ? 'بیوگرافی' : 'Bio'}</span>} name="bio">
                <Input.TextArea rows={2} style={inSt} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title={<span style={{ color: "var(--av-text)", fontFamily: ff }}>{i.viewUser}</span>}
        open={!!viewRec}
        onClose={() => setViewRec(null)}
        styles={{
          body: { background: "var(--av-bg4)", padding: 18 },
          header: { background: "var(--av-bg4)", borderBottom: "1px solid var(--av-border2)" },
        }}
      >
        {viewRec && (
          <div>
            <div
              style={{
                textAlign: "center",
                padding: "0 0 18px",
                borderBottom: "1px solid var(--av-border2)",
                marginBottom: 16,
              }}
            >
              <Avatar
                size={66}
                style={{
                  background: `hsl(${String(viewRec.id).charCodeAt(0) * 38 + 190},58%,44%)`,
                  fontSize: 26,
                  fontWeight: 800,
                  marginBottom: 11,
                }}
              >
                {viewRec.name.charAt(0)}
              </Avatar>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--av-text)", fontFamily: ff }}>
                {isRTL ? viewRec.nameFa : viewRec.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--av-text4)", marginTop: 3 }}>{viewRec.email}</div>
            </div>
            {[
              { l: i.phone, v: viewRec.phone || "—" },
              { l: i.dept, v: viewRec.dept },
              { l: i.role, v: i[viewRec.role as 'user' | 'admin'] },
              { l: i.status, v: i[viewRec.status as 'active' | 'inactive' | 'banned'] },
              { l: i.ticketCount, v: fNum(viewRec.tickets || 0, isRTL) },
              { l: i.lastLogin, v: fDate(viewRec.lastLogin || "2025-01-01", calMode, isRTL) },
              { l: i.created, v: fDate(viewRec.created || "2025-01-01", calMode, isRTL) },
            ].map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--av-border2)",
                }}
              >
                <span style={{ fontSize: 11.5, color: "var(--av-text4)", fontWeight: 600 }}>{it.l}</span>
                <span style={{ fontSize: 13, color: "var(--av-text2)" }}>{String(it.v)}</span>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
};

export default UserMgmt;