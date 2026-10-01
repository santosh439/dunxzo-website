let extraActions = [];
const listeners = new Set();

export function spawnAction(action) {
  if (extraActions.some((a) => a.id === action.id)) return;
  extraActions = [action, ...extraActions];
  listeners.forEach((l) => l());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getExtraActions() {
  return extraActions;
}
