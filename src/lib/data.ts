import { createClient } from "./supabase";
import type { Item } from "@/data/items";

export async function getItems(): Promise<Item[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("year", { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data as Item[]) || [];
  } catch {
    return [];
  }
}
