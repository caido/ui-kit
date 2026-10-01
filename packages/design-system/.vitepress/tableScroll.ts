import type { MarkdownRenderer } from "vitepress";

/**
 * Wraps every table so a table too wide for the column scrolls sideways on its
 * own, rather than squeezing its columns until words break mid-character.
 */
export const tableScroll = (md: MarkdownRenderer) => {
  const open = md.renderer.rules.table_open;
  const close = md.renderer.rules.table_close;

  md.renderer.rules.table_open = (tokens, index, options, env, self) =>
    `<div class="table-scroll">` +
    (open === undefined
      ? self.renderToken(tokens, index, options)
      : open(tokens, index, options, env, self));

  md.renderer.rules.table_close = (tokens, index, options, env, self) =>
    (close === undefined
      ? self.renderToken(tokens, index, options)
      : close(tokens, index, options, env, self)) + `</div>`;
};
