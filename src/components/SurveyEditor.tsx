import { FileText, AlignLeft, ArrowRight } from 'lucide-react';
import Sidebar from './Sidebar'; // default import に変更
import type { QuestionTypeId } from './Sidebar'; // 型インポートを明示
import { QuestionCard, QuestionEditor } from './QuestionItems';
import type { Question } from './QuestionItems'; // 型インポートを明示

interface SurveyEditorProps {
  questions: Question[];
  openQuestionId: string | null;
  draggedIndex: number | null;
  surveyTitle: string;
  surveyDescription: string;
  isEditingMetadata: boolean;
  onAddQuestion: (typeId: QuestionTypeId) => void;
  onDuplicateQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (updatedQuestion: Question) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (targetIndex: number) => void;
  onDragEnd: () => void;
  setOpenQuestionId: (id: string | null) => void;
  setSurveyTitle: (title: string) => void;
  setSurveyDescription: (desc: string) => void;
  setIsEditingMetadata: (isEditing: boolean) => void;
  onComplete: () => void;
}

export default function SurveyEditor({
  questions,
  openQuestionId,
  draggedIndex,
  surveyTitle,
  surveyDescription,
  isEditingMetadata,
  onAddQuestion,
  onDuplicateQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onDragStart,
  onDragEnter,
  onDragEnd,
  setOpenQuestionId,
  setSurveyTitle,
  setSurveyDescription,
  setIsEditingMetadata,
  onComplete,
}: SurveyEditorProps) {
  return (
    <>
      <Sidebar onAddQuestion={onAddQuestion} />
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
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={index === draggedIndex ? 'opacity-40 scale-[0.98] border border-dashed border-blue-400 rounded-lg' : 'opacity-100'}
              >
                {openQuestionId === q.id ? (
                  <QuestionEditor question={q} onClose={() => setOpenQuestionId(null)} onDelete={() => onDeleteQuestion(q.id)} onDuplicate={() => onDuplicateQuestion(q.id)} onUpdate={onUpdateQuestion} />
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

        {/* 作成完了ボタン */}
        {questions.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>作成完了してプレビューへ</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </main>
    </>
  );
}