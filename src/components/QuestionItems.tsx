import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, X, Plus } from 'lucide-react';

export interface Question {
  id: string;
  number: string;
  title: string;
  type: string;
  required: boolean;
}

interface CardProps {
  question: Question;
  onOpen: () => void;
}

export function QuestionCard({ question, onOpen }: CardProps) {
  return (
    <div 
      className="flex items-center justify-between border border-slate-200 rounded-lg p-4 bg-white shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-center gap-3 flex-1">
        <GripVertical size={16} className="text-slate-400 cursor-grab" />
        <span className="font-medium text-sm text-slate-800">
          {question.number}. {question.title}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {question.required && (
          <span className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">必須</span>
        )}
        <span className="text-sm text-slate-500 flex items-center gap-1">
          {question.type} <ChevronDown size={14} />
        </span>
      </div>
    </div>
  );
}

interface EditorProps {
  question: Question;
  onClose: () => void;
}

export function QuestionEditor({ question, onClose }: EditorProps) {
  const [isUrgent, setIsUrgent] = useState(question.required);
  const options = ["出社中心", "ハイブリッド（出社とリモートの併用）", "フルリモート", "その他（自由記述）"];

  return (
    <div className="border border-blue-300 ring-1 ring-blue-100 rounded-lg shadow-sm overflow-hidden transition-all">
      <div className="flex items-center justify-between p-4 bg-white cursor-pointer select-none" onClick={onClose}>
        <div className="flex items-center gap-3 flex-1">
          <GripVertical size={16} className="text-slate-400 cursor-grab" />
          <span className="font-bold text-sm text-slate-900">{question.number}. {question.title}</span>
        </div>
        <div className="flex items-center gap-4">
          {isUrgent && <span className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">必須</span>}
          <span className="text-sm text-slate-700 flex items-center gap-1 font-bold">
            {question.type} <ChevronUp size={14} />
          </span>
        </div>
      </div>

      <div className="p-5 bg-slate-50/50 border-t border-slate-100 space-y-4">
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">質問文</label>
            <input 
              type="text" 
              defaultValue="現在の働き方について、あてはまるものをすべて選んでください。" 
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-24 flex flex-col justify-between items-end">
            <span className="text-xs font-bold text-slate-500">必須</span>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input type="checkbox" checked={isUrgent} onChange={() => setIsUrgent(!isUrgent)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className={`ml-2 text-xs font-bold ${isUrgent ? 'text-blue-600' : 'text-slate-400'}`}>{isUrgent ? 'オン' : 'オフ'}</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center"><label className="text-xs font-bold text-slate-500">選択肢</label></div>
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 rounded px-3 py-2.5 shadow-sm">
              <input type="checkbox" disabled className="rounded border-slate-300" />
              <span className="text-sm text-slate-700 flex-1">{option}</span>
              <button className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
            </div>
          ))}
          <button className="w-full py-2 border border-dashed border-blue-300 rounded text-sm text-blue-600 font-medium hover:bg-blue-50 flex items-center justify-center gap-1 mt-2">
            <Plus size={16} /> 選択肢を追加
          </button>
        </div>
      </div>
    </div>
  );
}
