import { Globe } from 'lucide-react';

interface SurveyPublishProps {
  onBack: () => void;
  validateSurvey: () => { isValid: boolean; message: string }; // 【追加】型の定義
}

export default function SurveyPublish({ onBack, validateSurvey }: SurveyPublishProps) {
  
  // 【追加】公開ボタンを押したときの処理
  const handlePublish = () => {
    // 親コンポーネントから受け取ったバリデーションを実行
    const result = validateSurvey();
    
    if (!result.isValid) {
      alert(`【公開不可】\n${result.message}`);
      return; // エラーがある場合は処理を中断
    }

    // バリデーションを通過した場合の本来の公開処理
    alert('アンケートを公開しました！');
  };

  return (
    <main className="col-span-12 p-8 bg-white min-h-[600px] flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full space-y-6 pt-6">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold text-slate-900">アンケートの公開設定</h2>
          <p className="text-sm text-slate-500">
            公開用URLの発行や、回答受付に関するステータスの管理を行います。
          </p>
        </div>

        {/* 設定カード */}
        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">ステータス変更</h3>
          <p className="text-xs text-slate-600">
            「公開する」ボタンを押すと、このアンケートは即座に外部からの回答受付が可能な状態になります。未入力項目がある場合はエラーが表示されます。
          </p>
        </div>
      </div>

      {/* フッターアクションエリア */}
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between max-w-2xl mx-auto w-full mt-12">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
        >
          プレビューに戻る
        </button>

        <button
          onClick={handlePublish} // 【修正】バリデーション付きの関数に変更
          className="flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm"
        >
          <Globe size={16} />
          <span>この内容で公開する</span>
        </button>
      </div>
    </main>
  );
}