import { useState, useEffect } from 'react'
import type { NavbarLink } from '@explainer/ui'
import { LocaleSwitcher, MobileMenu, MobileNavLinks, Navbar, getAppLinks } from '@explainer/ui'
import { useTranslations } from '../i18n/utils'

interface BlogNavbarProps {
  activePath: string
  appUrlOverrides?: Partial<Record<string, string>>
  locale: string
  locales: string[]
  localeSwitchUrls: Record<string, string>
}

export function BlogNavbar({ activePath, appUrlOverrides, locale: initialLocale, locales, localeSwitchUrls }: BlogNavbarProps) {
  const isListing = activePath === '/' || activePath === ''
  const [locale, setLocale] = useState(initialLocale)

  useEffect(() => {
    if (!isListing) {
      setLocale(initialLocale)
      return
    }
    // On the listing page the server always renders with defaultLang.
    // Read the locale the inline script already detected from the cookie/browser.
    const detected = (window as any).__detectedLocale as string | undefined
    if (detected) setLocale(detected)

    const handleLocaleChange = (e: Event) => {
      setLocale((e as CustomEvent<{ locale: string }>).detail.locale)
    }
    window.addEventListener('locale:change', handleLocaleChange)
    return () => window.removeEventListener('locale:change', handleLocaleChange)
  }, [initialLocale])
  const appLinks = getAppLinks('blog', appUrlOverrides)
  const t = useTranslations(locale)

  const blogLinks: NavbarLink[] = [
    { label: t('nav.allArticles'), href: '/', icon: 'lucide:newspaper' },
    { label: t('nav.rss'), href: `/${locale}/rss.xml`, icon: 'lucide:rss' },
  ]

  const handleListingLocaleChange = isListing
    ? (newLocale: string) => {
        setLocale(newLocale)
        document.querySelectorAll<HTMLElement>('[data-locale]').forEach((el) => {
          el.style.display = el.dataset.locale === newLocale ? '' : 'none'
        })
        window.dispatchEvent(new CustomEvent('locale:change', { detail: { locale: newLocale } }))
        document.dispatchEvent(new Event('tags:filter'))
      }
    : undefined

  return (
    <Navbar
      currentApp="blog"
      appUrlOverrides={appUrlOverrides}
      brandHref={appUrlOverrides?.website ?? '/'}
      links={blogLinks}
      activePath={activePath}
      leftSlot={
        <MobileMenu>
          <MobileNavLinks
            links={blogLinks}
            appLinks={appLinks}
            activePath={activePath}
          />
        </MobileMenu>
      }
      rightSlot={
        <LocaleSwitcher
          locales={locales}
          currentLocale={locale}
          switchUrls={isListing ? {} : localeSwitchUrls}
          onLocaleChange={handleListingLocaleChange}
        />
      }
    />
  )
}
