import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다", url: null },
        { status: 401 }
      );
    }

    const valid = await verifySession(session.value);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "세션이 만료되었습니다", url: null },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "파일이 선택되지 않았습니다", url: null },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "파일 크기는 4MB 이하여야 합니다", url: null },
        { status: 400 }
      );
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

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, url: null },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    return NextResponse.json({ success: true, url: data.publicUrl, error: null });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "업로드에 실패했습니다";
    return NextResponse.json(
      { success: false, error: message, url: null },
      { status: 500 }
    );
  }
}
