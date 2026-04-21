import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Compass, Target, Sparkles, LogIn } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';
import { AdminPanel } from './AdminPanel';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
        <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl text-center border overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <BrainCircuit className="w-16 h-16 mx-auto text-blue-600 mb-6" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">ברוכים הבאים ל-IndeGrow</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            מערכת הפעלה אישית לחיים עצמאיים. 
            משמעת, אחריות, התמדה, אמת, צמיחה.
            <br/><br/>
            התחברו כדי לרכז את תהליכי הצמיחה שלכם תחת קורת גג אחת, וקבלו ליווי AI מבוסס תבונה.
          </p>
          <button 
            onClick={loginWithGoogle}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            התחברו עם Google והתחילו
          </button>
        </div>
      </div>
    );
  }

  // MOCK DATA for MVP view, replacing soon.
  const stats = [
    { label: "משימות יומיות", value: "3/5", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "עבודה עמוקה", value: "25 דק'", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "כיוון שבועי", value: "+12%", icon: Compass, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            שלום, {user.displayName} <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-slate-500">"חייב אדם לראות את עצמו כאילו הוא יצא ממצרים"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((S, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${S.bg}`}>
              <S.icon className={`w-6 h-6 ${S.color}`} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{S.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{S.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core System Mock for future logic */}
        <section className="bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" /> 
            הצעת מנוע צמיחה (AI)
          </h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-900">
            <p className="font-medium mb-2">זיהוי דפוס: אתה חלש במיקוד השבוע.</p>
            <p className="text-sm opacity-90 mb-4">
              מזהה ירידה ברמת ההתמדה בתחום "השכל/למידה". המלצה: החלפת יעד יומי ל-25 דקות של למידה ממוקדת ללא הסחות דעת, ואחריה תרגיל נשימה.
            </p>
            <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              קבל משימה עכשיו
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border shadow-sm relative">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-600" /> 
            עולמות התפתחות
          </h2>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">🧠 שכל / למידה</span>
                <span className="text-xs bg-slate-200 px-2 py-1 rounded font-bold">רמה 4</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">💰 כסף / עסקים</span>
                <span className="text-xs bg-slate-200 px-2 py-1 rounded font-bold">רמה 2</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">🏃‍♂️ גוף ובריאות</span>
                <span className="text-xs bg-slate-200 px-2 py-1 rounded font-bold">רמה 5</span>
             </div>
          </div>
        </section>
      </div>

      <AdminPanel />

    </div>
  );
}
