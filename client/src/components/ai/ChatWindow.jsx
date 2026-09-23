import { useEffect, useRef } from "react";

import { useAI } from "../../context/AIContext";

import MessageBubble from "./MessageBubble";

import TypingIndicator from "./TypingIndicator";

function ChatWindow() {

  const { messages, isTyping } = useAI();

  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior:"smooth"

    });

  },[messages,isTyping]);

  return (

    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 h-[520px] overflow-y-auto">

      <h2 className="text-xl font-bold mb-8">

        Conversation

      </h2>

      <div className="space-y-6">

        {messages.map((message)=>(

          <MessageBubble

            key={message.id}

            sender={message.sender}

            text={message.text}

          />

        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />

      </div>

    </div>

  );

}

export default ChatWindow;