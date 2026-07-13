export default function Stepper() {
  return (
    <div className="flex justify-center py-4 border-b border-slate-100 bg-slate-50/50 text-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-blue-600">
          <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
          設問設計
        </div>
        <div className="w-16 border-t border-dashed border-slate-300"></div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-5 h-5 border border-slate-400 rounded-full flex items-center justify-center text-xs">2</span>
          設定
        </div>
        <div className="w-16 border-t border-dashed border-slate-300"></div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-5 h-5 border border-slate-400 rounded-full flex items-center justify-center text-xs">3</span>
          プレビュー
        </div>
      </div>
    </div>
  );
}
