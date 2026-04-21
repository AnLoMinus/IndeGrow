import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { CheckCircle2, Circle, Trophy, Loader2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  isCompleted: boolean;
  createdAt: string;
  userId: string;
}

export function TasksWidget() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // We fetch tasks belonging to the user
    // A robust system would query by `createdAt` to only get today's tasks
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbTasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Task));
      
      // Auto-generate starting tasks if empty
      if (dbTasks.length === 0 && !snapshot.metadata.hasPendingWrites) {
        generateDailyTasks(user.uid);
      }
      
      setTasks(dbTasks.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateDailyTasks = async (userId: string) => {
    const today = new Date().toISOString();
    const starterTasks = [
      { id: crypto.randomUUID(), userId, title: 'קרא 10 דקות בספר התפתחות', category: 'mind', isCompleted: false, createdAt: today },
      { id: crypto.randomUUID(), userId, title: 'בצע פעילות גופנית 20 דקות', category: 'body', isCompleted: false, createdAt: today },
      { id: crypto.randomUUID(), userId, title: 'למד מיומנות חדשה ליצירת הכנסה (15 דק)', category: 'money', isCompleted: false, createdAt: today }
    ];

    starterTasks.forEach(async (task) => {
      await setDoc(doc(db, 'tasks', task.id), task);
    });
  };

  const toggleTask = async (task: Task) => {
    if (!user) return;
    
    const taskRef = doc(db, 'tasks', task.id);
    const completed = !task.isCompleted;

    try {
      await updateDoc(taskRef, {
        isCompleted: completed,
        completedAt: completed ? new Date().toISOString() : null
      });

      // Grant XP safely if checked (simple model for 0.0.3)
      if (completed) {
        await updateDoc(doc(db, 'users', user.uid), {
          xp: increment(25) // Grant 25 XP per task
        });
      }
    } catch (e) {
      console.error("Error updating task", e);
    }
  };

  if (loading) {
    return <div className="p-6 bg-white border rounded-2xl flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
  }

  // Calculate generic progress
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <section className="bg-white p-6 rounded-2xl border shadow-sm relative">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
             <Trophy className="w-5 h-5 text-amber-500" /> 
             משימות יומיות
           </h2>
           <p className="text-sm text-slate-500">התמדה בונה אותך</p>
        </div>
        <div className="text-left">
           <span className="text-2xl font-bold tracking-tight text-blue-600">{completedCount}/{tasks.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 delay-100" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`flex items-start gap-4 p-4 border rounded-xl transition cursor-pointer select-none
               ${task.isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'}
            `}
            onClick={() => toggleTask(task)}
          >
             <button aria-label="Toggle Complete" className={`mt-0.5 shrink-0 ${task.isCompleted ? 'text-blue-600' : 'text-slate-400'}`}>
                {task.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
             </button>
             <div className="flex-1 text-right">
                <span className={`font-medium ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                  {task.title}
                </span>
                <span className="block text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                  {task.category}
                </span>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
