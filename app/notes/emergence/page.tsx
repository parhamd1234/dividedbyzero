import type { Metadata } from "next";
import CategoryListing from "../../_components/CategoryListing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Emergence — Field Notes — Divided by Zero",
  description: "Posts about structure becoming behavior.",
};

export default function EmergencePage() {
  return <CategoryListing category="emergence" />;
}
