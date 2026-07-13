import { ArrowRight } from 'lucide-react';
import Sidebar from './Sidebar';
import type { QuestionTypeId } from './Sidebar';
import type { Question } from './QuestionItems';
import SurveyMetadataSection from './SurveyMetadataSection';
import QuestionList from './QuestionList';

interface SurveyEditorProps {
  questions: Question[];
  openQuestionId: string | null;
  draggedIndex: number | null;
  surveyTitle: string;
  surveyDescription: string;
  isEditingMetadata: boolean;
  onAddQuestion: (typeId: QuestionTypeId) => void;
  onDuplicateQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (updatedQuestion: Question) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (targetIndex: number) => void;
  onDragEnd: () => void;
  setOpenQuestionId: (id: string | null) => void;
  setSurveyTitle: (title: string) => void;
  setSurveyDescription: (desc: string) => void;
  setIsEditingMetadata: (isEditing: boolean) => void;
  onComplete: () => void;
}

export default function SurveyEditor({
  questions,
  openQuestionId,
  draggedIndex,
  surveyTitle,
  surveyDescription,
  isEditingMetadata,
  onAddQuestion,
  onDuplicateQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onDragStart,
  onDragEnter,
  onDragEnd,
  setOpenQuestionId,
  setSurveyTitle,
  setSurveyDescription,
  setIsEditingMetadata,
  onComplete,
}: SurveyEditorProps) {
  return (
    <>
      <Sidebar onAddQuestion={onAddQuestion} />
      <main className="col-span-9 p-6 bg-white space-y-6">
        <SurveyMetadataSection
          isEditingMetadata={isEditingMetadata}
          surveyTitle={surveyTitle}
          surveyDescription={surveyDescription}
          onStartEdit={() => setIsEditingMetadata(true)}
          onFinishEdit={() => setIsEditingMetadata(false)}
          onTitleChange={setSurveyTitle}
          onDescriptionChange={setSurveyDescription}
        />

        <QuestionList
          questions={questions}
          openQuestionId={openQuestionId}
          draggedIndex={draggedIndex}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDeleteQuestion={onDeleteQuestion}
          onDuplicateQuestion={onDuplicateQuestion}
          onUpdateQuestion={onUpdateQuestion}
          onOpenQuestion={(id) => setOpenQuestionId(id)}
          onCloseQuestion={() => setOpenQuestionId(null)}
        />

        {/* 作成完了ボタン */}
        {questions.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>作成完了してプレビューへ</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </main>
    </>
  );
}