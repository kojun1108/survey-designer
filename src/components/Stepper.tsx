import { Edit3, Eye, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { number: 1, label: '設問設計', icon: Edit3 },
    { number: 2, label: 'プレビュー', icon: Eye },
    { number: 3, label: '公開設定', icon: CheckCircle2 },
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between relative">
        
        {/* 背景の進行ライン */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* 進捗に合わせて伸びる青いライン */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300 ease-in-out"
          style={{ 
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' 
          }}
        />

        {/* 各ステップの描画 */}
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : isActive
                    ? 'bg-white border-blue-600 text-blue-600 font-bold shadow-md ring-4 ring-blue-50'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} className="stroke-[3]" />
                ) : (
                  <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                )}
              </div>
              
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.number}. {step.label}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}