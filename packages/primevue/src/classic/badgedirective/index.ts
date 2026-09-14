export default {
  root: ({ context }) => ({
    class: [
      // Font
      "font-bold",
      "text-xs leading-5",

      // Alignment
      "flex items-center justify-center",
      "text-center",

      // Position
      "absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 origin-top-right",

      // Size
      "m-0",
      {
        "p-0": context.nogutter || context.dot,
        "px-2": !context.nogutter && !context.dot,
        "min-w-[0.5rem] w-2 h-2": context.dot,
        "min-w-[1.5rem] h-6": !context.dot,
      },

      // Shape
      {
        "rounded-full": context.nogutter || context.dot,
        "rounded-[10px]": !context.nogutter && !context.dot,
      },

      // Color
      {
        "bg-fill-primary":
          !context.info &&
          !context.success &&
          !context.warning &&
          !context.danger &&
          !context.help &&
          !context.secondary,
        "bg-fill-neutral text-fg-on-neutral": context.secondary,
        "bg-fill-success text-fg-on-success": context.success,
        "bg-fill-info text-fg-on-info": context.info || context.help,
        "bg-fill-warn text-fg-on-warn": context.warning,
        "bg-fill-danger text-fg-on-danger": context.danger,
      },
    ],
  }),
};
