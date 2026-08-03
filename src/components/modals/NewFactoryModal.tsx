import React, { useState } from "react";
import { Factory, User } from "../../types";
import { createFactory } from "../../lib/api";
import { X, Building2, CheckCircle2, AlertCircle } from "lucide-react";

interface NewFactoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  onFactoryCreated: (factory: Factory) => void;
}

export const NewFactoryModal: React.FC<NewFactoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onFactoryCreated,
}) => {
  const [name, setName] = useState("");
  const [industryType, setIndustryType] = useState("Precision Manufacturing");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [numberOfMachines, setNumberOfMachines] = useState<number | "">(12);
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Factory Name is required.");
      return;
    }
    if (!industryType.trim()) {
      setErrorMsg("Industry Type is required.");
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Factory Location is required.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Address is required.");
      return;
    }
    if (!contactPerson.trim()) {
      setErrorMsg("Contact Person is required.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Email is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Phone Number is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const created = await createFactory({
        name: name.trim(),
        industryType: industryType.trim(),
        location: location.trim(),
        address: address.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        phone: phone.trim(),
        numberOfMachines: numberOfMachines ? Number(numberOfMachines) : 0,
        description: description.trim(),
        userId: currentUser?.id,
        userEmail: currentUser?.email,
      });

      setSuccessMsg("Factory created successfully.");

      setTimeout(() => {
        onFactoryCreated(created);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create factory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-[#FAFAFA] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#09090B] border-b border-[#27272A] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3B82F6]">
                Industrial Setup
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Create New Industrial Factory
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

        {/* Notifications */}
        {successMsg && (
          <div className="m-4 mb-0 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="m-4 mb-0 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Factory Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Precision Stamping Plant"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Industry Type <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={industryType}
                onChange={(e) => setIndustryType(e.target.value)}
                placeholder="e.g. Precision CNC Machining"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Factory Location <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Cleveland, OH"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 1042 Industrial Parkway, Bldg 4"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Contact Person <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@factory.com"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Number of Machines (Optional)
              </label>
              <input
                type="number"
                min={0}
                value={numberOfMachines}
                onChange={(e) =>
                  setNumberOfMachines(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 16"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-volume automotive precision stamping and metal fabrication."
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] resize-none"
              />
            </div>
          </div>

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
              {isSubmitting ? "Creating..." : "Create Factory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
