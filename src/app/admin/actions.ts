"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase";
import { createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, error: "ADMIN_PASSWORD 환경변수가 설정되지 않았습니다" };
  }

  if (password !== adminPassword) {
    return { success: false, error: "비밀번호가 올바르지 않습니다" };
  }

  const token = await createSession();
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function createItemAction(formData: FormData) {
  const supabase = createClient();

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const linksRaw = formData.get("links") as string;
  const links = linksRaw ? JSON.parse(linksRaw) : [];

  const yearRaw = formData.get("year") as string;

  const { error } = await supabase.from("items").insert({
    category: formData.get("category") as string,
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || null,
    description: formData.get("description") as string,
    tags,
    links,
    year: yearRaw ? parseInt(yearRaw) : null,
    publication: (formData.get("publication") as string) || null,
    collaborator: (formData.get("collaborator") as string) || null,
    thumbnail: (formData.get("thumbnail") as string) || null,
    period_start: (formData.get("period_start") as string) || null,
    period_end: (formData.get("period_end") as string) || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateItemAction(id: string, formData: FormData) {
  const supabase = createClient();

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const linksRaw = formData.get("links") as string;
  const links = linksRaw ? JSON.parse(linksRaw) : [];

  const yearRaw = formData.get("year") as string;

  const { error } = await supabase
    .from("items")
    .update({
      category: formData.get("category") as string,
      title: formData.get("title") as string,
      subtitle: (formData.get("subtitle") as string) || null,
      description: formData.get("description") as string,
      tags,
      links,
      year: yearRaw ? parseInt(yearRaw) : null,
      publication: (formData.get("publication") as string) || null,
      collaborator: (formData.get("collaborator") as string) || null,
      thumbnail: (formData.get("thumbnail") as string) || null,
      period_start: (formData.get("period_start") as string) || null,
      period_end: (formData.get("period_end") as string) || null,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteItemAction(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file");
    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false as const, error: "파일이 선택되지 않았습니다", url: null };
    }

    if (file.size > 4 * 1024 * 1024) {
      return { success: false as const, error: "파일 크기는 4MB 이하여야 합니다", url: null };
    }

    const supabase = createClient();
    const ext = file.name?.split(".").pop() || "png";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error } = await supabase.storage
      .from("images")
      .upload(filename, buffer, {
        contentType: file.type || "image/png",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    return { success: true as const, url: data.publicUrl, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "업로드에 실패했습니다";
    return { success: false as const, error: message, url: null };
  }
}
