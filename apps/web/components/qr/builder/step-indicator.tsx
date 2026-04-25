"use client";

const STEPS = [
  { id: 1, label: "Choose type" },
  { id: 2, label: "Add content" },
  { id: 3, label: "Design" },
];

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                step.id < current
                  ? "bg-primary text-primary-foreground"
                  : step.id === current
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.id < current ? (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
                  <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                step.id === current ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-2 h-px w-8 sm:w-12 transition-colors ${
                step.id < current ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
