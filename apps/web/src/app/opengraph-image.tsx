import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/constants/site-name';
import { getCatalogue } from '@/modules/catalogue/services/get-catalogue';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CATEGORY_COLORS: Record<string, string> = {
  foundations: '#4a6fa5',
  programming: '#c9a227',
  architecture: '#8b6ba8',
  data: '#4a9782',
  platform: '#5b8dbe',
  quality: '#a85f5f',
  security: '#b5734a',
  craft: '#7d9b6a',
  career: '#9b8aa6',
};

const SPINE_COUNT = 46;
const MAX_SPINE_HEIGHT = 150;
const MIN_SPINE_HEIGHT = 45;

export default async function Image() {
  const { books, stats } = await getCatalogue();

  const sample = books.slice(0, SPINE_COUNT);
  const maxPages = Math.max(...sample.map((book) => book.pages ?? 200), 1);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0b0d12',
        padding: '64px 64px 0 64px',
        fontFamily: 'serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 6,
            color: '#6b6659',
            textTransform: 'uppercase',
          }}
        >
          {stats.books} volumes · {stats.pages.toLocaleString('en')} pages
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 88,
            fontWeight: 700,
            color: '#e8e4da',
            marginTop: 18,
            lineHeight: 1.05,
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#9a9487',
            marginTop: 20,
            maxWidth: 820,
          }}
        >
          Software engineering books, drawn to scale.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 5,
          borderBottom: '2px solid #c9a227',
          paddingBottom: 0,
        }}
      >
        {sample.map((book) => {
          const ratio = Math.min((book.pages ?? 200) / maxPages, 1);
          const height = MIN_SPINE_HEIGHT + ratio ** 0.6 * (MAX_SPINE_HEIGHT - MIN_SPINE_HEIGHT);
          const color = CATEGORY_COLORS[book.category] ?? '#6b6659';

          return (
            <div
              key={book.path}
              style={{
                display: 'flex',
                width: 18,
                height,
                background: color,
                borderRadius: '2px 2px 0 0',
                opacity: 0.92,
              }}
            />
          );
        })}
      </div>
    </div>,
    size,
  );
}
