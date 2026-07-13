import { useState } from 'react';
import { 
  Menu, Eye, Save, CheckCircle, 
  CircleDot, CheckSquare, ChevronDown, 
  Type, Hash, Calendar, Star, Layout, 
  GripVertical, X, Plus, ChevronUp
} from 'lucide-react';

export default function App() {
  const [isQuestion2Open, setIsQuestion2Open] = useState(true);
  const [isUrgent, setIsUrgent] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
      {/* 画面タイトル */}
      <div className="max-w-6xl mx-auto mb-4 flex items-center gap-3">
        <span className="bg-blue-600 text-white font-bold w-7 h-7 flex items-center justify-center rounded text-sm">4</span>
        <h1 className="text-xl font-bold text-slate-900">アンケート詳細設計画面</h1>
      </div>

      {/* メインコンテナ */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        
        {/* ヘッダー */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold">アンケート詳細設計</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50">
              <Eye size={16} /> プレビュー
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50">
              <Save size={16} /> 一時保存
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm">
              <CheckCircle size={16} /> 作成完了
            </button>
          </div>
        </header>

        {/* ステッパー */}
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

        {/* メインコンテンツエリア（2カラム） */}
        <div className="grid grid-cols-12 min-h-[600px]">
          
          {/* 左サイドバー: 設問タイプ */}
          <aside className="col-span-3 border-r border-slate-200 bg-slate-50/30 p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-700 px-2 mb-3">設問タイプ</h3>
            
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <CircleDot size={18} className="text-blue-600" />
              <span className="text-sm font-medium">単一選択</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-blue-500 rounded-lg shadow-sm">
              <CheckSquare size={18} className="text-blue-600" />
              <span className="text-sm font-bold">複数選択</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <ChevronDown size={18} className="text-slate-400" />
              <span className="text-sm font-medium">プルダウン</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <Type size={18} className="text-slate-400" />
              <span className="text-sm font-medium">自由記述</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <Hash size={18} className="text-blue-500" />
              <span className="text-sm font-medium">数値入力</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <Calendar size={18} className="text-slate-400" />
              <span className="text-sm font-medium">日付</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <Star size={18} className="text-slate-400" />
              <span className="text-sm font-medium">評価（5段階）</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 transition">
              <Layout size={18} className="text-slate-400" />
              <span className="text-sm font-medium">説明・区切り</span>
            </button>
          </aside>

          {/* 右メイン: 設問一覧 */}
          <main className="col-span-9 p-6 bg-white space-y-4">
            <div className="text-sm text-slate-500 mb-2">
              設問一覧 <span className="text-xs">（ドラッグ＆ドロップで順番変更）</span>
            </div>

            {/* Q1 */}
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical size={16} className="text-slate-400 cursor-grab" />
                <span className="font-medium text-sm">Q1. あなたの所属部署を教えてください。</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">必須</span>
                <span className="text-sm text-slate-500 flex items-center gap-1">単一選択 <ChevronDown size={14} /></span>
              </div>
            </div>

            {/* Q2 (展開状態) */}
            <div className={`border rounded-lg shadow-sm overflow-hidden transition-all ${isQuestion2Open ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}>
              <div 
                className="flex items-center justify-between p-4 bg-white cursor-pointer select-none"
                onClick={() => setIsQuestion2Open(!isQuestion2Open)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical size={16} className="text-slate-400 cursor-grab" />
                  <span className="font-bold text-sm text-slate-900">Q2. 現在の働き方について</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">必須</span>
                  <span className="text-sm text-slate-700 flex items-center gap-1 font-medium">
                    複数選択 {isQuestion2Open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </div>
              </div>

              {isQuestion2Open && (
                <div className="p-5 bg-slate-50/50 border-t border-slate-100 space-y-4">
                  {/* 質問文 & 必須トグル */}
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
                        <input 
                          type="checkbox" 
                          checked={isUrgent} 
                          onChange={() => setIsUrgent(!isUrgent)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-2 text-xs font-bold text-blue-600">オン</span>
                      </label>
                    </div>
                  </div>

                  {/* 選択肢セクション */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500">選択肢（複数選択）</label>
                      <span className="text-xs text-slate-400">複数選択</span>
                    </div>

                    {[
                      "出社中心",
                      "ハイブリッド（出社とリモートの併用）",
                      "フルリモート",
                      "その他（自由記述）"
                    ].map((option, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 rounded px-3 py-2.5 shadow-sm">
                        <input type="checkbox" disabled className="rounded border-slate-300" />
                        <span className="text-sm text-slate-700 flex-1">{option}</span>
                        <button className="text-slate-400 hover:text-slate-600">
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    <button className="w-full py-2 border border-dashed border-blue-300 rounded text-sm text-blue-600 font-medium hover:bg-blue-50 flex items-center justify-center gap-1 mt-2">
                      <Plus size={16} /> 選択肢を追加
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Q3 */}
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical size={16} className="text-slate-400 cursor-grab" />
                <span className="font-medium text-sm">Q3. 満足度を教えてください。</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">必須</span>
                <span className="text-sm text-slate-500 flex items-center gap-1">評価（5段階） <ChevronDown size={14} /></span>
              </div>
            </div>

            {/* Q4 */}
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical size={16} className="text-slate-400 cursor-grab" />
                <span className="font-medium text-sm">Q4. ご意見・ご要望があればご自由にご記入ください。</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 flex items-center gap-1">自由記述 <ChevronDown size={14} /></span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}