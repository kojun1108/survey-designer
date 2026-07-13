import { useState } from 'react';
import Stepper from './components/Stepper';
import SurveyEditor from './components/SurveyEditor';
import SurveyPreview from './components/SurveyPreview';
import SurveyPublish from './components/SurveyPublish';
import type { QuestionTypeId } from './components/Sidebar';
import type { Question } from './components/QuestionItems';
import { Eye, Save, ArrowLeft, Globe } from 'lucide-react';

type AppMode = 'edit' | 'preview' | 'publish';

export default function App() {
  // 状態管理 (State)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<AppMode>('edit');
  const [surveyTitle, setSurveyTitle] = useState('未設定のアンケートタイトル');
  const [surveyDescription, setSurveyDescription] = useState('このアンケートの概要や回答者への案内文をここに入力してください。');
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);

  // バリデーションロジック（必須項目チェック）
  const validateSurvey = (): { isValid: boolean; message: string } => {
    // 1. タイトルチェック
    if (!surveyTitle.trim() || surveyTitle === '未設定のアンケートタイトル') {
      return { isValid: false, message: 'アンケートタイトルを設定してください。' };
    }

    // 2. 設問数チェック
    if (questions.length === 0) {
      return { isValid: false, message: '設問を少なくとも1つ以上作成してください。' };
    }

    // 3. 各設問の個別チェック
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qNum = i + 1;

      // 設問タイトルの空白チェック
      if (!q.title.trim()) {
        return { isValid: false, message: `Q${qNum}の設問タイトルが入力されていません。` };
      }

      // 選択肢が必要なタイプ（単一、複数、プルダウン）のチェック
      const needsOptions = ['単一選択', '複数選択', 'プルダウン'].includes(q.type);
      if (needsOptions) {
        if (!q.options || q.options.length === 0) {
          return { isValid: false, message: `Q${qNum}には選択肢が少なくとも1つ以上必要です。` };
        }
        
        // 空白の選択肢がないかチェック
        const hasEmptyOption = q.options.some(opt => !opt.trim());
        if (hasEmptyOption) {
          return { isValid: false, message: `Q${qNum}に空欄の選択肢があります。入力するか削除してください。` };
        }
      }
    }

    return { isValid: true, message: '' };
  };

  // 一時保存ボタンの処理（いつでも保存可能）
  const handleSave = () => {
    alert('アンケートの内容を一時保存しました。');
  };

  // Stepper用のステップ番号取得
  const getStepNumber = (): number => {
    if (currentMode === 'preview') return 2;
    if (currentMode === 'publish') return 3;
    return 1;
  };

  // 設問操作ロジック
  const handleAddQuestion = (typeId: QuestionTypeId) => {
    const labels: Record<QuestionTypeId, string> = {
      single: '単一選択',
      multiple: '複数選択',
      dropdown: 'プルダウン',
      text: '自由記述',
      number: '数値入力',
      date: '日付',
      rating: '評価（5段階）',
      divider: '説明・区切り',
    };

    const nextNumber = questions.length + 1;
    const newId = `q-${Date.now()}`;
    const typeLabel = labels[typeId];
    const defaultOptions = ['単一選択', '複数選択', 'プルダウン'].includes(typeLabel)
      ? ['選択肢1', '選択肢2', '選択肢3']
      : undefined;

    const newQuestion: Question = {
      id: newId,
      number: `Q${nextNumber}`,
      title: '', // 初期値は空欄
      type: typeLabel,
      required: false,
      options: defaultOptions
    };

    setQuestions([...questions, newQuestion]);
    setOpenQuestionId(newId);
  };

  const handleDuplicateQuestion = (id: string) => {
    const targetIndex = questions.findIndex(q => q.id === id);
    if (targetIndex === -1) return;

    const targetQuestion = questions[targetIndex];
    const newId = `q-dup-${Date.now()}`;
    const duplicatedQuestion: Question = {
      ...targetQuestion,
      id: newId,
      options: targetQuestion.options ? [...targetQuestion.options] : undefined,
    };

    const updatedList = [...questions];
    updatedList.splice(targetIndex + 1, 0, duplicatedQuestion);
    setQuestions(renumberQuestions(updatedList));
    setOpenQuestionId(newId);
  };

  const handleDeleteQuestion = (id: string) => {
    const filtered = questions.filter(q => q.id !== id);
    setQuestions(renumberQuestions(filtered));
    if (openQuestionId === id) setOpenQuestionId(null);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  // ドラッグ＆ドロップのロジック
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragEnter = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const updatedList = [...questions];
    const [draggedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(targetIndex, 0, draggedItem);
    setDraggedIndex(targetIndex);
    setQuestions(renumberQuestions(updatedList));
  };
  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
      {/* 画面トップエリア */}
      <div className="max-w-6xl mx-auto mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">アンケート詳細設計</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {currentMode !== 'edit' && (
            <button 
              onClick={() => setCurrentMode(currentMode === 'publish' ? 'preview' : 'edit')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-sm transition-colors text-sm"
            >
              <ArrowLeft size={16} className="text-slate-500" />
              <span>{currentMode === 'publish' ? 'プレビュー画面に戻る' : '設計画面に戻る'}</span>
            </button>
          )}

          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-sm transition-colors text-sm"
          >
            <Save size={16} className="text-slate-500" />
            <span>一時保存</span>
          </button>

          {currentMode === 'edit' ? (
            <button 
              onClick={() => {
                setOpenQuestionId(null);
                setCurrentMode('preview');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
            >
              <Eye size={16} />
              <span>プレビュー</span>
            </button>
          ) : currentMode === 'preview' ? (
            <button 
              onClick={() => setCurrentMode('publish')} // 【修正】チェックせずに公開設定画面へ進めるように
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
            >
              <Globe size={16} />
              <span>公開設定</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* メインカード枠 */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Stepper currentStep={getStepNumber()} />

        <div className="grid grid-cols-12 min-h-[600px]">
          {currentMode === 'edit' && (
            <SurveyEditor
              questions={questions}
              openQuestionId={openQuestionId}
              draggedIndex={draggedIndex}
              surveyTitle={surveyTitle}
              surveyDescription={surveyDescription}
              isEditingMetadata={isEditingMetadata}
              onAddQuestion={handleAddQuestion}
              onDuplicateQuestion={handleDuplicateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              setOpenQuestionId={setOpenQuestionId}
              setSurveyTitle={setSurveyTitle}
              setSurveyDescription={setSurveyDescription}
              setIsEditingMetadata={setIsEditingMetadata}
              onComplete={() => setCurrentMode('preview')}
            />
          )}

          {currentMode === 'preview' && (
            <SurveyPreview
              surveyTitle={surveyTitle}
              surveyDescription={surveyDescription}
              questions={questions}
            />
          )}

          {currentMode === 'publish' && (
            <SurveyPublish
              onBack={() => setCurrentMode('preview')}
              validateSurvey={validateSurvey} // 【追加】公開設定コンポーネントにバリデーション関数を渡す
            />
          )}
        </div>
      </div>
    </div>
  );
}

function renumberQuestions(list: Question[]) {
  return list.map((q, index) => ({
    ...q,
    number: `Q${index + 1}`
  }));
}
