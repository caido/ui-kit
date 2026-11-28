import { ref } from "vue";

const open = ref(false);

export const useSearch = () => {
  const openSearch = () => {
    open.value = true;
  };

  const closeSearch = () => {
    open.value = false;
  };

  return { open, openSearch, closeSearch };
};
