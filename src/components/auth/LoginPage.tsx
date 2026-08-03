import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Cpu,
  Activity,
  Zap,
  Radio,
  CheckCircle2,
  Server,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Gauge,
  Wifi,
  Sparkles,
  Layers,
  ChevronRight,
  User as UserIcon,
  Building,
  Briefcase,
} from "lucide-react";
import { User } from "../../types";
import {
  loginUser,
  registerUser,
  requestForgotPassword,
  verifyResetToken,
  resetPassword,
} from "../../lib/api";

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<User["role"]>("Factory Owner");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);

  // Reset Password from URL token state
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [manualResetToken, setManualResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetVerifying, setResetVerifying] = useState(false);

  // Live telemetry ticker for background holographic widgets
  const [vibrationVal, setVibrationVal] = useState(0.014);
  const [tempVal, setTempVal] = useState(41.8);
  const [powerVal, setPowerVal] = useState(247.2);

  useEffect(() => {
    // Check if URL has a resetToken parameter
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("resetToken");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setAuthMode("reset");
      setResetVerifying(true);
      verifyResetToken(tokenFromUrl).then((res) => {
        setResetVerifying(false);
        if (res.success && res.email) {
          setResetEmail(res.email);
        } else {
          setErrorMessage(res.message || "Invalid or expired password reset token.");
        }
      });
    }

    const interval = setInterval(() => {
      setVibrationVal(+(0.012 + Math.random() * 0.006).toFixed(3));
      setTempVal(+(41.5 + Math.random() * 0.8).toFixed(1));
      setPowerVal(+(245.0 + Math.random() * 5.0).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(cleanEmail, cleanPassword);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMessage(res.message || "Authentication failed. Please check your credentials.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("factorypilot_user", JSON.stringify(res.user));
      }

      onLoginSuccess(res.user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || "An error occurred during authentication.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setErrorMessage("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser(
        cleanEmail,
        cleanPassword,
        cleanName,
        role,
        companyName.trim() || "Smart Industrial Corp"
      );
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMessage(res.message || "Registration failed. Please try again.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("factorypilot_user", JSON.stringify(res.user));
      }

      onLoginSuccess(res.user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || "An error occurred during account creation.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotMsg("");
    setGeneratedResetToken(null);
    const cleanEmail = forgotEmail.trim();

    if (!cleanEmail) {
      setForgotError("Please enter your corporate email.");
      return;
    }

    setForgotLoading(true);

    const res = await requestForgotPassword(cleanEmail);
    setForgotLoading(false);

    if (res.success) {
      setForgotSent(true);
      setForgotMsg(res.message);
      if (res.resetToken) {
        setGeneratedResetToken(res.resetToken);
      }
    } else {
      setForgotError(res.message);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const tokenToUse = resetToken || manualResetToken.trim();

    if (!tokenToUse) {
      setErrorMessage("Please enter or provide a valid industrial reset key / token.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(tokenToUse, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage("Industrial key and password updated successfully. You can now log in.");
      // Clean up reset token from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("resetToken");
      window.history.replaceState({}, document.title, url.toString());
      setAuthMode("login");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken(null);
      setManualResetToken("");
    } else {
      setErrorMessage(res.message || "Failed to update password. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050811] text-[#FAFAFA] flex items-center justify-center overflow-hidden font-sans select-none">
      {/* =========================================================================
          BACKGROUND: CYBERNETIC DIGITAL TWIN FACTORY SCENE & METRICS
         ========================================================================= */}
      {/* Grid Pattern Mesh */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Futuristic Gradient Atmospheric Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Animated Glowing Cyber Scanlines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-pulse duration-1000" />

      {/* FLOATING HOLOGRAPHIC TELEMETRY CHIPS (Desktop Visual Depth) */}
      <div className="hidden lg:block absolute left-8 top-12 max-w-xs z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#0B132B]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                Digital Twin Node #01
              </span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono">
              ONLINE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#121E36] p-2 rounded-lg border border-cyan-500/10">
              <span className="text-[#94A3B8] block text-[10px]">Axis Vibration</span>
              <span className="font-mono text-emerald-400 font-semibold">{vibrationVal} mm/s</span>
            </div>
            <div className="bg-[#121E36] p-2 rounded-lg border border-cyan-500/10">
              <span className="text-[#94A3B8] block text-[10px]">Bearing Temp</span>
              <span className="font-mono text-cyan-300 font-semibold">{tempVal} °C</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1">
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3 h-3 text-amber-400" /> {powerVal} kW
            </span>
            <span className="font-mono text-emerald-400">Efficiency: 98.6%</span>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block absolute right-8 top-16 max-w-xs z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[#0B132B]/80 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                Gemini AI Telemetry Core
              </span>
            </div>
            <span className="text-blue-300 font-mono text-[10px]">v2.5 Pro</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Predictive Accuracy:</span>
              <span className="font-mono text-blue-300 font-bold">99.4%</span>
            </div>
            <div className="w-full bg-[#121E36] rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[99.4%]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] bg-[#121E36] p-2 rounded-lg border border-blue-500/20">
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 0 Failure Risk Detected
            </span>
            <span className="text-[#94A3B8] font-mono">24h Scan</span>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block absolute left-12 bottom-12 max-w-xs z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-[#0B132B]/70 backdrop-blur-md border border-emerald-500/20 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs text-[#94A3B8]"
        >
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/30">
            <Wifi className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-white text-[11px]">Cyber-Secure Gateway Active</div>
            <div className="font-mono text-[10px] text-emerald-400">TLS 1.3 • AES-256 Cloud SQL Link</div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          CENTERED GLASSMORPHISM LOGIN CARD
         ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md mx-4"
      >
        {/* Glowing Border Halo */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />

        <div className="relative bg-[#0A1021]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6">
          {/* PLATFORM HEADER & BRANDING */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-1">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                AI Industrial Monitoring
              </span>
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium max-w-xs mx-auto">
              FactoryPilot AI • Smart Factory & Predictive Maintenance Platform
            </p>
          </div>

          {/* MODE TOGGLE TABS */}
          {authMode !== "reset" && (
            <div className="flex bg-[#111A30] p-1 rounded-xl border border-[#1E293B]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === "login"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === "register"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* SUCCESS BANNER */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* ERROR BANNER */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* RESET PASSWORD MODE */}
          {authMode === "reset" ? (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-white text-sm">Reset Your Password</h3>
                {resetEmail && <p className="text-xs text-cyan-400 font-mono">Account: {resetEmail}</p>}
                <p className="text-xs text-[#94A3B8]">Enter your new password below</p>
              </div>

              {resetVerifying ? (
                <div className="p-4 text-center text-xs text-cyan-400 flex items-center justify-center gap-2 font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying reset token...
                </div>
              ) : (
                <>
                  {!resetToken && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#CBD5E1]">Industrial Reset Key / Token</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={manualResetToken}
                          onChange={(e) => setManualResetToken(e.target.value)}
                          placeholder="Paste 64-character reset token"
                          className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all font-mono"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#CBD5E1]">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#CBD5E1]">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 p-[1px] font-semibold text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all duration-300 disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    <div className="relative w-full bg-[#0B132B]/90 hover:bg-transparent transition-all duration-300 py-3 rounded-[11px] flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider">
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Update Password & Proceed</span>
                          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setErrorMessage("");
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            /* LOGIN / REGISTER FORM */
            <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#CBD5E1]">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#CBD5E1]">Corporate Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#CBD5E1]">Password</label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordOpen(true);
                        setForgotError("");
                        setForgotMsg("");
                        setForgotSent(false);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === "register" ? "Minimum 6 characters" : "••••••••••••"}
                    className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#CBD5E1]">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Precision Manufacturing"
                        className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#CBD5E1]">Industrial Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as User["role"])}
                        className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Factory Owner" className="bg-[#111A30] text-white">Factory Owner</option>
                        <option value="Factory Manager" className="bg-[#111A30] text-white">Factory Manager</option>
                        <option value="Plant Operations Director" className="bg-[#111A30] text-white">Plant Operations Director</option>
                        <option value="Maintenance Engineer" className="bg-[#111A30] text-white">Maintenance Engineer</option>
                        <option value="Sustainability Manager" className="bg-[#111A30] text-white">Sustainability Manager</option>
                        <option value="Administrator" className="bg-[#111A30] text-white">Administrator</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#94A3B8] hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E293B] bg-[#111A30] text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Keep session active (Remember Me)</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 p-[1px] font-semibold text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all duration-300 disabled:opacity-50 mt-2 cursor-pointer"
              >
                <div className="relative w-full bg-[#0B132B]/90 hover:bg-transparent transition-all duration-300 py-3 rounded-[11px] flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>{authMode === "login" ? "Authenticating..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === "login" ? "Sign In & Access Dashboard" : "Register & Launch Dashboard"}</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          )}

          {/* TOGGLE LINK */}
          {authMode !== "reset" && (
            <div className="text-center pt-2">
              {authMode === "login" ? (
                <p className="text-xs text-[#94A3B8]">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline underline-offset-2 cursor-pointer"
                  >
                    Sign up here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[#94A3B8]">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline underline-offset-2 cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          )}

          {/* FOOTER & SECURITY COMPLIANCE */}
          <div className="pt-2 text-center text-[10px] text-[#64748B] space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 1.3 Encrypted • ISO 27001 & SOC 2 Compliant</span>
            </div>
            <div>© 2026 FactoryPilot AI Inc. All Industrial Rights Reserved.</div>
          </div>
        </div>
      </motion.div>

      {/* =========================================================================
          FORGOT PASSWORD MODAL
         ========================================================================= */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A1021] border border-cyan-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center gap-3 border-b border-[#1E293B] pb-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Industrial Key Reset</h3>
                  <p className="text-xs text-[#94A3B8]">Request an encrypted reset link</p>
                </div>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 mx-auto" />
                  <div className="font-semibold text-white text-sm">Industrial Reset Key Generated!</div>
                  <p className="text-[11px] text-[#94A3B8]">
                    {forgotMsg || "Check your email inbox or click below to proceed directly."}
                  </p>

                  {generatedResetToken && (
                    <button
                      type="button"
                      onClick={() => {
                        const tokenToUse = generatedResetToken;
                        setIsForgotPasswordOpen(false);
                        setForgotSent(false);
                        setForgotEmail("");
                        setResetToken(tokenToUse);
                        setAuthMode("reset");
                        setResetVerifying(true);
                        verifyResetToken(tokenToUse).then((res) => {
                          setResetVerifying(false);
                          if (res.success && res.email) {
                            setResetEmail(res.email);
                          } else {
                            setErrorMessage(res.message || "Invalid or expired password reset token.");
                          }
                        });
                        const url = new URL(window.location.href);
                        url.searchParams.set("resetToken", tokenToUse);
                        window.history.replaceState({}, document.title, url.toString());
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 font-semibold text-white text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Proceed to Set New Password</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(false);
                      setForgotSent(false);
                      setForgotEmail("");
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#111A30] text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CBD5E1]">Corporate Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-[#111A30] border border-[#1E293B] focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#111A30] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:brightness-110 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Reset Token</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
