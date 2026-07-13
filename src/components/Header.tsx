import { Menu, Eye, Save, CheckCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-700">
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-bold">アンケート詳細設計</h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition">
          <Eye size={16} /> プレビュー
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition">
          <Save size={16} /> 一時保存
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition">
          <CheckCircle size={16} /> 作成完了
        </button>
      </div>
    </header>
  );
}
