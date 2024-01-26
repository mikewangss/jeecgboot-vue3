import type { App } from 'vue';
import { createPinia } from 'pinia';
const store = createPinia();
export const CACHE_INCLUDED_ROUTES = 'CACHE_INCLUDED_ROUTES';
export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
