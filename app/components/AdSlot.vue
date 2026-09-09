<script setup lang="ts">
// In-content ad slot (PRD §6.7 + "AdSense/SPA" rules):
//  - Real <ins class="adsbygoogle"> + exactly one push() per mounted unit, only when
//    ADSENSE_SLOT is configured (post-approval).
//  - Renders nothing in production before approval (no demo boxes).
//  - Dev-only placeholder so the layout can be QA'd.
// The recipe page gates this component by its content threshold — this component
// only handles "is there an adsense slot + how to render it".

const config = useRuntimeConfig()
const publisher = String(config.public.adsensePublisher || '')
const slot = String(config.public.adsenseSlot || '')

const showAd = computed(() => publisher && slot && /^ca-pub-\d{16}$/.test(publisher))
const devPlaceholder = import.meta.dev && !showAd.value

let scriptPromise: Promise<void> | null = null

function loadAdSenseScript(): Promise<void> {
  if (typeof window.adsbygoogle !== 'undefined') return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisher)}`
    s.async = true
    s.crossOrigin = 'anonymous'
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = null
      reject(new Error('AdSense script failed to load'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

onMounted(async () => {
  if (!showAd.value) return
  try {
    await loadAdSenseScript()
    await nextTick()
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // Leave the min-height reserve; no visible ad.
  }
})
</script>

<template>
  <div v-if="showAd" class="adslot" aria-hidden="true">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="publisher"
      :data-ad-slot="slot"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </div>
  <div v-else-if="devPlaceholder" class="adslot adslot--placeholder">
    <span>Ad slot — hidden after AdSense approval</span>
  </div>
</template>

<style scoped>
.adslot {
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.adslot--placeholder {
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--sand), transparent 55%);
  color: var(--muted-foreground);
  font-size: 0.8125rem;
}
</style>