import React, { useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Switch,
  InputNumber,
  Tabs,
  Alert,
  App,
} from 'antd';
import { useApp } from '../context/AppContext';
import { UserLayout, AdminLayout, Panel, PgHeader, Btn, lbSt, inSt } from '../components/Layouts';

const Settings: React.FC = () => {
  const { message } = App.useApp();
  const { i, lang, setLang, auth, isRTL, calMode, setCalMode, themeMode, setThemeMode, resolvedTheme } = useApp();
  const isAdmin = auth?.role === "admin";
  const Wrap = isAdmin ? AdminLayout : UserLayout;
  const ff = "var(--av-font-display)";
  const [saving, setSaving] = useState(false);

  const TR: React.FC<{ label: string; desc: string; def?: boolean }> = ({ label, desc, def }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid var(--av-border2)",
      }}
    >
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--av-text)", fontFamily: ff }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--av-text4)", marginTop: 2 }}>{desc}</div>
      </div>
      <Switch defaultChecked={def} size="small" />
    </div>
  );

  const tabs = [
    {
      key: "general",
      label: i.general,
      children: (
        <Panel>
          <Form layout="vertical">
            <Form.Item label={<span style={lbSt}>{i.language}</span>}>
              <Radio.Group
                value={lang}
                onChange={e => setLang(e.target.value)}
                style={{ display: "flex", gap: 12 }}
              >
                <Radio value="en" style={{ color: "var(--av-text2)" }}>
                  English (LTR)
                </Radio>
                <Radio value="fa" style={{ color: "var(--av-text2)" }}>
                  فارسی (RTL)
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={<span style={lbSt}>{i.calendarType}</span>}>
              <Radio.Group
                value={calMode}
                onChange={e => setCalMode(e.target.value)}
                style={{ display: "flex", gap: 12 }}
              >
                <Radio value="gregorian">{i.gregorian}</Radio>
                <Radio value="jalali">{i.jalali}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={<span style={lbSt}>{i.themeMode}</span>}>
              <Radio.Group
                value={themeMode}
                onChange={e => setThemeMode(e.target.value)}
                style={{ display: "flex", gap: 12 }}
              >
                <Radio value="light">☀️ {i.lightMode}</Radio>
                <Radio value="dark">🌙 {i.darkMode}</Radio>
                <Radio value="system">🖥 {i.systemTheme}</Radio>
              </Radio.Group>
            </Form.Item>
            {isAdmin && (
              <>
                <Form.Item label={<span style={lbSt}>{i.siteName}</span>}>
                  <Input defaultValue="Aven" style={inSt} size="large" />
                </Form.Item>
                <Form.Item label={<span style={lbSt}>{i.sessionTimeout}</span>}>
                  <InputNumber
                    min={5}
                    max={1440}
                    defaultValue={60}
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Form.Item>
              </>
            )}
            <Btn
              loading={saving}
              onClick={async () => {
                setSaving(true);
                await new Promise(r => setTimeout(r, 500));
                message.success(i.settingsSaved);
                setSaving(false);
              }}
            >
              {i.save}
            </Btn>
          </Form>
        </Panel>
      ),
    },

    ...(isAdmin
      ? [
          {
            key: "system",
            label: i.system,
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Alert
                  title={i.systemConfig}
                  description={i.systemConfigDesc}
                  type="warning"
                  showIcon
                />
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
                    {i.sysStatus}
                  </h4>
                  {[
                    { svc: i.apiServer, st: "operational", lat: "12ms" },
                    { svc: i.database, st: "operational", lat: "3ms" },
                    { svc: i.emailService, st: "operational", lat: "—" },
                    { svc: i.fileStorage, st: "degraded", lat: "340ms" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid var(--av-border2)",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--av-text)" }}>
                        {s.svc}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--av-text4)",
                            fontFamily: "var(--av-font-mono)",
                          }}
                        >
                          {s.lat}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: s.st === "operational" ? "#10b981" : "#d97706",
                              boxShadow: `0 0 5px ${s.st === "operational" ? "#10b981" : "#d97706"}`,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              color: s.st === "operational" ? "#10b981" : "#d97706",
                            }}
                          >
                            {s.st === "operational" ? i.operationalStatus : i.degradedStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Panel>
                <Panel>
                  <TR label={i.maintenance} desc="Disable access for regular users" />
                  <TR label={i.debugLogging} desc={i.debugLoggingDesc} />
                  <TR label={i.guestAccess} desc={i.guestAccessDesc} def />
                </Panel>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Wrap>
      <PgHeader
        crumbs={
          isAdmin
            ? [{ label: i.adminDash, page: "admin-dash" }, { label: i.settings }]
            : [{ label: i.dashboard, page: "dashboard" }, { label: i.settings }]
        }
        title={i.settings}
      />
      <Tabs items={tabs} />
    </Wrap>
  );
};

export default Settings;