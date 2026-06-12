import type { Metadata } from "next";
import CategoryListing from "../../_components/CategoryListing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Signal — Field Notes — Divided by Zero",
  description: "Posts about the carrier wave beneath the noise.",
};

export default function SignalPage() {
  return <CategoryListing category="signal" />;
}
