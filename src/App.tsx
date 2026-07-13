import { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Sidebar from './components/Sidebar';
import { QuestionCard, QuestionEditor, Question } from './components/QuestionItems';

export default function App() {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>('q2');

  const questions: Question[] = [
    { id: 'q1', number: 'Q1', title: 'あなたの所属部署を教えてください。', type: '単一選択', required: true },
    { id: 'q2', number: 'Q2', title: '現在の働き方について', type: '複数選択', required: true },
    { id: 'q3', number: 'Q3', title: '満足度を教えてください。', type: '評価（5段階）', required: true },
    { id: 'q4', number: 'Q4', title: 'ご意見・ご要望があればご自由にご記入ください。', type: '自由記述', required: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
      {/* 画面タイトル */}
      <div className="max-w-6xl mx-auto mb-4 flex items-center gap-3">
        <span className="bg-blue-600 text-white font-bold w-7 h-7 flex items-center justify-center rounded text-sm shadow-sm">4</span>
        <h1 className="text-xl font-bold text-slate-900">アンケート詳細設計画面</h1>
      </div>

      {/* メインコンテナ */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Header />
        <Stepper />

        <div className="grid grid-cols-12 min-h-[600px]">
          <Sidebar />

          {/* 右メイン: 設問一覧 */}
          <main className="col-span-9 p-6 bg-white space-y-4">
            <div className="text-sm text-slate-500 mb-2">
              設問一覧 <span className="text-xs">（ドラッグ＆ドロップで順番変更）</span>
            </div>

            {questions.map((q) => {
              if (openQuestionId === q.id) {
                return (
                  <QuestionEditor 
                    key={q.id} 
                    question={q} 
                    onClose={() => setOpenQuestionId(null)} 
                  />
                );
              }

              return (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  onOpen={() => setOpenQuestionId(q.id)} 
                />
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}