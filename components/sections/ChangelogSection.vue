<template>
  <section id="changelog" class="section">
    <div class="container">
      <div class="section-head">
        <h2>最近改了啥</h2>
      </div>

      <div v-if="entries.length" class="timeline">
        <div v-for="r in entries" :key="r.version" class="release fade-up">
          <div class="release-side">
            <div class="ver">{{ r.version }}</div>
            <div class="date">{{ r.date }}</div>
            <span class="status-tag" :class="{ latest: r === entries[0] }">{{ r === entries[0] ? '最新' : '稳定' }}</span>
          </div>
          <div class="release-body">
            <ul v-if="r.items.length" class="changes">
              <li v-for="(c, i) in r.items" :key="i" class="change">
                <span class="ctype" :class="`ctype--${c.type}`">{{ typeLabel(c.type) }}</span>
                <span class="ctext">{{ c.text }}</span>
              </li>
            </ul>
            <p v-else class="empty-body">该版本暂无变更说明。</p>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="skeleton">
        <div v-for="n in 3" :key="n" class="skel-row">
          <div class="skel-side"><div class="skel-line w60" /><div class="skel-line w40" /></div>
          <div class="skel-card"><div class="skel-line w90" /><div class="skel-line w70" /><div class="skel-line w80" /></div>
        </div>
        <p class="skel-hint">正在加载…</p>
      </div>

      <div v-else class="fallback">
        <p>暂时无法读取更新日志，你可以直接前往 GitHub Releases 查看全部变更。</p>
        <a class="btn btn-secondary" :href="REPO_URL + '/releases'" target="_blank" rel="noopener">前往 Releases</a>
      </div>

      <div v-if="entries.length" class="more">
        <a :href="REPO_URL + '/releases'" class="history-link" target="_blank" rel="noopener">
          查看完整更新日志
          <ArrowRight :size="16" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { useReleases, REPO_URL, type ChangelogEntry, type ChangeItem, formatDate } from '~/composables/useReleases'

const { fetchReleases, fetchChangelog } = useReleases()

const entries = ref<ChangelogEntry[]>([])
const loading = ref(true)

function parseBody(body: string, version: string, date: string): ChangelogEntry {
  const items: ChangeItem[] = []
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line || !/^[-*]/.test(line)) continue
    const text = line.replace(/^[-*]\s*/, '').replace(/^\[[^\]]*\]\s*/, '').trim()
    if (!text) continue
    const typeMap: Array<{ type: ChangeItem['type']; re: RegExp }> = [
      { type: 'new', re: /新增|新加|feature|add/i },
      { type: 'fix', re: /修复|修正|fix/i },
      { type: 'improve', re: /优化|改进|提升|update|change|refactor/i },
      { type: 'remove', re: /移除|删除|remove/i }
    ]
    let type: ChangeItem['type'] = 'improve'
    for (const t of typeMap) { if (t.re.test(text)) { type = t.type; break } }
    items.push({ type, text })
  }
  return { version, date, items: items.slice(0, 12) }
}

onMounted(async () => {
  try {
    const list = await fetchReleases()
    const recent = list.slice(0, 6)
    const results = await Promise.allSettled(
      recent.map(async (r) => {
        const cl = await fetchChangelog(r)
        if (cl && cl.items.length) return cl
        return parseBody(r.body || '', r.tag_name, formatDate(r.published_at))
      })
    )
    const out: ChangelogEntry[] = []
    results.forEach((res) => {
      if (res.status === 'fulfilled' && res.value) out.push(res.value)
    })
    if (out.length) entries.value = out
  } catch {} finally {
    loading.value = false
  }
})

function typeLabel(t: ChangeItem['type']) {
  return t === 'new' ? '新增' : t === 'improve' ? '优化' : t === 'fix' ? '修复' : t === 'remove' ? '移除' : '文档'
}
</script>

<style scoped>
.timeline { display: flex; flex-direction: column; gap: 8px; }
.release {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 8px;
  align-items: start;
}
@media (max-width: 720px) { .release { grid-template-columns: 1fr; } }

.release-side {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
@media (max-width: 720px) { .release-side { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 8px; } }
.ver { font-size: 1.05rem; font-weight: 600; color: var(--fg); }
.date { font-size: var(--fs-sm); color: var(--fg-muted); }
.status-tag {
  align-self: flex-start;
  margin-top: 4px;
  font-size: var(--fs-xs);
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--fg-muted);
}
.status-tag.latest { background: var(--accent); color: var(--accent-contrast); }

.release-body {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 20px 24px;
}
.changes { display: flex; flex-direction: column; gap: 10px; }
.change { display: flex; align-items: flex-start; gap: 12px; }
.ctype {
  flex: none;
  font-size: var(--fs-xs);
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius);
  margin-top: 1px;
}
.ctype--new { background: var(--success); color: var(--accent-contrast); }
.ctype--improve { background: var(--surface); color: var(--fg-muted); }
.ctype--fix { background: var(--accent); color: var(--accent-contrast); }
.ctype--remove { background: var(--surface); color: var(--fg-muted); }
.ctype--docs { background: var(--surface); color: var(--fg-muted); }
.ctext { font-size: var(--fs-body); color: var(--fg); line-height: 1.6; max-width: 60ch; }
@media (max-width: 480px) {
  .timeline { gap: 8px; }
  .release { gap: 8px; }
  .changes { gap: 8px; }
  .change { gap: 8px; }
  .ctext { font-size: var(--fs-xs); }
  .release-body { padding: 16px 18px; }
}
.empty-body { color: var(--fg-muted); font-size: var(--fs-body); }

.skeleton { display: flex; flex-direction: column; gap: 8px; }
.skel-row { display: grid; grid-template-columns: 160px 1fr; gap: 8px; }
@media (max-width: 720px) { .skel-row { grid-template-columns: 1fr; } }
.skel-side, .skel-card { display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: var(--radius); background: var(--tile); }
.skel-line { height: 12px; border-radius: 6px; background: var(--surface); }
.w40 { width: 40%; } .w60 { width: 60%; } .w70 { width: 70%; } .w80 { width: 80%; } .w90 { width: 90%; }
.skel-hint { text-align: center; color: var(--fg-subtle); font-size: var(--fs-sm); margin-top: 8px; }

.fallback { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px; text-align: center; color: var(--fg-muted); }

.more { margin-top: 24px; }
.history-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: color 200ms var(--ease);
}
.history-link:hover { color: var(--accent); }
</style>