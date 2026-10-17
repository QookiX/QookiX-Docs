<template>
  <section id="download" class="section alt">
    <div class="container">
      <div class="section-head">
        <h2>{{ $t('download.title') }}</h2>
        <p class="section-sub">{{ $t('download.sub') }}</p>
      </div>

      <div class="action-tile fade-up">

        <div class="platforms">
          <button
            v-for="p in platformTabs"
            :key="p.id"
            class="platform"
            :class="{ active: selectedPlatform === p.id }"
            @click="selectedPlatform = p.id"
          >
            <component :is="p.icon" :size="20" class="p-icon" />
            <span>{{ p.name }}</span>
          </button>
        </div>

        <div v-if="loaded && currentAssets.length" class="download-area">
          <div class="dl-info">
            <div class="dl-ver">QookiX {{ latest?.tag_name }}</div>
            <div class="dl-meta">
              <span>{{ $t('download.published') }} {{ latest ? formatDate(latest.published_at) : '' }}</span>
              <span class="sep">·</span>
              <span>{{ latest?.name || latest?.tag_name }}</span>
            </div>
          </div>

          <div class="asset-list">
            <div v-for="a in currentAssets" :key="a.asset.name" class="asset-row">
              <div class="asset-meta">
                <span class="asset-arch">{{ a.arch }}</span>
                <span class="asset-file">{{ a.asset.name }}</span>
                <span class="asset-size">{{ a.displaySize }}</span>
              </div>
              <a class="btn btn-primary" :href="a.downloadUrl" target="_blank" rel="noopener">
                <Download :size="15" />
                {{ $t('download.btn') }}
              </a>
            </div>
          </div>
        </div>

        <div v-else-if="!loaded" class="placeholder">
          <span class="spinner" />
          <p>{{ $t('download.loading') }}</p>
        </div>

        <div v-else class="placeholder">
          <p>{{ $t('download.error') }}</p>
          <a class="btn btn-primary" :href="REPO_URL + '/releases'" target="_blank" rel="noopener">{{ $t('download.goto_releases') }}</a>
        </div>
      </div>

      <a :href="REPO_URL + '/releases'" class="history-link" target="_blank" rel="noopener">
        {{ $t('download.history') }}
        <ArrowRight :size="16" />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import { Monitor, Command, Terminal, Smartphone, Download, ArrowRight } from 'lucide-vue-next'
import { useReleases, REPO_URL, type Platform, type PlatformAsset, type GhRelease, formatDate } from '~/composables/useReleases'

const { fetchLatestRelease, fetchAndroidRelease, matchPlatformAssets, probeMirror } = useReleases()

const desktopLatest = ref<GhRelease | null>(null)
const androidLatest = ref<GhRelease | null>(null)
const desktopAssets = ref<PlatformAsset[]>([])
const androidAssets = ref<PlatformAsset[]>([])

const selectedPlatform = ref<Platform>('windows')
const loaded = ref(false)

const platformTabs: { id: Platform; name: string; icon: Component }[] = [
  { id: 'windows', name: 'Windows', icon: Monitor },
  { id: 'macos', name: 'macOS', icon: Command },
  { id: 'linux', name: 'Linux', icon: Terminal },
  { id: 'android', name: 'Android', icon: Smartphone }
]

const isAndroid = computed(() => selectedPlatform.value === 'android')
const latest = computed(() => (isAndroid.value ? androidLatest.value : desktopLatest.value))
const currentAssets = computed(() => {
  const list = isAndroid.value ? androidAssets.value : desktopAssets.value
  return list.filter((a) => a.platform === selectedPlatform.value)
})

onMounted(async () => {
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) selectedPlatform.value = 'android'
  else if (/Mac/i.test(ua)) selectedPlatform.value = 'macos'
  else if (/Linux/i.test(ua)) selectedPlatform.value = 'linux'
  else if (/Win/i.test(ua)) selectedPlatform.value = 'windows'

  await probeMirror()
  const [dr, ar] = await Promise.allSettled([fetchLatestRelease(), fetchAndroidRelease()])
  if (dr.status === 'fulfilled' && dr.value) {
    desktopLatest.value = dr.value
    desktopAssets.value = matchPlatformAssets(dr.value)
  }
  if (ar.status === 'fulfilled' && ar.value) {
    androidLatest.value = ar.value
    androidAssets.value = matchPlatformAssets(ar.value, false)
  }
  if (!currentAssets.value.length) {
    const all = [...desktopAssets.value, ...androidAssets.value]
    const first = all[0]
    if (first) selectedPlatform.value = first.platform
  }
  loaded.value = true
})
</script>

<style scoped>
.alt { background: var(--surface); }
.action-tile {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 32px;
  overflow: hidden;
}
@media (max-width: 480px) {
  .action-tile { padding: 20px; }
}

.platforms {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.platform {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--fg-muted);
  font-weight: 500;
  font-size: var(--fs-sm);
  transition: background 200ms var(--ease), color 200ms var(--ease);
}
.platform span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.platform:hover { color: var(--fg); }
.platform.active {
  background: var(--accent);
  color: var(--accent-contrast);
}
.p-icon { flex: none; }

.download-area { display: flex; flex-direction: column; gap: 16px; }
.dl-info {
  padding: 16px 20px;
  border-radius: var(--radius);
  background: var(--surface);
}
.dl-ver { font-weight: 600; font-size: 1.1rem; }
.dl-meta { margin-top: 4px; font-size: var(--fs-body); color: var(--fg-muted); display: flex; gap: 8px; flex-wrap: wrap; }
.sep { color: var(--fg-subtle); }

.asset-list { display: flex; flex-direction: column; gap: 8px; }
.asset-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius);
  background: var(--surface);
  flex-wrap: wrap;
}
.asset-meta { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; flex-wrap: wrap; }
.asset-arch {
  font-size: var(--fs-xs);
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--accent-contrast);
  flex: none;
}
.asset-file { font-size: var(--fs-body); color: var(--fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.asset-size { font-size: var(--fs-sm); color: var(--fg-muted); flex: none; }

.placeholder { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px 20px; text-align: center; color: var(--fg-muted); }
.spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.history-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: color 200ms var(--ease);
}
.history-link:hover { color: var(--accent); }

.section-sub {
  color: var(--fg);
  font-size: var(--fs-body);
  line-height: 1.7;
  max-width: 60ch;
  margin-top: 12px;
}

@media (max-width: 480px) {
  .platforms { gap: 4px; margin-bottom: 18px; }
  .platform { padding: 8px 4px; gap: 3px; font-size: 0.75rem; }
  .p-icon { width: 15px; height: 15px; flex: none; }
  .dl-info { padding: 14px 16px; }
  .dl-ver { font-size: 1rem; }
  .asset-row { flex-direction: column; align-items: stretch; gap: 10px; padding: 12px; }
  .asset-meta { gap: 8px; }
  .asset-file { flex-basis: 100%; max-width: 100%; white-space: normal; overflow-wrap: anywhere; overflow: visible; text-overflow: clip; }
}
@media (max-width: 440px) {
  .platform span { display: none; }
  .platform { padding: 10px; }
}
</style>