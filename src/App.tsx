import { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Sidebar from './components/Sidebar';
import type { QuestionTypeId } from './components/Sidebar';
import { QuestionCard, QuestionEditor } from './components/QuestionItems';
import type { Question } from './components/QuestionItems';
import { FileText, AlignLeft } from 'lucide-react';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  // ドラッグ中の設問のインデックスを保持するステート
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [surveyTitle, setSurveyTitle] = useState('未設定のアンケートタイトル');
  const [surveyDescription, setSurveyDescription] = useState('このアンケートの概要や回答者への案内文をここに入力してください。');
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);

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

  // 設問を複製する関数（その設問のすぐ下にコピーを挿入する）
  const handleDuplicateQuestion = (id: string) => {
    const targetIndex = questions.findIndex(q => q.id === id);
    if (targetIndex === -1) return;

    const targetQuestion = questions[targetIndex];
    const newId = `q-dup-${Date.now()}`;
    
    const duplicatedQuestion: Question = {
      ...targetQuestion,
      id: newId,
      options: targetQuestion.options ? [...targetQuestion.options] : undefined,
    };

    const updatedList = [...questions];
    updatedList.splice(targetIndex + 1, 0, duplicatedQuestion);
    
    // 一番下にあるヘルパー関数を使って番号を振り直して保存
    setQuestions(renumberQuestions(updatedList));
    setOpenQuestionId(newId);
  };

  // 設問を削除する関数
  const handleDeleteQuestion = (id: string) => {
    const filtered = questions.filter(q => q.id !== id);
    setQuestions(renumberQuestions(filtered));
    if (openQuestionId === id) {
      setOpenQuestionId(null);
    }
  };

  // 設問の内容を更新する関数
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  // ドラッグ＆ドロップ並び替えのロジック群
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedList = [...questions];
    const [draggedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(targetIndex, 0, draggedItem);

    setDraggedIndex(targetIndex);
    setQuestions(renumberQuestions(updatedList));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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

          <main className="col-span-9 p-6 bg-white space-y-6">
            
            {/* アンケートタイトル・概要 設定スペース */}
            <div className={`border rounded-xl transition-all p-5 ${
              isEditingMetadata 
                ? 'border-blue-500 bg-blue-50/10 shadow-md' 
                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
            }`}>
              {isEditingMetadata ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-blue-600">アンケート基本情報の編集</span>
                    <button 
                      onClick={() => setIsEditingMetadata(false)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs shadow-sm transition-colors"
                    >
                      完了
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <FileText size={14} /> アンケートタイトル
                    </label>
                    <input
                      type="text"
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      className="w-full text-base font-bold border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <AlignLeft size={14} /> 概要・はじめに（説明文）
                    </label>
                    <textarea
                      rows={3}
                      value={surveyDescription}
                      onChange={(e) => setSurveyDescription(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div onClick={() => setIsEditingMetadata(true)} className="cursor-pointer group/meta">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h2 className="text-lg font-bold text-slate-900 group-hover/meta:text-blue-600 transition-colors">
                        {surveyTitle || <span className="text-slate-400 italic">タイトルが未入力です</span>}
                      </h2>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {surveyDescription || <span className="text-slate-400 italic">概要・説明文が未入力です</span>}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium border border-slate-200 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover/meta:opacity-100 transition-opacity ml-4 whitespace-nowrap">
                      編集する
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 設問一覧の見出し */}
            <div>
              <div className="text-sm font-bold text-slate-700 mb-2">
                設問一覧 <span className="text-xs font-normal text-slate-400">（左端のハンドルをドラッグして順番変更）</span>
              </div>

              <div className="space-y-4">
                {questions.map((q, index) => {
                  const isDragging = index === draggedIndex;
                  
                  return (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className={`transition-all duration-150 ${
                        isDragging ? 'opacity-40 scale-[0.98] border border-dashed border-blue-400 rounded-lg' : 'opacity-100'
                      }`}
                    >
                      {openQuestionId === q.id ? (
                        <QuestionEditor 
                          question={q} 
                          onClose={() => setOpenQuestionId(null)} 
                          onDelete={() => handleDeleteQuestion(q.id)}
                          onDuplicate={() => handleDuplicateQuestion(q.id)}
                          onUpdate={handleUpdateQuestion}
                        />
                      ) : (
                        <QuestionCard 
                          question={q} 
                          onOpen={() => setOpenQuestionId(q.id)} 
                        />
                      )}
                    </div>
                  );
                })}

                {questions.length === 0 && (
                  <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                    <p className="text-sm font-medium text-slate-500 mb-1">設問が登録されていません</p>
                    <p className="text-xs text-slate-400">左側の「設問タイプ」をクリックして、新しい設問を追加してください。</p>
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// 🆕 エラー回避のため、コンポーネントの外（最下部）に独立して配置
function renumberQuestions(list: Question[]) {
  return list.map((q, index) => ({
    ...q,
    number: `Q${index + 1}`
  }));
}