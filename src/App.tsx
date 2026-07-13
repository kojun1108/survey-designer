import { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Sidebar from './components/Sidebar';
import type { QuestionTypeId } from './components/Sidebar';
import { QuestionCard, QuestionEditor } from './components/QuestionItems';
import type { Question } from './components/QuestionItems';

export default function App() {
  // すべての設問タイプを1回ずつ押して追加した状態の初期データ
  const [questions, setQuestions] = useState<Question[]>([
    { id: 'initial-single', number: 'Q1', title: 'あなたの所属部署を教えてください。', type: '単一選択', required: true },
    { id: 'initial-multiple', number: 'Q2', title: '現在の働き方について（あてはまるものをすべて選択）', type: '複数選択', required: true },
    { id: 'initial-dropdown', number: 'Q3', title: 'お住まいの都道府県を選択してください。', type: 'プルダウン', required: true },
    { id: 'initial-text', number: 'Q4', title: '弊社のサービスに対するご意見・ご要望をご記入ください。', type: '自由記述', required: false },
    { id: 'initial-number', number: 'Q5', title: 'あなたの年齢をご入力ください。', type: '数値入力', required: false },
    { id: 'initial-date', number: 'Q6', title: 'ご希望の参加日程を選択してください。', type: '日付', required: false },
    { id: 'initial-rating', number: 'Q7', title: '今回のイベントの満足度を教えてください。', type: '評価（5段階）', required: true },
    { id: 'initial-divider', number: 'Q8', title: 'ここからは、あなたご自身に関する質問となります。', type: '説明・区切り', required: false },
  ]);

  // 最初からQ2を展開状態にしておく
  const [openQuestionId, setOpenQuestionId] = useState<string | null>('initial-multiple');

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

            {questions.length === 0 && (
              <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                左側の「設問タイプ」をクリックして、設問を追加してください。
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}