import { useState, useEffect } from 'react';
import { ChevronUp, GripVertical } from 'lucide-react';
import {
  SingleChoice, MultipleChoice, DropdownChoice,
  TextAnswer, NumberInput, DateInput, RatingInput, DividerView,
} from './QuestionTypes';
import QuestionOptionEditor from './QuestionOptionEditor';
import QuestionActionBar from './QuestionActionBar';

export interface Question {
  id: string;
  number: string;
  title: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface ItemProps {
  question: Question;
}

interface CardProps extends ItemProps {
  onOpen: () => void;
}

interface EditorProps extends ItemProps {
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (updated: Question) => void;
}

function RenderQuestionBody({ type, options }: { type: string; options?: string[] }) {
  switch (type) {
    case '単一選択': return <SingleChoice options={options} preview={true} />;
    case '複数選択': return <MultipleChoice options={options} preview={true} />;
    case 'プルダウン': return <DropdownChoice options={options} />;
    case '自由記述': return <TextAnswer />;
    case '数値入力': return <NumberInput />;
    case '日付': return <DateInput />;
    case '評価（5段階）': return <RatingInput />;
    case '説明・区切り': return <DividerView />;
    default: return null;
  }
}

// --- 1. 通常時の表示カード (QuestionCard) ---
export function QuestionCard({ question, onOpen }: CardProps) {
  return (
    <div className="border border-slate-200 bg-white rounded-lg shadow-sm p-4 hover:border-slate-300 transition-all group relative">
      <div className="flex items-start gap-3">
        {/* 左側のグリップハンドル（このエリアで掴んで動かせる感覚を演出） */}
        <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400 pt-1 select-none">
          <GripVertical size={16} />
        </div>

        <div className="flex-1 cursor-pointer" onClick={onOpen}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {question.number}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {question.type}
            </span>
            {question.required && (
              <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded font-bold">
                必須
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-800">{question.title}</h4>
          
          <div className="pointer-events-none opacity-70">
            <RenderQuestionBody type={question.type} options={question.options} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. 編集時の詳細フォーム (QuestionEditor) ---
export function QuestionEditor({ question, onClose, onDelete, onDuplicate, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(question.title);
  const [required, setRequired] = useState(question.required);
  const [options, setOptions] = useState<string[]>(question.options || ['選択肢1', '選択肢2', '選択肢3']);

  const isChoiceType = ['単一選択', '複数選択', 'プルダウン'].includes(question.type);

  useEffect(() => {
    onUpdate({
      ...question,
      title,
      required,
      options: isChoiceType ? options : undefined
    });
  }, [title, required, options]);

  return (
    <div className="border-2 border-blue-500 bg-slate-50/50 rounded-lg shadow-md p-5 transition-all space-y-4">
      {/* 上部ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {/* 編集モードでも掴めるグリップ */}
          <div className="cursor-grab active:cursor-grabbing text-slate-400 mr-1 select-none">
            <GripVertical size={16} />
          </div>
          <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded">
            {question.number}
          </span>
          <span className="text-sm font-bold text-slate-700">{question.type}の編集</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
          <ChevronUp size={18} />
        </button>
      </div>

      {/* 設問タイトル入力 */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-600 block">設問タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm font-medium border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        />
      </div>

      {/* 選択肢の設定 */}
      {isChoiceType && <QuestionOptionEditor options={options} onChange={setOptions} />}

      {/* 下部コントローラー */}
      <QuestionActionBar
        showRequiredToggle={question.type !== '説明・区切り'}
        required={required}
        onToggleRequired={() => setRequired(!required)}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}