/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import { i18n } from './vuetify'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(i18n)
}
