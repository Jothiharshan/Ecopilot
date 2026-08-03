import React, { useState } from "react";
import { Factory } from "../../types";
import { bulkImportRecords, createFactory } from "../../lib/api";
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Building2 } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  factory: Factory | null;
  onRecordsImported: () => void;
  onFactoryCreatedAndImported?: (newFactory: Factory) => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen,
  onClose,
  factory,
  onRecordsImported,
  onFactoryCreatedAndImported,
}) => {
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [newFactoryName, setNewFactoryName] = useState<string>("");
  const [replaceExisting, setReplaceExisting] = useState<boolean>(true);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!factory && !newFactoryName) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setNewFactoryName(`Factory - ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`);
    }
    setImportSuccess(null);
    setImportError(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedRows(results.data || []);
        },
        error: (err) => {
          setImportError("Failed to parse CSV file: " + err.message);
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(firstSheet);
          setParsedRows(json);
        } catch (err: any) {
          setImportError("Failed to parse Excel spreadsheet: " + err.message);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setImportError("Unsupported file format. Please upload .csv or .xlsx");
    }
  };

  const handleDownloadSampleCsv = () => {
    const sampleData = [
      ["date", "electricity_kwh", "water_liters", "production_output", "working_hours", "machine_utilization", "maintenance_cost", "operating_cost"],
      ["2026-04-01", "4150", "12500", "1850", "16", "82", "150", "2300"],
      ["2026-04-02", "4220", "12800", "1890", "16", "85", "150", "2350"],
      ["2026-04-03", "5840", "15900", "1680", "16", "72", "900", "3400"],
      ["2026-04-04", "4180", "12400", "1920", "16", "88", "150", "2310"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + sampleData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fname = factory ? factory.name : "sample_plant";
    link.setAttribute("download", `ecopilot_${fname.toLowerCase().replace(/[^a-z0-9]/g, "_")}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);
    setImportError(null);
    try {
      let targetFactory = factory;
      if (!targetFactory) {
        const nameToUse = newFactoryName.trim() || "New Smart Factory";
        targetFactory = await createFactory({
          name: nameToUse,
          location: "Primary Site",
          industryType: "General Manufacturing",
          numberOfMachines: 12,
          numberOfEmployees: 25,
        });
      }

      const res = await bulkImportRecords(targetFactory.id, parsedRows, replaceExisting);
      if (res.success) {
        setImportSuccess(res.message);
        setTimeout(() => {
          if (!factory && onFactoryCreatedAndImported && targetFactory) {
            onFactoryCreatedAndImported(targetFactory);
          } else {
            onRecordsImported();
          }
          onClose();
        }, 1200);
      } else {
        setImportError("Import failed.");
      }
    } catch (err: any) {
      setImportError(err.message || "Failed to upload records.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-[#FAFAFA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#09090B] border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3B82F6]">
                Bulk Ingestion
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {factory ? `Upload CSV / Excel for ${factory.name}` : "Upload CSV / Excel File"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!factory && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Factory Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Precision Works"
                value={newFactoryName}
                onChange={(e) => setNewFactoryName(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}
          {/* Download sample template banner */}
          <div className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Need a formatting template?</h4>
              <p className="text-xs text-[#A1A1AA]">
                Download a pre-formatted CSV with date, kWh, liters, and production columns.
              </p>
            </div>
            <button
              onClick={handleDownloadSampleCsv}
              className="px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Sample CSV</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <label className="border-2 border-dashed border-[#27272A] hover:border-[#3B82F6] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-[#09090B]/40 group">
            <div className="w-12 h-12 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] group-hover:text-[#3B82F6] group-hover:border-[#3B82F6]/40 transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">
                {fileName ? fileName : "Click or drag CSV / Excel file here"}
              </p>
              <p className="text-xs text-[#71717A] mt-1">
                Supports .csv, .xlsx, and .xls files
              </p>
            </div>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Parsed Rows summary */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-300">
                    Ready to import {parsedRows.length} daily telemetry rows
                  </p>
                  <p className="text-emerald-400/80 mt-0.5">
                    Dates found from {String(parsedRows[0]?.date || "")} to{" "}
                    {String(parsedRows[parsedRows.length - 1]?.date || "")}
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2.5 px-1 cursor-pointer text-xs text-[#A1A1AA] hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#09090B] border-[#27272A] text-blue-500 focus:ring-0 accent-blue-500"
                />
                <span>Replace initial default benchmark data with this CSV dataset</span>
              </label>
            </div>
          )}

          {/* Success or Error */}
          {importSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-xs font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{importSuccess}</span>
            </div>
          )}
          {importError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-xs font-bold text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{importError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#09090B]/80 border-t border-[#27272A] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting || parsedRows.length === 0}
            className="px-5 py-2 rounded-lg bg-white text-black hover:bg-[#E4E4E7] text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            {isImporting ? "Importing Data..." : `Import ${parsedRows.length} Records`}
          </button>
        </div>
      </div>
    </div>
  );
};
