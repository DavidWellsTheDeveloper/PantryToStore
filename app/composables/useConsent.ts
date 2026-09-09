// Google Consent Mode v2 + lightweight CMP (PRD §6.7).
// Ads default to non-personalized (denied) until the visitor opts in; the choice is
// stored in a first-party cookie so it survives navigation. The CMP banner only
// appears once the AdSense publisher id is configured (post-approval).

const CONSENT_COOKIE = 'pts-consent'
const ACCEPTED = 'accepted'

type ConsentState = { ad_storage: string; ad_user_data: string; ad_personalization: string; analytics_storage: string }

const DENIED: ConsentState = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
}
const GRANTED: ConsentState = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
}

function rawCookie(name: string): string | undefined {
  const hit = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))
  if (!hit) return undefined
  return decodeURIComponent(hit.slice(name.length + 1))
}

function updateTag(state: ConsentState) {
  window.gtag?.('consent', 'update', state)
}

/** Runs early (client plugin) so consent defaults precede any ad script. */
export function initConsentMode(): ConsentState {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    const layer = window.dataLayer
    window.gtag = (...args: unknown[]) => {
      layer.push(args as unknown[])
    }
  }
  window.gtag('consent', 'default', DENIED)
  const stored = rawCookie(CONSENT_COOKIE)
  const granted = stored === ACCEPTED
  if (granted) {
    updateTag(GRANTED)
    return GRANTED
  }
  return DENIED
}

export function useConsent() {
  const adsConfigured = Boolean(useRuntimeConfig().public.adsensePublisher)
  const decided = useState<boolean>('consent-decided', () => false)
  const showBanner = computed(() => adsConfigured && !decided.value)

  function decide(accept: boolean) {
    const state = accept ? GRANTED : DENIED
    document.cookie = `${CONSENT_COOKIE}=${accept ? ACCEPTED : 'rejected'}; path=/; max-age=31536000; samesite=lax`
    updateTag(state)
    decided.value = true
  }

  return { showBanner, decide }
}