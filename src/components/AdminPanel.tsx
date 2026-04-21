import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Users, Activity, Clock, ShieldAlert } from 'lucide-react';

export function AdminPanel() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const q = query(collection(db, 'users'), orderBy('lastActive', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, [profile]);

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl mt-8">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
        <ShieldAlert className="w-6 h-6 text-red-400" />
        <h2 className="text-xl font-bold">פאנל מנהל מערכת</h2>
      </div>

      <div className="mb-4 text-sm text-slate-400 flex items-center gap-2">
        <Users className="w-4 h-4" />
        {users.length} משתמשים רשומים סך הכל
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 rounded-tr-lg">משתמש</th>
              <th className="px-4 py-3">אימייל</th>
              <th className="px-4 py-3">סטטוס</th>
              <th className="px-4 py-3">טוקנים</th>
              <th className="px-4 py-3 rounded-tl-lg">נראה לאחרונה</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                <td className="px-4 py-3 flex items-center gap-3">
                   <img src={u.photoURL} alt={u.displayName} className="w-8 h-8 rounded-full bg-slate-700" />
                   <span className="font-medium">{u.displayName}</span>
                   {u.role === 'admin' && <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-bold">Admin</span>}
                </td>
                <td className="px-4 py-3 text-slate-400">{u.email}</td>
                <td className="px-4 py-3">
                  {u.isOnline ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <Activity className="w-3 h-3" /> מחובר
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">מנותק</span>
                  )}
                </td>
                <td className="px-4 py-3 text-amber-400 font-medium">{u.tokenBalance?.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(u.lastActive).toLocaleString('he-IL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
