import { LogoIcon } from "./icons/LogoIcon"
import { MenuIcon } from "./icons/MenuIcon"
import { GithubIcon } from "./icons/GithubIcon"
import { CommandKeyIcon } from "./icons/keys/CommandKeyIcon"
import { useNavDrawer } from "$/state/navDrawer"
import { SITE_LINKS } from "$/constants"
import { usePageContext } from "$/context/pageContext"
import { isLinkActive, isMac as isMacImpl } from "$/utils"
import { useCommandPallete } from "$/state/commandPallete"
import { DiscordIcon } from "./icons/DiscordIcon"
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon"
import { SiteLangToggle } from "./SiteLangToggle"
import { useCallback, useLayoutEffect, useMemo, useState } from "kaioken"

export function Navbar() {
  const { setOpen } = useNavDrawer()
  const { urlPathname } = usePageContext()

  return (
    <nav className="flex items-center justify-between py-3 w-full">
      <div className="flex items-center gap-4 h-full">
      <button
          ariaLabel="Show menu"
          onclick={(e) => setOpen(true, e)}
          type="button"
          className="sm:hidden flex items-center justify-center h-full"
        >
          <MenuIcon />
        </button>

        <a href="/" className="hidden sm:flex items-center gap-1 h-full">
          <div className="flex items-center justify-center">
            <LogoIcon />
          </div>
          <span className="text-primary font-bold text-xl flex items-center">
            Kaioken
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-4 ml-2 h-full">
          {SITE_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : "_self"}
              className={`text-md flex items-center h-full ${
                isLinkActive(link.activePath ?? link.href, urlPathname)
                  ? "text-light"
                  : "text-muted hover:text-light"
              }`}
            >
              <span className="flex items-center">
                {link.title}
                {link.external && <ExternalLinkIcon className="ml-1" />}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 h-full">
        <SiteLangToggle />
        <SearchButton />
        <div className="flex items-center gap-3 h-full">
          <a
            href="https://github.com/CrimsonChi/kaioken"
            target="_blank"
            ariaLabel="Visit the Kaioken repo on GitHub"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <GithubIcon />
          </a>
          <a
            href="https://discord.gg/yspvgXegvs"
            target="_blank"
            ariaLabel="Join the Kaioken Discord server"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <DiscordIcon />
          </a>
        </div>
      </div>
    </nav>
  )
}

function SearchButton() {
  const { setOpen } = useCommandPallete()
  const [mounted, setMounted] = useState(false)
  const isMac = useMemo(() => mounted && isMacImpl(), [mounted])
  const handleClick = useCallback((e: MouseEvent) => setOpen(true, e), [])
  useLayoutEffect(() => setMounted(true), [])
  return (
    <button
      ariaLabel="Search documentation"
      type="button"
      className="flex leading-4 justify-between items-center flex-grow text-left sm:flex-grow-0 min-w-36 px-4 py-2 pr-2 gap-4 rounded border border-white border-opacity-10 bg-stone-950 hover:bg-stone-900"
      onclick={handleClick}
    >
      <span className="text-xs sm:hidden text-muted">Search...</span>
      <span className="hidden sm:flex text-muted">
        <span className="text-xs">Search Docs</span>
      </span>
      <span className="hidden sm:flex items-center gap-1 bg-light opacity-85 text-dark px-1 rounded text-[11px] font-mono">
        {!mounted ? (
          <span innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" />
        ) : isMac ? (
          <CommandKeyIcon width="0.7rem" height="0.7rem" />
        ) : (
          "Ctrl"
        )}
        <b>K</b>
      </span>
    </button>
  )
}
