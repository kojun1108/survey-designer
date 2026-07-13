import { useState } from 'react';
import { Trash2, Copy, ChevronUp, GripVertical } from 'lucide-react';
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
  onSave?: (updated: Question) => void;
}

// 設問タイプに応じたフォーム描画ヘルパー
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
        {/* ドラッグハンドル(ダミー) */}
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
          
          {/* ここで設問タイプに合わせたリアルな形状を表示 */}
          <div className="pointer-events-none opacity-70">
            <RenderQuestionBody type={question.type} options={question.options} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. 編集時の詳細フォーム (QuestionEditor) ---
export function QuestionEditor({ question, onClose }: EditorProps) {
  const [title, setTitle] = useState(question.title);
  const [required, setRequired] = useState(question.required);
  // 選択肢系のためのデフォルトステート
  const [options, setOptions] = useState<string[]>(question.options || ['選択肢1', '選択肢2', '選択肢3']);

  const isChoiceType = ['単一選択', '複数選択', 'プルダウン'].includes(question.type);

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

      {/* 選択肢タイプ（単一・複数・プルダウン）の場合のみ、オプション編集フィールドを出す */}
      {isChoiceType && (
        <div className="space-y-2 bg-white p-3 rounded-md border border-slate-200">
          <label className="text-xs font-bold text-slate-600 block">選択肢の設定</label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
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
            </div>
          ))}
        </div>
      )}

      {/* 下部コントローラー */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-500 text-xs">
        <div className="flex items-center gap-4">
          {/* 説明・区切りタイプは必須チェックを隠す */}
          {question.type !== '説明・区切り' && (
            <label className="flex items-center gap-2 cursor-pointer font-medium select-none text-slate-600">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              回答を必須にする
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
            <Copy size={14} />
            <span>複製</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
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