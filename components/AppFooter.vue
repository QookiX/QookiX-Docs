<template>
  <footer class="footer">
    <div class="container">
      <div class="mark">QookiX</div>

      <div class="inner">
        <div class="brand">
          <p class="tagline">{{ $t('footer.tagline') }}</p>
        </div>

        <div class="cols">
          <div class="col">
            <h4>{{ $t('footer.product') }}</h4>
            <a href="#download">{{ $t('footer.download') }}</a>
            <a href="https://docs.qookix.cn" target="_blank" rel="noopener">{{ $t('footer.docs') }}</a>
            <a :href="REPO_URL + '/releases'" target="_blank" rel="noopener">Releases</a>
          </div>
          <div class="col">
            <h4>{{ $t('footer.resource') }}</h4>
            <a href="https://modrinth.com" target="_blank" rel="noopener">Modrinth</a>
            <a href="https://www.curseforge.com" target="_blank" rel="noopener">CurseForge</a>
            <a href="https://www.mcimg.com" target="_blank" rel="noopener">{{ $t('footer.mcimg') }}</a>
            <a href="#changelog">{{ $t('footer.changelog') }}</a>
          </div>
          <div class="col">
            <h4>{{ $t('footer.project') }}</h4>
            <a :href="REPO_URL" target="_blank" rel="noopener">GitHub</a>
            <a href="https://afdian.com/a/weimosheng" target="_blank" rel="noopener">{{ $t('footer.afdian') }}</a>
            <a :href="REPO_URL + '/issues'" target="_blank" rel="noopener">{{ $t('footer.feedback') }}</a>
            <a :href="REPO_URL + '/blob/main/LICENSE'" target="_blank" rel="noopener">GPL-3.0</a>
          </div>
        </div>
      </div>

      <div class="bottom">
        <span>{{ $t('footer.copyright') }}</span>
        <span>{{ $t('footer.tech') }}</span>
      </div>
      <div class="disclaimer">
        {{ $t('footer.disclaimer') }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { REPO_URL } from '~/composables/useReleases'
</script>

<style scoped>
.footer {
  padding-top: 80px;
  padding-bottom: 32px;
  background: var(--surface);
}
.mark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-hero);
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--fg);
  margin-bottom: 48px;
}

.inner {
  display: grid;
  grid-template-columns: 1.4fr 2fr;
  gap: 48px;
  padding-bottom: 32px;
}
@media (max-width: 768px) { .inner { grid-template-columns: 1fr; gap: 32px; } }

.tagline {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  max-width: 42ch;
  line-height: 1.6;
}

.cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 520px) { .cols { grid-template-columns: repeat(2, 1fr); } }
.col { display: flex; flex-direction: column; gap: 10px; }
.col h4 {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--fg);
  margin-bottom: 4px;
}
.col a {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  transition: color 200ms var(--ease);
}
.col a:hover { color: var(--accent); }

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 24px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
}
@media (max-width: 520px) { .bottom { flex-direction: column; align-items: flex-start; gap: 6px; } }
@media (max-width: 380px) {
  .cols { grid-template-columns: 1fr; gap: 18px; }
  .inner { gap: 24px; padding-bottom: 24px; }
  .footer { padding-top: 48px; }
}
.disclaimer {
  margin-top: 16px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.6;
  max-width: 60ch;
}
</style>