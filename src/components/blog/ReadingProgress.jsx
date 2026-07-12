import React from 'react';

/**
 * Fixed reading progress under the navbar.
 * Fills as the user scrolls the article, and supports click/drag scrubbing.
 */
export function ReadingProgress({ targetRef }) {
  const [progress, setProgress] = React.useState(0);
  const dragging = React.useRef(false);
  const trackRef = React.useRef(null);

  const getMetrics = React.useCallback(() => {
    const el = targetRef?.current;
    if (!el) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      return { start: 0, range: Math.max(1, docHeight), scrollTop };
    }
    const rect = el.getBoundingClientRect();
    const start = window.scrollY + rect.top - window.innerHeight * 0.12;
    const range = Math.max(1, el.offsetHeight - window.innerHeight * 0.35);
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return { start, range, scrollTop };
  }, [targetRef]);

  const progressFromScroll = React.useCallback(() => {
    const { start, range, scrollTop } = getMetrics();
    const raw = ((scrollTop - start) / range) * 100;
    return Math.min(100, Math.max(0, raw));
  }, [getMetrics]);

  const scrollToProgress = React.useCallback(
    (pct) => {
      const clamped = Math.min(100, Math.max(0, pct));
      const { start, range } = getMetrics();
      const top = start + (range * clamped) / 100;
      window.scrollTo({ top: Math.max(0, top), behavior: dragging.current ? 'auto' : 'smooth' });
      setProgress(clamped);
    },
    [getMetrics],
  );

  const pctFromPointer = (clientX) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    return ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
  };

  React.useEffect(() => {
    const onScroll = () => {
      if (dragging.current) return;
      setProgress(progressFromScroll());
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [progressFromScroll]);

  React.useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      scrollToProgress(pctFromPointer(e.clientX));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [scrollToProgress]);

  return (
    <div
      className="fixed inset-x-0 top-[4.5rem] z-40"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        ref={trackRef}
        className="group relative h-1.5 cursor-pointer bg-stone-200/90 transition-[height] hover:h-2.5"
        onPointerDown={(e) => {
          e.preventDefault();
          dragging.current = true;
          document.body.style.userSelect = 'none';
          document.body.style.cursor = 'grabbing';
          scrollToProgress(pctFromPointer(e.clientX));
        }}
        title="Drag or click to jump in the article"
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 transition-[width] duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 6px)` }}
          aria-hidden
        />
        <span className="pointer-events-none absolute right-3 top-3 rounded bg-stone-900/85 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white opacity-0 transition-opacity group-hover:opacity-100 sm:right-5">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
