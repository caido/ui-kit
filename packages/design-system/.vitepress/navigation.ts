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

const foundationWithTabs = (text: string, slug: string): Link => ({
  text,
  link: `/foundations/${slug}`,
  tabs: [
    { text: "Overview", link: `/foundations/${slug}` },
    { text: "Usage", link: `/foundations/${slug}/usage` },
    { text: "Reference", link: `/foundations/${slug}/reference` },
  ],
});

const tokensTabs: Tab[] = [
  { text: "Overview", link: "/foundations/tokens" },
  { text: "Usage", link: "/foundations/tokens/usage" },
  { text: "Reference", link: "/foundations/tokens/reference" },
  { text: "All tokens", link: "/foundations/tokens/all" },
];

const component = (text: string, slug: string): Link => ({
  text,
  link: `/components/${slug}`,
  tabs: [
    { text: "Overview", link: `/components/${slug}` },
    { text: "Usage", link: `/components/${slug}/usage` },
    { text: "Reference", link: `/components/${slug}/reference` },
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
        tabs: tokensTabs,
      },
      foundationWithTabs("Colour", "colour"),
      foundationWithTabs("Type", "type"),
      foundationWithTabs("Space", "space"),
      foundationWithTabs("Depth", "depth"),
      foundationWithTabs("Icons", "icons"),
      foundationWithTabs("Motion", "motion"),
      foundationWithTabs("States", "states"),
      foundationWithTabs("Feedback", "feedback"),
      foundationWithTabs("Accessibility", "accessibility"),
      foundationWithTabs("Theme", "theme"),
      foundationWithTabs("Components", "components"),
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
