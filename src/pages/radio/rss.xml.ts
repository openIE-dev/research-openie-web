import type { APIRoute } from 'astro';
import radioFeed from '../../data/radio-feed.json' with { type: 'json' };
import coverageSummary from '../../data/coverage-summary.json' with { type: 'json' };

const BASE = 'https://research.openie.dev';

function escXml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc2822(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date('2026-11-26T09:30:00Z').toUTCString() : d.toUTCString();
}

function fmtItunesDuration(sec: number): string {
  const total = Math.max(1, Math.round(sec));
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return hh > 0
    ? `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    : `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export const GET: APIRoute = async () => {
  const episodes = [...(radioFeed.episodes || [])].sort((a, b) => b.number - a.number);
  const lastBuild = episodes[0]?.published_utc || radioFeed.generated_at_utc;
  const disclosure = radioFeed.ai_disclosure;
  const radioAssetsMap: Record<string, any> = (coverageSummary as any).radio_assets || {};

  const itemsXml = episodes
    .map((ep) => {
      const ra = radioAssetsMap[ep.id] || {};
      const audioAbs = `${BASE}${ep.audio_url}`;
      const opusRel = ra.opus_url || `/media/radio/opus/${ep.id}.opus`;
      const opusAbs = `${BASE}${opusRel}`;
      const opusBytes = ra.opus_bytes || Math.max(48000, Math.round((ep.duration_sec || 180) * 3000));
      const vttAbs = `${BASE}${ep.captions_url}`;
      const brailleAbs = `${BASE}/transcripts/${ep.id}/`;
      const sourceSheetAbs = `${BASE}${ra.source_sheet_url || '/sourcesheets/'}`;
      const pageAbs = `${BASE}/radio/#${ep.id}`;
      const panelStr = Array.isArray((ep as any).panel) && (ep as any).panel.length ? `Roundtable Cast: ${(ep as any).panel.join(', ')}. ` : '';
      const fullDesc = `${panelStr}${ep.summary} — Source sheet: ${sourceSheetAbs} · Braille HTML transcript: ${brailleAbs} — ${disclosure}`;
      return `    <item>
      <guid isPermaLink="false">openie-radio-${escXml(ep.id)}</guid>
      <title>${escXml(`Ep. ${ep.number}: ${ep.title}`)}</title>
      <link>${escXml(pageAbs)}</link>
      <pubDate>${escXml(toRfc2822(ep.published_utc))}</pubDate>
      <description>${escXml(fullDesc)}</description>
      <itunes:subtitle>${escXml(ep.subtitle)}</itunes:subtitle>
      <itunes:summary>${escXml(fullDesc)}</itunes:summary>
      <itunes:author>Open Interface Engineering</itunes:author>
      <itunes:episode>${ep.number}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
      <itunes:duration>${fmtItunesDuration(ep.duration_sec)}</itunes:duration>
      <enclosure url="${escXml(audioAbs)}" length="${ep.byte_length}" type="audio/x-m4a" />
      <podcast:alternateEnclosure type="audio/ogg; codecs=opus" length="${opusBytes}" bitrate="24000" title="Low-Bandwidth 24 kbps Opus">
        <podcast:source uri="${escXml(opusAbs)}" />
      </podcast:alternateEnclosure>
      <podcast:transcript url="${escXml(vttAbs)}" type="text/vtt" language="en" />
      <podcast:transcript url="${escXml(brailleAbs)}" type="text/html" language="en" />
    </item>`;
    })
    .join('\n');

  const channelDesc = `${radioFeed.subtitle} ${disclosure} Per-language RSS feeds: ${BASE}/radio/<lang>/rss.xml · Coverage matrix: ${BASE}/coverage.json`;

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${escXml(radioFeed.title)}</title>
    <link>${BASE}/radio/</link>
    <language>en-us</language>
    <copyright>Open Interface Engineering, Inc. (CC-BY-4.0 Audio · CC0-1.0 Metadata)</copyright>
    <lastBuildDate>${escXml(toRfc2822(lastBuild))}</lastBuildDate>
    <atom:link href="${BASE}/radio/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escXml(channelDesc)}</description>
    <itunes:author>Open Interface Engineering</itunes:author>
    <itunes:summary>${escXml(channelDesc)}</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:owner>
      <itunes:name>Open Interface Engineering</itunes:name>
      <itunes:email>research@openie.dev</itunes:email>
    </itunes:owner>
    <itunes:category text="Science" />
    <itunes:category text="Technology" />
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
