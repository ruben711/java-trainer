import { isGoldTagLabel, tierForLabel, type CustomTag as Tag } from "@/lib/nameStyle";
import type { CSSProperties } from "react";

export default function CustomTag({ tag }: { tag: Tag }) {
  const gold = isGoldTagLabel(tag.label);
  const tier = tierForLabel(tag.label);
  const style = {
    "--tag-color": tag.color,
    "--tag-glow": tag.color + "66",
  } as CSSProperties;
  const tierClass = tier > 0 ? `jt-tag-tier-${tier}` : "";
  return (
    <span className={`jt-tag ${tierClass} ${gold ? "jt-tag-gold" : ""}`} style={style}>
      <span>{tag.label}</span>
    </span>
  );
}
