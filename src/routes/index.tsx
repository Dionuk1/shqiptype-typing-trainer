import { createFileRoute } from "@tanstack/react-router";
import { TypingTest } from "@/components/TypingTest";
import { SupportSection } from "@/components/SupportSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShqipType — Albanian Typing Test" },
      {
        name: "description",
        content:
          "A minimalist, distraction-free typing test for the Albanian language. Practice Standard Albanian or the Kosovo dialect with live WPM and accuracy.",
      },
      { property: "og:title", content: "ShqipType — Albanian Typing Test" },
      {
        property: "og:description",
        content:
          "A minimalist, distraction-free typing test for the Albanian language. Practice Standard Albanian or the Kosovo dialect with live WPM and accuracy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-navy">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-sky/25 blur-3xl animate-floaty" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-frost/10 blur-3xl animate-floaty2" />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-sky/15 blur-3xl animate-floaty-slow" />
      <TypingTest />
      <SupportSection />
    </div>
  );
}
