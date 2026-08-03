import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Factory as FactoryIcon,
  Cpu,
  Car,
  Shirt,
  Zap,
  FlaskConical,
  Package,
  Anvil,
  Leaf,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  Clock,
  BatteryCharging,
  Target,
  Wrench,
  X,
} from "lucide-react";
import { IndustryProfile, Factory, User } from "../../types";

interface IndustryOnboardingModalProps {
  isOpen: boolean;
  currentUser: User;
  currentFactory?: Factory | null;
  onClose?: () => void;
  onComplete: (profile: IndustryProfile, updatedFactory: Partial<Factory>) => void;
}

export const INDUSTRY_VERTICLES = [
  {
    id: "auto",
    title: "Automotive & Precision Components",
    icon: Car,
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400",
    description: "CNC Milling, Lathes, Stamping Presses, Robotic Welding, Stator Winding",
    defaultMachines: 24,
    defaultEmployees: 85,
    locationPreset: "Pune Auto Cluster, MH",
  },
  {
    id: "textile",
    title: "Textiles & Apparel Mills",
    icon: Shirt,
    color: "from-purple-500/20 to-pink-500/20 border-pink-500/40 text-pink-400",
    description: "Spinning Frames, Shuttleless Looms, Dyeing Vessels, Steam Boilers",
    defaultMachines: 40,
    defaultEmployees: 120,
    locationPreset: "Coimbatore Textile Hub, TN",
  },
  {
    id: "electronics",
    title: "Electronics & Semiconductors",
    icon: Cpu,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400",
    description: "SMT Surface Mount, Reflow Ovens, Cleanrooms, Automated Optical Inspection",
    defaultMachines: 18,
    defaultEmployees: 60,
    locationPreset: "Bengaluru Tech Park, KA",
  },
  {
    id: "chemical",
    title: "Chemicals & Pharmaceuticals",
    icon: FlaskConical,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400",
    description: "Batch Reactors, Centrifuges, Chiller Plants, Lyophilizers, Fluidized Beds",
    defaultMachines: 15,
    defaultEmployees: 50,
    locationPreset: "Ankleshwar Chemical Belt, GJ",
  },
  {
    id: "fnb",
    title: "Food, Beverage & Packaging",
    icon: Package,
    color: "from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-400",
    description: "Rotary Bottling, Pasteurizers, Retort Autoclaves, Blow Molding, Chillers",
    defaultMachines: 12,
    defaultEmployees: 45,
    locationPreset: "Aurangabad Food Zone, MH",
  },
  {
    id: "metal",
    title: "Heavy Metal & Foundry Forging",
    icon: Anvil,
    color: "from-red-500/20 to-amber-500/20 border-red-500/40 text-red-400",
    description: "Induction Melting Furnaces, Drop Hammers, Hydraulic Presses, Heat Treat",
    defaultMachines: 10,
    defaultEmployees: 75,
    locationPreset: "Ludhiana Industrial Hub, PB",
  },
  {
    id: "renewable",
    title: "Renewables & Green Tech Assembly",
    icon: Leaf,
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/40 text-teal-300",
    description: "Solar PV Cell Tabbing, Inverter Testing, Battery Stacking & Encapsulation",
    defaultMachines: 20,
    defaultEmployees: 90,
    locationPreset: "Phoenix Energy Corridor, AZ",
  },
  {
    id: "general",
    title: "General MSME Manufacturing",
    icon: FactoryIcon,
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-400",
    description: "Multi-purpose Assembly Lines, Compressors, Injection Molding, Conveyors",
    defaultMachines: 16,
    defaultEmployees: 40,
    locationPreset: "Industrial Zone #04",
  },
];

export const IndustryOnboardingModal: React.FC<IndustryOnboardingModalProps> = ({
  isOpen,
  currentUser,
  currentFactory,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedVertical, setSelectedVertical] = useState(
    currentFactory?.industryType || "Automotive & Precision Components"
  );
  const [plantName, setPlantName] = useState(
    currentFactory?.name || `${currentUser.companyName || "Vanguard"} Precision Unit #1`
  );
  const [location, setLocation] = useState(
    currentFactory?.location || "Coimbatore Textile Hub, TN"
  );
  const [machineCount, setMachineCount] = useState<number>(
    currentFactory?.numberOfMachines || 24
  );
  const [employeeCount, setEmployeeCount] = useState<number>(
    currentFactory?.numberOfEmployees || 85
  );
  const [shiftType, setShiftType] = useState<
    "1 Shift (8 Hours)" | "2 Shifts (16 Hours)" | "24/7 Continuous Operation"
  >("2 Shifts (16 Hours)");
  const [energySource, setEnergySource] = useState<
    "State Power Grid" | "Grid + On-Site Solar Hybrid" | "Diesel Generator / Captive LNG" | "100% Renewable"
  >("Grid + On-Site Solar Hybrid");
  const [primaryGoal, setPrimaryGoal] = useState<
    "Reduce Electricity & Peak Cost" | "Zero Unplanned Down-time" | "ESG & Carbon Compliance" | "Maximize OEE & Output"
  >("Zero Unplanned Down-time");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectVerticalCard = (vert: typeof INDUSTRY_VERTICLES[0]) => {
    setSelectedVertical(vert.title);
    setMachineCount(vert.defaultMachines);
    setEmployeeCount(vert.defaultEmployees);
    if (!location || location === "Coimbatore Textile Hub, TN") {
      setLocation(vert.locationPreset);
    }
  };

  const handleSkip = () => {
    if (onClose) {
      onClose();
    } else {
      const defaultProfile: IndustryProfile = {
        industryType: selectedVertical,
        plantName,
        location,
        machineCount: Number(machineCount),
        employeeCount: Number(employeeCount),
        shiftType,
        energySource,
        primaryGoal,
        hasCompletedOnboarding: false,
      };
      onComplete(defaultProfile, {});
    }
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profile: IndustryProfile = {
      industryType: selectedVertical,
      plantName,
      location,
      machineCount: Number(machineCount),
      employeeCount: Number(employeeCount),
      shiftType,
      energySource,
      primaryGoal,
      hasCompletedOnboarding: true,
    };

    const updatedFactory: Partial<Factory> = {
      name: plantName,
      location: location,
      industryType: selectedVertical,
      numberOfMachines: Number(machineCount),
      numberOfEmployees: Number(employeeCount),
      shiftType,
      energySource,
      primaryGoal,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onComplete(profile, updatedFactory);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090D1A] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden text-[#FAFAFA] flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#050811] border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-xl text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                  Industry Setup Wizard
                </span>
                <span className="text-xs text-[#94A3B8]">Step {step} of 3</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Configure Your Industry & Plant Context
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Skip Industry Setup Wizard"
            >
              <span>Skip Wizard</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#18181B] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="w-full bg-[#111A30] h-1.5 flex">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          {/* STEP 1: SELECT INDUSTRY SECTOR / VERTICAL */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Select Your Manufacturing Industry Vertical
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  FactoryPilot AI tunes vibration tolerances, thermal thresholds, and Gemini AI prompt algorithms to match your sector.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INDUSTRY_VERTICLES.map((vert) => {
                  const Icon = vert.icon;
                  const isSelected = selectedVertical === vert.title;

                  return (
                    <div
                      key={vert.id}
                      onClick={() => handleSelectVerticalCard(vert)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
                        isSelected
                          ? "bg-[#111C38] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400"
                          : "bg-[#0C1327] border-[#1E293B] hover:border-cyan-500/40 hover:bg-[#111A30]"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-cyan-400">
                          <CheckCircle2 className="w-5 h-5 fill-cyan-400/20" />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border ${vert.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-white">{vert.title}</h4>
                          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                            {vert.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: PLANT NAME, LOCATION, CAPACITY */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Facility Scale & Operational Capacity
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Specify your plant name, location, and total floor equipment count.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Factory / Plant Unit Name
                  </label>
                  <input
                    type="text"
                    required
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g. Apex Precision Mill Unit #1"
                    className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Industrial Location / Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Coimbatore Textile Hub, TN"
                    className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      Active Machines & Telemetry Nodes
                    </span>
                    <span className="font-mono text-cyan-400 text-xs font-bold">{machineCount} Units</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={machineCount}
                    onChange={(e) => setMachineCount(Number(e.target.value))}
                    className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      Workforce / Floor Staff Count
                    </span>
                    <span className="font-mono text-cyan-400 text-xs font-bold">{employeeCount} Staff</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(Number(e.target.value))}
                    className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Operating Shift Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Daily Operating Shift Pattern
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    "1 Shift (8 Hours)",
                    "2 Shifts (16 Hours)",
                    "24/7 Continuous Operation",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShiftType(s as any)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        shiftType === s
                          ? "bg-[#111C38] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : "bg-[#111A30] border-[#1E293B] text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ENERGY SOURCE & AI GOAL */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Energy Profile & Primary AI Optimization Objective
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Help Gemini 2.5 AI prioritize anomaly alerts and cost-saving recommendations.
                </p>
              </div>

              {/* Energy Source */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
                  Primary Electrical Power Infrastructure
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { title: "State Power Grid", desc: "Heavy TOD peak tariff exposure" },
                    { title: "Grid + On-Site Solar Hybrid", desc: "Offset daytime peak demand" },
                    { title: "Diesel Generator / Captive LNG", desc: "Off-grid / backup power" },
                    { title: "100% Renewable", desc: "Hydro / Wind / PPA green power" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setEnergySource(item.title as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        energySource === item.title
                          ? "bg-[#111C38] border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : "bg-[#111A30] border-[#1E293B] text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{item.title}</div>
                      <div className="text-[10px] text-[#94A3B8]">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Objective */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Primary Industrial Optimization Priority
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { title: "Reduce Electricity & Peak Cost", desc: "Cut kWh bills & peak demand penalties" },
                    { title: "Zero Unplanned Down-time", desc: "Predictive vibration & bearing heat alerts" },
                    { title: "ESG & Carbon Compliance", desc: "Track Scope 1 & 2 carbon footprint metrics" },
                    { title: "Maximize OEE & Output", desc: "Optimize machine throughput & line speed" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setPrimaryGoal(item.title as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        primaryGoal === item.title
                          ? "bg-[#111C38] border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          : "bg-[#111A30] border-[#1E293B] text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{item.title}</div>
                      <div className="text-[10px] text-[#94A3B8]">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Calibration Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300">
                <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-white">AI Engine Configuration Ready</div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Calibrating Gemini 2.5 ML models for <span className="text-cyan-300 font-semibold">{selectedVertical}</span> at <span className="text-white font-semibold">{plantName}</span> ({location}).
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-[#050811] border-t border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl bg-[#111A30] border border-[#1E293B] text-xs font-semibold text-[#CBD5E1] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Skip Task</span>
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 text-xs font-bold text-white uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>{isSubmitting ? "Calibrating..." : "Initialize Industry Dashboard"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
