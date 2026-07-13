import { Plus, X } from 'lucide-react';

interface QuestionOptionEditorProps {
  options: string[];
  onChange: (nextOptions: string[]) => void;
}

export default function QuestionOptionEditor({ options, onChange }: QuestionOptionEditorProps) {
  const handleDeleteOption = (idxToRemove: number) => {
    onChange(options.filter((_, idx) => idx !== idxToRemove));
  };

  const handleAddOption = () => {
    onChange([...options, `選択肢${options.length + 1}`]);
  };

  return (
    <div className="space-y-2 bg-white p-3 rounded-md border border-slate-200">
      <label className="text-xs font-bold text-slate-600 block mb-1">選択肢の設定</label>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-4 text-center">{idx + 1}.</span>
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[idx] = e.target.value;
                onChange(newOpts);
              }}
              className="flex-1 text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => handleDeleteOption(idx)}
              className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-100 transition-colors"
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
  );
}
