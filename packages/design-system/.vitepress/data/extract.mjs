import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const PF =
  process.env.CAIDO_PROXY_FRONTEND_DIR ??
  path.resolve(HERE, "../../../../..", "proxy-frontend");
const REPO = path.join(PF, "packages/components/src/styles");
const darkSrc = fs.readFileSync(path.join(REPO, "tokens.css"), "utf8");

function findCF() {
  const base = path.join(PF, "node_modules/.pnpm");
  if (!fs.existsSync(base)) return "";
  const dir = fs
    .readdirSync(base)
    .filter((d) => d.startsWith("@caido+common-frontend@"))
    .sort()
    .pop();
  if (!dir) return "";
  const f = path.join(
    base,
    dir,
    "node_modules/@caido/common-frontend/dist/assets/style.css",
  );
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
}
const cfSrc = findCF();

const varsPath = path.join(PF, "packages/ui/src/styles/colors.variables.css");
const varsSrc = fs.existsSync(varsPath)
  ? fs.readFileSync(varsPath, "utf8")
  : "";
const lightSrc = fs.readFileSync(path.join(REPO, "theme.light.css"), "utf8");

const hsl2rgb = (h, s, l) => {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2;
  const seg = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60)];
  return seg.map((v) => Math.round((v + m) * 255));
};
const toHex = (a) =>
  "#" +
  a
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

function parse(src) {
  const out = {};
  for (const m of src.matchAll(
    /(--[a-zA-Z0-9-]+):\s*([^;]+);(?:\s*\/\*([^*]*)\*\/)?/g,
  )) {
    out[m[1]] = { raw: m[2].trim(), note: (m[3] || "").trim() };
  }
  return out;
}
const darkRaw = { ...parse(cfSrc), ...parse(varsSrc), ...parse(darkSrc) };
const lightRaw = parse(
  lightSrc.slice(lightSrc.indexOf(':root[data-mode="light"]')),
);

const ROLE = [
  [/^--c-plane-canvas/, "The page behind everything"],
  [/^--c-plane-raised/, "Cards, panels, menus and dialogs"],
  [/^--c-plane-overlay/, "Floating surfaces above the page"],
  [/^--c-plane-inset/, "Input fills and wells"],
  [/^--c-plane-chip/, "Chips, tags and small fills"],
  [/^--c-plane-sunken/, "Gutters and empty states"],
  [/^--c-plane-selected/, "The selected row or item"],
  [/^--c-plane-hover/, "The hovered row or item"],
  [/^--c-plane-zebra/, "Alternating table rows"],
  [/^--c-plane-tab-active/, "The active tab"],
  [/^--c-plane-tab-inactive/, "A resting tab"],
  [/^--c-plane-tab-panel/, "The panel below the tabs"],
  [/^--c-plane-loading/, "The veil over loading content"],
  [/^--c-plane-accent-wash/, "A faint accent tint behind content"],
  [/^--c-plane-tooltip/, "The tooltip surface"],
  [/^--c-plane-/, "A surface plane"],
  [/^--c-ink-strong/, "Maximum emphasis text"],
  [/^--c-ink-body/, "Body text"],
  [/^--c-ink-muted/, "Secondary text and captions"],
  [/^--c-ink-faint/, "Placeholder and disabled text"],
  [/^--c-ink-disabled/, "Text in a disabled control"],
  [/^--c-ink-neutral/, "Neutral text with no state"],
  [/^--c-ink-on-chip/, "Text sitting on a chip"],
  [/^--c-ink-celebration/, "Success messaging in onboarding"],
  [/^--c-ink-/, "A text tier"],
  [/^--c-line-control/, "The visible boundary of a control, held at 3:1"],
  [/^--c-line-strong/, "A boundary that carries meaning"],
  [/^--c-line-soft/, "A decorative separator"],
  [/^--c-line-default/, "The default divider"],
  [/^--c-line-tooltip/, "The tooltip hairline"],
  [/^--c-line-/, "A line or divider"],
  [/^--c-bg-primary/, "The primary action fill"],
  [/^--c-bg-secondary/, "The gold accent fill"],
  [/^--c-bg-tertiary/, "A low emphasis fill"],
  [/^--c-bg-danger/, "The destructive action fill"],
  [/^--c-bg-success/, "The success fill"],
  [/^--c-bg-info/, "The informational fill"],
  [/^--c-bg-default/, "The page background"],
  [/^--c-bg-subtle/, "A raised background"],
  [/^--c-bg-inset/, "An inset background"],
  [/^--c-bg-/, "A background fill"],
  [/^--c-fg-onEmphasis/, "Text on a solid fill"],
  [/^--c-fg-primary/, "Brand text"],
  [/^--c-fg-secondary/, "Gold accent text"],
  [/^--c-fg-tertiary/, "Low emphasis text"],
  [/^--c-fg-danger/, "Error text"],
  [/^--c-fg-success/, "Success text"],
  [/^--c-fg-info/, "Informational text"],
  [/^--c-fg-default/, "Default body text"],
  [/^--c-fg-subtle/, "Secondary text"],
  [/^--c-fg-/, "A text colour"],
  [/^--c-border-danger/, "The border of an error control"],
  [/^--c-border-success/, "The border of a success control"],
  [/^--c-border-info/, "The border of an informational control"],
  [/^--c-border-primary/, "The border of a brand control"],
  [/^--c-border-secondary/, "The border of a gold control"],
  [/^--c-border-tertiary/, "The border of a neutral control"],
  [/^--c-border-default/, "The default control border"],
  [/^--c-border-/, "A border colour"],
  [/^--c-highlight-color-/, "A tagged row fill in HTTP History"],
  [
    /^--c-highlight-swatch-/,
    "The icon colour for that tag in the context menu",
  ],
  [/^--c-syntax-/, "A token colour in the request and response viewers"],
  [/^--c-editor-/, "Editor chrome"],
  [/^--c-workflow-node-/, "A workflow node category"],
];
function describe(name, lightRaw, darkRaw) {
  const own = (lightRaw[name]?.note || darkRaw[name]?.note || "").trim();
  if (own && own.length > 2) return own.replace(/\s+/g, " ");
  const hit = ROLE.find(([re]) => re.test(name));
  let base = hit ? hit[1] : "A colour token";
  if (/--pressed$/.test(name)) base += ", pressed";
  else if (/-hover(-|$)/.test(name)) base += ", hovered";
  else if (/-soft$/.test(name)) base += ", softened";
  else if (/-veil$/.test(name)) base += ", as a veil";
  return base;
}

function resolve(raw, name, seen = 0) {
  if (seen > 8) return null;
  const e = raw[name];
  if (!e) return null;
  let v = e.raw.replace(
    /var\((--[a-zA-Z0-9-]+)\)/g,
    (_, n) => raw[n]?.raw ?? _,
  );
  let m;
  if ((m = v.match(/#([0-9a-fA-F]{6})/)))
    return toHex(
      [1, 3, 5].map((i) => parseInt(("#" + m[1]).slice(i, i + 2), 16)),
    );
  if ((m = v.match(/hsl\(\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%/)))
    return toHex(hsl2rgb(+m[1], +m[2], +m[3]));
  if ((m = v.match(/^([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%$/)))
    return toHex(hsl2rgb(+m[1], +m[2], +m[3]));
  if ((m = v.match(/rgb\(\s*(\d+)\s+(\d+)\s+(\d+)/)))
    return toHex([+m[1], +m[2], +m[3]]);
  return null;
}

function resolveCss(raw, name) {
  const e = raw[name];
  if (!e) return null;
  let v = e.raw;
  for (let i = 0; i < 8 && v.includes("var("); i++) {
    v = v.replace(/var\((--[a-zA-Z0-9-]+)\)/g, (_, n) => raw[n]?.raw ?? _);
  }
  let m;
  if (
    (m = v.match(
      /rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*[/,]\s*([\d.]+)\s*\)/,
    ))
  )
    return `rgb(${m[1]} ${m[2]} ${m[3]} / ${m[4]})`;
  if (
    (m = v.match(
      /hsla?\(\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%\s*[/,]\s*([\d.]+)\s*\)/,
    ))
  ) {
    const [r, g, b] = hsl2rgb(+m[1], +m[2], +m[3]);
    return `rgb(${r} ${g} ${b} / ${m[4]})`;
  }
  return resolve(raw, name);
}

const FAMILIES = [
  "surface",
  "primary",
  "secondary",
  "danger",
  "success",
  "info",
];
const ramps = {};
for (const fam of FAMILIES) {
  ramps[fam] = { light: [], dark: [] };
  for (const [theme, raw] of [
    ["light", lightRaw],
    ["dark", darkRaw],
  ]) {
    for (const name of Object.keys(raw)) {
      const m = name.match(new RegExp(`^--c-${fam}-(\\d+)$`));
      if (!m) continue;
      const hex = resolve(raw, name);
      if (hex)
        ramps[fam][theme].push({ step: +m[1], hex, job: raw[name].note });
    }
    ramps[fam][theme].sort((a, b) => a.step - b.step);
  }
}
fs.writeFileSync(path.join(HERE, "ramps.json"), JSON.stringify(ramps, null, 1));

const GROUPS = [
  ["Planes", /^--c-plane-/],
  ["Ink", /^--c-ink-/],
  ["Lines", /^--c-line-/],
  ["Background", /^--c-bg-/],
  ["Foreground", /^--c-fg-/],
  ["Border", /^--c-border-/],
  ["Highlights", /^--c-highlight-/],
  ["Syntax", /^--c-syntax-/],
  ["Editor", /^--c-editor-/],
  ["Workflow", /^--c-workflow-/],
];
const tokens = [];
const names = new Set([...Object.keys(lightRaw), ...Object.keys(darkRaw)]);
for (const name of names) {
  const group = GROUPS.find(([, re]) => re.test(name))?.[0];
  if (!group) continue;
  const light = resolve(lightRaw, name),
    dark = resolve(darkRaw, name);
  if (!light && !dark) continue;
  tokens.push({
    name,
    group,
    light,
    dark,
    note: describe(name, lightRaw, darkRaw),
  });
}
tokens.sort(
  (a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name),
);

const grouped = [];
for (const g of GROUPS.map(([name]) => name)) {
  const rows = tokens
    .filter((t) => t.group === g)
    .map((t) => ({
      name: t.name,
      light: t.light ?? "",
      dark: t.dark ?? "",
      desc: t.note ?? "",
    }));
  if (rows.length) grouped.push({ group: g, tokens: rows });
}
fs.writeFileSync(
  path.join(HERE, "tokens.json"),
  JSON.stringify(grouped, null, 1),
);

const ALIAS = {
  "--c-bg-canvas": "--c-plane-canvas",
  "--c-bg-raised": "--c-plane-raised",
  "--c-bg-subtle": "--c-plane-sunken",
  "--c-bg-inset": "--c-plane-inset",
  "--c-bg-selected": "--c-plane-chip",
  "--c-bg-disabled": "--c-plane-inset",
  "--c-fg-default": "--c-ink-strong",
  "--c-fg-muted": "--c-ink-muted",
  "--c-fg-faint": "--c-ink-faint",
  "--c-fg-onsolid": "--c-on-emphasis",
  "--c-border-separator": "--c-line-soft",
  "--c-border-control": "--c-line-control",

  "--c-border-line": "--c-line-default",
  "--c-accent-solid": "--c-primary-500",
  "--c-accent-fg": "--c-primary-500",
  "--c-gold-fg": "--c-secondary-400",
  "--c-danger-fg": "--c-danger-400",
  "--c-success-fg": "--c-success-400",
  "--c-info-fg": "--c-info-400",
  "--c-tag-ink": "--c-ink-strong",

  "--c-skeleton": "--c-surface-200",

  "--c-gutter-handle": "--c-surface-700",

  "--c-row-zebra": "--c-table-stripe",
  "--c-row-hover": "--c-plane-hover-row",
  "--c-row-selected": "--c-table-selection-overlay",
  "--c-state-pressed": "--c-active-overlay",
  "--c-bg-header": "--c-plane-chip",
};

const DARK_CANON = {
  "--c-bg-header": "--c-surface-800",
};
const scope = {};
for (const [theme, raw] of [
  ["light", lightRaw],
  ["dark", darkRaw],
]) {
  const lines = [];
  for (const [local, canon] of Object.entries(ALIAS)) {
    const source = (theme === "dark" ? DARK_CANON[local] : undefined) ?? canon;
    const value = resolveCss(raw, source);
    if (!value)
      throw new Error(`${local} did not resolve from ${source} for ${theme}`);
    lines.push(`  ${local}: ${value};`);
  }
  if (theme === "dark") {
    const sk = resolve(raw, "--c-surface-700");
    const at = lines.findIndex((l) => l.includes("--c-skeleton"));
    if (sk && at !== -1) lines[at] = `  --c-skeleton: ${sk};`;
  }
  const tag = resolve(raw, "--c-highlight-color-red");
  lines.push(`  --c-tag-row: ${tag ?? "#000000"};`);
  const ring = resolveCss(raw, "--c-focus-ring");
  if (!ring)
    throw new Error(
      `--c-focus-ring did not resolve for ${theme}. The product owns this token; do not substitute a literal.`,
    );
  lines.push(`  --c-focus-ring: ${ring};`);
  scope[theme] = lines.join("\n");
}
fs.writeFileSync(
  path.join(HERE, "scope-block.json"),
  JSON.stringify(scope, null, 1),
);

const cssPath = path.join(HERE, "..", "theme", "custom.css");
if (!fs.existsSync(cssPath)) {
  throw new Error(
    `custom.css not found at ${cssPath}. Refusing to emit JSON without the stylesheet: that is how tokens go stale.`,
  );
}
{
  const css = fs.readFileSync(cssPath, "utf8");

  const open = ':root, .ds-scope[data-mode="light"] {';
  const i = css.indexOf(open);
  const j = css.indexOf(".ds-scope {", i);
  if (i >= 0 && j > i) {
    const block =
      open +
      "\n" +
      scope.light +
      "\n}\n\n" +
      '.dark, .ds-scope[data-mode="dark"] {\n' +
      scope.dark +
      "\n}\n\n";
    fs.writeFileSync(cssPath, css.slice(0, i) + block + css.slice(j));
    console.log("css     : theme/custom.css scope block rewritten");
  } else {
    console.log("css     : WARNING anchors not found, custom.css NOT updated");
  }
}

console.log(
  `ramps   : ${FAMILIES.map((f) => `${f} ${ramps[f].light.length}L/${ramps[f].dark.length}D`).join(", ")}`,
);
console.log(
  `tokens  : ${tokens.length} across ${new Set(tokens.map((t) => t.group)).size} groups`,
);
console.log(`scope   : ${Object.keys(ALIAS).length + 3} values per theme`);
