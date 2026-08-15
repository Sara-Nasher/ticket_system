import React from 'react';
import { App as AntApp } from 'antd';
import { AppProvider } from './context/AppContext';
import AppContent from './AppContent';

function App() {
  return (
    <AppProvider>
      <AntApp>
        <AppContent />
      </AntApp>
    </AppProvider>
  );
}

export default App;