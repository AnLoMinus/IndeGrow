import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { fetchGrowthSuggestion } from '../lib/gemini';
import { Target, Sparkles, PlusCircle, Check } from 'lucide-react';

interface SuggestionData {
  insight: string;
  recommendedTask: {
    title: string;
    description: string;
    category: string;
  };
}

export function AIGrowthWidget() {
  const { user, profile } = useAuth();
  const [suggestion, setSuggestion] = useState<SuggestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function loadSuggestion() {
      if (!user || !profile) return;
      try {
        // Fetch recent tasks for context
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid)
        );
        const taskSnap = await getDocs(tasksQuery);
        const recentTasks = taskSnap.docs.map(d => d.data());

        // Ask Gemini!
        const aiResponse = await fetchGrowthSuggestion(profile, recentTasks);
        if (aiResponse) {
           setSuggestion(aiResponse);
        }
      } catch (e) {
         console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadSuggestion();
  }, [user, profile]);

  const acceptTask = async () => {
    if (!user || !suggestion) return;
    
    try {
      const taskId = crypto.randomUUID();
      await setDoc(doc(db, 'tasks', taskId), {
        id: taskId,
        userId: user.uid,
        title: suggestion.recommendedTask.title,
        description: suggestion.recommendedTask.description,
        category: suggestion.recommendedTask.category,
        isCompleted: false,
        createdAt: new Date().toISOString()
      });
      setAccepted(true);
    } catch (e) {
       console.error("Failed to accept AI task", e);
    }
  }

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden h-full flex flex-col justify-center items-center">
         <Sparkles className="w-8 h-8 text-blue-400 animate-pulse mb-3" />
         <p className="text-slate-500 font-medium animate-pulse">המערכת מנתחת דפוסים אישיים...</p>
      </section>
    );
  }

  if (!suggestion) {
    return null; // Silent fail if quota met or no response
  }

  return (
    <section className="bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" /> 
        הצעת מנוע צמיחה (AI)
      </h2>
      
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-900 flex-1">
          <p className="font-bold text-sm text-blue-700 opacity-80 mb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> תובנה יומית ממוקדת:</p>
          <p className="font-medium mb-4 text-sm leading-relaxed">{suggestion.insight}</p>
          
          <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50">
             <p className="font-bold text-sm text-slate-700 mb-1">
               {suggestion.recommendedTask.title}
             </p>
             <p className="text-xs text-slate-600 block mb-2">{suggestion.recommendedTask.description}</p>
             <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                {suggestion.recommendedTask.category}
             </span>
          </div>
        </div>

        <button 
           onClick={acceptTask}
           disabled={accepted}
           className={`mt-4 w-full text-sm font-bold px-4 py-3 rounded-xl transition flex items-center justify-center gap-2
             ${accepted ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}
           `}
        >
          {accepted ? (
            <>
              <Check className="w-4 h-4" /> משימה אושרה ונוספה לרשימה!
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" /> אני לוקח את האתגר (הוסף למשימות)
            </>
          )}
        </button>
      </div>
    </section>
  );
}
