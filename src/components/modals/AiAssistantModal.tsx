import React, { useState, useEffect, useRef } from "react";
import { Factory, ChatMessage } from "../../types";
import { sendAiChat } from "../../lib/api";
import { X, Sparkles, Send, Bot, User, HelpCircle, ArrowRight } from "lucide-react";
import { useGuide } from "../../context/GuideContext";
import { EXPLANATIONS } from "../../data/explanations";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  factory: Factory;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  factory,
}) => {
  const { openExplanation } = useGuide();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome-1",
          sender: "ai",
          text: `### **FactoryPilot AI — Smart Factory Co-Pilot**\n\nHello! I am monitoring **${factory.name}** (${factory.location}). I have full access to your electricity kWh, water liters, machine utilization %, and cost telemetry.\n\n**Ask me anything** or choose a suggested prompt below!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: "local-ml",
        },
      ]);
    }
  }, [isOpen, factory, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendPrompt = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput("");
    setIsLoading(true);

    try {
      const res = await sendAiChat(textToSend, factory.id, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: res.source as any,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "⚠️ Unable to reach the FactoryPilot AI engine. Please verify your connection or try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    "Why is electricity increasing?",
    "How can I reduce operating costs?",
    "Show this month's production trend",
    "Which machine consumes the most power?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-[#FAFAFA] flex flex-col h-[640px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#09090B] border-b border-[#27272A] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#3B82F6]">
                  AI Co-Pilot Assistant
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {factory.name} — Interactive Telemetry Chat
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openExplanation(EXPLANATIONS.aiAssistantChat)}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
              title="What is this chatbot?"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="px-6 py-2.5 bg-[#09090B]/60 border-b border-[#27272A] flex flex-wrap items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-semibold text-[#A1A1AA]">Try asking:</span>
          {presetQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(q)}
              className="px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] hover:border-[#3B82F6]/40 text-[11px] font-medium text-white transition-all flex items-center gap-1 shadow-sm"
            >
              <span>{q}</span>
              <ArrowRight className="w-3 h-3 text-[#3B82F6]" />
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? "bg-white text-black"
                      : "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#27272A] text-white rounded-tr-sm"
                      : "bg-[#09090B] border border-[#27272A] text-[#E4E4E7] rounded-tl-sm shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text.split("\n").map((line, idx) => (
                      <p key={idx} className={line.startsWith("###") ? "font-bold text-white text-sm my-1" : "my-0.5"}>
                        {line.replace(/^###\s*/, "")}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-[#71717A]">
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.source && (
                      <span className="font-mono text-[#3B82F6] uppercase">
                        {msg.source === "gemini" ? "Gemini 2.5 AI" : "FactoryPilot ML Engine"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#A1A1AA] animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl">
                Analyzing factory operational telemetry...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-[#09090B] border-t border-[#27272A] flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask FactoryPilot AI about ${factory.name}...`}
              className="flex-1 bg-[#18181B] border border-[#27272A] focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563eb] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
