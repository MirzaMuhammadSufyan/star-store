import React from 'react';

/**
 * Reading progress sits in its own strip BELOW the navbar + amber accent,
 * so the two never visually merge. Knob is always visible and scrubbable.
 *
 * Progress is scoped to the article column only — footer / chrome are excluded.
 */
export function ReadingProgress({ targetRef }) {
  const [progress, setProgress] = React.useState(0);
  const dragging = React.useRef(false);
  const trackRef = React.useRef(null);

  const getMetrics = React.useCallback(() => {
    const el = targetRef?.current;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Until the article mounts, keep a neutral range (do NOT fall back to
    // full document height — that incorrectly includes the site footer).
    if (!el) {
      return { start: 0, range: 1, scrollTop };
    }

    const articleTop = scrollTop + el.getBoundingClientRect().top;
    const articleHeight = el.offsetHeight;
    const viewHeight = window.innerHeight;

    // 0% when the article top reaches the reading chrome (navbar + progress).
    // 100% when the article bottom reaches the bottom of the viewport —
    // i.e. the article is fully read, before the footer.
    const chrome = 7 * 16; // ~4.5rem nav + progress strip
    const start = articleTop - chrome;
    const end = articleTop + articleHeight - viewHeight;
    const range = Math.max(1, end - start);

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

    // Recalculate when article images / typography change height
    const el = targetRef?.current;
    let ro;
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onScroll);
      ro.observe(el);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro?.disconnect();
    };
  }, [progressFromScroll, targetRef]);

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

  const knobLeft = `clamp(0px, calc(${progress}% - 7px), calc(100% - 14px))`;

  return (
    <div
      className="fixed inset-x-0 top-[4.5rem] z-40 border-b border-stone-200 bg-[#fafaf8]"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      {/* Clear gap under navbar amber stripe so the two lines never blend */}
      <div className="h-1.5 w-full bg-[#fafaf8]" aria-hidden />
      <div className="px-3 pb-2 sm:px-5 lg:px-6">
        <div
          ref={trackRef}
          className="relative h-1.5 cursor-pointer rounded-full bg-stone-200"
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
            className="absolute inset-y-0 left-0 rounded-full bg-amber-500 transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.25)] pointer-events-none"
            style={{ left: knobLeft }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
