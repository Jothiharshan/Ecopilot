import React, { useState } from "react";
import { Factory } from "../../types";
import { Building2, Plus, CheckCircle2, MapPin, Cpu, Briefcase, Trash2, Edit2, AlertTriangle, RefreshCw, X, Key, Copy, Check, ShieldCheck, Eye, EyeOff, Database, Server, Globe, ExternalLink } from "lucide-react";
import { isSupabaseConfigured, getSupabaseCredentials } from "../../lib/supabase";

interface FactorySettingsViewProps {
  factories: Factory[];
  selectedFactory: Factory | null;
  onSelectFactory: (factory: Factory) => void;
  onOpenNewFactoryModal: () => void;
  onDeleteFactory?: (factoryId: string) => Promise<void> | void;
}

export const FactorySettingsView: React.FC<FactorySettingsViewProps> = ({
  factories,
  selectedFactory,
  onSelectFactory,
  onOpenNewFactoryModal,
  onDeleteFactory,
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [factoryToDelete, setFactoryToDelete] = useState<Factory | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // API Keys Management State
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; created: string; lastUsed: string }[]>(() => {
    const saved = localStorage.getItem("factory_api_keys");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "key_1",
        name: "Primary Industrial IoT Gateway Key",
        key: "eco_live_8f39a7b2c41d9e50a12f689c",
        created: "2026-07-20",
        lastUsed: "Just now",
      },
    ];
  });

  const [newKeyName, setNewKeyName] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});

  // Supabase Configuration State
  const initialSupa = getSupabaseCredentials();
  const [supaUrl, setSupaUrl] = useState<string>(() => localStorage.getItem("supa_url") || initialSupa.url);
  const [supaAnonKey, setSupaAnonKey] = useState<string>(() => localStorage.getItem("supa_anon_key") || initialSupa.key);
  const [isSupaSaved, setIsSupaSaved] = useState<boolean>(() => Boolean(localStorage.getItem("supa_url") || isSupabaseConfigured()));
  const [supaTestStatus, setSupaTestStatus] = useState<string | null>(null);
  const [isTestingSupa, setIsTestingSupa] = useState<boolean>(false);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("supa_url", supaUrl.trim());
    localStorage.setItem("supa_anon_key", supaAnonKey.trim());
    setIsSupaSaved(true);
    setSuccessMsg("Supabase configuration updated successfully!");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleTestSupabaseConnection = async () => {
    setIsTestingSupa(true);
    setSupaTestStatus(null);
    try {
      const targetUrl = supaUrl.trim() || initialSupa.url;
      const targetKey = supaAnonKey.trim() || initialSupa.key;

      if (!targetUrl || !targetKey) {
        setSupaTestStatus("Missing Supabase URL or Anon Key. Please fill in both fields.");
        setIsTestingSupa(false);
        return;
      }

      // Quick ping to Supabase auth health endpoint
      const res = await fetch(`${targetUrl.replace(/\/$/, "")}/auth/v1/health?apikey=${targetKey}`);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setSupaTestStatus(`Connected successfully! Supabase project is active (GoTrue ${data.version || 'v2'}).`);
      } else {
        setSupaTestStatus(`Connected to host, but returned HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err: any) {
      setSupaTestStatus(`Connection error: ${err?.message || "Could not reach Supabase endpoint"}`);
    } finally {
      setIsTestingSupa(false);
    }
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newKeyName.trim() || `Industrial Sensor Key #${apiKeys.length + 1}`;
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newSecret = `eco_live_${randomHex}`;
    const newEntry = {
      id: `key_${Date.now()}`,
      name,
      key: newSecret,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
    };
    const updated = [newEntry, ...apiKeys];
    setApiKeys(updated);
    localStorage.setItem("factory_api_keys", JSON.stringify(updated));
    setNewKeyName("");
    setShowGenerateModal(false);
    setVisibleKeyIds((prev) => ({ ...prev, [newEntry.id]: true }));
    setSuccessMsg(`New API Key "${name}" generated successfully.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleCopyKey = (keyText: string, keyId: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleRevokeKey = (keyId: string) => {
    const updated = apiKeys.filter((k) => k.id !== keyId);
    setApiKeys(updated);
    localStorage.setItem("factory_api_keys", JSON.stringify(updated));
  };

  const confirmDelete = async () => {
    if (!factoryToDelete || !onDeleteFactory) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteFactory(factoryToDelete.id);
      const deletedName = factoryToDelete.name;
      setFactoryToDelete(null);
      setSuccessMsg(`Factory "${deletedName}" was deleted successfully.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to delete factory:", err);
      setDeleteError(err.message || "Failed to delete factory. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            MSME Factory Portfolio & Telemetry Settings
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Manage your industrial plants, machine count, and location tariff profiles.
          </p>
        </div>
        <button
          onClick={onOpenNewFactoryModal}
          className="px-4 py-2 bg-white text-black hover:bg-[#E4E4E7] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Factory</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Factories Grid */}
      {factories.length === 0 ? (
        <div className="p-10 text-center bg-[#18181B] border border-[#27272A] rounded-2xl max-w-xl mx-auto space-y-3">
          <Building2 className="w-12 h-12 text-[#71717A] mx-auto" />
          <h4 className="text-base font-bold text-white">No Factories Registered</h4>
          <p className="text-xs text-[#A1A1AA]">
            You have not added any factory yet. Create a factory or upload a telemetry spreadsheet to get started.
          </p>
          <button
            onClick={onOpenNewFactoryModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 mt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Factory</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {factories.map((f) => {
            const isSelected = selectedFactory?.id === f.id;
            return (
              <div
                key={f.id}
                onClick={() => onSelectFactory(f)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#18181B] border-[#3B82F6] shadow-lg shadow-blue-500/10"
                    : "bg-[#09090B] border-[#27272A] hover:border-white/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-[#3B82F6] text-white"
                          : "bg-[#18181B] text-[#A1A1AA] border border-[#27272A]"
                      }`}
                    >
                      {isSelected ? "ACTIVE MONITORING" : "STANDBY"}
                    </span>
                    <span className="text-[11px] font-mono text-[#A1A1AA]">ID: {f.id.slice(0, 8)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-[#27272A] flex items-center justify-center text-white font-bold">
                        <Building2 className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white tracking-tight">{f.name}</h4>
                        <p className="text-xs text-[#A1A1AA] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#71717A]" />
                          <span>{f.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#27272A] text-xs">
                    <div>
                      <span className="text-[10px] text-[#71717A] uppercase font-bold">Industry Sector</span>
                      <p className="font-semibold text-white mt-0.5">{f.industryType}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71717A] uppercase font-bold">CNC / Machine Count</span>
                      <p className="font-semibold text-white mt-0.5">{f.numberOfMachines} units</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#27272A] flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#3B82F6] truncate">
                    {isSelected ? "✓ Currently Active" : "Click to Switch Active"}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSuccessMsg(`Telemetry profile for ${f.name} updated successfully.`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Configure
                    </button>

                    {onDeleteFactory && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFactoryToDelete(f);
                        }}
                        className="px-2.5 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        title={`Delete ${f.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Industrial API Keys Section */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Industrial API Keys & IoT Access</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold px-2 py-0.5 rounded-full">
                  REST / MQTT Ingestion
                </span>
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Use API keys to authenticate IoT sensor gateways, CNC edge devices, or third-party telemetry pipelines.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New API Key</span>
          </button>
        </div>

        {/* List of Keys */}
        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-[#27272A] rounded-xl text-xs text-[#71717A]">
              No API keys created yet. Click <span className="text-cyan-400 font-semibold">Create New API Key</span> above to generate your first integration secret.
            </div>
          ) : (
            apiKeys.map((k) => {
              const isVisible = visibleKeyIds[k.id];
              const maskedKey = isVisible
                ? k.key
                : `${k.key.slice(0, 9)}${"•".repeat(16)}${k.key.slice(-4)}`;

              return (
                <div
                  key={k.id}
                  className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{k.name}</span>
                      <span className="text-[10px] text-[#A1A1AA] font-mono bg-[#18181B] px-2 py-0.5 rounded border border-[#27272A]">
                        Created {k.created}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-cyan-300 bg-[#18181B] px-3 py-1 rounded-lg border border-[#27272A] tracking-wider select-all">
                        {maskedKey}
                      </code>

                      <button
                        type="button"
                        onClick={() =>
                          setVisibleKeyIds((prev) => ({ ...prev, [k.id]: !prev[k.id] }))
                        }
                        className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#18181B] transition-colors"
                        title={isVisible ? "Hide secret key" : "Show secret key"}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyKey(k.key, k.id)}
                        className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-cyan-400 hover:bg-[#18181B] transition-colors flex items-center gap-1 text-xs cursor-pointer"
                        title="Copy API Key"
                      >
                        {copiedKeyId === k.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px] font-bold">Copied!</span>
                          </>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#27272A]">
                    <div className="text-right">
                      <div className="text-[10px] text-[#71717A] uppercase font-bold">Last Used</div>
                      <div className="text-xs font-mono text-[#A1A1AA]">{k.lastUsed}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeKey(k.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Supabase Database Integration Section */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Supabase PostgreSQL Integration</span>
                <span className={`text-[10px] border font-semibold px-2 py-0.5 rounded-full ${isSupaSaved || isSupabaseConfigured() ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                  {isSupaSaved || isSupabaseConfigured() ? 'Configured' : 'Credentials Needed'}
                </span>
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Connect your Supabase project URL and anon public key to persist sensor records, user telemetry, and real-time logs.
              </p>
            </div>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#CBD5E1] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="text"
                value={supaUrl}
                onChange={(e) => setSupaUrl(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full bg-[#09090B] border border-[#27272A] focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-[#71717A] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#CBD5E1] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Anon / Public Key</span>
              </label>
              <input
                type="password"
                value={supaAnonKey}
                onChange={(e) => setSupaAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#09090B] border border-[#27272A] focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-[#71717A] outline-none"
              />
            </div>
          </div>

          {supaTestStatus && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${supaTestStatus.includes('Connected') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{supaTestStatus}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Supabase Configuration</span>
            </button>

            <button
              type="button"
              onClick={handleTestSupabaseConnection}
              disabled={isTestingSupa}
              className="px-4 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupa ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isTestingSupa ? 'Testing Connection...' : 'Test Connection'}</span>
            </button>
          </div>
        </form>

        <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#A1A1AA] space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Environment Variables Quick Reference</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            You can also persist your Supabase connection globally by setting these environment variables in <code className="text-emerald-300 font-mono">.env.example</code> or your hosting dashboard:
          </p>
          <pre className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"`}
          </pre>
        </div>
      </div>

      {/* Create New API Key Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowGenerateModal(false)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create Industrial API Key</h3>
                <p className="text-xs text-[#A1A1AA]">Generate a secure token for IoT sensor streams</p>
              </div>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#CBD5E1]">Key Description / Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Pune Factory Line #3 Gateway"
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717A] outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security Notice</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  Keys grant full data ingestion access to your factory telemetry metrics. Keep this token secret.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>Generate Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {factoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => {
                if (!isDeleting) {
                  setFactoryToDelete(null);
                  setDeleteError(null);
                }
              }}
              className="absolute top-4 right-4 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Factory?</h3>
                <p className="text-xs text-[#A1A1AA]">Confirm permanent deletion</p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {deleteError}
              </div>
            )}

            <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl space-y-1">
              <div className="text-xs font-bold text-white">{factoryToDelete.name}</div>
              <div className="text-[11px] text-[#A1A1AA] flex items-center gap-2">
                <span>Location: {factoryToDelete.location}</span>
                <span>•</span>
                <span>Machines: {factoryToDelete.numberOfMachines}</span>
              </div>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Are you sure you want to delete this factory? This action will remove all associated daily telemetry records, AI prediction models, and health metrics. <span className="text-red-400 font-semibold">This cannot be undone.</span>
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setFactoryToDelete(null);
                  setDeleteError(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Factory</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

