import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import type { QuestionTypeId } from './components/Sidebar';
import { QuestionCard, QuestionEditor } from './components/QuestionItems';
import type { Question } from './components/QuestionItems';
import { FileText, AlignLeft, Eye, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

// 画面のモード定義
type AppMode = 'edit' | 'preview' | 'publish';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 🆕 現在の画面モードを管理するステート ('edit' | 'preview' | 'publish')
  const [currentMode, setCurrentMode] = useState<AppMode>('edit');

  const [surveyTitle, setSurveyTitle] = useState('未設定のアンケートタイトル');
  const [surveyDescription, setSurveyDescription] = useState('このアンケートの概要や回答者への案内文をここに入力してください。');
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);

  // 🆕 プレビュー画面での回答データを保持するステート（テスト用）
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // 新しい設問を追加
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
    
    setQuestions(renumberQuestions(updatedList));
    setOpenQuestionId(newId);
  };

  const handleDeleteQuestion = (id: string) => {
    const filtered = questions.filter(q => q.id !== id);
    setQuestions(renumberQuestions(filtered));
    if (openQuestionId === id) {
      setOpenQuestionId(null);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

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

  // プレビュー画面での回答入力ハンドラー
  const handleAnswerChange = (qId: string, value: any) => {
    setAnswers({ ...answers, [qId]: value });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
      <div className="max-w-6xl mx-auto mb-4 flex items-center gap-3">
        <span className="bg-blue-600 text-white font-bold w-7 h-7 flex items-center justify-center rounded text-sm shadow-sm">4</span>
        <h1 className="text-xl font-bold text-slate-900">アンケート詳細設計画面</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Header />
        
        {/* 🆕 動的なステップバー (位置クリックでも移動可能) */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-sm font-medium">
          <button 
            onClick={() => setCurrentMode('edit')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              currentMode === 'edit' ? 'border-blue-600 text-blue-600 bg-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. 設問設計
          </button>
          <button 
            onClick={() => setCurrentMode('preview')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              currentMode === 'preview' ? 'border-blue-600 text-blue-600 bg-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            2. プレビュー
          </button>
          <button 
            onClick={() => setCurrentMode('publish')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              currentMode === 'publish' ? 'border-blue-600 text-blue-600 bg-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            3. 公開設定
          </button>
        </div>

        <div className="grid grid-cols-12 min-h-[600px]">
          
          {/* 1. 設問設計モードのレイアウト */}
          {currentMode === 'edit' && (
            <>
              <Sidebar onAddQuestion={handleAddQuestion} />
              <main className="col-span-9 p-6 bg-white space-y-6">
                {/* アンケートタイトル・概要 設定スペース */}
                <div className={`border rounded-xl transition-all p-5 ${
                  isEditingMetadata ? 'border-blue-500 bg-blue-50/10 shadow-md' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}>
                  {isEditingMetadata ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-blue-600">アンケート基本情報の編集</span>
                        <button onClick={() => setIsEditingMetadata(false)} className="px-3 py-1 bg-blue-600 text-white font-semibold rounded text-xs shadow-sm">完了</button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><FileText size={14} /> アンケートタイトル</label>
                        <input type="text" value={surveyTitle} onChange={(e) => setSurveyTitle(e.target.value)} className="w-full text-base font-bold border border-slate-300 rounded-md p-2 bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><AlignLeft size={14} /> 概要・はじめに（説明文）</label>
                        <textarea rows={3} value={surveyDescription} onChange={(e) => setSurveyDescription(e.target.value)} className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white" />
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => setIsEditingMetadata(true)} className="cursor-pointer group/meta flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h2 className="text-lg font-bold text-slate-900 group-hover/meta:text-blue-600">{surveyTitle}</h2>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{surveyDescription}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-medium border border-slate-200 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover/meta:opacity-100 transition-opacity">編集する</span>
                    </div>
                  )}
                </div>

                {/* 設問一覧 */}
                <div>
                  <div className="text-sm font-bold text-slate-700 mb-2">設問一覧 <span className="text-xs font-normal text-slate-400">（左端のハンドルをドラッグして順番変更）</span></div>
                  <div className="space-y-4">
                    {questions.map((q, index) => (
                      <div
                        key={q.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={index === draggedIndex ? 'opacity-40 scale-[0.98] border border-dashed border-blue-400 rounded-lg' : 'opacity-100'}
                      >
                        {openQuestionId === q.id ? (
                          <QuestionEditor question={q} onClose={() => setOpenQuestionId(null)} onDelete={() => handleDeleteQuestion(q.id)} onDuplicate={() => handleDuplicateQuestion(q.id)} onUpdate={handleUpdateQuestion} />
                        ) : (
                          <QuestionCard question={q} onOpen={() => setOpenQuestionId(q.id)} />
                        )}
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                        <p className="text-sm font-medium text-slate-500 mb-1">設問が登録されていません</p>
                        <p className="text-xs text-slate-400">左側の「設問タイプ」をクリックして、新しい設問を追加してください。</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🆕 作成完了ボタン（押すとプレビューへ移動） */}
                {questions.length > 0 && (
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setOpenQuestionId(null);
                        setCurrentMode('preview');
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      <span>作成完了してプレビューへ</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </main>
            </>
          )}

          {/* 🆕 2. 回答者プレビューモードの表示レイアウト */}
          {currentMode === 'preview' && (
            <main className="col-span-12 p-8 bg-slate-50/50 min-h-[600px] flex flex-col items-center">
              {/* プレビュー通知バナー */}
              <div className="w-full max-w-3xl bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-xs font-semibold flex items-center gap-2 mb-6 shadow-sm">
                <Eye size={16} className="text-amber-600" />
                <span>現在は「回答者プレビュー画面」です。実際の回答者がどのように画面を操作し、入力できるかテスト可能です。</span>
              </div>

              {/* 模擬スマホ/PCデザインのアンケート用紙 */}
              <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden p-8 space-y-8">
                {/* アンケートの顔 */}
                <div className="border-b border-slate-200 pb-5 space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">{surveyTitle}</h2>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{surveyDescription}</p>
                </div>

                {/* 動的な設問フォーム表示 */}
                <div className="space-y-6">
                  {questions.map((q) => (
                    <div key={q.id} className="p-5 border border-slate-100 rounded-xl bg-white shadow-sm space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-400">{q.number}</span>
                        <h3 className="text-sm font-bold text-slate-800">{q.title}</h3>
                        {q.required && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">必須</span>}
                      </div>

                      {/* 回答コンポーネントのテスト用フォーム展開 */}
                      <div className="pt-1 text-sm text-slate-700">
                        {q.type === '単一選択' && q.options && (
                          <div className="space-y-2">
                            {q.options.map((opt, i) => (
                              <label key={i} className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors">
                                <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => handleAnswerChange(q.id, opt)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === '複数選択' && q.options && (
                          <div className="space-y-2">
                            {q.options.map((opt, i) => {
                              const currentAnswers = answers[q.id] || [];
                              const isChecked = currentAnswers.includes(opt);
                              return (
                                <label key={i} className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors">
                                  <input type="checkbox" checked={isChecked} onChange={(e) => {
                                    const next = e.target.checked ? [...currentAnswers, opt] : currentAnswers.filter((a: string) => a !== opt);
                                    handleAnswerChange(q.id, next);
                                  }} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'プルダウン' && q.options && (
                          <select value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className="w-full max-w-xs border border-slate-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm">
                            <option value="">選択してください</option>
                            {q.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                          </select>
                        )}

                        {q.type === '自由記述' && (
                          <textarea rows={3} value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} placeholder="回答を入力してください" className="w-full border border-slate-300 rounded-md p-2 bg-white text-sm" />
                        )}

                        {q.type === '数値入力' && (
                          <input type="number" value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} placeholder="数字を入力" className="w-full max-w-xs border border-slate-300 rounded-md p-2 bg-white text-sm" />
                        )}

                        {q.type === '日付' && (
                          <input type="date" value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className="w-full max-w-xs border border-slate-300 rounded-md p-2 bg-white text-sm" />
                        )}

                        {q.type === '評価（5段階）' && (
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => handleAnswerChange(q.id, star)} className={`text-2xl transition-colors ${star <= (answers[q.id] || 0) ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}>★</button>
                            ))}
                          </div>
                        )}

                        {q.type === '説明・区切り' && (
                          <div className="h-[2px] bg-slate-100 my-4" />
                        )}
                      </div>
                    </div>
                  ))}

                  {questions.length === 0 && (
                    <p className="text-center py-12 text-slate-400 text-sm">表示できる設問がありません。</p>
                  )}
                </div>

                {/* プレビュー内送信ボタン */}
                <div className="pt-6 border-t border-slate-100 flex justify-center">
                  <button onClick={() => alert('これはプレビュー画面のテスト送信です。実際の回答データは送信されません。')} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow transition-colors text-sm">
                    回答を送信する（テスト）
                  </button>
                </div>
              </div>

              {/* 画面下のナビゲーションコントローラー */}
              <div className="w-full max-w-3xl mt-8 flex justify-between items-center bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <button onClick={() => setCurrentMode('edit')} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 px-4 py-2 rounded-md transition-colors">
                  <ArrowLeft size={14} />
                  <span>設計画面に戻る</span>
                </button>
                <button onClick={() => setCurrentMode('publish')} className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md shadow transition-colors">
                  <span>公開設定に進む</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </main>
          )}

          {/* 🆕 3. 公開設定モードの表示レイアウト */}
          {currentMode === 'publish' && (
            <main className="col-span-12 p-12 bg-white min-h-[600px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">アンケートの公開準備が整いました</h2>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                URLの発行、有効期限、特定の組織内のみへの限定公開といったセキュリティや公開スコープの設定をここで行うことができます。
              </p>
              <div className="pt-4 flex items-center gap-3">
                <button onClick={() => setCurrentMode('preview')} className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded text-xs hover:bg-slate-50 transition-colors">
                  プレビューに戻る
                </button>
                <button onClick={() => alert('アンケートが正常に一般公開されました！')} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-xs shadow transition-colors">
                  この内容で公開する
                </button>
              </div>
            </main>
          )}

        </div>
      </div>
    </div>
  );
}

function renumberQuestions(list: Question[]) {
  return list.map((q, index) => ({
    ...q,
    number: `Q${index + 1}`
  }));
}