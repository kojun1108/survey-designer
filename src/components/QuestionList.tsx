import { QuestionCard, QuestionEditor } from './QuestionItems';
import type { Question } from './QuestionItems';

interface QuestionListProps {
  questions: Question[];
  openQuestionId: string | null;
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragEnter: (targetIndex: number) => void;
  onDragEnd: () => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onUpdateQuestion: (updatedQuestion: Question) => void;
  onOpenQuestion: (id: string) => void;
  onCloseQuestion: () => void;
}

function EmptyQuestionState() {
  return (
    <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
      <p className="text-sm font-medium text-slate-500 mb-1">設問が登録されていません</p>
      <p className="text-xs text-slate-400">左側の「設問タイプ」をクリックして、新しい設問を追加してください。</p>
    </div>
  );
}

export default function QuestionList({
  questions,
  openQuestionId,
  draggedIndex,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDeleteQuestion,
  onDuplicateQuestion,
  onUpdateQuestion,
  onOpenQuestion,
  onCloseQuestion,
}: QuestionListProps) {
  return (
    <div>
      <div className="text-sm font-bold text-slate-700 mb-2">
        設問一覧 <span className="text-xs font-normal text-slate-400">（左端のハンドルをドラッグして順番変更）</span>
      </div>
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
              <QuestionEditor
                question={q}
                onClose={onCloseQuestion}
                onDelete={() => onDeleteQuestion(q.id)}
                onDuplicate={() => onDuplicateQuestion(q.id)}
                onUpdate={onUpdateQuestion}
              />
            ) : (
              <QuestionCard question={q} onOpen={() => onOpenQuestion(q.id)} />
            )}
          </div>
        ))}
        {questions.length === 0 && <EmptyQuestionState />}
      </div>
    </div>
  );
}
