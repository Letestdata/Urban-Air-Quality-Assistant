import React from "react";
import { PollutantDetail } from "@/lib/types";
import { getAQIBadgeColor } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface PollutantCardProps {
  data: PollutantDetail;
}

export function PollutantCard({ data }: PollutantCardProps) {
  if (!data.is_available || data.value === null) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm opacity-60">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm text-gray-500">{data.pollutant}</span>
          <span className="text-[10px] uppercase font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            Unavailable
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Sensor measurement not currently supplied by monitoring station.</p>
      </div>
    );
  }

  const category = data.category || "Moderate";
  const badgeClass = getAQIBadgeColor(category);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h3 className="font-bold text-sm text-[#202B27]">{data.pollutant}</h3>
            <p className="text-[11px] text-gray-500 line-clamp-1">{data.display_name}</p>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {category}
          </span>
        </div>

        {/* Value Display */}
        <div className="my-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-[#102D26]">
              {data.value}
            </span>
            <span className="text-xs font-semibold text-gray-500">{data.unit}</span>
          </div>
          {data.sub_index !== null && (
            <div className="text-[11px] font-medium text-gray-600 mt-0.5">
              CPCB Sub-Index: <span className="font-bold text-[#202B27]">{data.sub_index}</span>
            </div>
          )}
        </div>
      </div>

      {/* Standard limit and health note */}
      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
        {data.standard_limit_24h && (
          <div className="mb-1 flex justify-between">
            <span>CPCB 24h limit:</span>
            <span className="font-semibold text-gray-700">{data.standard_limit_24h} {data.unit}</span>
          </div>
        )}
        {data.health_impact && (
          <p className="text-[10px] text-gray-400 leading-tight line-clamp-2">
            {data.health_impact}
          </p>
        )}
      </div>
    </div>
  );
}
