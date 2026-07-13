import { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Sidebar from './components/Sidebar';
import type { QuestionTypeId } from './components/Sidebar';
import { QuestionCard, QuestionEditor } from './components/QuestionItems';
import type { Question } from './components/QuestionItems';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  // 新しい設問を追加する
  const handleAddQuestion = (typeId: QuestionTypeId) => {
    const labels: Record<QuestionTypeId, string> = {
      single: '単一選択',
      multiple: '複数選択',
      dropdown: 'プルダウン',
      text: '自由記述',
      number: '数値入力',
      date: '日付',
      rating: '評価（5段階）',
      divider: '説明・区切り',
    };

    const nextNumber = questions.length + 1;
    const newId = `q-${Date.now()}`;
    const typeLabel = labels[typeId];

    const defaultOptions = ['単一選択', '複数選択', 'プルダウン'].includes(typeLabel)
      ? ['選択肢1', '選択肢2', '選択肢3']
      : undefined;

    const newQuestion: Question = {
      id: newId,
      number: `Q${nextNumber}`,
      title: typeLabel === '説明・区切り' 
        ? 'ここへ案内文や説明テキストを入力してください。'
        : `新しい${typeLabel}の設問タイトルを入力してください。`,
      type: typeLabel,
      required: false,
      options: defaultOptions
    };

    setQuestions([...questions, newQuestion]);
    setOpenQuestionId(newId);
  };

  // 設問を削除する関数（番号の再振り分けも含む）
  const handleDeleteQuestion = (id: string) => {
    const filtered = questions.filter(q => q.id !== id);
    // 削除後にQ1, Q2... と番号を綺麗に詰め直す
    const renumbered = filtered.map((q, index) => ({
      ...q,
      number: `Q${index + 1}`
    }));
    setQuestions(renumbered);
    if (openQuestionId === id) {
      setOpenQuestionId(null);
    }
  };

  // 設問の内容（タイトル・必須・選択肢）を更新する関数
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
      <div className="max-w-6xl mx-auto mb-4 flex items-center gap-3">
        <span className="bg-blue-600 text-white font-bold w-7 h-7 flex items-center justify-center rounded text-sm shadow-sm">4</span>
        <h1 className="text-xl font-bold text-slate-900">アンケート詳細設計画面</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Header />
        <Stepper />

        <div className="grid grid-cols-12 min-h-[600px]">
          <Sidebar onAddQuestion={handleAddQuestion} />

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
                    onDelete={() => handleDeleteQuestion(q.id)}
                    onUpdate={handleUpdateQuestion}
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

            {questions.length === 0 && (
              <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <p className="text-sm font-medium text-slate-500 mb-1">設問が登録されていません</p>
                <p className="text-xs text-slate-400">左側の「設問タイプ」をクリックして、新しい設問を追加してください。</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}