import { Copy, Trash2 } from 'lucide-react';

interface QuestionActionBarProps {
  showRequiredToggle: boolean;
  required: boolean;
  onToggleRequired: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function QuestionActionBar({
  showRequiredToggle,
  required,
  onToggleRequired,
  onDuplicate,
  onDelete,
  onClose,
}: QuestionActionBarProps) {
  return (
    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-500 text-xs">
      <div className="flex items-center gap-4">
        {showRequiredToggle && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">回答必須</span>
            <button
              type="button"
              onClick={onToggleRequired}
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
        <button
          type="button"
          onClick={onDuplicate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
        >
          <Copy size={14} />
          <span>複製</span>
        </button>
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
  );
}
