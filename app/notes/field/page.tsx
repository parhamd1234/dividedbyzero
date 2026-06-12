import type { Metadata } from "next";
import CategoryListing from "../../_components/CategoryListing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Field — Field Notes — Divided by Zero",
  description: "Posts about the medium and its mechanics.",
};

export default function FieldPage() {
  return <CategoryListing category="field" />;
}
