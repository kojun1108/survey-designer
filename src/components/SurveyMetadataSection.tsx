import { FileText, AlignLeft } from 'lucide-react';

interface SurveyMetadataSectionProps {
  isEditingMetadata: boolean;
  surveyTitle: string;
  surveyDescription: string;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

function SurveyMetadataPreview({
  surveyTitle,
  surveyDescription,
  onStartEdit,
}: Pick<SurveyMetadataSectionProps, 'surveyTitle' | 'surveyDescription' | 'onStartEdit'>) {
  return (
    <div onClick={onStartEdit} className="cursor-pointer group/meta flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <h2 className="text-lg font-bold text-slate-900 group-hover/meta:text-blue-600">{surveyTitle}</h2>
        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{surveyDescription}</p>
      </div>
      <span className="text-xs text-slate-400 font-medium border border-slate-200 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover/meta:opacity-100 transition-opacity">
        編集する
      </span>
    </div>
  );
}

function SurveyMetadataEditor({
  surveyTitle,
  surveyDescription,
  onFinishEdit,
  onTitleChange,
  onDescriptionChange,
}: Pick<
  SurveyMetadataSectionProps,
  'surveyTitle' | 'surveyDescription' | 'onFinishEdit' | 'onTitleChange' | 'onDescriptionChange'
>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-bold text-blue-600">アンケート基本情報の編集</span>
        <button onClick={onFinishEdit} className="px-3 py-1 bg-blue-600 text-white font-semibold rounded text-xs shadow-sm">
          完了
        </button>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <FileText size={14} /> アンケートタイトル
        </label>
        <input
          type="text"
          value={surveyTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-base font-bold border border-slate-300 rounded-md p-2 bg-white"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <AlignLeft size={14} /> 概要・はじめに（説明文）
        </label>
        <textarea
          rows={3}
          value={surveyDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white"
        />
      </div>
    </div>
  );
}

export default function SurveyMetadataSection({
  isEditingMetadata,
  surveyTitle,
  surveyDescription,
  onStartEdit,
  onFinishEdit,
  onTitleChange,
  onDescriptionChange,
}: SurveyMetadataSectionProps) {
  return (
    <div
      className={`border rounded-xl transition-all p-5 ${
        isEditingMetadata
          ? 'border-blue-500 bg-blue-50/10 shadow-md'
          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
      }`}
    >
      {isEditingMetadata ? (
        <SurveyMetadataEditor
          surveyTitle={surveyTitle}
          surveyDescription={surveyDescription}
          onFinishEdit={onFinishEdit}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
        />
      ) : (
        <SurveyMetadataPreview
          surveyTitle={surveyTitle}
          surveyDescription={surveyDescription}
          onStartEdit={onStartEdit}
        />
      )}
    </div>
  );
}
