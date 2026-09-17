# Accents

Accents do not communicate meaning, unlike danger, success, or the other intents.

Use an accent where the user chooses a colour for their own content, or where colour separates one category from another without saying anything about it.

## When to use an accent

Ask whether the colour could be swapped for another without changing what the interface means.

If it could, it is an accent. A user tagging three requests in different colours is organising their own work, and nothing breaks if red and blue trade places.

If it could not, it is an intent. A failed request is red because red means failure, and turning it green would be wrong.

<DoDont image="accent">
  <template #do>
    <p>Use accents for rows a user has marked, where the colour is their choice.</p>
  </template>
  <template #dont>
    <p>Use an accent where the colour carries status. That is what the intents are for.</p>
  </template>
</DoDont>

## Row highlights

A user can mark any row in a table with one of nine colours. These are their colours, not ours, so the system preserves them rather than deriving new ones.

<TokenSwatches prefix="color.highlight" />

The dark values are the ones Caido has always shipped. The light values are adjusted so dark text still reads on them, because a highlight is a background for a row of text. The exact values are in [all tokens](/foundations/tokens/all.md).

Text on a highlighted row uses `fg-strong`. `fg-default` clears the contrast floor on three of the nine and fails the rest.

<DoDont image="highlight">
  <template #do>
    <p>Put <code>fg-strong</code> on a highlighted row, in every one of the nine colours.</p>
  </template>
  <template #dont>
    <p>Drop to a lighter foreground because it looks calmer on one of them.</p>
  </template>
</DoDont>

## Workflow node categories

Nodes in the workflow editor are coloured by what kind of node they are. This is categorisation, not status.

<TokenSwatches prefix="color.workflow-node" />

A node border is a stroke on a canvas rather than a background for text, so these darken in the light theme instead of moving toward a tint.

## Medals

<TokenSwatches prefix="color.medal" />

Gold, silver and bronze are not ours to choose. They are recognised by their colour, and repainting them removes the only thing they carry.

Their hue is fixed in both themes. Their lightness is not: bronze at its canonical value measures 2.97 against the dark page, which is under the floor, so it is lifted until it passes. All three darken in the light theme.

## Accent accessibility

An accent is still a colour behind or beside something, so it still has to be measured.

Pair `fg-strong` with any row highlight. Pair `fg-default` or `fg-strong` with a workflow node surface.

Accents are also the place where colour is most likely to be the only signal, since the user picked it and it carries no label. Keep a name, an icon, or a position alongside it.

<DoDont image="medal">
  <template #do>
    <p>Keep the rank written next to the medal, so the colour confirms it rather than carries it.</p>
  </template>
  <template #dont>
    <p>Leave three coloured discs to say first, second and third on their own.</p>
  </template>
</DoDont>

## Icons are not text

The foreground roles hold their colour back so small text stays legible.

An icon that carries meaning through its colour, like a medal, does not have that problem, and flattening it with a rule written for text would remove the point of it. Icons like these take an accent rather than a foreground.
