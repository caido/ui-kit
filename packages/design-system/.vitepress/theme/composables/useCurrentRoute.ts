import { useRoute } from "vitepress";
import { computed } from "vue";

export const useCurrentRoute = () => {
  const route = useRoute();

  return computed(() =>
    route.path.replace(/index\.html$/u, "").replace(/\.html$/u, ""),
  );
};
