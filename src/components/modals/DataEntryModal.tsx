import React, { useState } from "react";
import { DailyRecord, Factory } from "../../types";
import { addDailyRecord } from "../../lib/api";
import { X, Plus, Sparkles, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { useGuide } from "../../context/GuideContext";

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  factory: Factory;
  onRecordAdded: (newRec: DailyRecord) => void;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  isOpen,
  onClose,
  factory,
  onRecordAdded,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(todayStr);
  const [machineName, setMachineName] = useState("Main Assembly CNC Line #1");
  const [temperature, setTemperature] = useState<number | "">(68);
  const [pressure, setPressure] = useState<number | "">(120);
  const [vibration, setVibration] = useState<number | "">(2.4);
  const [electricityKwh, setElectricityKwh] = useState<number | "">(4150);
  const [waterLiters, setWaterLiters] = useState<number | "">(12800);
  const [productionOutput, setProductionOutput] = useState<number | "">(1890);
  const [workingHours, setWorkingHours] = useState<number | "">(16);
  const [machineUtilization, setMachineUtilization] = useState<number | "">(86);
  const [downtimeHours, setDowntimeHours] = useState<number | "">(0);
  const [maintenanceCost, setMaintenanceCost] = useState<number | "">(180);
  const [operatingCost, setOperatingCost] = useState<number | "">(2450);
  const [operatorNotes, setOperatorNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoCalculateCost = (elec: number, water: number, maint: number) => {
    const calc = Math.round(elec * 0.18 + water * 0.04 + maint + 1400);
    setOperatingCost(calc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    try {
      const rec = await addDailyRecord(factory.id, {
        date,
        machineName: machineName.trim(),
        temperature: Number(temperature) || 0,
        pressure: Number(pressure) || 0,
        vibration: Number(vibration) || 0,
        electricityKwh: Number(electricityKwh) || 0,
        waterLiters: Number(waterLiters) || 0,
        productionOutput: Number(productionOutput) || 0,
        workingHours: Number(workingHours) || 8,
        machineUtilization: Number(machineUtilization) || 75,
        downtimeHours: Number(downtimeHours) || 0,
        maintenanceCost: Number(maintenanceCost) || 0,
        operatingCost: Number(operatingCost) || 0,
        operatorNotes: operatorNotes.trim(),
      });

      setSuccessMsg("Monitoring data saved successfully.");
      onRecordAdded(rec);

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-[#FAFAFA] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#09090B] border-b border-[#27272A] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3B82F6]">
                Telemetry Log
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Daily Manual Data Entry — {factory.name}
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

        {/* Success Alert */}
        {successMsg && (
          <div className="m-4 mb-0 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Machine / Line Name
              </label>
              <input
                type="text"
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
                placeholder="e.g. Station 4 CNC Lathe"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) =>
                  setTemperature(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 68.5"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Pressure (PSI)
              </label>
              <input
                type="number"
                step="0.1"
                value={pressure}
                onChange={(e) =>
                  setPressure(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 120"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Vibration Level (mm/s)
              </label>
              <input
                type="number"
                step="0.1"
                value={vibration}
                onChange={(e) =>
                  setVibration(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 2.4"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Energy Consumption (kWh)
              </label>
              <input
                type="number"
                required
                min={0}
                value={electricityKwh}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setElectricityKwh(val);
                  handleAutoCalculateCost(Number(val) || 0, Number(waterLiters) || 0, Number(maintenanceCost) || 0);
                }}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Water Usage (Liters)
              </label>
              <input
                type="number"
                required
                min={0}
                value={waterLiters}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setWaterLiters(val);
                  handleAutoCalculateCost(Number(electricityKwh) || 0, Number(val) || 0, Number(maintenanceCost) || 0);
                }}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Production Count (Units)
              </label>
              <input
                type="number"
                required
                min={0}
                value={productionOutput}
                onChange={(e) =>
                  setProductionOutput(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Running Hours (Hours)
              </label>
              <input
                type="number"
                required
                min={0}
                max={24}
                value={workingHours}
                onChange={(e) =>
                  setWorkingHours(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Downtime (Hours)
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={downtimeHours}
                onChange={(e) =>
                  setDowntimeHours(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 1.5"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Machine Utilization (%)
              </label>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={machineUtilization}
                onChange={(e) =>
                  setMachineUtilization(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Maintenance Cost ($)
              </label>
              <input
                type="number"
                min={0}
                value={maintenanceCost}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setMaintenanceCost(val);
                  handleAutoCalculateCost(Number(electricityKwh) || 0, Number(waterLiters) || 0, Number(val) || 0);
                }}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Operator Notes
              </label>
              <textarea
                rows={2}
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="e.g. Hydraulic pump fluid change completed at 14:00. All spindles calibrated."
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] resize-none"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-[#27272A] flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-white text-black hover:bg-[#E4E4E7] text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Saving Entry..." : "Save Daily Telemetry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
