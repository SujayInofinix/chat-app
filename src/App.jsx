import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import WhatsappInbox from './pages/WhatsappInbox';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/whatsapp/conversations" replace />} />
          <Route path="/whatsapp/conversations" element={<WhatsappInbox />} />
          <Route path="/whatsapp/conversations/:id" element={<WhatsappInbox />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
