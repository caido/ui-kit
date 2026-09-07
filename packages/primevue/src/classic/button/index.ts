export default {
  root: ({ props, context, parent, instance }) => ({
    class: [
      "relative",

      // Fluid
      { "w-full": props.fluid },

      // Alignments
      "items-center inline-flex text-center align-bottom justify-center",
      {
        "flex-col":
          (props.iconPos === "top" || props.iconPos === "bottom") &&
          props.label,
      },

      // Sizes & Spacing
      "leading-[normal] text-nowrap",
      {
        "px-3 py-2": props.size === null,
        "text-sm py-1.5 px-3": props.size === "small",
        "text-xl py-3 px-4": props.size === "large",
      },
      { "gap-2": props.label !== null },
      {
        "w-10 px-0": props.label == null && props.icon !== null,
      },
      {
        "w-10 px-0 gap-0": instance.hasIcon && !props.label && !props.badge,
        "rounded-[50%] h-10 [&>[data-pc-section=label]]:w-0 [&>[data-pc-section=label]]:invisible":
          instance.hasIcon && !props.label && !props.badge && props.rounded,
      },

      // Shapes
      { "shadow-lg": props.raised },
      { "rounded-md": !props.rounded, "rounded-full": props.rounded },
      {
        "rounded-none first:rounded-l-md last:rounded-r-md":
          parent.instance.$name == "InputGroup",
      },

      // Link Button
      { "text-fg-primary bg-transparent border-transparent": props.link },

      // Plain Button
      {
        "text-fg-on-neutral bg-fill-neutral border border-fill-neutral":
          props.plain && !props.outlined && !props.text,
      },
      // Plain Text Button
      { "text-fg-muted": props.plain && props.text },
      // Plain Outlined Button
      {
        "text-surface-500 border border-line-strong":
          props.plain && props.outlined,
      },

      // Text Button
      { "bg-transparent border-transparent": props.text && !props.plain },

      // Outlined Button
      { "bg-transparent border": props.outlined && !props.plain },

      // --- Severity Buttons ---

      // Primary Button
      {
        "text-fg-on-primary":
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-primary":
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-primary":
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Primary Text Button
      {
        "text-fg-primary":
          props.text && props.severity === null && !props.plain,
      },
      // Primary Outlined Button
      {
        "text-fg-primary border border-fill-primary":
          props.outlined && props.severity === null && !props.plain,
      },

      // Secondary Button
      {
        "text-fg-on-secondary":
          props.severity === "secondary" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-secondary":
          props.severity === "secondary" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-secondary":
          props.severity === "secondary" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Secondary Text Button
      {
        "text-fg-secondary":
          props.text && props.severity === "secondary" && !props.plain,
      },
      // Secondary Outlined Button
      {
        "text-fg-secondary border border-line-secondary hover:bg-surface-secondary":
          props.outlined && props.severity === "secondary" && !props.plain,
      },

      // Success Button
      {
        "text-fg-on-success":
          props.severity === "success" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-success":
          props.severity === "success" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-success":
          props.severity === "success" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Success Text Button
      {
        "text-fg-success":
          props.text && props.severity === "success" && !props.plain,
      },
      // Success Outlined Button
      {
        "text-fg-success border border-fill-success hover:bg-surface-success":
          props.outlined && props.severity === "success" && !props.plain,
      },

      // Info Button
      {
        "text-fg-on-info":
          props.severity === "info" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-info":
          props.severity === "info" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-info":
          props.severity === "info" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Info Text Button
      {
        "text-fg-info": props.text && props.severity === "info" && !props.plain,
      },
      // Info Outlined Button
      {
        "text-fg-info border border-fill-info hover:bg-surface-info ":
          props.outlined && props.severity === "info" && !props.plain,
      },

      // Warning Button
      {
        "text-fg-on-warn":
          props.severity === "warn" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-warn":
          props.severity === "warn" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-warn":
          props.severity === "warn" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Warning Text Button
      {
        "text-fg-warn": props.text && props.severity === "warn" && !props.plain,
      },
      // Warning Outlined Button
      {
        "text-fg-warn border border-line-warn hover:bg-surface-warn":
          props.outlined && props.severity === "warn" && !props.plain,
      },

      // Help Button
      {
        "text-fg-on-info":
          props.severity === "help" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-info":
          props.severity === "help" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-info":
          props.severity === "help" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Help Text Button
      {
        "text-fg-info": props.text && props.severity === "help" && !props.plain,
      },
      // Help Outlined Button
      {
        "text-fg-info border border-line-info hover:bg-surface-info":
          props.outlined && props.severity === "help" && !props.plain,
      },

      // Danger Button
      {
        "text-fg-on-danger":
          props.severity === "danger" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-fill-danger":
          props.severity === "danger" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-fill-danger":
          props.severity === "danger" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Danger Text Button
      {
        "text-fg-danger":
          props.text && props.severity === "danger" && !props.plain,
      },
      // Danger Outlined Button
      {
        "text-fg-danger border border-fill-danger hover:bg-surface-danger":
          props.outlined && props.severity === "danger" && !props.plain,
      },

      // Contrast Button
      {
        "text-surface-900":
          props.severity === "contrast" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "bg-surface-300":
          props.severity === "contrast" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        "border border-surface-300":
          props.severity === "contrast" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Contrast Text Button
      {
        "text-fg-muted":
          props.text && props.severity === "contrast" && !props.plain,
      },
      // Contrast Outlined Button
      {
        "text-fg-muted border border-line-default":
          props.outlined && props.severity === "contrast" && !props.plain,
      },

      // --- Severity Button States ---

      // Link

      // Plain
      {
        "hover:bg-fill-neutral-hover hover:border-fill-neutral-hover":
          props.plain && !props.outlined && !props.text,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-300/10":
          props.plain && (props.text || props.outlined),
      },

      // Primary
      {
        "hover:bg-fill-primary-hover hover:border-fill-primary-hover":
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-primary":
          (props.text || props.outlined) &&
          props.severity === null &&
          !props.plain,
      },

      // Secondary
      {
        "hover:bg-fill-secondary-hover hover:border-fill-secondary-hover":
          props.severity === "secondary" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-secondary":
          (props.text || props.outlined) &&
          props.severity === "secondary" &&
          !props.plain,
      },

      // Success
      {
        "hover:bg-fill-success-hover hover:border-fill-success-hover":
          props.severity === "success" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-success":
          (props.text || props.outlined) &&
          props.severity === "success" &&
          !props.plain,
      },

      // Info
      {
        "hover:bg-fill-info-hover hover:border-fill-info-hover":
          props.severity === "info" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-info":
          (props.text || props.outlined) &&
          props.severity === "info" &&
          !props.plain,
      },

      // Warning
      {
        "hover:bg-fill-warn-hover hover:border-fill-warn-hover":
          props.severity === "warn" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-warn":
          (props.text || props.outlined) &&
          props.severity === "warn" &&
          !props.plain,
      },

      // Help
      {
        "hover:bg-fill-info-hover hover:border-fill-info-hover":
          props.severity === "help" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-info":
          (props.text || props.outlined) &&
          props.severity === "help" &&
          !props.plain,
      },

      // Danger
      {
        "hover:bg-fill-danger-hover hover:border-fill-danger-hover":
          props.severity === "danger" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-danger":
          (props.text || props.outlined) &&
          props.severity === "danger" &&
          !props.plain,
      },

      // Contrast
      {
        "hover:bg-surface-200 hover:border-surface-200":
          props.severity === "contrast" &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        "hover:bg-surface-hover":
          (props.text || props.outlined) &&
          props.severity === "contrast" &&
          !props.plain,
      },

      // Disabled
      { "opacity-60 pointer-events-none cursor-default": context.disabled },

      // Transitions
      "transition duration-200 ease-in-out",

      // Misc
      "cursor-pointer overflow-hidden select-none",

      // Badge
      "[&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4",
    ],
  }),
  label: ({ props }) => ({
    class: [
      "duration-200",
      "font-medium",
      "truncate",
      {
        "hover:underline": props.link,
      },
      { "flex-1": props.label !== null, "invisible w-0": props.label == null },
    ],
  }),
  icon: ({ props }) => ({
    class: [
      "text-base leading-4",
      "mx-0",
      {
        "mr-2": props.iconPos == "left" && props.label != null,
        "ml-2 order-1": props.iconPos == "right" && props.label != null,
        "order-2": props.iconPos == "bottom" && props.label != null,
      },
    ],
  }),
  loadingIcon: ({ props }) => ({
    class: [
      "h-4 w-4",
      "mx-0",
      {
        "mr-2": props.iconPos == "left" && props.label != null,
        "ml-2 order-1": props.iconPos == "right" && props.label != null,
        "mb-2": props.iconPos == "top" && props.label != null,
        "mt-2": props.iconPos == "bottom" && props.label != null,
      },
      "animate-spin",
    ],
  }),
  badge: ({ props }) => ({
    class: [
      {
        "ml-2 w-4 h-4 leading-none flex items-center justify-center":
          props.badge,
      },
    ],
  }),
};
