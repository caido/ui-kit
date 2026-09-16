export type Tab = {
  text: string;
  link: string;
};

export type Link = {
  text: string;
  link: string;
  tabs?: Tab[];
};

export type Group = Link & {
  items: Item[];
};

export type Item = Link | Group;

export type ThemeConfig = {
  navigation: Item[];
  search: { provider: "local" };
};

export const isGroup = (item: Item): item is Group => "items" in item;

const foundation = (text: string, slug: string): Link => ({
  text,
  link: `/foundations/${slug}`,
});

const component = (text: string, slug: string): Link => ({
  text,
  link: `/components/${slug}`,
  tabs: [
    { text: "Overview", link: `/components/${slug}` },
    { text: "Usage", link: `/components/${slug}/usage` },
  ],
});

export const navigation: Item[] = [
  {
    text: "Get started",
    link: "/get-started",
    items: [
      { text: "About the design system", link: "/get-started/about" },
      { text: "For plugin authors", link: "/get-started/plugins" },
      { text: "For contributors", link: "/get-started/contributing" },
    ],
  },
  {
    text: "Foundations",
    link: "/foundations",
    items: [
      {
        text: "Tokens",
        link: "/foundations/tokens",
        items: [
          { text: "Naming", link: "/foundations/tokens/naming" },
          { text: "Appearance", link: "/foundations/tokens/appearance" },
          { text: "Adding a token", link: "/foundations/tokens/adding" },
          { text: "All tokens", link: "/foundations/tokens/all" },
        ],
      },
      foundation("Colour", "colour"),
      foundation("Type", "type"),
      foundation("Space", "space"),
      foundation("Depth", "depth"),
      foundation("Motion", "motion"),
      foundation("Icons", "icons"),
      foundation("States", "states"),
      foundation("Feedback", "feedback"),
      foundation("Accessibility", "accessibility"),
      foundation("Theme", "theme"),
      foundation("Components", "components"),
    ],
  },
  {
    text: "Components",
    link: "/components",
    items: [
      component("Button", "button"),
      component("Card", "card"),
      component("Checkbox", "checkbox"),
      component("Dialog", "dialog"),
      component("Input", "input"),
      component("Menu", "menu"),
      component("Radio", "radio"),
      component("Segmented", "segmented"),
      component("Select", "select"),
      component("Table", "table"),
      component("Tabs", "tabs"),
      component("Tag", "tag"),
      component("Toast", "toast"),
      component("Toggle", "toggle"),
    ],
  },
  {
    text: "Guides",
    link: "/guides",
    items: [
      { text: "Theming", link: "/guides/theming" },
      { text: "Governance", link: "/guides/governance" },
      { text: "Enforcement", link: "/guides/enforcement" },
      { text: "Migration", link: "/guides/migration" },
    ],
  },
];

const leaves = (item: Item): Link[] =>
  isGroup(item) ? [item, ...item.items.flatMap(leaves)] : [item];

const pages = navigation.flatMap(leaves);

export const tabsForRoute = (path: string): Tab[] | undefined =>
  pages.find((page) => page.tabs?.some((tab) => tab.link === path) === true)
    ?.tabs;

export const containsRoute = (item: Item, path: string): boolean =>
  leaves(item).some(
    (page) =>
      page.link === path ||
      page.tabs?.some((tab) => tab.link === path) === true,
  );
