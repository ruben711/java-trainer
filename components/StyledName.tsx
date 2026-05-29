import { PARTICLE_EMOJI, type NameStyle } from "@/lib/nameStyle";
import type { CSSProperties } from "react";

export default function StyledName({
  name,
  style,
  isAdmin,
}: {
  name: string;
  style?: NameStyle | null;
  isAdmin?: boolean;
}) {
  const classes = ["jt-name"];
  const inline: CSSProperties = {};

  if (style?.bold) inline.fontWeight = 700;
  if (style?.font === "mono") classes.push("font-mono");
  if (style?.font === "pixel") classes.push("jt-name-pixel");

  if (style?.rainbow) {
    classes.push("jt-name-rainbow");
  } else if (style?.gradient) {
    classes.push("jt-name-gradient");
    inline.backgroundImage = `linear-gradient(90deg, ${style.gradient[0]}, ${style.gradient[1]})`;
  } else if (style?.color) {
    inline.color = style.color;
  }
  if (style?.glow) classes.push("jt-name-glow");
  if (style?.pulse) classes.push("jt-name-pulse");
  if (style?.shake) classes.push("jt-name-shake");

  const particle =
    style?.particle && style.particle !== "none"
      ? PARTICLE_EMOJI[style.particle]
      : null;

  return (
    <span className="inline-flex items-center gap-1">
      {isAdmin && (
        <span className="jt-admin-badge" title="Admin" aria-label="Admin">
          👑
        </span>
      )}
      <span className={classes.join(" ")} style={inline}>
        {name}
      </span>
      {particle && (
        <span className="opacity-80" aria-hidden>
          {particle}
        </span>
      )}
    </span>
  );
}
