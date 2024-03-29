// https://vike.dev/onRenderClient
import type { OnRenderClientAsync } from "vike/types"
import { hydrate } from "kaioken/ssr"
import { getTitle } from "./utils"
import { App } from "./App"

export const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const container = document.getElementById("page-root")!

  if (!pageContext.isHydration) {
    document.title = getTitle(pageContext)
  } else {
    hydrate(App, container, { pageContext })
  }
}
