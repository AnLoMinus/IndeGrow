/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full relative">
          <Dashboard />
        </main>
      </div>
    </AuthProvider>
  );
}
