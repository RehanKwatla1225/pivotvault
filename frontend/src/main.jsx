import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <App />
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
