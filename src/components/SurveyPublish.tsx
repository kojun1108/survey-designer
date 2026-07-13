import { CheckCircle2 } from 'lucide-react';

interface SurveyPublishProps {
  onBack: () => void;
}

export default function SurveyPublish({ onBack }: SurveyPublishProps) {
  return (
    <main className="col-span-12 p-12 bg-white min-h-[600px] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-sm">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-xl font-bold text-slate-900">アンケートの公開準備が整いました</h2>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed">
        URLの発行、有効期限、特定の組織内のみへの限定公開といったセキュリティや公開スコープの設定をここで行うことができます。
      </p>
      <div className="pt-4 flex items-center gap-3">
        <button onClick={onBack} className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded text-xs hover:bg-slate-50 transition-colors">
          プレビューに戻る
        </button>
        <button onClick={() => alert('アンケートが正常に一般公開されました！')} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-xs shadow transition-colors">
          この内容で公開する
        </button>
      </div>
    </main>
  );
}