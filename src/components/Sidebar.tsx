import { CircleDot, CheckSquare, ChevronDown, Type, Hash, Calendar, Star, Layout } from 'lucide-react';

interface QuestionType {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  active?: boolean;
}

export default function Sidebar() {
  const questionTypes: QuestionType[] = [
    { id: 'single', label: '単一選択', icon: CircleDot },
    { id: 'multiple', label: '複数選択', icon: CheckSquare, active: true },
    { id: 'dropdown', label: 'プルダウン', icon: ChevronDown },
    { id: 'text', label: '自由記述', icon: Type },
    { id: 'number', label: '数値入力', icon: Hash },
    { id: 'date', label: '日付', icon: Calendar },
    { id: 'rating', label: '評価（5段階）', icon: Star },
    { id: 'divider', label: '説明・区切り', icon: Layout },
  ];

  return (
    <aside className="col-span-3 border-r border-slate-200 bg-slate-50/30 p-4 space-y-2">
      <h3 className="text-sm font-bold text-slate-700 px-2 mb-3">設問タイプ</h3>
      {questionTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            className={`w-full flex items-center gap-3 px-3 py-3 bg-white border rounded-lg shadow-sm transition-all duration-200 ${
              type.active 
                ? 'border-blue-500 ring-1 ring-blue-100 font-bold' 
                : 'border-slate-200 hover:border-blue-500 hover:shadow'
            }`}
          >
            <Icon size={18} className={type.active ? 'text-blue-600' : 'text-slate-400'} />
            <span className={`text-sm ${type.active ? 'text-slate-900' : 'text-slate-600 font-medium'}`}>
              {type.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
