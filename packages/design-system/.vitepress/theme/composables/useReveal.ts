import { onBeforeUnmount, onMounted } from "vue";

const SHOWN = "reveal-shown";

export const useReveal = () => {
  const elements: HTMLElement[] = [];

  let observer: IntersectionObserver | undefined;

  const register = (element: unknown) => {
    if (element instanceof HTMLElement) {
      elements.push(element);
      observer?.observe(element);
    }
  };

  onMounted(() => {
    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => element.classList.add(SHOWN));
      return;
    }

    // eslint-disable-next-line compat/compat -- the browsers this rule names have no IntersectionObserver, and the branch above has already shown every element to them
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(SHOWN);
          observer?.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    elements.forEach((element) => observer?.observe(element));
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
  });

  return { register };
};
