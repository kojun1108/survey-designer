import { useState } from 'react';
import { Eye } from 'lucide-react';
import type { Question } from './QuestionItems';

interface SurveyPreviewProps {
  surveyTitle: string;
  surveyDescription: string;
  questions: Question[];
  // 不要になったナビゲーション関数を props から削除
}

export default function SurveyPreview({
  surveyTitle,
  surveyDescription,
  questions,
}: SurveyPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (qId: string, value: any) => {
    setAnswers({ ...answers, [qId]: value });
  };

  return (
    <main className="col-span-12 p-8 bg-slate-50/50 min-h-[600px] flex flex-col items-center">
      <div className="w-full max-w-3xl bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-xs font-semibold flex items-center gap-2 mb-6 shadow-sm">
        <Eye size={16} className="text-amber-600" />
        <span>現在は「回答者プレビュー画面」です。実際の回答者がどのように画面を操作し、入力できるかテスト可能です。</span>
      </div>

      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden p-8 space-y-8">
        <div className="border-b border-slate-200 pb-5 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{surveyTitle}</h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{surveyDescription}</p>
        </div>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="p-5 border border-slate-100 rounded-xl bg-white shadow-sm space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-400">{q.number}</span>
                <h3 className="text-sm font-bold text-slate-800">{q.title || <span className="text-red-400 italic">（設問タイトル未入力）</span>}</h3>
                {q.required && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">必須</span>}
              </div>

              <div className="pt-1 text-sm text-slate-700">
                {q.type === '単一選択' && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors">
                        <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => handleAnswerChange(q.id, opt)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                        <span>{opt || <span className="text-red-400 text-xs italic">（選択肢が空欄です）</span>}</span>
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
                          <span>{opt || <span className="text-red-400 text-xs italic">（選択肢が空欄です）</span>}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === 'プルダウン' && q.options && (
                  <select value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className="w-full max-w-xs border border-slate-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm">
                    <option value="">選択してください</option>
                    {q.options.map((opt, i) => <option key={i} value={opt}>{opt || '（空欄の選択肢）'}</option>)}
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
      </div>
    </main>
  );
}