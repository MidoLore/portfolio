import { useTheme } from '../themes/ThemeProvider';
import { THEMES } from '../themes/themes';

const SWATCHES = ['bg', 'surface', 'text', 'accent'];

// Content for the THEME window: a grid of cards, each previewing its own colors
function ThemePicker() {
  const { themeId, setTheme } = useTheme();

  return (
    <div className='p-6 grid grid-cols-4 gap-3 overflow-y-auto absolute inset-0 top-13 content-start'>
      {Object.entries(THEMES).map(([id, t]) => {
        const active = id === themeId;
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            aria-pressed={active}
            className='flex flex-col items-center gap-2 rounded-lg border-2 px-2 py-3 transition-transform hover:-translate-y-0.5'
            style={{
              background: t.colors.bg,
              color: t.colors.text,
              borderColor: active ? t.colors.accent : `${t.colors.accent}40`,
              boxShadow: active ? `0 0 12px ${t.colors.accent}80` : 'none',
            }}
          >
            <span className='flex'>
              {SWATCHES.map(k => (
                <span key={k} className='h-3 w-3 border border-black/40' style={{ background: t.colors[k] }} />
              ))}
            </span>
            <span className='text-sm tracking-widest whitespace-nowrap'>{id.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemePicker
