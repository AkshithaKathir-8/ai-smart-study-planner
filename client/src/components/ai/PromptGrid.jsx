import PromptCard from "./PromptCard";
import aiPrompts from "../../data/aiPrompts";
import { useAI } from "../../context/AIContext";

function PromptGrid() {

  const { addMessage } = useAI();

  const handlePrompt = (prompt) => {

    addMessage({
      id: Date.now(),
      sender: "user",
      text: prompt,
    });

  };

  return (

    <div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">

        ✨ Suggested Actions

      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {aiPrompts.map((item) => (

          <PromptCard
            key={item.id}
            emoji={item.emoji}
            title={item.title}
            description={item.description}
            onClick={() => handlePrompt(item.prompt)}
          />

        ))}

      </div>

    </div>

  );

}

export default PromptGrid;