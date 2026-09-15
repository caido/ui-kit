import { ref, shallowRef } from "vue";

export type TabHandle = {
  tabs: string[];
  slugs: string[];
  active: number;
  panelId: string;
};

export const tabHandle = shallowRef<TabHandle | undefined>(undefined);

export const tabRevision = ref(0);

export const setTabHandle = (handle: TabHandle | undefined) => {
  tabHandle.value = handle;
  tabRevision.value += 1;
};
