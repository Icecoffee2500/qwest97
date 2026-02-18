import { getItems } from "@/lib/data";
import { items as fallbackItems } from "@/data/items";
import Portfolio from "@/components/Portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbItems = await getItems();
  const items = dbItems.length > 0 ? dbItems : fallbackItems;
  return <Portfolio items={items} />;
}
