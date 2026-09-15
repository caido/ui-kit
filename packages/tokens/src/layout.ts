import { dimensions, typeSteps } from "./__generated__/values";

const COMPACT_PADDING = dimensions.spacing / 2;

const BODY_LEADING_RATIO = typeSteps.body.leading / typeSteps.body.size;

export const rowHeight = (interfaceFontSize: number) =>
  Math.round(interfaceFontSize * BODY_LEADING_RATIO) + COMPACT_PADDING * 2;
