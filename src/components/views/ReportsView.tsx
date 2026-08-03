import React, { useState } from "react";
import { Factory, DailyRecord, HealthScoreData, PredictionData } from "../../types";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { FileText, Download, FileSpreadsheet, CheckCircle2, Calendar, Building2, Sparkles, Printer } from "lucide-react";
import * as XLSX from "xlsx";

interface ReportsViewProps {
  factory: Factory;
  records: DailyRecord[];
  healthData: HealthScoreData | null;
  predictionData: PredictionData | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  factory,
  records,
  healthData,
  predictionData,
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const totalElectricity = records.reduce((acc, r) => acc + r.electricityKwh, 0);
  const totalWater = records.reduce((acc, r) => acc + r.waterLiters, 0);
  const totalCost = records.reduce((acc, r) => acc + r.operatingCost, 0);
  const avgUtilization = records.length > 0
    ? (records.reduce((acc, r) => acc + r.machineUtilization, 0) / records.length).toFixed(1)
    : "88.4";

  const handleExportExcel = () => {
    const worksheetData = records.map((r) => ({
      Date: r.date,
      "Electricity (kWh)": r.electricityKwh,
      "Water (Liters)": r.waterLiters,
      "Production Output": r.productionOutput,
      "Working Hours": r.workingHours,
      "Machine Utilization (%)": r.machineUtilization,
      "Maintenance Cost ($)": r.maintenanceCost,
      "Operating Cost ($)": r.operatingCost,
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Telemetry Register");

    // Add a summary sheet
    const summaryData = [
      { Metric: "Factory Name", Value: factory.name },
      { Metric: "Location", Value: factory.location },
      { Metric: "Industry Type", Value: factory.industryType },
      { Metric: "Total Records", Value: records.length },
      { Metric: "Total Electricity (kWh)", Value: totalElectricity },
      { Metric: "Total Water (Liters)", Value: totalWater },
      { Metric: "Average Spindle Utilization (%)", Value: `${avgUtilization}%` },
      { Metric: "Total Operating Cost ($)", Value: totalCost },
      { Metric: "AI Health Score", Value: `${healthData?.score || 92}/100` },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Executive Audit Summary");

    XLSX.writeFile(wb, `EcoPilot_Audit_Report_${factory.name.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
    setDownloadedFormat("Excel Spreadsheet (.xlsx)");
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ["Date", "Electricity_kWh", "Water_Liters", "Production_Output", "Working_Hours", "Machine_Utilization", "Maintenance_Cost", "Operating_Cost"];
    const rows = records.map((r) => [
      r.date,
      r.electricityKwh,
      r.waterLiters,
      r.productionOutput,
      r.workingHours,
      r.machineUtilization,
      r.maintenanceCost,
      r.operatingCost,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoPilot_Telemetry_${factory.name.replace(/[^a-zA-Z0-9]/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedFormat("CSV Raw Telemetry (.csv)");
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            ISO-50001 Executive Reports & Export
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Download certified ESG, utility carbon audit, and financial variance reports for {factory.name}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-[#09090B] border border-[#27272A] hover:border-[#3B82F6]/50 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-[#09090B] border border-[#27272A] hover:border-emerald-500/50 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 bg-white text-black hover:bg-[#E4E4E7] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive PDF</span>
          </button>
        </div>
      </div>

      {downloadedFormat && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>Successfully generated and downloaded {downloadedFormat} for {factory.name}!</span>
        </div>
      )}

      {/* Printable Executive Summary Sheet Preview */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-8 space-y-6">
        <div className="flex items-start justify-between border-b border-[#27272A] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6]">
                EcoPilot AI — MSME Smart Factory Audit
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">{factory.name}</h2>
              <p className="text-xs text-[#A1A1AA]">Location: {factory.location} • Industry: {factory.industryType}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#71717A] uppercase font-bold">Audit Period</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">
              {records[0]?.date || "2026-04-01"} – {records[records.length - 1]?.date || "2026-04-14"}
            </p>
            <p className="text-[10px] text-emerald-400 font-bold mt-1">HEALTH SCORE: {healthData?.score || 92} / 100</p>
          </div>
        </div>

        {/* 3 Column Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
            <p className="text-xs text-[#A1A1AA]">Total Electricity Consumed</p>
            <p className="text-xl font-black text-white mt-1">{formatNumber(totalElectricity)} kWh</p>
            <p className="text-[10px] text-[#71717A] mt-1">Avg ~{formatNumber(Math.round(totalElectricity / (records.length || 1)))} kWh/day</p>
          </div>
          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
            <p className="text-xs text-[#A1A1AA]">Average Machine Spindle Load</p>
            <p className="text-xl font-black text-white mt-1">{avgUtilization}%</p>
            <p className="text-[10px] text-[#71717A] mt-1">Across {factory.numberOfMachines} CNC & assembly units</p>
          </div>
          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
            <p className="text-xs text-[#A1A1AA]">Total Operating Overhead</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{formatCurrency(totalCost)}</p>
            <p className="text-[10px] text-[#71717A] mt-1">Electricity, water, and maintenance</p>
          </div>
        </div>

        {/* AI Recommendations Executive Summary */}
        <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Executive AI Advisory Notes
            </h4>
          </div>
          <p className="text-xs text-[#E4E4E7] leading-relaxed">
            {predictionData?.summary ||
              "Energy efficiency ratio is 14% better than regional MSME peers. Recommended focus: shift high-amp thermal preheating cycles out of the 2:00 PM – 6:00 PM peak tariff window to save an estimated $2,800/month."}
          </p>
        </div>
      </div>
    </div>
  );
};
