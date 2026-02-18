"use client";

import { useState, useRef, useTransition } from "react";
import dynamic from "next/dynamic";
import { uploadImageAction } from "@/app/admin/actions";

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-20 bg-neutral-50" />,
});

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
  const [dragging, setDragging] = useState(false);
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

  function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) return;

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
  }

  function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadFile(file);
    };
    input.click();
  }

  function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) uploadFile(file);
        return;
      }
    }
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
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onPaste={handlePaste}
            rows={16}
            className={`w-full px-3 py-2.5 text-sm border outline-none transition-colors bg-white resize-y font-mono leading-relaxed ${
              dragging
                ? "border-black bg-neutral-50"
                : "border-neutral-200 focus:border-black"
            }`}
            placeholder="Markdown과 LaTeX를 사용할 수 있습니다.&#10;&#10;예시:&#10;## 제목&#10;**볼드**, *이탤릭*&#10;$E = mc^2$ (인라인 수식)&#10;$$\sum_{i=1}^{n} x_i$$ (블록 수식)&#10;&#10;이미지: 드래그 앤 드롭 또는 붙여넣기"
          />
          {dragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 border border-dashed border-black pointer-events-none">
              <span className="text-xs tracking-wider uppercase text-neutral-500">
                이미지를 놓으세요
              </span>
            </div>
          )}
        </div>
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
