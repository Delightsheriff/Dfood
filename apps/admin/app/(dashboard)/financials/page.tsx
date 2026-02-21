import { redirect } from "next/navigation";

/**
 * Financials page has been consolidated into Analytics.
 * Redirect any bookmarks / deep-links.
 */
export default function FinancialsPage() {
  redirect("/analytics");
}
