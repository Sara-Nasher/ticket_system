import React from 'react';
import { Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';

const ServerError: React.FC = () => {
  const { i } = useApp();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--av-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--av-font-display)",
      }}
    >
      <div className="av-orb-2" style={{ opacity: 0.35 }} />
      <Result
        status="500"
        title={<span style={{ color: "var(--av-text)", fontSize: 28, fontWeight: 800 }}>{i.p500t}</span>}
        subTitle={<span style={{ color: "var(--av-text3)" }}>{i.p500d}</span>}
        extra={
          <button
            onClick={() => window.location.reload()}
            className="av-btn-p"
            style={{
              padding: "10px 22px",
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ReloadOutlined />
            {i.retry}
          </button>
        }
        style={{ position: "relative", zIndex: 2 }}
      />
    </div>
  );
};

export default ServerError;