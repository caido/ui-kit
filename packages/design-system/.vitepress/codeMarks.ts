import type { MarkdownRenderer } from "vitepress";

const OPEN = "[[";
const CLOSE = "]]";

const TAG = /(<[^>]*>)/u;
const ENTITY = /&(?:#x([0-9a-fA-F]+)|#(\d+)|([a-zA-Z][a-zA-Z0-9]*));/y;

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

type Slot = { part: number; start: number; end: number; text: string };

type State = { marked: boolean[]; dropped: boolean[] };

const decode = (parts: string[]): Slot[] => {
  const slots: Slot[] = [];

  parts.forEach((part, index) => {
    if (index % 2 === 1) return;

    let at = 0;
    while (at < part.length) {
      let text = part.slice(at, at + 1);
      let width = 1;

      if (text === "&") {
        ENTITY.lastIndex = at;
        const found = ENTITY.exec(part);
        if (found !== null) {
          const [whole, hex, decimal, name] = found;
          if (hex !== undefined) text = String.fromCodePoint(parseInt(hex, 16));
          else if (decimal !== undefined)
            text = String.fromCodePoint(parseInt(decimal, 10));
          else text = NAMED[name ?? ""] ?? whole;
          width = whole.length;
        }
      }

      slots.push({ part: index, start: at, end: at + width, text });
      at += width;
    }
  });

  return slots;
};

const resolve = (slots: Slot[]): State => {
  const marked = slots.map(() => false);
  const dropped = slots.map(() => false);

  const starts: number[] = [];
  let offset = 0;
  for (const slot of slots) {
    starts.push(offset);
    offset += slot.text.length;
  }

  const text = slots.map((slot) => slot.text).join("");
  const span = (from: number, until: number, apply: (index: number) => void) =>
    slots.forEach((slot, index) => {
      const start = starts[index] ?? 0;
      if (start < until && start + slot.text.length > from) apply(index);
    });

  let from = 0;
  for (;;) {
    const open = text.indexOf(OPEN, from);
    if (open === -1) break;

    const close = text.indexOf(CLOSE, open + OPEN.length);
    if (close === -1) break;

    span(open, open + OPEN.length, (index) => (dropped[index] = true));
    span(close, close + CLOSE.length, (index) => (dropped[index] = true));
    span(open + OPEN.length, close, (index) => (marked[index] = true));

    from = close + CLOSE.length;
  }

  return { marked, dropped };
};

const rebuild = (parts: string[], slots: Slot[], state: State) => {
  const output = [...parts];
  const byPart = new Map<number, number[]>();

  slots.forEach((slot, index) => {
    const bucket = byPart.get(slot.part) ?? [];
    bucket.push(index);
    byPart.set(slot.part, bucket);
  });

  for (const [part, indexes] of byPart) {
    const source = parts[part] ?? "";
    let built = "";
    let open = false;

    for (const index of indexes) {
      const slot = slots[index];
      if (slot === undefined) continue;
      if (state.dropped[index] === true) continue;

      const wanted = state.marked[index] === true;
      if (wanted && !open) {
        built += `<span class="token-highlight">`;
        open = true;
      }
      if (!wanted && open) {
        built += "</span>";
        open = false;
      }
      built += source.slice(slot.start, slot.end);
    }

    output[part] = open ? `${built}</span>` : built;
  }

  return output.join("");
};

export const codeMarks = (md: MarkdownRenderer) => {
  const fence = md.renderer.rules.fence;
  if (fence === undefined) return;

  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const html = fence(tokens, index, options, env, self);
    if (!html.includes(OPEN)) return html;

    const parts = html.split(TAG);
    const slots = decode(parts);
    const state = resolve(slots);
    if (!state.marked.includes(true)) return html;

    return rebuild(parts, slots, state);
  };
};
