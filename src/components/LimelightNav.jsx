import { useState, useRef, useLayoutEffect, useEffect, cloneElement } from 'react';

const PRIMARY = '#ffffff';

export function LimelightNav({ items = [], activeIndex: activeIndexProp = -1 }) {
  const [activeIndex, setActiveIndex] = useState(activeIndexProp);
  const [isReady, setIsReady]         = useState(false);
  const navItemRefs = useRef([]);
  const limelightRef = useRef(null);

  // Stay in sync with the route-driven prop
  useEffect(() => {
    setActiveIndex(activeIndexProp);
  }, [activeIndexProp]);

  useLayoutEffect(() => {
    const limelight  = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    if (!limelight) return;

    if (activeIndex >= 0 && activeItem) {
      limelight.style.visibility = 'visible';
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
      if (!isReady) setTimeout(() => setIsReady(true), 50);
    } else {
      // No active item — hide completely so the box-shadow doesn't bleed in
      limelight.style.visibility = 'hidden';
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) return null;

  return (
    <nav style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      height: 64,
      borderRadius: 14,
      background: '#000000',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      padding: '0 8px',
      color: '#ffffff',
    }}>
      {items.map(({ id, icon, label, onClick }, index) => (
        <div
          key={id}
          ref={el => (navItemRefs.current[index] = el)}
          onClick={onClick}
          title={label}
          role="button"
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '0 22px',
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
          }}
        >
          {cloneElement(icon, {
            style: {
              width: 22,
              height: 22,
              transition: 'opacity 0.2s ease',
              opacity: activeIndex === index ? 1 : 0.35,
              ...(icon.props.style || {}),
            },
          })}
        </div>
      ))}

      {/* Sliding limelight bar */}
      <div
        ref={limelightRef}
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 10,
          width: 44,
          height: 5,
          borderRadius: 9999,
          background: PRIMARY,
          boxShadow: `0 50px 15px ${PRIMARY}`,
          left: '-999px',
          transition: isReady ? 'left 0.35s ease-in-out' : 'none',
        }}
      >
        {/* Cone glow */}
        <div style={{
          position: 'absolute',
          left: '-30%',
          top: 5,
          width: '160%',
          height: 56,
          clipPath: 'polygon(5% 100%, 25% 0, 75% 0, 95% 100%)',
          background: `linear-gradient(to bottom, ${PRIMARY}55, transparent)`,
          pointerEvents: 'none',
        }} />
      </div>
    </nav>
  );
}
