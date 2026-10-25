<template>
  <div>
    <HeroSection />
    <FeatureSection />

    <WhySection />
    <DownloadSection />
    <ChangelogSection />
    <FaqSection />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const { t, tm, rt } = useI18n()

const jsonLd = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QookiX Launcher',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Windows, macOS, Linux, Android',
  description: t('seo.description'),
  url: 'https://www.qookix.cn/',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
  featureList: (tm('seo.featureList') as any[]).map((m) => rt(m))
}))

useHead({
  title: computed(() => t('seo.title')),
  meta: [
    { name: 'description', content: computed(() => t('seo.description')) }
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: jsonLd
  }]
})
</script>