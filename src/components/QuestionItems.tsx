import { useState, useEffect } from 'react';
import { Trash2, Copy, ChevronUp, GripVertical, X, Plus } from 'lucide-react';
import { 
  SingleChoice, MultipleChoice, DropdownChoice, 
  TextAnswer, NumberInput, DateInput, RatingInput, DividerView 
} from './QuestionTypes';

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
        <div className="cursor-grab text-slate-300 group-hover:text-slate-400 pt-1">
          <GripVertical size={16} />
        </div>

        <div className="flex-1" onClick={onOpen}>
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
export function QuestionEditor({ question, onClose, onDelete, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(question.title);
  const [required, setRequired] = useState(question.required);
  const [options, setOptions] = useState<string[]>(question.options || ['選択肢1', '選択肢2', '選択肢3']);

  const isChoiceType = ['単一選択', '複数選択', 'プルダウン'].includes(question.type);

  // 編集内容が変わるたびに親コンポーネントの状態に自動同期する
  useEffect(() => {
    onUpdate({
      ...question,
      title,
      required,
      options: isChoiceType ? options : undefined
    });
  }, [title, required, options]);

  // 特定の選択肢を削除する
  const handleDeleteOption = (idxToRemove: number) => {
    setOptions(options.filter((_, idx) => idx !== idxToRemove));
  };

  // 新しい選択肢を追加する
  const handleAddOption = () => {
    setOptions([...options, `選択肢${options.length + 1}`]);
  };

  return (
    <div className="border-2 border-blue-500 bg-slate-50/50 rounded-lg shadow-md p-5 transition-all space-y-4">
      {/* 上部ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
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

      {/* 選択肢タイプの設定 */}
      {isChoiceType && (
        <div className="space-y-2 bg-white p-3 rounded-md border border-slate-200">
          <label className="text-xs font-bold text-slate-600 block mb-1">選択肢の設定</label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 group/opt">
                <span className="text-xs text-slate-400 w-4 text-center">{idx + 1}.</span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[idx] = e.target.value;
                    setOptions(newOpts);
                  }}
                  className="flex-1 text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500"
                />
                {/* 選択肢の削除×ボタン */}
                <button
                  type="button"
                  onClick={() => handleDeleteOption(idx)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-100 transition-colors"
                  title="選択肢を削除"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold pt-1"
          >
            <Plus size={14} />
            <span>選択肢を追加</span>
          </button>
        </div>
      )}

      {/* 下部コントローラー */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-500 text-xs">
        <div className="flex items-center gap-4">
          {/* 画像を反映したトグルスイッチ形式の「回答必須」UI */}
          {question.type !== '説明・区切り' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">回答必須</span>
              <button
                type="button"
                onClick={() => setRequired(!required)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  required ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    required ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
            <Copy size={14} />
            <span>複製</span>
          </button>
          {/* 設問削除ボタン */}
          <button 
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={14} />
            <span>削除</span>
          </button>
          <button 
            onClick={onClose}
            className="ml-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-sm text-xs transition-colors"
          >
            保存して閉じる
          </button>
        </div>
      </div>
    </div>
  );
}