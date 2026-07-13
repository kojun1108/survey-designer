import React, { useState, useRef } from 'react';
import { 
  Type, CheckSquare, ListPlus, ToggleLeft, Hash, Calendar, Star, Space,
  GripVertical, Copy, Trash2, ChevronDown, ChevronUp, Save, Eye, ClipboardEdit, CheckCircle2
} from 'lucide-react';

// ==========================================
// 1. 型定義（データ構造）
// ==========================================
type QuestionTypeId = 'single' | 'multiple' | 'dropdown' | 'text' | 'number' | 'date' | 'rating' | 'divider';

interface Question {
  id: string;
  number: string;
  title: string;
  type: string;
  required: boolean;
  options?: string[];
}

export default function App() {
  // ==========================================
  // 2. 状態管理（State）
  // ==========================================
  const [currentStep, setCurrentStep] = useState<1 | 2>(1); // 1: 編集, 2: プレビュー
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      number: 'Q1',
      title: '当システムを知ったきっかけを教えてください（複数選択可）',
      type: '複数選択',
      required: true,
      options: ['ホームページを見て', '知人・同僚からの紹介', 'SNS（X / LINEなど）', 'その他'],
    },
    {
      id: 'q-2',
      number: 'Q2',
      title: '本日の満足度を5段階で評価してください',
      type: '評価（5段階）',
      required: false,
    }
  ]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>('q-1');
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // ドラッグ&ドロップ用のインデックス保持
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  // ==========================================
  // 3. ロジック・イベントハンドラ
  // ==========================================
  
  // 設問番号の再振り分け（Q1, Q2, Q3...）
  const reorderQuestionNumbers = (list: Question[]) => {
    let qCount = 1;
    return list.map((q) => {
      if (q.type === '説明・区切り') {
        return { ...q, number: '※' };
      }
      const num = `Q${qCount}`;
      qCount++;
      return { ...q, number: num };
    });
  };

  // 新しい設問の追加
  const handleAddQuestion = (typeId: QuestionTypeId) => {
    const typeMap: Record<QuestionTypeId, { name: string; hasOptions: boolean }> = {
      single: { name: '単一選択', hasOptions: true },
      multiple: { name: '複数選択', hasOptions: true },
      dropdown: { name: 'プルダウン', hasOptions: true },
      text: { name: '自由記述', hasOptions: false },
      number: { name: '数値入力', hasOptions: false },
      date: { name: '日付', hasOptions: false },
      rating: { name: '評価（5段階）', hasOptions: false },
      divider: { name: '説明・区切り', hasOptions: false },
    };

    const newId = `q-${Date.now()}`;
    const newQuestion: Question = {
      id: newId,
      number: '', // 後で自動計算
      title: '',
      type: typeMap[typeId].name,
      required: typeId !== 'divider',
      ...(typeMap[typeId].hasOptions ? { options: ['選択肢 1', '選択肢 2'] } : {}),
    };

    const updatedList = [...questions, newQuestion];
    setQuestions(reorderQuestionNumbers(updatedList));
    setOpenQuestionId(newId); // 追加した設問を自動展開
  };

  // 設問の複製
  const handleDuplicate = (index: number) => {
    const original = questions[index];
    const duplicated: Question = {
      ...original,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: original.title ? `${original.title} (コピー)` : '',
      options: original.options ? [...original.options] : undefined,
    };
    const updatedList = [...questions];
    updatedList.splice(index + 1, 0, duplicated);
    setQuestions(reorderQuestionNumbers(updatedList));
    setOpenQuestionId(duplicated.id);
  };

  // 設問の削除
  const handleDelete = (id: string) => {
    const updatedList = questions.filter((q) => q.id !== id);
    setQuestions(reorderQuestionNumbers(updatedList));
    if (openQuestionId === id) setOpenQuestionId(null);
  };

  // 設問データの更新（タイトル、必須フラグ、選択肢など）
  const handleUpdateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedList = [...questions];
    updatedList[index] = updatedQuestion;
    setQuestions(reorderQuestionNumbers(updatedList));
  };

  // 選択肢の追加・削除・変更
  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const q = questions[qIndex];
    if (!q.options) return;
    const newOptions = [...q.options];
    newOptions[oIndex] = text;
    handleUpdateQuestion(qIndex, { ...q, options: newOptions });
  };

  const handleAddOption = (qIndex: number) => {
    const q = questions[qIndex];
    if (!q.options) return;
    handleUpdateQuestion(qIndex, { ...q, options: [...q.options, `選択肢 ${q.options.length + 1}`] });
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    if (!q.options) return;
    if (q.options.length <= 1) {
      alert('選択肢は少なくとも1つ以上必要です。');
      return;
    }
    const newOptions = q.options.filter((_, i) => i !== oIndex);
    handleUpdateQuestion(qIndex, { ...q, options: newOptions });
  };

  // ドラッグ＆ドロップ並び替えロジック
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    if (dragItemIndex.current !== null && dragOverItemIndex.current !== null) {
      const updatedList = [...questions];
      const targetItem = updatedList.splice(dragItemIndex.current, 1)[0];
      updatedList.splice(dragOverItemIndex.current, 0, targetItem);
      setQuestions(reorderQuestionNumbers(updatedList));
    }
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  // プレビュー画面での複数選択回答ロジック
  const handleCheckboxAnswer = (qId: string, option: string, checked: boolean) => {
    const current = Array.isArray(answers[qId]) ? answers[qId] : [];
    if (checked) {
      setAnswers({ ...answers, [qId]: [...current, option] });
    } else {
      setAnswers({ ...answers, [qId]: current.filter((item: string) => item !== option) });
    }
  };

  // 一時保存ボタン
  const triggerSave = () => {
    alert('アンケートの構成を一時保存しました。');
  };

  // パレットメニューの定義
  const paletteItems = [
    { id: 'single', label: '単一選択', desc: 'ラジオボタン', icon: ToggleLeft, color: 'text-blue-500 bg-blue-50' },
    { id: 'multiple', label: '複数選択', desc: 'チェックボックス', icon: CheckSquare, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'dropdown', label: 'プルダウン', desc: 'リストから選択', icon: ListPlus, color: 'text-indigo-500 bg-indigo-50' },
    { id: 'text', label: '自由記述', desc: 'テキスト入力', icon: Type, color: 'text-amber-500 bg-amber-50' },
    { id: 'number', label: '数値入力', desc: '半角数字のみ', icon: Hash, color: 'text-purple-500 bg-purple-50' },
    { id: 'date', label: '日付', desc: 'カレンダー選択', icon: Calendar, color: 'text-rose-500 bg-rose-50' },
    { id: 'rating', label: '評価（5段階）', desc: '星評価スコア', icon: Star, color: 'text-orange-500 bg-orange-50' },
    { id: 'divider', label: '説明・区切り', desc: '文章や境界線', icon: Space, color: 'text-slate-500 bg-slate-100' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* ==========================================
          ヘッダーエリア
          ========================================== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-xl shadow-md shadow-blue-500/10">
            <ClipboardEdit size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm md:text-base tracking-tight">高度なアンケートビルダー</h1>
            <p className="text-[11px] text-slate-400 font-medium">ドラッグ&ドロップ対応リアルタイム構築</p>
          </div>
        </div>

        {/* タブ切り替え & 一時保存 */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentStep === 1 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardEdit size={14} />
              <span>編集・構成</span>
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentStep === 2 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye size={14} />
              <span>プレビュー確認</span>
            </button>
          </div>

          <button 
            onClick={triggerSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-sm transition-colors text-sm"
          >
            <Save size={16} className="text-slate-500" />
            <span>一時保存</span>
          </button>
        </div>
      </header>

      {/* ==========================================
          メインコンテンツ
          ========================================== */}
      <main className="max-w-[1200px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ステップ1: 編集画面 */}
        {currentStep === 1 && (
          <>
            {/* 左側: 設問追加サイドパレット */}
            <section className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 lg:sticky lg:top-20">
              <div className="pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">設問パーツを追加</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {paletteItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAddQuestion(item.id)}
                      className="flex items-center gap-3 w-full p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all text-left group"
                    >
                      <div className={`p-2 rounded-lg transition-colors ${item.color}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 右側: メイン並び替えエディタ領域 */}
            <section className="lg:col-span-8 space-y-3">
              {questions.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 bg-white/50">
                  <ClipboardEdit size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium">設問がまだありません</p>
                  <p className="text-xs text-slate-400 mt-1">左のパレットから項目をクリックして追加してください。</p>
                </div>
              ) : (
                questions.map((q, qIndex) => {
                  const isOpen = openQuestionId === q.id;
                  const hasOptions = ['単一選択', '複数選択', 'プルダウン'].includes(q.type);

                  return (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={() => handleDragStart(qIndex)}
                      onDragEnter={() => handleDragEnter(qIndex)}
                      onDragEnd={handleDragEnd}
                      className="bg-white border border-slate-200 rounded-xl shadow-sm transition-all overflow-hidden"
                    >
                      {/* カードヘッダー */}
                      <div 
                        onClick={() => setOpenQuestionId(isOpen ? null : q.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                          <div className="cursor-grab active:cursor-grabbing text-slate-400 p-1 hover:text-slate-600 transition-colors">
                            <GripVertical size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-400 min-w-[28px]">{q.number}</span>
                          <div className="flex-1 min-w-0">
                            {isOpen ? (
                              <input
                                type="text"
                                value={q.title}
                                onChange={(e) => handleUpdateQuestion(qIndex, { ...q, title: e.target.value })}
                                placeholder="設問タイトルを入力してください"
                                className="w-full text-sm font-semibold border-b border-slate-300 focus:border-blue-500 focus:outline-none pb-0.5 bg-transparent"
                              />
                            ) : (
                              <span className={`text-sm font-semibold block truncate ${q.title ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                                {q.title || '（設問タイトルが未入力です）'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {q.type}
                          </span>
                          {q.required && (
                            <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-bold">必須</span>
                          )}
                        </div>
                        <div className="text-slate-400 ml-4">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      {/* カード詳細（アコーディオン） */}
                      {isOpen && (
                        <div className="border-t border-slate-100 p-5 bg-slate-50/30 space-y-4">
                          {/* 選択肢の編集 */}
                          {hasOptions && q.options && (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 block">選択肢の設定</label>
                              <div className="space-y-1.5 max-w-xl">
                                {q.options.map((opt, oIndex) => (
                                  <div key={oIndex} className="flex items-center gap-2 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                      placeholder={`選択肢 ${oIndex + 1} の値を入力`}
                                      className="flex-1 text-xs border border-slate-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    <button
                                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                                      className="text-slate-400 hover:text-red-500 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => handleAddOption(qIndex)}
                                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1 transition-colors"
                              >
                                ＋ 選択肢を追加
                              </button>
                            </div>
                          )}

                          {/* ボトムツールバー */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={q.required}
                                onChange={(e) => handleUpdateQuestion(qIndex, { ...q, required: e.target.checked })}
                                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                disabled={q.type === '説明・区切り'}
                              />
                              <span className="text-xs font-bold text-slate-600">この回答を必須にする</span>
                            </label>

                            <div className="flex items-center gap-1 text-slate-500">
                              <button 
                                onClick={() => handleDuplicate(qIndex)} 
                                title="複製" 
                                className="p-2 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors"
                              >
                                <Copy size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(q.id)} 
                                title="削除" 
                                className="p-2 hover:bg-red-50 rounded-lg hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}

        {/* ステップ2: プレビュー画面 */}
        {currentStep === 2 && (
          <section className="lg:col-span-8 lg:col-start-3 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900">アンケート回答プレビュー</h2>
              <p className="text-xs text-slate-400 mt-1">※ユーザー側で表示される実際の画面イメージです。</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('回答のプレビュー送信が成功しました。'); }} className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-bold text-slate-400 mt-0.5 min-w-[24px]">{q.number}</span>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-800">
                        {q.title || <span className="text-slate-300 italic">（タイトル未設定の設問）</span>}
                      </span>
                      {q.required && (
                        <span className="text-[10px] text-red-500 font-bold ml-2 bg-red-50 border border-red-100 px-1 py-0.2 rounded">必須</span>
                      )}
                    </div>
                  </div>

                  {/* 各設問タイプに応じた入力コントロールの出し分け */}
                  <div className="pl-8">
                    {q.type === '単一選択' && q.options && (
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <label key={i} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === '複数選択' && q.options && (
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <label key={i} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={(answers[q.id] || []).includes(opt)}
                              onChange={(e) => handleCheckboxAnswer(q.id, opt, e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === 'プルダウン' && q.options && (
                      <select
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full max-w-xs text-sm border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {q.type === '自由記述' && (
                      <textarea
                        rows={3}
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        placeholder="回答をここに入力してください"
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    )}

                    {q.type === '数値入力' && (
                      <input
                        type="number"
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        placeholder="半角数字で入力"
                        className="w-full max-w-xs text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    )}

                    {q.type === '日付' && (
                      <input
                        type="date"
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full max-w-xs text-sm border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    )}

                    {q.type === '評価（5段階）' && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.id]: star })}
                            className="transition-transform active:scale-95 text-slate-300"
                          >
                            <Star
                              size={22}
                              className={star <= (answers[q.id] || 0) ? 'fill-orange-400 text-orange-400' : 'text-slate-300'}
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === '説明・区切り' && (
                      <div className="border-t border-dashed border-slate-200 my-1 pt-2">
                        <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                          ※ この項目はアンケートの区切り、または説明文用のセクションです。
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all text-sm"
                >
                  <CheckCircle2 size={16} />
                  <span>アンケートを送信する</span>
                </button>
              </div>
            </form>
          </section>
        )}

      </main>
    </div>
  );
}
