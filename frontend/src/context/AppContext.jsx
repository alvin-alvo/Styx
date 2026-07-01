import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSecret as otplibGenerateSecret, verifySync } from 'otplib';
import i18n from '../i18n';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // 2FA states
  const [requires2FA, setRequires2FA] = useState(false);
  const [totpSecret, setTotpSecret] = useState(localStorage.getItem('totpSecret') || null);
  const [demoMode, setDemoMode] = useState(true);

  // Initialize theme from local storage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
  }, []);

  // Apply theme class to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply language to local storage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Helper to manage mock DB
  const loadUsers = () => {
    try {
      const users = localStorage.getItem('styx_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem('styx_users', JSON.stringify(users));
  };

  const signup = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    
    if (!cleanUser || !cleanPass) return { error: 'Username and password required.' };

    const users = loadUsers();
    if (users.find(u => u.username === cleanUser)) {
      return { error: 'Username already exists.' };
    }

    const newUser = { username: cleanUser, password: cleanPass, role: 'user', totpSecret: null };
    users.push(newUser);
    saveUsers(users);

    setUser(newUser);
    setRequires2FA(true);
    return { status: 'setup' };
  };

  const login = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    
    // Support legacy admin/admin override for demo ease
    if (cleanUser === 'admin' && cleanPass === 'admin') {
      const users = loadUsers();
      let adminUser = users.find(u => u.username === 'admin');
      if (!adminUser) {
        adminUser = { username: 'admin', password: 'admin', role: 'administrator', totpSecret: null };
        users.push(adminUser);
        saveUsers(users);
      }
      setUser(adminUser);
      setRequires2FA(true);
      return { status: adminUser.totpSecret ? 'verify' : 'setup' };
    }

    const users = loadUsers();
    const existingUser = users.find(u => u.username === cleanUser && u.password === cleanPass);
    
    if (existingUser) {
      setUser(existingUser);
      setRequires2FA(true);
      return { status: existingUser.totpSecret ? 'verify' : 'setup' };
    }
    
    return { error: 'Invalid credentials.' };
  };

  const generateNewSecret = () => {
    const secret = otplibGenerateSecret();
    return secret;
  };

  const verifyTOTP = (token, secretForSetup = null) => {
    try {
      const secretToTest = secretForSetup || user?.totpSecret;
      if (!secretToTest) return false;

      const { valid } = verifySync({ token, secret: secretToTest, strategy: 'totp' });
      if (valid) {
        // If this was a setup verification, save the secret to the DB
        if (secretForSetup) {
          const users = loadUsers();
          const userIdx = users.findIndex(u => u.username === user.username);
          if (userIdx !== -1) {
            users[userIdx].totpSecret = secretForSetup;
            saveUsers(users);
            setUser(users[userIdx]);
          }
        }
        
        setIsAuthenticated(true);
        setRequires2FA(false);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const bypass2FA = () => {
    setIsAuthenticated(true);
    setRequires2FA(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRequires2FA(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      language,
      changeLanguage,
      isAuthenticated,
      requires2FA,
      totpSecret,
      demoMode,
      user,
      login,
      signup,
      logout,
      generateNewSecret,
      verifyTOTP,
      bypass2FA
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
