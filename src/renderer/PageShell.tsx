import "$/styles/global.css"
import type { PageContext } from "vike/types"
import { LayoutDefault } from "$/layouts/LayoutDefault"
import { PageContextProvider } from "$/context/pageContext"

export function PageShell({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: JSX.Children
}) {
  const PageLayout = pageContext.config.Layout
  return (
    <PageContextProvider pageContext={pageContext}>
      <LayoutDefault>
        {PageLayout ? <PageLayout>{children}</PageLayout> : children}
      </LayoutDefault>
    </PageContextProvider>
  )
}
