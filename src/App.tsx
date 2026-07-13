import { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Sidebar from './components/Sidebar';
import type { QuestionTypeId } from './components/Sidebar';
import { QuestionCard, QuestionEditor } from './components/QuestionItems';
import type { Question } from './components/QuestionItems';

export default function App() {
  // 1. 初期状態を空の配列にする
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  // サイドバーがクリックされたときに、新しい設問をリストの末尾に追加する関数
  const handleAddQuestion = (typeId: QuestionTypeId) => {
    // 選択されたIDから日本語のラベル名を取得
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
    const newId = `q-${Date.now()}`; // 重複しないユニークなIDを生成

    const newQuestion: Question = {
      id: newId,
      number: `Q${nextNumber}`,
      title: `新しい${labels[typeId]}の設問タイトルを入力してください。`,
      type: labels[typeId],
      required: false,
    };

    // 既存の設問リストの末尾に追加し、追加した設問を自動で展開状態（編集モード）にする
    setQuestions([...questions, newQuestion]);
    setOpenQuestionId(newId);
  };

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
          {/* 追加用関数をProps経由でサイドバーに渡す */}
          <Sidebar onAddQuestion={handleAddQuestion} />

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

            {/* 設問がゼロの時の案内表示（点線のボックス） */}
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