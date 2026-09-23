import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useAI } from "../../context/AIContext";

function ChatInput() {
  const [text, setText] = useState("");

  const { sendMessage } = useAI();

  const handleSend = async () => {
    if (!text.trim()) return;

    const message = text;

    setText("");

    await sendMessage(message);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

      <div className="flex gap-4">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask Kortex AI anything..."
          className="flex-1 rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-2xl px-6"
        >
          <SendHorizonal size={22} />
        </button>

      </div>

    </div>
  );
}

export default ChatInput;