import { Sparkles, User } from "lucide-react";
import ProductRecommendation from "@/components/ProductRecommendation";

export default function ChatMessage({ message, onSelectPrompt, onProductAction }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-black text-white">
          <Sparkles size={14} className="text-white" />
        </div>
      )}

      <div className={`flex max-w-[85%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Text bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-black text-white"
              : "border border-border bg-secondary/60 text-foreground"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Embedded real product recommendations */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="mt-3 w-full">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {message.products.map((product) => (
                <ProductRecommendation
                  key={product.id}
                  product={product}
                  onAction={onProductAction}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested next queries */}
        {!isUser && message.suggestedQueries && message.suggestedQueries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.suggestedQueries.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                className="border border-border bg-background px-2.5 py-1 text-[11px] font-500 text-muted-foreground transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <span className="mt-1 text-[10px] text-muted-foreground/60">
          {message.timestamp || "Just now"}
        </span>
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-muted text-muted-foreground">
          <User size={14} />
        </div>
      )}
    </div>
  );
}
