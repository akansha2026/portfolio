import { getAllStats } from "@/lib/stats";
export const revalidate = 3600;
export async function GET() {
  return Response.json(await getAllStats());
}
