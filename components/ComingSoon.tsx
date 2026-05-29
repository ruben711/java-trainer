import { BookOpen } from "lucide-react";

export default function ComingSoon({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="panel max-w-md p-6 text-center">
        <BookOpen size={22} className="mx-auto text-faint" strokeWidth={1.75} />
        <h1 className="mt-3 text-[15px] font-semibold">{title}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{blurb}</p>
        <span className="chip mt-4 border-accent/40 text-accent">binnenkort beschikbaar</span>
      </div>
    </div>
  );
}
