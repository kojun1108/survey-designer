import { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import SurveyEditor from './components/SurveyEditor';
import SurveyPreview from './components/SurveyPreview';
import SurveyPublish from './components/SurveyPublish';
import type { QuestionTypeId } from './components/Sidebar';
import type { Question } from './components/QuestionItems';
import { Eye } from 'lucide-react';

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
      title: typeLabel === '説明・区切り' ? 'ここへ案内文や説明テキストを入力してください。' : `新しい${typeLabel}の設問タイトルを入力してください。`,
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
      {/* 画面トップヘッダーエリア */}
      <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white font-bold w-7 h-7 flex items-center justify-center rounded text-sm shadow-sm">4</span>
          <h1 className="text-xl font-bold text-slate-900">アンケート詳細設計画面</h1>
        </div>
        {currentMode === 'edit' && (
          <button 
            onClick={() => {
              setOpenQuestionId(null);
              setCurrentMode('preview');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg shadow-sm transition-colors text-sm"
          >
            <Eye size={16} />
            <span>プレビュー</span>
          </button>
        )}
      </div>

      {/* メインカード枠 */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Header />
        <Stepper currentStep={getStepNumber()} />

        <div className="grid grid-cols-12 min-h-[600px]">
          {/* 現在のモードに合わせてコンポーネントを切り替え */}
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
              onComplete={() => {
                setOpenQuestionId(null);
                setCurrentMode('preview');
              }}
            />
          )}

          {currentMode === 'preview' && (
            <SurveyPreview
              surveyTitle={surveyTitle}
              surveyDescription={surveyDescription}
              questions={questions}
              onBack={() => setCurrentMode('edit')}
              onNext={() => setCurrentMode('publish')}
            />
          )}

          {currentMode === 'publish' && (
            <SurveyPublish
              onBack={() => setCurrentMode('preview')}
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