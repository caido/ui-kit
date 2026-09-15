# Inter.woff2

Vendored. Do not edit the binary. Regenerate it with the steps below.

|             |                                                                    |
| ----------- | ------------------------------------------------------------------ |
| Upstream    | https://github.com/rsms/inter/releases/tag/v4.1                    |
| Source file | `InterVariable.ttf` from `Inter-4.1.zip`                           |
| Version     | 4.001, git-9221beed3                                               |
| Licence     | SIL Open Font License 1.1, `./LICENSE-Inter.txt`                   |
| SHA-256     | `676b6abd8c73230622ad474bdce0cc92b2e7c19b0c2b5aef55b0c430a857d5fb` |
| Size        | 25,596 bytes                                                       |

## What was done to it

**Instanced.** `opsz` pinned to 14 and the `wght` axis limited to 400 to 600. Pinning `opsz` gives up optical sizing and saves 14,280 bytes. Capping at 600 keeps `font-weight: 700` and `font-weight: 600` landing on the same rendered weight, which is what the type reduction assumed.

**Three substitutions baked into the cmap**, so they cannot be switched off and do not depend on a runtime feature. The `font-feature-settings` descriptor on `@font-face` is Chrome 140 and the declared floor is Chrome 123, so scoping features to this face at runtime is not available.

| Codepoint                      | Was    | Is                    | Feature it came from |
| ------------------------------ | ------ | --------------------- | -------------------- |
| `l` and its 14 accented forms  | `l`    | `l.ss02`, with a tail | `cv05`               |
| `I` and its 33 accented forms  | `I`    | `I.1`, with serifs    | `cv08`               |
| `0` and its 8 positional forms | `zero` | `zero.slash`          | `zero`               |

57 codepoints in total. `l` and `I` are the same rectangle in stock Inter, which is Arial's exact failure and the reason this face needed fixing.

**One GSUB patch.** `tnum` had no entry for `zero.slash`, so `font-variant-numeric: tabular-nums` would have left the zero proportional while the other nine digits went tabular, misaligning every status code column. `zero.slash -> zero.tf.slash` was added to the `tnum` lookup. All ten tabular digits now measure 1328 units.

Figures are left proportional by default so `tabular-nums` stays a meaningful utility.

## Regenerating

Needs `fonttools` and `brotli`.

```
python3 -m fontTools.varLib.instancer InterVariable.ttf opsz=14 wght=400:600 -o step1.ttf
```

Then bake the substitutions and patch `tnum`. Read the `cv05`, `cv08` and `zero` feature maps from GSUB, rewrite every unicode cmap entry those maps cover, and append the one `tnum` entry. The result is `step2.ttf`.

```
python3 -m fontTools.subset step2.ttf \
  --output-file=Inter.woff2 --flavor=woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+00A0,U+2013,U+2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2190,U+2191,U+2192,U+2193,U+21A9,U+21E7,U+2303,U+2318,U+232B,U+00B7,U+2212,U+00B1,U+00B5" \
  --layout-features="kern,ccmp,mark,mkmk,locl,calt,tnum"
```

The subsetter drops name records 13 and 14, which carry the licence text and URL. Restore them verbatim from the upstream file afterwards, because OFL clause 2 requires the notice to travel with each copy and a binary that leaves this repository should carry it.

## Known gap

U+229E, the squared plus, is not in Inter. It is not in any of the sixteen faces surveyed, or in Arial. `packages/utils/src/keys.ts:130` returns it as the Windows key symbol and the shortcut dialog renders it at up to 63px, so it falls back on Windows. Subsetting cannot add a glyph that does not exist. Tracked separately.
