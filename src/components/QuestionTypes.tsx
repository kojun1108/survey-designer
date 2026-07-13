import { Star } from 'lucide-react';

interface TypeProps {
  options?: string[];
  preview?: boolean;
}

// 1. 単一選択 (ラジオボタン)
export function SingleChoice({ options = ['選択肢1', '選択肢2', '選択肢3'], preview = false }: TypeProps) {
  return (
    <div className="space-y-2 mt-2">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input type="radio" name="preview-single" disabled={preview} className="text-blue-600 focus:ring-blue-500" />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

// 2. 複数選択 (チェックボックス)
export function MultipleChoice({ options = ['選択肢1', '選択肢2', '選択肢3'], preview = false }: TypeProps) {
  return (
    <div className="space-y-2 mt-2">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input type="checkbox" disabled={preview} className="rounded text-blue-600 focus:ring-blue-500" />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

// 3. プルダウン
export function DropdownChoice({ options = ['選択肢1', '選択肢2', '選択肢3'] }: TypeProps) {
  return (
    <select className="mt-2 block w-full max-w-xs rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border">
      <option value="">選択してください</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

// 4. 自由記述 (テキストエリア)
export function TextAnswer() {
  return (
    <textarea
      rows={3}
      disabled
      placeholder="回答者はここに文章を入力します"
      className="mt-2 block w-full rounded-md border-slate-200 bg-slate-50/50 shadow-sm text-sm p-2 border cursor-not-allowed"
    />
  );
}

// 5. 数値入力
export function NumberInput() {
  return (
    <input
      type="number"
      disabled
      placeholder="半角数値を入力"
      className="mt-2 block w-full max-w-xs rounded-md border-slate-200 bg-slate-50/50 shadow-sm text-sm p-2 border cursor-not-allowed"
    />
  );
}

// 6. 日付入力
export function DateInput() {
  return (
    <input
      type="date"
      disabled
      className="mt-2 block w-full max-w-xs rounded-md border-slate-200 bg-slate-50/50 shadow-sm text-sm p-2 border cursor-not-allowed"
    />
  );
}

// 7. 評価（5段階）
export function RatingInput() {
  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((num) => (
        <button key={num} type="button" className="text-slate-300 hover:text-amber-400 transition-colors">
          <Star size={24} className="fill-current" />
        </button>
      ))}
      <span className="text-xs text-slate-400 ml-2">（1:不満 〜 5:満足）</span>
    </div>
  );
}

// 8. 説明・区切り
export function DividerView() {
  return (
    <div className="mt-2 p-3 bg-slate-50 rounded border-l-4 border-slate-400 text-xs text-slate-500 italic">
      ※この項目は回答を求めず、画面上の案内やセクションの区切りとして表示されます。
    </div>
  );
}