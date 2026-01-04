import type { RouteRecordRaw } from "vue-router"

const routeFiles = import.meta.glob('./*.ts', { eager: true })

const routes: RouteRecordRaw[] = []

Object.keys(routeFiles).forEach((key) => {
  if (key === './index.ts') return;

  const module = routeFiles[key] as { default: RouteRecordRaw }

  routes.push(module.default)
})

export default routes