import { ref } from 'vue'

export const REPO = 'weimosheng/QookiX-Launcher'
export const REPO_URL = `https://github.com/${REPO}`
const API_BASE = `https://api.github.com/repos/${REPO}`
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`

const MIRROR_BASE = 'https://qookix.cn-nb1.rains3.com'
const MIRROR_RELEASE_JSON = `${MIRROR_BASE}/release.json`

export interface GhAsset {
  name: string
  browser_download_url: string
  size: number
  content_type?: string
}

export interface GhRelease {
  tag_name: string
  name: string
  published_at: string
  body: string
  prerelease: boolean
  html_url: string
  assets: GhAsset[]
}

export interface ChangeItem {
  type: 'new' | 'improve' | 'fix' | 'remove' | 'docs'
  text: string
}

export interface ChangelogEntry {
  version: string
  date: string
  items: ChangeItem[]
}

export type Platform = 'windows' | 'macos' | 'linux'

export interface PlatformAsset {
  platform: Platform
  label: string
  arch: string
  asset: GhAsset
  downloadUrl: string
  displaySize: string
}

let mirrorAvailable = false

function timeoutFetch(url: string, ms: number, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t))
}

function mirrorDownloadUrl(assetName: string): string {
  return `${MIRROR_BASE}/${assetName.replace(/QookiX\.Launcher/g, 'QookiX%20Launcher')}`
}

function normalizeRelease(data: any): GhRelease {
  return {
    tag_name: data.tag_name || '',
    name: data.name || data.tag_name || '',
    published_at: data.published_at || data.created_at || '',
    body: data.body || '',
    prerelease: data.prerelease || false,
    html_url: data.html_url || '',
    assets: (data.assets || []).map((a: any) => ({
      name: a.name || '',
      browser_download_url: a.browser_download_url || '',
      size: a.size || 0,
      content_type: a.content_type
    }))
  }
}

export async function probeMirror(): Promise<boolean> {
  if (mirrorAvailable) return true
  try {
    const res = await timeoutFetch(MIRROR_RELEASE_JSON, 6000)
    mirrorAvailable = res.ok
  } catch {}
  return mirrorAvailable
}

export async function fetchLatestRelease(): Promise<GhRelease | null> {
  try {
    const res = await timeoutFetch(MIRROR_RELEASE_JSON, 8000)
    if (res.ok) {
      const data = await res.json()
      if (data && data.tag_name && Array.isArray(data.assets)) {
        mirrorAvailable = true
        return normalizeRelease(data)
      }
    }
  } catch {}
  try {
    const res = await timeoutFetch(`${API_BASE}/releases/latest`, 8000, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    if (res.ok) return normalizeRelease(await res.json())
  } catch {}
  return null
}

const releases = ref<GhRelease[]>([])
const releasesLoading = ref(false)
let releasesFetched = false

async function fetchReleases(): Promise<GhRelease[]> {
  if (releasesFetched) return releases.value
  releasesLoading.value = true
  try {
    const res = await timeoutFetch(`${API_BASE}/releases?per_page=10`, 10000, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        releases.value = data.map(normalizeRelease)
        releasesFetched = true
      }
    }
  } catch {}
  if (!releasesFetched) {
    const latest = await fetchLatestRelease()
    if (latest) {
      releases.value = [latest]
      releasesFetched = true
    }
  }
  releasesLoading.value = false
  return releases.value
}

function normalizeType(raw: string): ChangeItem['type'] {
  const s = raw.toLowerCase().trim()
  if (/(新增|新|feature|add|new)/.test(s)) return 'new'
  if (/(优化|改进|提升|enhance|improve|perf|refactor)/.test(s)) return 'improve'
  if (/(修复|修正|fix|bug)/.test(s)) return 'fix'
  if (/(移除|删除|remove|delete|deprecat)/.test(s)) return 'remove'
  if (/(文档|doc)/.test(s)) return 'docs'
  return 'improve'
}

function parseChangelogJson(data: any, fallbackVersion?: string, fallbackDate?: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = []
  const toItems = (raw: any): ChangeItem[] => {
    if (!Array.isArray(raw)) return []
    return raw.map((it: any) => {
      if (typeof it === 'string') return { type: 'improve' as const, text: it }
      const text = it.text || it.desc || it.content || it.message || ''
      const type = normalizeType(it.type || it.kind || it.tag || text)
      return { type, text }
    })
  }

  if (Array.isArray(data)) {
    for (const e of data) {
      if (typeof e === 'string') continue
      entries.push({
        version: e.version || e.tag || e.tag_name || '',
        date: e.date || e.published_at || e.time || '',
        items: toItems(e.items || e.changes || e.notes || e.list || e.entries || [])
      })
    }
  } else if (data && typeof data === 'object') {
    if (data.version || data.items || data.changes || data.notes || data.entries) {
      entries.push({
        version: data.version || fallbackVersion || '',
        date: data.date || data.published_at || fallbackDate || '',
        items: toItems(data.items || data.changes || data.notes || data.list || data.entries || [])
      })
    } else {
      for (const [ver, val] of Object.entries(data)) {
        if (val && typeof val === 'object') {
          entries.push({
            version: ver,
            date: (val as any).date || (val as any).published_at || '',
            items: toItems((val as any).items || (val as any).changes || (val as any).notes || (val as any).list || (val as any).entries || [])
          })
        }
      }
    }
  }
  return entries.filter((e) => e.version || e.items.length)
}

let changelogPromise: Promise<ChangelogEntry[]> | null = null

async function loadGlobalChangelog(): Promise<ChangelogEntry[]> {
  if (changelogPromise) return changelogPromise
  changelogPromise = (async () => {
    const targets: string[] = []
    if (mirrorAvailable) targets.push(`${MIRROR_BASE}/changelog.json`)
    targets.push(`${RAW_BASE}/changelog.json`)
    for (const u of targets) {
      try {
        const res = await timeoutFetch(u, 8000)
        if (!res.ok) continue
        const data = JSON.parse(await res.text())
        const parsed = parseChangelogJson(data, '', '')
        if (parsed.length) return parsed
      } catch {}
    }
    return []
  })()
  return changelogPromise
}

async function fetchChangelog(release: GhRelease): Promise<ChangelogEntry | null> {
  const normVer = (v: string) => v.replace(/^v/i, '').trim()
  const matchEntry = (entries: ChangelogEntry[]): ChangelogEntry | null => {
    return entries.find((e) => normVer(e.version) === normVer(release.tag_name) || e.version === release.name) || null
  }

  const global = await loadGlobalChangelog()
  const found = matchEntry(global)
  if (found) return found

  const asset = release.assets.find((a) => /changelog\.json$/i.test(a.name))
  if (asset) {
    try {
      const res = await timeoutFetch(asset.browser_download_url, 8000)
      if (res.ok) {
        const data = JSON.parse(await res.text())
        const parsed = parseChangelogJson(data, release.tag_name, release.published_at)
        const matched = matchEntry(parsed)
        if (matched) return matched
        if (parsed.length) return parsed[0]
      }
    } catch {}
  }

  if (global.length) return global[0]
  return null
}

const PLATFORM_RULES: Array<{ platform: Platform; label: string; arch: string; test: RegExp }> = [
  { platform: 'windows', label: 'Windows', arch: '安装版', test: /x64[-_]?setup\.exe/i },
  { platform: 'windows', label: 'Windows', arch: '便携版', test: /portable.*\.zip/i },
  { platform: 'macos', label: 'macOS', arch: 'Apple Silicon', test: /aarch64.*\.dmg/i },
  { platform: 'macos', label: 'macOS', arch: '便携版', test: /app\.tar\.gz/i },
  { platform: 'linux', label: 'Linux', arch: 'AppImage', test: /\.appimage$/i },
  { platform: 'linux', label: 'Linux', arch: 'deb', test: /\.deb$/i },
  { platform: 'linux', label: 'Linux', arch: 'rpm', test: /\.rpm$/i }
]

export function matchPlatformAssets(release: GhRelease): PlatformAsset[] {
  const useMirror = mirrorAvailable
  const out: PlatformAsset[] = []
  const seen = new Set<string>()
  for (const asset of release.assets) {
    if (/\.sig$/i.test(asset.name)) continue
    for (const rule of PLATFORM_RULES) {
      if (rule.test.test(asset.name)) {
        const key = `${rule.platform}-${rule.arch}`
        if (seen.has(key)) continue
        seen.add(key)
        out.push({
          platform: rule.platform,
          label: rule.label,
          arch: rule.arch,
          asset,
          downloadUrl: useMirror ? mirrorDownloadUrl(asset.name) : asset.browser_download_url,
          displaySize: formatSize(asset.size)
        })
        break
      }
    }
  }
  return out
}

export function findPortable(release: GhRelease): { downloadUrl: string; displaySize: string; name: string } | null {
  const asset = release.assets.find((a) => /portable.*\.zip$|\.zip$.*portable/i.test(a.name))
  if (!asset) return null
  return {
    name: asset.name,
    downloadUrl: mirrorAvailable ? mirrorDownloadUrl(asset.name) : asset.browser_download_url,
    displaySize: formatSize(asset.size)
  }
}

export function formatSize(bytes: number): string {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function useReleases() {
  return {
    releases,
    releasesLoading,
    fetchReleases,
    fetchLatestRelease,
    fetchChangelog,
    matchPlatformAssets,
    findPortable,
    probeMirror
  }
}