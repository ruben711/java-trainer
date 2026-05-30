import { isGoldTagLabel, type CustomTag as Tag } from "@/lib/nameStyle";
import type { CSSProperties } from "react";

export default function CustomTag({ tag }: { tag: Tag }) {
  const gold = isGoldTagLabel(tag.label);
  const style = {
    "--tag-color": tag.color,
    "--tag-glow": tag.color + "66",
  } as CSSProperties;
  return (
    <span className={`jt-tag ${gold ? "jt-tag-gold" : ""}`} style={style}>
      <span>{tag.label}</span>
    </span>
  );
}
