<template>
  <section id="faq" class="section alt">
    <div class="container">
      <div class="board">
        <div class="sticky-head">
          <h2>{{ $t('faq.title') }}</h2>
        </div>

        <div class="accordion">
          <details
            v-for="(item, i) in faqs"
            :key="i"
            class="tile fade-up"
            :open="i === 0"
          >
            <summary class="faq-q">
              <span>{{ item.q }}</span>
              <Plus :size="18" class="q-icon" />
            </summary>
            <div class="faq-a">{{ item.a }}</div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'

const { tm, rt } = useI18n()

const faqs = computed(() => {
  const items = tm('faq.items') as any[]
  return items.map((item) => ({
    q: rt(item.q),
    a: rt(item.a)
  }))
})
</script>

<style scoped>
.alt { background: var(--surface); padding-bottom: 120px; }
.board {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 8px;
}
@media (max-width: 860px) { .board { grid-template-columns: 1fr; } }

.sticky-head {
  align-self: start;
}
.sticky-head h2 { font-size: var(--fs-h1); }

.accordion { display: flex; flex-direction: column; gap: 8px; }

.tile {
  background: var(--tile);
  border-radius: var(--radius);
  overflow: hidden;
}
.tile[open] { background: var(--surface); }

.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--fg);
  cursor: pointer;
  list-style: none;
}
.faq-q::-webkit-details-marker { display: none; }
.q-icon {
  flex: none;
  color: var(--accent);
  transition: transform 300ms var(--ease);
}
.tile[open] .q-icon { transform: rotate(45deg); }

.faq-a {
  padding: 0 24px 20px;
  color: var(--fg);
  font-size: var(--fs-body);
  line-height: 1.75;
  max-width: 60ch;
}

@media (max-width: 480px) {
  .faq-q { padding: 16px 18px; font-size: var(--fs-sm); gap: 12px; }
  .faq-a { padding: 0 18px 16px; font-size: var(--fs-sm); }
  .sticky-head { position: static; }
}
</style>