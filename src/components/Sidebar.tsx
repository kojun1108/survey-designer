import { CircleDot, CheckSquare, ChevronDown, Type, Hash, Calendar, Star, Layout } from 'lucide-react';

// 利用可能なすべての設問タイプを定義
export const QUESTION_TYPES = [
  { id: 'single', label: '単一選択', icon: CircleDot },
  { id: 'multiple', label: '複数選択', icon: CheckSquare },
  { id: 'dropdown', label: 'プルダウン', icon: ChevronDown },
  { id: 'text', label: '自由記述', icon: Type },
  { id: 'number', label: '数値入力', icon: Hash },
  { id: 'date', label: '日付', icon: Calendar },
  { id: 'rating', label: '評価（5段階）', icon: Star },
  { id: 'divider', label: '説明・区切り', icon: Layout },
] as const;

export type QuestionTypeId = typeof QUESTION_TYPES[number]['id'];

interface SidebarProps {
  onAddQuestion: (typeId: QuestionTypeId) => void;
}

export default function Sidebar({ onAddQuestion }: SidebarProps) {
  return (
    <aside className="col-span-3 border-r border-slate-200 bg-slate-50/30 p-4 space-y-2">
      <h3 className="text-sm font-bold text-slate-700 px-2 mb-3">設問タイプ</h3>
      {QUESTION_TYPES.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onAddQuestion(type.id)}
            className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:shadow transition-all duration-200 group text-left"
          >
            <Icon size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
              {type.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}