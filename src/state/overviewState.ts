/**
 * This is a store that hold right panel state on sidebar layouts
 * It could be one of the SidebarId
 *
 * We can import and set activeSidebar (or use toggleSidebar) anywhere in our project
 * @see /src/components/navigation/desktop/sidebar/SidebarColorCurved.vue
 * @see /src/pages/sidebar-blank-page-1.vue
 */

import { ref } from 'vue'

type SidebarId =
  | 'overview'
  | 'origin'
  | 'ssl'
  | 'firewall'
  | 'cache'
  | 'advanced'
  | 'domains'

export const activeSidebar = ref([
  { name: 'essential', open: false },
  { name: 'overview', open: false },
  { name: 'origin', open: false },
  { name: 'ssl', open: false },
  { name: 'firewall', open: false },
  { name: 'cache', open: false },
  { name: 'advanced', open: false },
  { name: 'domains', open: false },
])

export function toggleSidebar(sidebar: SidebarId) {
  const bool = activeSidebar.value.filter((e) => e.name == sidebar)[0].open
  activeSidebar.value.filter((e) => e.name == sidebar)[0].open = !bool
}
