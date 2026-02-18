"use client";

import { useState, useRef, useTransition } from "react";
import { uploadImageAction } from "@/app/admin/actions";
import MarkdownRenderer from "./MarkdownRenderer";

interface MarkdownEditorProps {
  name: string;
  defaultValue: string;
}

export default function MarkdownEditor({
  name,
  defaultValue,
}: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [, startTransition] = useTransition();

  function insertAtCursor(before: string, after: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const placeholder = selected || "";
    const newValue =
      value.substring(0, start) + before + placeholder + after + value.substring(end);
    setValue(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      if (selected) {
        const pos = start + before.length + selected.length + after.length;
        textarea.setSelectionRange(pos, pos);
      } else {
        const pos = start + before.length;
        textarea.setSelectionRange(pos, pos);
      }
    });
  }

  async function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploading(true);
      const fd = new FormData();
      fd.set("file", file);

      startTransition(async () => {
        const result = await uploadImageAction(fd);
        setUploading(false);
        if (result.success && result.url) {
          const textarea = textareaRef.current;
          const pos = textarea ? textarea.selectionStart : value.length;
          const img = `\n![${file.name}](${result.url})\n`;
          setValue((v) => v.substring(0, pos) + img + v.substring(pos));
        }
      });
    };
    input.click();
  }

  const tools = [
    { label: "B", action: () => insertAtCursor("**", "**"), title: "Bold" },
    { label: "I", action: () => insertAtCursor("*", "*"), title: "Italic" },
    { label: "H", action: () => insertAtCursor("\n## ", "\n"), title: "Heading" },
    { label: "—", action: () => insertAtCursor("\n---\n"), title: "구분선" },
    { label: "$", action: () => insertAtCursor("$", "$"), title: "Inline LaTeX" },
    { label: "$$", action: () => insertAtCursor("\n$$\n", "\n$$\n"), title: "Block LaTeX" },
    { label: "IMG", action: handleImageUpload, title: "이미지 업로드" },
  ];

  return (
    <div>
      <input type="hidden" name={name} value={value} />

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border border-neutral-200 border-b-0 px-1.5 py-1">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            onClick={tool.action}
            disabled={uploading}
            className="px-2 py-1 text-[10px] tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors uppercase disabled:opacity-40"
            title={tool.title}
          >
            {tool.label}
          </button>
        ))}

        {uploading && (
          <span className="text-[10px] text-neutral-400 animate-pulse ml-2">
            업로드 중...
          </span>
        )}

        <div className="flex-1" />

        <div className="flex text-[10px] tracking-wider uppercase">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`px-2 py-1 transition-colors ${
              mode === "write"
                ? "text-black"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-2 py-1 transition-colors ${
              mode === "preview"
                ? "text-black"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={16}
          className="w-full px-3 py-2.5 text-sm border border-neutral-200 outline-none focus:border-black transition-colors bg-white resize-y font-mono leading-relaxed"
          placeholder="Markdown과 LaTeX를 사용할 수 있습니다.&#10;&#10;예시:&#10;## 제목&#10;**볼드**, *이탤릭*&#10;$E = mc^2$ (인라인 수식)&#10;$$\sum_{i=1}^{n} x_i$$ (블록 수식)"
        />
      ) : (
        <div className="border border-neutral-200 p-5 min-h-[300px] overflow-y-auto bg-white">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-sm text-neutral-300">
              미리보기할 내용이 없습니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
