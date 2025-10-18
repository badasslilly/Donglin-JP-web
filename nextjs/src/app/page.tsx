// src/app/page.tsx
import { redirect } from "next/navigation";

// Simple static redirect to the default locale.
// Keep this file tiny and dependency-free so prerendering "/" never imports next-intl.
export default function RootRedirect() {
  redirect("/ja");
}
