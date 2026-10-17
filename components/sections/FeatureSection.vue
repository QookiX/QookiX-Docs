<template>
  <section id="features" class="section">
    <div class="container">
      <div class="section-head">
        <h2>{{ $t('features.title') }}</h2>
      </div>

      <div class="board">
        <article v-for="f in features" :key="f.title" class="tile fade-up" :class="f.cls">
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </article>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { tm, rt } = useI18n()

const featureCls = ['w7', 'w5', 'w4', 'w4', 'w4', 'w6', 'w6', 'w4', 'w4', 'w4']
const features = computed(() => {
  const items = tm('features.items') as any[]
  return items.map((item, i) => ({
    title: rt(item.title),
    desc: rt(item.desc),
    cls: featureCls[i]
  }))
})
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;
}
.tile {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background 200ms var(--ease);
}
.tile:hover { background: var(--surface); }
.tile h3 { font-size: 1.15rem; }
.tile p {
  color: var(--fg);
  font-size: var(--fs-body);
  line-height: 1.6;
  max-width: 52ch;
}


.w4 { grid-column: span 4; }
.w5 { grid-column: span 5; }
.w6 { grid-column: span 6; }
.w7 { grid-column: span 7; }
.w12 { grid-column: span 12; }

@media (max-width: 860px) {
  .board { grid-template-columns: repeat(12, 1fr); }
  .w4 { grid-column: span 12; }
  .w5 { grid-column: span 6; }
  .w6 { grid-column: span 12; }
  .w7 { grid-column: span 12; }
  .w12 { grid-column: span 12; }
}
@media (max-width: 560px) {
  .board { grid-template-columns: 1fr; gap: 0; }
  .w4, .w5, .w6, .w7, .w12 { grid-column: span 1; }
  .tile { background: none; padding: 22px 0; }
  .tile:hover { background: none; }
  .tile h3 { font-size: 1.1rem; }
}
</style>