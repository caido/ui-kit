export default {
  root: ({ props, context }) => ({
    class: [
      "flex flex-col border-b border-line-default",
      {
        "[&>[data-pc-name=accordionheader]]:select-none [&>[data-pc-name=accordionheader]]:pointer-events-none [&>[data-pc-name=accordionheader]]:cursor-default [&>[data-pc-name=accordionheader]]:opacity-60":
          props?.disabled,
        "[&>[data-pc-name=accordionheader]]:text-fg-default hover:[&>[data-pc-name=accordionheader]]:text-fg-strong":
          !props.disabled && context.active,
        "[&>[data-pc-section=toggleicon]]:text-fg-default hover:[&>[data-pc-section=toggleicon]]:text-fg-strong":
          !props.disabled && context.active,
        "[&:last-child>[data-pc-name=accordioncontent]>[data-pc-section=content]]:rounded-b-md":
          !props.disabled && context.active,
        "[&:last-child>[data-pc-name=accordionheader]]:rounded-b-md":
          !props.disabled && !context.active,
      },
      "[&:nth-child(n+2)>[data-pc-name=accordionheader]]:border-t-0",
      "[&:first-child>[data-pc-name=accordionheader]]:rounded-t-md",
    ],
  }),
};
