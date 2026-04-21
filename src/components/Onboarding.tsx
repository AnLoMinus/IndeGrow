import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Target, TrendingUp, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const questions = [
  {
    id: 'financial',
    title: 'מצב כלכלי 💰',
    desc: 'איך היית מגדיר את המצב הכלכלי הנוכחי שלך?',
    options: [
      { id: 'f1', label: 'שרידות - מתקשה לסגור את החודש', value: 'survival' },
      { id: 'f2', label: 'יציב - סוגר את החודש אבל לא חוסך', value: 'stable' },
      { id: 'f3', label: 'צומח - חוסך ומשקיע', value: 'growing' },
      { id: 'f4', label: 'עצמאי - הכנסות פסיביות ויציבות גבוהה', value: 'independent' },
    ]
  },
  {
    id: 'habits',
    title: 'הרגלים ומשמעת 🧩',
    desc: 'איך נראית שגרת היום שלך בדרך כלל?',
    options: [
      { id: 'h1', label: 'כאוס מוחלט, קשה לי להתמיד במשהו', value: 'chaotic' },
      { id: 'h2', label: 'משתדל אבל מרגיש שאני מבזבז המון זמן', value: 'inconsistent' },
      { id: 'h3', label: 'יש לי שגרה יציבה רוב הזמן', value: 'stable' },
      { id: 'h4', label: 'ממוקד מאוד, מנצל כל דקה', value: 'disciplined' },
    ]
  },
  {
    id: 'interests',
    title: 'מיקוד ופיתוח 🎯',
    desc: 'איזה תחום היית רוצה לפתח הכי הרבה כרגע?',
    options: [
      { id: 'i1', label: 'קריירה וכישורים מקצועיים (שכל)', value: 'mind' },
      { id: 'i2', label: 'בריאות, כושר ותזונה (גוף)', value: 'body' },
      { id: 'i3', label: 'עסקים ויצירת הכנסה (כסף)', value: 'money' },
      { id: 'i4', label: 'שקט נפשי וחיבור פנימי (רוח)', value: 'spirit' },
    ]
  }
];

export function Onboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitOnboarding();
    }
  };

  const submitOnboarding = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    // Base levels start at 1, maybe get bumped based on answers
    const baseLevels = { body: 1, mind: 1, money: 1, spirit: 1 };
    
    // Quick heuristic logic based on answers:
    if (answers.financial === 'growing' || answers.financial === 'independent') baseLevels.money += 1;
    if (answers.habits === 'stable' || answers.habits === 'disciplined') {
       baseLevels.mind += 1;
       baseLevels.body += 1;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true,
        onboardingData: answers,
        levels: baseLevels
      }, { merge: true });
      // The context listener will pick up the profile change automatically!
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[step];
  const canContinue = !!answers[currentQ.id];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 p-4">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl border overflow-hidden relative p-8">
         <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
           <div 
             className="h-full bg-blue-600 transition-all duration-300"
             style={{ width: `${((step + 1) / questions.length) * 100}%` }}
           />
         </div>

         <div className="text-center mb-8 mt-4">
           <h1 className="text-2xl font-bold text-slate-800 mb-2">בניית זהות דיגיטלית</h1>
           <p className="text-slate-500">ענה על מספר שאלות כדי שנוכל להתאים את המערכת אליך.</p>
         </div>

         <div className="mb-8">
           <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
             {currentQ.title}
           </h2>
           <p className="text-slate-600 mb-6">{currentQ.desc}</p>
           
           <div className="space-y-3">
             {currentQ.options.map(opt => (
               <button
                 key={opt.id}
                 onClick={() => handleSelect(currentQ.id, opt.value)}
                 className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                   answers[currentQ.id] === opt.value 
                   ? 'border-blue-600 bg-blue-50 text-blue-900' 
                   : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                 }`}
               >
                 <span className="font-medium">{opt.label}</span>
               </button>
             ))}
           </div>
         </div>

         <button
           onClick={handleNext}
           disabled={!canContinue || isSubmitting}
           className="w-full flex items-center justify-center gap-2 bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white p-4 rounded-xl font-bold transition-all"
         >
           {isSubmitting ? 'בונה פרופיל...' : (step === questions.length - 1 ? 'שמור פרופיל והתחל מומנטום' : 'השאלה הבאה')}
           {!isSubmitting && <ArrowRight className="w-5 h-5" />}
         </button>
      </div>
    </div>
  );
}
