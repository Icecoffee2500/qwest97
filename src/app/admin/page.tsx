import { getItems } from "@/lib/data";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const items = await getItems();
  return <AdminDashboard items={items} />;
}
