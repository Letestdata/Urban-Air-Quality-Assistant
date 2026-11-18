import React from "react";
import { PlanActivity } from "@/lib/types";
import { Check, X, Clock, HelpCircle, ArrowRightCircle, Sparkles } from "lucide-react";

interface ActivityCardProps {
  activity: PlanActivity;
  onStatusChange: (id: string, status: "pending" | "completed" | "skipped") => void;
}

export function ActivityCard({ activity, onStatusChange }: ActivityCardProps) {
  const isCompleted = activity.status === "completed";
  const isSkipped = activity.status === "skipped";

  const bracketBadges = {
    morning: "bg-amber-100 text-amber-900 border-amber-200",
    afternoon: "bg-emerald-100 text-emerald-900 border-emerald-200",
    evening: "bg-indigo-100 text-indigo-900 border-indigo-200",
    night: "bg-slate-100 text-slate-900 border-slate-200"
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isCompleted
          ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
          : isSkipped
          ? "bg-gray-50 border-gray-200 opacity-60"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${bracketBadges[activity.time_bracket]}`}>
            {activity.time_bracket}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {activity.suggested_time}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStatusChange(activity.id, isCompleted ? "pending" : "completed")}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              isCompleted
                ? "bg-[#1F8A63] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-800"
            }`}
            title={isCompleted ? "Mark as pending" : "Mark as completed"}
            aria-label={`Mark ${activity.title} as completed`}
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCompleted ? "Done" : "Complete"}</span>
          </button>

          <button
            onClick={() => onStatusChange(activity.id, isSkipped ? "pending" : "skipped")}
            className={`p-1.5 rounded-lg text-xs transition ${
              isSkipped
                ? "bg-gray-600 text-white"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
            title={isSkipped ? "Restore activity" : "Skip activity"}
            aria-label={`Skip ${activity.title}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Title & Action */}
      <h3 className={`text-base font-bold text-[#202B27] ${isCompleted ? "line-through text-gray-500" : ""}`}>
        {activity.title}
      </h3>
      <p className="text-sm text-gray-700 mt-1 font-medium leading-relaxed">
        {activity.action}
      </p>

      {/* Scientific Reason */}
      <div className="mt-3.5 p-3 rounded-xl bg-[#F3F6F1] border border-gray-200/60 text-xs text-gray-600 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-[#1F8A63] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#102D26]">Why: </span>
          <span>{activity.reason}</span>
        </div>
      </div>

      {/* Alternative */}
      {activity.alternative && (
        <div className="mt-2 text-xs text-gray-500 flex items-start gap-2 pl-1">
          <ArrowRightCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-gray-700">Alternative:</strong> {activity.alternative}
          </span>
        </div>
      )}

      {/* Evidence type footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span className="capitalize">Evidence: {activity.evidence_type.replace("_", " ")}</span>
        {activity.source_reference && (
          <span className="truncate max-w-[200px]" title={activity.source_reference}>
            Ref: {activity.source_reference}
          </span>
        )}
      </div>
    </div>
  );
}
