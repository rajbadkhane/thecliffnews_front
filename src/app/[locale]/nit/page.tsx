import { Metadata } from "next";
import NITClient from "./nit-client";

export const metadata: Metadata = {
  title: "Notice Inviting Tenders (NIT) | The Cliff News",
  description:
    "Browse Notice Inviting Tenders (NIT) - official tender notices and procurement announcements from The Cliff News. Stay updated with government and corporate tenders.",
  openGraph: {
    title: "Notice Inviting Tenders (NIT) - Official Tenders | The Cliff News",
    description:
      "Browse Notice Inviting Tenders (NIT) - official tender notices and procurement announcements from The Cliff News. Stay updated with government and corporate tenders.",
    type: "website",
  },
};

export default function NITPage() {
  return <NITClient />;
}