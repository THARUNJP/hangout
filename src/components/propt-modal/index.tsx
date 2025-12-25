import { X } from "lucide-react";
import { useState } from "react";

type NamePromptModalProps = {
  open: boolean;
  onContinue: (name: string) => void;
  onClose: () => void;
};

export default function NamePromptModal({
  open,
  onContinue,
  onClose,
}: NamePromptModalProps) {
  const [name, setName] = useState("");

  if (!open) return null;

  const handleContinue = () => {
    if (!name.trim()) return;
    onContinue(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={29} />
        </button>

        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Enter your name
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleContinue}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
