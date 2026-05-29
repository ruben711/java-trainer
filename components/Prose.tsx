function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Minimale markdown-renderer voor de (zelf-geschreven) opgave-teksten. */
export default function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  const html = blocks
    .map((block) => {
      const esc = escapeHtml(block);
      const lines = esc.split("\n");
      if (lines.every((l) => /^[-*]\s+/.test(l) || l.trim() === "")) {
        const items = lines
          .filter((l) => l.trim())
          .map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (lines.every((l) => /^&gt;\s?/.test(l) || l.trim() === "")) {
        const inner = lines
          .map((l) => l.replace(/^&gt;\s?/, ""))
          .join(" ");
        return `<blockquote>${inline(inner)}</blockquote>`;
      }
      if (/^###\s+/.test(esc)) return `<h4>${inline(esc.replace(/^###\s+/, ""))}</h4>`;
      if (/^##\s+/.test(esc)) return `<h3>${inline(esc.replace(/^##\s+/, ""))}</h3>`;
      return `<p>${inline(esc).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
  return (
    <div className="prose-lite" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
