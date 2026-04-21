import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle, logout } from '../lib/firebase';
import { Modal } from './Modal';
import { MarkdownViewer } from './MarkdownViewer';
import { LogIn, LogOut, Info, CheckSquare, Coins, User as UserIcon } from 'lucide-react';

export function Header() {
  const { user, profile } = useAuth();
  
  // Modal states
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [todoOpen, setTodoOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Right side: Logo & Version */}
        <div className="flex flex-col items-start leading-none group cursor-pointer" onClick={() => setChangelogOpen(true)}>
          <span className="font-bold text-xl tracking-tight text-blue-700">IndeGrow OS</span>
          <div className="flex flex-row items-center gap-1 mt-1 bg-blue-100 text-blue-800 text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors group-hover:bg-blue-200">
            <span>גרסה 0.0.1</span>
          </div>
        </div>

        {/* Center/Left: Navigation & Actions */}
        <div className="flex items-center gap-4">
          
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={() => setTodoOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              משימות מערכת
            </button>
            <button 
              onClick={() => setAboutOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Info className="w-4 h-4" />
              אודות
            </button>
          </div>

          {/* User Auth & Tokens */}
          <div className="flex items-center gap-3 border-r pr-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium">{user.displayName}</span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full" title="הערכת טוקנים שנותרו בחשבון החינמי">
                    <Coins className="w-3 h-3" />
                    <span>{profile?.tokenBalance?.toLocaleString() || '---'} טוקנים</span>
                  </div>
                </div>
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || 'User'} 
                  className="w-9 h-9 rounded-full border shadow-sm"
                />
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="התנתק"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                התחברות עם Google
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal open={changelogOpen} onOpenChange={setChangelogOpen} title="יומן עדכונים וגרסאות (Changelog)">
        <MarkdownViewer fileUrl="/Changelog.md" />
      </Modal>

      <Modal open={todoOpen} onOpenChange={setTodoOpen} title="משימות ושדרוגי מערכת (Todo)">
        <MarkdownViewer fileUrl="/Todo.md" />
      </Modal>

      <Modal open={aboutOpen} onOpenChange={setAboutOpen} title="אודות המערכת">
        <div className="flex flex-col gap-4 text-slate-700 mt-4 leading-relaxed">
          <p className="text-base text-center font-medium bg-blue-50 text-blue-800 p-4 rounded-lg">
            מערכת <strong>IndeGrow OS</strong> - מערכת הפעלה לחיים עצמאיים. 
            מלווה אישית להתפתחות מתמדת, יצירת כיוון ומשמעות, ולחיים בעלי תנועה קדימה.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2 border-b pb-2">קרדיטים ומפתח:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-slate-400" />
                <strong>לאון יעקובוב (AnLoMinus)</strong>
              </li>
              <li>📞 <a href="https://wa.me/972543285967" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">054-328-5967</a> (לפתיחת וואטסאפ)</li>
              <li>📧 <a href="mailto:GlobalElite8200@gmail.com" className="text-blue-600 hover:underline">GlobalElite8200@gmail.com</a></li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="https://www.linkedin.com/in/anlominus/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600">LinkedIn</a>
              <a href="https://github.com/Anlominus" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900">GitHub</a>
              <a href="https://www.facebook.com/AnlominusX" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-700">Facebook</a>
              <a href="https://codepen.io/Anlominus" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900">CodePen</a>
            </div>
          </div>
        </div>
      </Modal>

    </header>
  );
}
