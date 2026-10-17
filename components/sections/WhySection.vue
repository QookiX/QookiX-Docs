<template>
  <section id="why" class="section">
    <div class="container">
      <div class="section-head">
        <h2>{{ $t('why.title') }}</h2>
      </div>

      <div class="board">
        <div class="compare-tile fade-up">
          <div class="compare-row compare-head">
            <span v-for="(h, i) in head" :key="i">{{ h }}</span>
          </div>
          <div v-for="row in compare" :key="row.label" class="compare-row">
            <span class="compare-label">{{ row.label }}</span>
            <span class="compare-yes">
              <Check :size="16" />
              {{ row.us }}
            </span>
            <span class="compare-no">{{ row.them }}</span>
          </div>
        </div>

        <div class="stats-board">
          <div v-for="s in stats" :key="s.label" class="stat-tile fade-up">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

const { tm, rt } = useI18n()

const head = computed(() => {
  const items = tm('why.head') as any[]
  return items.map((item) => rt(item))
})

const compare = computed(() => {
  const items = tm('why.compare') as any[]
  return items.map((item) => ({
    label: rt(item.label),
    us: rt(item.us),
    them: rt(item.them)
  }))
})

const stats = computed(() => {
  const items = tm('why.stats') as any[]
  return items.map((item) => ({
    value: rt(item.value),
    label: rt(item.label)
  }))
})
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 8px;
}
@media (max-width: 860px) { .board { grid-template-columns: 1fr; } }

.compare-tile {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 28px;
  display: flex;
  flex-direction: column;
}
.compare-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 0;
  font-size: var(--fs-body);
  align-items: center;
}
.compare-row:not(:last-child) {
  margin-bottom: 4px;
}
.compare-row:nth-child(odd) {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 16px 12px;
  margin-inline: -12px;
}
.compare-head {
  font-weight: 600;
  color: var(--fg);
  padding-bottom: 16px;
}
.compare-head span:nth-child(2) { color: var(--accent); }
.compare-label { color: var(--fg); font-weight: 500; }
.compare-yes {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
}
.compare-no { color: var(--fg-muted); }

.stats-board {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.stat-tile {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}
.stat-value {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}
.stat-label {
  color: var(--fg);
  font-size: var(--fs-body);
}

@media (max-width: 480px) {
  .compare-tile { padding: 20px; }
  .compare-row { font-size: var(--fs-sm); gap: 8px; padding: 12px 0; }
  .stat-tile { padding: 22px 18px; }
  .stat-value { font-size: 1.5rem; }
}
</style>