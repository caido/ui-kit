import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

import {
  buildContract,
  checkAnnouncements,
  checkDeprecated,
  checkRemovals,
  checkReplacements,
} from "./contract.ts";
import { checkPairing } from "./contrast.ts";
import {
  checkAppearances,
  checkDirectNames,
  checkNamespaces,
  checkWholePixels,
  emitLegacyStylesheet,
  emitStylesheet,
  isSameAppearance,
} from "./emit.ts";
import { iconAliases, resolveIcon } from "./icons.ts";
import { rowHeight } from "./layout.ts";
import { flattenTokens, type ResolvedToken, resolveTokens } from "./resolve.ts";

const color = (hue: number, saturation = 50, lightness = 50) => ({
  colorSpace: "hsl",
  components: [hue, saturation, lightness],
});

const token = (path: string, hue: number): ResolvedToken => ({
  path,
  value: color(hue),
});

const step = (path: string, size: number, leading: number, weight?: number) =>
  ({ path, value: { size, leading, weight } }) as ResolvedToken;

describe("flattenTokens", () => {
  it("walks groups and ignores keys that are not tokens", () => {
    const flat = flattenTokens([
      {
        $schema: "x",
        palette: { $type: "color", red: { "100": { $value: color(0) } } },
      },
    ]);

    expect([...flat.keys()]).toEqual(["palette.red.100"]);
  });

  it("lets a later document win, which is how appearances compose", () => {
    const flat = flattenTokens([
      { color: { surface: { "700": { $value: color(1) } } } },
      { color: { surface: { "700": { $value: color(2) } } } },
    ]);

    expect(flat.get("color.surface.700")).toEqual(color(2));
  });
});

describe("resolveTokens", () => {
  it("follows an alias to the value it points at", () => {
    const flat = flattenTokens([
      {
        palette: { neutral: { "700": { $value: color(9) } } },
        color: { surface: { "700": { $value: "{palette.neutral.700}" } } },
      },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual(
      token("color.surface.700", 9),
    );
  });

  it("reports an alias that points at nothing", () => {
    const flat = flattenTokens([
      { color: { surface: { "700": { $value: "{palette.neutral.750}" } } } },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrapErr()).toBe(
      "color.surface.700 points at palette.neutral.750, which does not exist",
    );
  });

  it("reports a cycle rather than looping", () => {
    const flat = flattenTokens([
      {
        color: {
          a: { $value: "{color.b}" },
          b: { $value: "{color.a}" },
        },
      },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrapErr()).toContain("circular alias");
  });
});

describe("checkAppearances", () => {
  it("passes when both appearances hold the same set of names", () => {
    const light = [token("color.surface.700", 1)];
    const dark = [token("color.surface.700", 2)];

    expect(checkAppearances(light, dark).isOk()).toBe(true);
  });

  it("names a token that only one appearance defines", () => {
    const light: ResolvedToken[] = [];
    const dark = [token("color.surface.700", 2)];

    expect(checkAppearances(light, dark)._unsafeUnwrapErr()).toEqual([
      "color.surface.700",
    ]);
  });
});

describe("checkNamespaces", () => {
  it("accepts a namespace the framework lacks but the stylesheet bridges", () => {
    const bridged: ResolvedToken = {
      path: "duration.surface",
      value: { ms: 300 },
    };

    expect(checkNamespaces([bridged]).isOk()).toBe(true);
  });

  it("accepts a semantic token inside a namespace that generates a class", () => {
    expect(checkNamespaces([token("color.surface.700", 1)]).isOk()).toBe(true);
  });

  it("names a semantic token that would generate no class", () => {
    expect(
      checkNamespaces([token("elevation.1", 1)])._unsafeUnwrapErr(),
    ).toEqual(["elevation.1"]);
  });

  it("ignores the palette, which is not meant to generate a class", () => {
    expect(checkNamespaces([token("palette.neutral.700", 1)]).isOk()).toBe(
      true,
    );
  });
});

describe("emitStylesheet", () => {
  it("writes one value when both appearances agree", () => {
    const sheet = emitStylesheet(
      [token("color.surface.700", 1)],
      [token("color.surface.700", 1)],
    );

    expect(sheet).toContain("--color-surface-700: hsl(1deg 50% 50%);");
    expect(sheet).not.toContain("light-dark(");
  });

  it("writes light-dark only where the appearances differ", () => {
    const sheet = emitStylesheet(
      [token("color.surface.700", 1)],
      [token("color.surface.700", 2)],
    );

    expect(sheet).toContain(
      "--color-surface-700: light-dark(hsl(1deg 50% 50%), hsl(2deg 50% 50%));",
    );
  });

  it("writes a layer as a bare number, so the class reaches z-index", () => {
    const layer: ResolvedToken = {
      path: "z-index.scrim",
      value: { index: 60 },
    };
    const sheet = emitStylesheet([layer], [layer]);

    expect(sheet).toContain("--z-index-scrim: 60;");
  });

  it("writes a duration in milliseconds and an easing as a curve", () => {
    const motion: ResolvedToken[] = [
      { path: "duration.surface", value: { ms: 300 } },
      { path: "ease.enter", value: { curve: [0, 0, 0.2, 1] } },
    ];
    const sheet = emitStylesheet(motion, motion);

    expect(sheet).toContain("--duration-surface: 300ms;");
    expect(sheet).toContain("--ease-enter: cubic-bezier(0, 0, 0.2, 1);");
  });

  it("keeps the palette out of the theme block, so it generates no class", () => {
    const sheet = emitStylesheet(
      [token("palette.neutral.700", 1)],
      [token("palette.neutral.700", 1)],
    );

    const themeBlock = sheet.slice(sheet.indexOf("@theme static {"));
    expect(themeBlock).not.toContain("--palette-neutral-700");
  });

  it("sets the three appearance states", () => {
    const sheet = emitStylesheet([], []);

    expect(sheet).toContain("color-scheme: light dark;");
    expect(sheet).toContain('[data-appearance="light"]');
    expect(sheet).toContain('[data-appearance="dark"]');
  });
});

describe("emitLegacyStylesheet", () => {
  it("writes a complete colour, so a consumer never wraps it", () => {
    const same = [token("color.surface.700", 224)];

    expect(emitLegacyStylesheet(same, same)).toContain(
      "--c-surface-700: hsl(224deg 50% 50%);",
    );
  });

  it("writes an oklch value in its own colour space", () => {
    const oklch: ResolvedToken = {
      path: "color.surface.700",
      value: { colorSpace: "oklch", components: [0.57, 0.178, 13.9] },
    };

    expect(emitLegacyStylesheet([oklch], [oklch])).toContain(
      "--c-surface-700: oklch(0.57 0.178 13.9);",
    );
  });

  it("writes a complete colour under the given name for a directly read token", () => {
    const same = [token("color.highlight.red", 6)];

    expect(
      emitLegacyStylesheet(same, same, {
        "color.highlight.red": "--c-highlight-color-red",
      }),
    ).toContain("--c-highlight-color-red: hsl(6deg 50% 50%);");
  });

  it("pairs the two appearances, so a legacy name follows the theme", () => {
    const sheet = emitLegacyStylesheet(
      [token("color.highlight.red", 6)],
      [token("color.highlight.red", 300)],
      { "color.highlight.red": "--c-highlight-color-red" },
    );

    expect(sheet).toContain(
      "--c-highlight-color-red: light-dark(hsl(6deg 50% 50%), hsl(300deg 50% 50%));",
    );
  });

  it("derives the name of a token the mapping does not list", () => {
    const same = [token("color.surface.700", 224)];
    const sheet = emitLegacyStylesheet(same, same, {
      "color.highlight.red": "--c-highlight-color-red",
    });

    expect(sheet).toContain("--c-surface-700: hsl(224deg 50% 50%);");
  });
});

describe("checkDirectNames", () => {
  it("accepts a name that points at a token", () => {
    expect(
      checkDirectNames([token("color.highlight.red", 1)], {
        "color.highlight.red": "--c-highlight-color-red",
      }).isOk(),
    ).toBe(true);
  });

  it("names a legacy name whose token no longer exists", () => {
    expect(
      checkDirectNames([], {
        "color.highlight.red": "--c-highlight-color-red",
      })._unsafeUnwrapErr(),
    ).toEqual(["color.highlight.red"]);
  });
});

describe("isSameAppearance", () => {
  it("is true while no light value has been chosen", () => {
    const same = [token("color.surface.700", 1)];
    expect(isSameAppearance(same, same)).toBe(true);
  });

  it("is false once one value differs", () => {
    expect(
      isSameAppearance(
        [token("color.surface.700", 1)],
        [token("color.surface.700", 2)],
      ),
    ).toBe(false);
  });
});

describe("checkPairing", () => {
  const values = new Map([
    ["white", color(0, 0, 100)],
    ["black", color(0, 0, 0)],
    ["mid", color(0, 0, 46)],
    ["border", color(0, 0, 38)],
  ]);

  const pairing = (
    foreground: string,
    background: string,
    usage: "text" | "large-text" | "identifier",
  ) => ({ foreground, background, usage, sites: 1 });

  it("measures a wash against what it composites onto, not against its own colour", () => {
    const opaque = checkPairing(pairing("white", "mid", "text"), values);
    const washed = checkPairing(
      {
        foreground: "white",
        background: "mid",
        over: "black",
        alpha: 0.5,
        usage: "text",
        sites: 1,
      },
      values,
    );

    expect(washed?.ratio).toBeGreaterThan(opaque!.ratio);
  });

  it("ignores a named backdrop when no alpha is given", () => {
    const plain = checkPairing(pairing("white", "mid", "text"), values);
    const withBackdrop = checkPairing(
      {
        foreground: "white",
        background: "mid",
        over: "black",
        usage: "text",
        sites: 1,
      },
      values,
    );

    expect(withBackdrop?.ratio).toBe(plain?.ratio);
  });

  it("reports nothing when the named backdrop is absent", () => {
    const result = checkPairing(
      {
        foreground: "white",
        background: "mid",
        over: "absent",
        alpha: 0.5,
        usage: "text",
        sites: 1,
      },
      values,
    );

    expect(result).toBeUndefined();
  });

  it("reports the published ratio for white on black", () => {
    const result = checkPairing(pairing("white", "black", "text"), values);

    expect(result?.ratio).toBeCloseTo(21, 2);
  });

  it("reports one for a colour against itself", () => {
    const result = checkPairing(pairing("mid", "mid", "text"), values);

    expect(result?.ratio).toBeCloseTo(1, 2);
  });

  it("gives the same ratio whichever way round the pair is written", () => {
    const one = checkPairing(pairing("white", "black", "text"), values);
    const other = checkPairing(pairing("black", "white", "text"), values);

    expect(one?.ratio).toBeCloseTo(other?.ratio ?? 0, 6);
  });

  it("passes a pairing that clears its threshold", () => {
    const result = checkPairing(pairing("white", "black", "text"), values);

    expect(result?.passes).toBe(true);
  });

  it("fails a pairing that falls short, and reports what was required", () => {
    const result = checkPairing(pairing("border", "black", "text"), values);

    expect(result).toMatchObject({ passes: false, required: 4.5 });
  });

  it("passes the same colours once the rule is the lower threshold", () => {
    const result = checkPairing(
      pairing("border", "black", "identifier"),
      values,
    );

    expect(result).toMatchObject({ passes: true, required: 3 });
  });

  it("returns nothing when a pairing names a token that does not exist", () => {
    const result = checkPairing(pairing("absent", "black", "text"), values);

    expect(result).toBeUndefined();
  });
});

describe("resolveTokens across value types", () => {
  it("resolves a type step, so a role can carry size and leading together", () => {
    const flat = flattenTokens([
      { text: { body: { $value: { size: 14, leading: 20, weight: 400 } } } },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual({
      path: "text.body",
      value: { size: 14, leading: 20, weight: 400 },
    });
  });

  it("resolves a font family, so the stack survives as a list", () => {
    const flat = flattenTokens([
      { font: { sans: { $value: { stack: ["Inter", "sans-serif"] } } } },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual({
      path: "font.sans",
      value: { stack: ["Inter", "sans-serif"] },
    });
  });

  it("follows an alias from a type step to another type step", () => {
    const flat = flattenTokens([
      {
        text: {
          body: { $value: { size: 14, leading: 20 } },
          "body-strong": { $value: "{text.body}" },
        },
      },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual({
      path: "text.body-strong",
      value: { size: 14, leading: 20 },
    });
  });

  it("resolves a layer, so a depth token stays a bare number", () => {
    const flat = flattenTokens([
      { "z-index": { scrim: { $value: { index: 60 } } } },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual({
      path: "z-index.scrim",
      value: { index: 60 },
    });
  });

  it("resolves a duration and an easing, so motion carries its own units", () => {
    const flat = flattenTokens([
      {
        duration: { surface: { $value: { ms: 300 } } },
        ease: { enter: { $value: { curve: [0, 0, 0.2, 1] } } },
      },
    ]);
    const resolved = resolveTokens(flat)._unsafeUnwrap();

    expect(resolved).toContainEqual({
      path: "duration.surface",
      value: { ms: 300 },
    });
    expect(resolved).toContainEqual({
      path: "ease.enter",
      value: { curve: [0, 0, 0.2, 1] },
    });
  });

  it("reports a value that is not a shape this system can emit", () => {
    const flat = flattenTokens([{ text: { body: { $value: { size: 14 } } } }]);

    expect(resolveTokens(flat)._unsafeUnwrapErr()).toBe(
      "text.body does not hold a value this system can emit",
    );
  });
});

describe("checkWholePixels", () => {
  it("names a step whose size is not a whole pixel at the base", () => {
    expect(
      checkWholePixels([step("text.body", 12.25, 20)])._unsafeUnwrapErr(),
    ).toEqual(["text.body"]);
  });

  it("names a step whose line height is not a whole pixel at the base", () => {
    expect(
      checkWholePixels([step("text.body", 14, 17.5)])._unsafeUnwrapErr(),
    ).toEqual(["text.body"]);
  });

  it("passes a step written in whole pixels", () => {
    expect(checkWholePixels([step("text.body", 14, 20)]).isOk()).toBe(true);
  });

  it("ignores a colour, which is not measured in pixels", () => {
    expect(checkWholePixels([token("color.surface.700", 1)]).isOk()).toBe(true);
  });
});

describe("emitStylesheet for type", () => {
  it("writes a role as a fraction of the base, so it moves with the text setting", () => {
    const sheet = emitStylesheet(
      [step("text.caption", 12, 16)],
      [step("text.caption", 12, 16)],
    );

    expect(sheet).toContain("--text-caption: calc(12 / 14 * 1rem);");
  });

  it("writes the line height as a ratio of the two pixel values", () => {
    const sheet = emitStylesheet(
      [step("text.body", 14, 20)],
      [step("text.body", 14, 20)],
    );

    expect(sheet).toContain("--text-body--line-height: calc(20 / 14);");
  });

  it("writes a weight only when the role carries one", () => {
    const withWeight = emitStylesheet(
      [step("text.title", 18, 24, 600)],
      [step("text.title", 18, 24, 600)],
    );
    const without = emitStylesheet(
      [step("text.title", 18, 24)],
      [step("text.title", 18, 24)],
    );

    expect(withWeight).toContain("--text-title--font-weight: 600;");
    expect(without).not.toContain("--text-title--font-weight");
  });

  it("quotes a face whose name carries a space, and leaves a keyword alone", () => {
    const family: ResolvedToken = {
      path: "font.sans",
      value: { stack: ["Inter Fallback", "sans-serif"] },
    };
    const sheet = emitStylesheet([family], [family]);

    expect(sheet).toContain('--font-sans: "Inter Fallback", sans-serif;');
  });

  it("clears the namespaces it takes over, so a component cannot pick a size", () => {
    const sheet = emitStylesheet([], []);

    expect(sheet).toContain("--text-*: initial;");
    expect(sheet).toContain("--font-weight-*: initial;");
    expect(sheet).toContain("--tracking-*: initial;");
  });
});

describe("emitLegacyStylesheet with type present", () => {
  it("leaves a type step out, because the legacy names are colours", () => {
    const same = [token("color.surface.700", 224), step("text.body", 14, 20)];
    const sheet = emitLegacyStylesheet(same, same);

    expect(sheet).toContain("--c-surface-700:");
    expect(sheet).not.toContain("text-body");
  });
});

describe("emitStylesheet for the measure", () => {
  const measure = (path: string, ch: number): ResolvedToken => ({
    path,
    value: { ch },
  });

  it("writes the measure in character widths, so it tracks the face", () => {
    const sheet = emitStylesheet(
      [measure("container.measure", 66)],
      [measure("container.measure", 66)],
    );

    expect(sheet).toContain("--container-measure: 66ch;");
  });

  it("accepts the measure namespace, which generates a max width class", () => {
    expect(checkNamespaces([measure("container.measure", 66)]).isOk()).toBe(
      true,
    );
  });

  it("resolves a measure written in the token source", () => {
    const flat = flattenTokens([
      { container: { measure: { $value: { ch: 66 } } } },
    ]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual({
      path: "container.measure",
      value: { ch: 66 },
    });
  });
});

describe("emitStylesheet for a dimension", () => {
  const dimension = (path: string, px: number): ResolvedToken => ({
    path,
    value: { px },
  });

  it("writes a dimension in pixels, so it does not move with the text setting", () => {
    const sheet = emitStylesheet(
      [dimension("radius.base", 4)],
      [dimension("radius.base", 4)],
    );

    expect(sheet).toContain("--radius-base: 4px;");
  });

  it("keeps a dimension distinct from a measure, which is in character widths", () => {
    const sheet = emitStylesheet(
      [
        dimension("radius.base", 4),
        { path: "container.measure", value: { ch: 66 } },
      ],
      [
        dimension("radius.base", 4),
        { path: "container.measure", value: { ch: 66 } },
      ],
    );

    expect(sheet).toContain("--radius-base: 4px;");
    expect(sheet).toContain("--container-measure: 66ch;");
  });

  it("resolves a dimension written in the token source", () => {
    const flat = flattenTokens([{ radius: { base: { $value: { px: 4 } } } }]);

    expect(resolveTokens(flat)._unsafeUnwrap()).toContainEqual({
      path: "radius.base",
      value: { px: 4 },
    });
  });

  it("reports a dimension whose value is not a number", () => {
    const flat = flattenTokens([{ radius: { base: { $value: { px: "4" } } } }]);

    expect(resolveTokens(flat)._unsafeUnwrapErr()).toBe(
      "radius.base does not hold a value this system can emit",
    );
  });
});

describe("rowHeight", () => {
  it("is the body line box plus the compact control padding at the default", () => {
    expect(rowHeight(14)).toBe(24);
  });

  it("grows with the interface text setting, because a row has to hold its text", () => {
    expect(rowHeight(24)).toBeGreaterThan(rowHeight(14));
  });

  it("stays a whole number, because a virtual list positions rows at multiples of it", () => {
    for (const size of [12, 13, 14, 17, 19, 24]) {
      expect(Number.isInteger(rowHeight(size))).toBe(true);
    }
  });

  it("leaves the line box room, so text is never taller than its row", () => {
    for (const size of [12, 14, 18, 24]) {
      expect(rowHeight(size)).toBeGreaterThan(size);
    }
  });
});

describe("resolveIcon", () => {
  it("rewrites a second spelling to the name the system already uses", () => {
    expect(resolveIcon("fas fa-save")).toBe("fas fa-floppy-disk");
  });

  it("rewrites every glyph in the list rather than only the first", () => {
    expect(resolveIcon("fas fa-save fa-search")).toBe(
      "fas fa-floppy-disk fa-magnifying-glass",
    );
  });

  it("leaves a glyph the table does not carry alone, because a plugin may use any icon in the library", () => {
    expect(resolveIcon("fas fa-camera")).toBe("fas fa-camera");
  });

  it("keeps the weight the caller asked for, because filled against hollow is the distinction one control draws", () => {
    expect(resolveIcon("far fa-circle")).toBe("far fa-circle");
  });

  it("keeps a prefix it does not recognise, because the field is a class list rather than a name", () => {
    expect(resolveIcon("fas fa-save animate-spin")).toBe(
      "fas fa-floppy-disk animate-spin",
    );
  });

  it("tolerates the spacing a plugin may pass", () => {
    expect(resolveIcon("  fas   fa-save  ")).toBe("fas fa-floppy-disk");
  });
});

describe("iconAliases against the shipped library", () => {
  const require = createRequire(import.meta.url);
  const metadata = JSON.parse(
    readFileSync(
      require.resolve(
        "@fortawesome/fontawesome-free/metadata/icon-families.json",
      ),
      "utf8",
    ),
  ) as Record<string, { aliases?: { names?: string[] } }>;

  const aliasesOf = (glyph: string) =>
    (metadata[glyph.slice("fa-".length)]?.aliases?.names ?? []).map(
      (name) => `fa-${name}`,
    );

  const targets = [...new Set(Object.values(iconAliases))];

  it("names a glyph the library ships as the survivor of every rename", () => {
    const unknown = targets.filter(
      (glyph) => metadata[glyph.slice("fa-".length)] === undefined,
    );
    expect(unknown).toEqual([]);
  });

  it("never points one spelling at another spelling, so resolving once is enough", () => {
    const chained = targets.filter((glyph) => iconAliases[glyph] !== undefined);
    expect(chained).toEqual([]);
  });

  it("carries every spelling the library gives the glyphs it covers, so an upgrade cannot open a gap", () => {
    const missing = targets
      .flatMap(aliasesOf)
      .filter((alias) => iconAliases[alias] === undefined);
    expect(missing).toEqual([]);
  });

  it("carries nothing the library does not call an alias of its target", () => {
    const stray = Object.entries(iconAliases).filter(
      ([alias, glyph]) => !aliasesOf(glyph).includes(alias),
    );
    expect(stray).toEqual([]);
  });
});

describe("checkDeprecated", () => {
  it("accepts a deprecation whose token is still emitted", () => {
    expect(
      checkDeprecated([token("color.fg.muted", 1)], {
        "color.fg.muted": { since: "0.1.0", reason: "renamed" },
      }).isOk(),
    ).toBe(true);
  });

  it("names a deprecation whose token has already gone", () => {
    expect(
      checkDeprecated([], {
        "color.fg.muted": { since: "0.1.0", reason: "renamed" },
      })._unsafeUnwrapErr(),
    ).toEqual(["color.fg.muted"]);
  });
});

describe("checkReplacements", () => {
  it("accepts a replacement that exists", () => {
    expect(
      checkReplacements(
        [token("color.fg.muted", 1), token("color.fg.subtle", 2)],
        {
          "color.fg.muted": {
            replacement: "color.fg.subtle",
            since: "0.1.0",
            reason: "renamed",
          },
        },
      ).isOk(),
    ).toBe(true);
  });

  it("accepts a deprecation that names no replacement", () => {
    expect(
      checkReplacements([token("color.fg.muted", 1)], {
        "color.fg.muted": { since: "0.1.0", reason: "going away" },
      }).isOk(),
    ).toBe(true);
  });

  it("names a replacement that points at nothing", () => {
    expect(
      checkReplacements([token("color.fg.muted", 1)], {
        "color.fg.muted": {
          replacement: "color.fg.nowhere",
          since: "0.1.0",
          reason: "renamed",
        },
      })._unsafeUnwrapErr(),
    ).toEqual([
      "color.fg.muted points at color.fg.nowhere, which does not exist",
    ]);
  });
});

describe("checkRemovals", () => {
  it("accepts a published name that is still emitted", () => {
    expect(
      checkRemovals([token("color.fg.muted", 1)], {
        version: "0.1.0",
        names: ["color.fg.muted"],
        deprecated: [],
      }).isOk(),
    ).toBe(true);
  });

  it("accepts a removal the previous release announced", () => {
    expect(
      checkRemovals([], {
        version: "0.1.0",
        names: ["color.fg.muted"],
        deprecated: ["color.fg.muted"],
      }).isOk(),
    ).toBe(true);
  });

  it("names a published token removed without a window", () => {
    expect(
      checkRemovals([], {
        version: "0.1.0",
        names: ["color.fg.muted"],
        deprecated: [],
      })._unsafeUnwrapErr(),
    ).toEqual(["color.fg.muted"]);
  });

  it("accepts a token added since the published contract", () => {
    expect(
      checkRemovals([token("color.fg.muted", 1), token("color.fg.fresh", 2)], {
        version: "0.1.0",
        names: ["color.fg.muted"],
        deprecated: [],
      }).isOk(),
    ).toBe(true);
  });
});

describe("buildContract", () => {
  it("freezes the emitted names and marks the deprecated ones", () => {
    expect(
      buildContract("0.2.0", [token("b.two", 1), token("a.one", 2)], {
        "a.one": { since: "0.1.0", reason: "renamed" },
      }),
    ).toEqual({
      version: "0.2.0",
      names: ["a.one", "b.two"],
      deprecated: ["a.one"],
    });
  });
});

describe("checkAnnouncements", () => {
  it("accepts a deprecation that says when and why", () => {
    expect(
      checkAnnouncements({
        "color.fg.muted": { since: "0.1.0", reason: "renamed" },
      }).isOk(),
    ).toBe(true);
  });

  it("names a deprecation with no reason", () => {
    expect(
      checkAnnouncements({
        "color.fg.muted": { since: "0.1.0", reason: "  " },
      })._unsafeUnwrapErr(),
    ).toEqual(["color.fg.muted is missing reason"]);
  });

  it("names both fields when neither is given", () => {
    expect(
      checkAnnouncements({
        "color.fg.muted": { since: "", reason: "" },
      })._unsafeUnwrapErr(),
    ).toEqual(["color.fg.muted is missing since and reason"]);
  });
});
