"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function Chat() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport,
  });

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const renderedMessages = useMemo(() => {
    return messages.map((m) => {
      const text = m.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");

      return { id: m.id, role: m.role, text };
    });
  }, [messages]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold">Chat (Gemini + Vercel AI SDK)</h1>
        <p className="text-sm text-gray-600">
          Configura{" "}
          <code className="rounded bg-gray-100 px-1">
            GOOGLE_GENERATIVE_AI_API_KEY
          </code>{" "}
          en tu <code className="rounded bg-gray-100 px-1">.env.local</code>.
        </p>
      </div>

      <div className="min-h-[320px] rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-3">
          {renderedMessages.length === 0 ? (
            <p className="text-sm text-gray-500">
              Escribe un mensaje para empezar.
            </p>
          ) : null}

          {renderedMessages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <span className="font-semibold">
                {m.role === "user" ? "Tú" : "AI"}:
              </span>{" "}
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (input.trim().length === 0 || isLoading) return;
          clearError();
          const text = input;
          setInput("");
          await sendMessage({ text });
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          className="rounded-md border bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Enviando…" : "Enviar"}
        </button>
      </form>

      {isLoading ? (
        <button
          type="button"
          onClick={() => stop()}
          className="self-start rounded-md border px-3 py-1 text-sm"
        >
          Detener
        </button>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error.message}
        </div>
      ) : null}
    </div>
  );
}
