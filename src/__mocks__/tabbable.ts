import type * as tabbable from 'tabbable';

const lib = jest.requireActual<typeof tabbable>('tabbable');

const pf = {
  ...lib,
  tabbable: (node: Element, options?: tabbable.CheckOptions & tabbable.TabbableOptions) =>
    lib.tabbable(node, { ...options, displayCheck: 'none' }),
  focusable: (node: Element, options?: tabbable.CheckOptions) =>
    lib.focusable(node, { ...options, displayCheck: 'none' }),
  isFocusable: (node: Element, options?: tabbable.CheckOptions) =>
    lib.isFocusable(node, { ...options, displayCheck: 'none' }),
  isTabbable: (node: Element, options?: tabbable.CheckOptions) =>
    lib.isTabbable(node, { ...options, displayCheck: 'none' })
};

module.exports = pf;
