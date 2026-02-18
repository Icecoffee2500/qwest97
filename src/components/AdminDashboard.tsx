"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/data/items";
import { publications } from "@/data/items";
import {
  createItemAction,
  updateItemAction,
  deleteItemAction,
  logoutAction,
} from "@/app/admin/actions";
import MarkdownEditor from "./MarkdownEditor";

interface Props {
  items: Item[];
}

export default function AdminDashboard({ items }: Props) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate() {
    setEditingItem(null);
    setView("form");
  }

  function handleEdit(item: Item) {
    setEditingItem(item);
    setView("form");
  }

  function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    startTransition(async () => {
      await deleteItemAction(id);
      router.refresh();
    });
  }

  function handleFormSubmit(formData: FormData) {
    startTransition(async () => {
      if (editingItem) {
        await updateItemAction(editingItem.id, formData);
      } else {
        await createItemAction(formData);
      }
      router.refresh();
      setView("list");
      setEditingItem(null);
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      router.push("/admin/login");
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view === "form" && (
              <button
                onClick={() => {
                  setView("list");
                  setEditingItem(null);
                }}
                className="text-[10px] text-neutral-400 hover:text-black transition-colors tracking-wider uppercase"
              >
                ←
              </button>
            )}
            <a
              href="/"
              className="text-[10px] text-neutral-400 hover:text-black transition-colors tracking-wider uppercase"
            >
              Site ↗
            </a>
            <span className="text-xs font-medium tracking-[0.25em] uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            {view === "list" && (
              <button
                onClick={handleCreate}
                className="text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors"
              >
                + New
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {isPending && (
          <div className="mb-4 text-[10px] text-neutral-400 tracking-wider uppercase animate-pulse">
            처리 중...
          </div>
        )}

        {view === "list" ? (
          <ItemList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ItemForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setView("list");
              setEditingItem(null);
            }}
            isPending={isPending}
          />
        )}
      </main>
    </div>
  );
}

function ItemList({
  items,
  onEdit,
  onDelete,
}: {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-400">
          아직 작성된 글이 없습니다
        </p>
        <p className="text-xs text-neutral-300 mt-2">
          상단의 + New 버튼으로 첫 글을 작성해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-4 group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 bg-neutral-100 text-neutral-500">
                {item.category}
              </span>
              {item.year && (
                <span className="text-[10px] text-neutral-300">
                  {item.year}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-neutral-900 truncate">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                {item.subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-[10px] tracking-wider uppercase text-red-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemForm({
  item,
  onSubmit,
  onCancel,
  isPending,
}: {
  item: Item | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [links, setLinks] = useState<{ label: string; url: string }[]>(
    item?.links || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    item?.category || "research"
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnail || "");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  async function handleThumbnailUpload(file: File) {
    if (!file.type.startsWith("image/")) return;
    setThumbnailUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const result = await res.json();
      if (result.success && result.url) {
        setThumbnailUrl(result.url);
      }
    } finally {
      setThumbnailUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("links", JSON.stringify(links));
    formData.set("thumbnail", thumbnailUrl);
    onSubmit(formData);
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: "label" | "url", value: string) {
    setLinks((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-neutral-200 outline-none focus:border-black transition-colors bg-white";
  const labelClass =
    "text-[10px] tracking-wider uppercase text-neutral-500 mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h2 className="text-sm font-medium tracking-wider uppercase mb-8">
        {item ? "Edit" : "New Item"}
      </h2>

      <div>
        <label className={labelClass}>Category *</label>
        <select
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={inputClass}
          required
        >
          <option value="research">Research</option>
          <option value="paper_review">Paper Review</option>
          <option value="project">Project</option>
          <option value="about">About</option>
        </select>
      </div>

      {(selectedCategory === "paper_review" || selectedCategory === "research") && (
        <div>
          <label className={labelClass}>Publication</label>
          <select
            name="publication"
            defaultValue={item?.publication || ""}
            className={inputClass}
          >
            <option value="">선택하세요</option>
            {publications.map((pub) => (
              <option key={pub} value={pub}>
                {pub}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCategory === "research" && (
        <div>
          <label className={labelClass}>Published Year</label>
          <input
            name="year"
            type="number"
            defaultValue={item?.year || ""}
            className={inputClass}
            placeholder="2025"
          />
        </div>
      )}

      {selectedCategory === "paper_review" && (
        <div>
          <label className={labelClass}>Domain</label>
          <input
            name="domain"
            defaultValue={item?.domain || ""}
            className={inputClass}
            placeholder="예: Scene Graph Generation, Object Detection 등"
          />
        </div>
      )}

      {selectedCategory === "project" && (
        <>
          <div>
            <label className={labelClass}>협력기관</label>
            <input
              name="collaborator"
              defaultValue={item?.collaborator || ""}
              className={inputClass}
              placeholder="예: 삼성전자, KAIST, Google 등"
            />
          </div>

          <div>
            <label className={labelClass}>썸네일 (협력기관 로고 등)</label>
            <div className="flex items-center gap-4">
              {thumbnailUrl && (
                <div className="relative w-16 h-16 rounded-lg border border-neutral-200 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl}
                    alt="thumbnail"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="absolute top-0 right-0 w-4 h-4 bg-black/60 text-white text-[8px] flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
              <label className="cursor-pointer text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors py-2">
                {thumbnailUploading ? (
                  <span className="animate-pulse">업로드 중...</span>
                ) : (
                  "+ Upload"
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailUpload(file);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>참여 시작</label>
              <input
                name="period_start"
                type="month"
                defaultValue={item?.period_start || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>참여 종료</label>
              <input
                name="period_end"
                type="month"
                defaultValue={item?.period_end || ""}
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          defaultValue={item?.title || ""}
          className={inputClass}
          required
        />
      </div>

      {selectedCategory !== "project" && selectedCategory !== "research" && (
        <div>
          <label className={labelClass}>Subtitle</label>
          <input
            name="subtitle"
            defaultValue={item?.subtitle || ""}
            className={inputClass}
            placeholder="학회명, 프로젝트 유형 등"
          />
        </div>
      )}

      {selectedCategory !== "project" && selectedCategory !== "research" && (
        <div>
          <label className={labelClass}>Year</label>
          <input
            name="year"
            type="number"
            defaultValue={item?.year || ""}
            className={inputClass}
            placeholder="2025"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Description *</label>
        <MarkdownEditor
          name="description"
          defaultValue={item?.description || ""}
        />
      </div>

      <div>
        <label className={labelClass}>Tags (쉼표로 구분)</label>
        <input
          name="tags"
          defaultValue={item?.tags?.join(", ") || ""}
          className={inputClass}
          placeholder="Machine Learning, NLP, Transformer"
        />
      </div>

      <div>
        <label className={labelClass}>Links</label>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="Label (Paper, Code 등)"
                className={`${inputClass} flex-1`}
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://..."
                className={`${inputClass} flex-[2]`}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="px-3 text-neutral-300 hover:text-red-400 transition-colors text-sm"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors py-2"
          >
            + Add Link
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-neutral-100">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-[10px] tracking-wider uppercase bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {isPending ? "저장 중..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
