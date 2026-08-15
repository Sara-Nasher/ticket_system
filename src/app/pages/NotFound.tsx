import React from 'react';
import { Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';

const NotFound: React.FC = () => {
  const { i, navigate } = useApp();

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
      <div className="av-orb-1" style={{ opacity: 0.35 }} />
      <div className="av-orb-2" style={{ opacity: 0.25 }} />
      <Result
        status="404"
        title={<span style={{ color: "var(--av-text)", fontSize: 28, fontWeight: 800 }}>{i.p404t}</span>}
        subTitle={<span style={{ color: "var(--av-text3)" }}>{i.p404d}</span>}
        extra={
          <button
            onClick={() => navigate("landing")}
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
            <HomeOutlined />
            {i.backHome}
          </button>
        }
        style={{ position: "relative", zIndex: 2 }}
      />
    </div>
  );
};

export default NotFound;