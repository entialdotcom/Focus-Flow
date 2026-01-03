import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const isDark = theme === 'dark';
      buttonRef.current.setAttribute('aria-pressed', isDark.toString());
    }
  }, [theme]);

  return (
    <>
      <style>{`
        .theme-toggle {
          -webkit-tap-highlight-color: transparent;
          width: clamp(120px, 20vmin, 180px);
          aspect-ratio: 8 / 3;
          border-radius: 100vh;
          border: 1px solid var(--border);
          position: relative;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--bg-secondary);
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1),
            0 1px 1px rgba(0,0,0,0.1);
          outline: none;
          z-index: 10;
          will-change: transform;
          isolation: isolate;
          transform: translate3d(0, 0, 0);
        }
        
        .theme-toggle:hover {
          transform: translateY(-1px) translate3d(0, 0, 0);
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1),
            0 2px 4px rgba(0,0,0,0.15);
        }
        
        .theme-toggle:active {
          transform: translateY(0) translate3d(0, 0, 0);
          box-shadow: 
            inset 0 2px 2px rgba(0,0,0,0.15),
            inset 0 -1px 0 rgba(255,255,255,0.05),
            0 0 0 rgba(0,0,0,0);
        }
        
        .theme-toggle:after {
          content: "";
          position: absolute;
          inset: 0;
          box-shadow:
            inset 0 -2px 2px 0 rgba(0,0,0,0.15),
            inset 0 2px 2px 0 rgba(0,0,0,0.65);
          border-radius: 100vh;
          pointer-events: none;
        }
        
        .theme-toggle__content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          border-radius: 100vh;
          display: block;
        }
        
        .theme-toggle__backdrop {
          overflow: visible !important;
          position: absolute;
          bottom: 0;
          width: 100%;
          left: 0;
          transition: translate 0.5s cubic-bezier(.4,-0.3,.6,1.3);
          translate: 0 calc(
            var(--is-dark, 0) * (100% - (3 / 8 * clamp(120px, 20vmin, 180px)))
          );
        }
        
        .theme-toggle__indicator {
          height: 100%;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          padding: 3%;
          transition: translate 0.5s cubic-bezier(.4,-0.3,.6,1.3);
          translate: calc(var(--is-dark, 0) * (100cqi - 100%)) 0;
        }
        
        .theme-toggle__star {
          height: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          position: relative;
          transition: translate 0.5s cubic-bezier(.4,-0.3,.6,1.3);
          translate: calc((var(--is-dark, 0) * -10%) + 5%) 0;
        }
        
        .theme-toggle__sun {
          background: #ffd700;
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          box-shadow:
            inset 2px 2px 4px 0 rgba(255,255,255,0.95),
            inset -2px -2px 4px 0 rgba(0,0,0,0.5);
        }
        
        .theme-toggle__moon {
          position: absolute;
          inset: -1%;
          border-radius: 50%;
          background: #d3d3d3;
          transition: translate 0.5s ease-in-out;
          translate: calc((100 - (var(--is-dark, 0) * 100)) * 1%) 0%;
          box-shadow:
            inset 2px 2px 4px 0 rgba(255,255,255,0.95),
            inset -2px -2px 4px 0 rgba(0,0,0,0.95);
        }
        
        .theme-toggle__crater {
          position: absolute;
          background: #a0a0a0;
          border-radius: 50%;
          width: calc(var(--size, 10) * 1%);
          aspect-ratio: 1;
          left: calc(var(--x) * 1%);
          top: calc(var(--y) * 1%);
          box-shadow:
            inset 2px 2px 2px 0 rgba(0,0,0,0.25),
            0 1px 2px 0 rgba(255,255,255,0.25);
        }
        
        .theme-toggle__crater:nth-of-type(1) {
          --size: 18;
          --x: 40;
          --y: 15;
        }
        .theme-toggle__crater:nth-of-type(2) {
          --size: 20;
          --x: 65;
          --y: 58;
        }
        .theme-toggle__crater:nth-of-type(3) {
          --size: 34;
          --x: 18;
          --y: 40;
        }
        
        .theme-toggle[aria-pressed="true"] {
          --is-dark: 1;
        }
        
        .theme-toggle[aria-pressed="false"] {
          --is-dark: 0;
        }
        
        .theme-toggle__stars path {
          transform-box: fill-box;
          transform-origin: 25% 50%;
          scale: calc(0.25 + (var(--is-dark, 0) * 0.75));
          transition: scale 0.5s 0.25s cubic-bezier(.4,-0.3,.6,1.3);
        }
        
        .theme-toggle__clouds path {
          fill: rgba(255,255,255,0.5);
        }
      `}</style>
      <button
        ref={buttonRef}
        className="theme-toggle"
        aria-pressed={theme === 'dark'}
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{ '--is-dark': theme === 'dark' ? 1 : 0 } as React.CSSProperties}
      >
        <span className="theme-toggle__content">
          {/* Day backdrop with clouds */}
          <svg
            aria-hidden="true"
            className="theme-toggle__backdrop"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 290 228"
          >
            <g className="theme-toggle__clouds">
              <path
                fill="#D9D9D9"
                d="M335 147.5c0 27.89-22.61 50.5-50.5 50.5a50.78 50.78 0 0 1-9.29-.853c-2.478 12.606-10.595 23.188-21.615 29.011C245.699 243.749 228.03 256 207.5 256a50.433 50.433 0 0 1-16.034-2.599A41.811 41.811 0 0 1 166 262a41.798 41.798 0 0 1-22.893-6.782A42.21 42.21 0 0 1 135 256a41.82 41.82 0 0 1-19.115-4.592A41.84 41.84 0 0 1 88 262c-1.827 0-3.626-.117-5.391-.343C74.911 270.448 63.604 276 51 276c-23.196 0-42-18.804-42-42s18.804-42 42-42c1.827 0 3.626.117 5.391.343C64.089 183.552 75.396 178 88 178a41.819 41.819 0 0 1 19.115 4.592C114.532 176.002 124.298 172 135 172a41.798 41.798 0 0 1 22.893 6.782 42.066 42.066 0 0 1 7.239-.773C174.137 164.159 189.749 155 207.5 155c.601 0 1.199.01 1.794.031A41.813 41.813 0 0 1 234 147h.002c.269-27.66 22.774-50 50.498-50 27.89 0 50.5 22.61 50.5 50.5Z"
              />
            </g>
          </svg>
          
          {/* Night backdrop with stars */}
          <svg
            aria-hidden="true"
            className="theme-toggle__backdrop"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 290 228"
          >
            <g>
              <g className="theme-toggle__stars">
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M61 11.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.749 3.749 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.749 3.749 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.749 3.749 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 61 11.5Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M62.5 45.219a.329.329 0 0 1 .315.238l.356 1.245a1.641 1.641 0 0 0 1.127 1.127l1.245.356a.328.328 0 0 1 0 .63l-1.245.356a1.641 1.641 0 0 0-1.127 1.127l-.356 1.245a.328.328 0 0 1-.63 0l-.356-1.245a1.641 1.641 0 0 0-1.127-1.127l-1.245-.356a.328.328 0 0 1 0-.63l1.245-.356a1.641 1.641 0 0 0 1.127-1.127l.356-1.245a.328.328 0 0 1 .315-.238Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M32 31.188a.28.28 0 0 1 .27.204l.305 1.067a1.405 1.405 0 0 0 .966.966l1.068.305a.28.28 0 0 1 0 .54l-1.068.305a1.405 1.405 0 0 0-.966.966l-.305 1.068a.28.28 0 0 1-.54 0l-.305-1.068a1.406 1.406 0 0 0-.966-.966l-1.067-.305a.28.28 0 0 1 0-.54l1.067-.305a1.406 1.406 0 0 0 .966-.966l.305-1.068a.281.281 0 0 1 .27-.203Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M41.5 74.219a.329.329 0 0 1 .315.238l.356 1.245a1.641 1.641 0 0 0 1.127 1.127l1.245.356a.328.328 0 0 1 0 .63l-1.245.356a1.641 1.641 0 0 0-1.127 1.127l-.356 1.245a.328.328 0 0 1-.63 0l-.356-1.245a1.641 1.641 0 0 0-1.127-1.127l-1.245-.356a.328.328 0 0 1 0-.63l1.245-.356a1.641 1.641 0 0 0 1.127-1.127l.356-1.245a.328.328 0 0 1 .315-.238Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M34 83.188a.28.28 0 0 1 .27.203l.305 1.068a1.405 1.405 0 0 0 .966.966l1.068.305a.28.28 0 0 1 0 .54l-1.068.305a1.405 1.405 0 0 0-.966.966l-.305 1.068a.28.28 0 0 1-.54 0l-.305-1.068a1.406 1.406 0 0 0-.966-.966l-1.068-.305a.28.28 0 0 1 0-.54l1.068-.305a1.406 1.406 0 0 0 .966-.966l.305-1.068a.281.281 0 0 1 .27-.204Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M63 89.25a.375.375 0 0 1 .36.272l.407 1.423a1.874 1.874 0 0 0 1.288 1.288l1.423.406a.374.374 0 0 1 0 .722l-1.423.406a1.874 1.874 0 0 0-1.288 1.288l-.407 1.423a.374.374 0 0 1-.72 0l-.407-1.423a1.874 1.874 0 0 0-1.288-1.288l-1.423-.406a.374.374 0 0 1 0-.722l1.423-.406a1.874 1.874 0 0 0 1.288-1.288l.407-1.423a.376.376 0 0 1 .36-.272Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M110.5 53.156a.236.236 0 0 1 .225.17l.254.89a1.174 1.174 0 0 0 .805.805l.89.254a.23.23 0 0 1 .122.084.233.233 0 0 1-.122.366l-.89.254a1.167 1.167 0 0 0-.805.805l-.254.89a.232.232 0 0 1-.225.17.235.235 0 0 1-.225-.17l-.254-.89a1.174 1.174 0 0 0-.805-.805l-.89-.254a.23.23 0 0 1-.122-.084.233.233 0 0 1 .122-.366l.89-.254a1.167 1.167 0 0 0 .805-.805l.254-.89a.232.232 0 0 1 .225-.17Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M120 27.188a.279.279 0 0 1 .27.204l.305 1.067a1.41 1.41 0 0 0 .966.966l1.067.305a.283.283 0 0 1 .148.1.286.286 0 0 1 0 .34.283.283 0 0 1-.148.1l-1.067.305a1.403 1.403 0 0 0-.966.966l-.305 1.067a.279.279 0 0 1-.439.147.275.275 0 0 1-.101-.147l-.305-1.067a1.41 1.41 0 0 0-.966-.966l-1.068-.305a.284.284 0 0 1-.147-.1.286.286 0 0 1 0-.34.284.284 0 0 1 .147-.1l1.068-.305a1.405 1.405 0 0 0 .966-.966l.305-1.067a.279.279 0 0 1 .27-.204Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M155 28.5a.753.753 0 0 1 .721.544l.813 2.846a3.746 3.746 0 0 0 2.576 2.576l2.846.813a.747.747 0 0 1 .543.721.75.75 0 0 1-.543.721l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.747.747 0 0 1-.721.543.749.749 0 0 1-.721-.543l-.813-2.846a3.746 3.746 0 0 0-2.576-2.576l-2.846-.813a.747.747 0 0 1-.543-.721.75.75 0 0 1 .543-.721l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.751.751 0 0 1 155 28.5Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M147 60.25a.377.377 0 0 1 .36.272l.407 1.423a1.883 1.883 0 0 0 1.288 1.288l1.423.407a.375.375 0 0 1 0 .72l-1.423.407a1.875 1.875 0 0 0-1.288 1.288l-.407 1.423a.371.371 0 0 1-.36.272.377.377 0 0 1-.36-.272l-.407-1.423a1.883 1.883 0 0 0-1.288-1.288l-1.423-.406a.375.375 0 0 1 0-.722l1.423-.406a1.875 1.875 0 0 0 1.288-1.288l.407-1.423a.372.372 0 0 1 .36-.272Z"
                    clipRule="evenodd"
                  />
                </g>
                <g>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M125.5 76.344a.513.513 0 0 1 .496.374l.559 1.956a2.574 2.574 0 0 0 1.771 1.771l1.956.56a.514.514 0 0 1 .27.805.514.514 0 0 1-.27.186l-1.956.559a2.57 2.57 0 0 0-1.771 1.77l-.559 1.957a.514.514 0 0 1-.806.27.514.514 0 0 1-.186-.27l-.559-1.956a2.574 2.574 0 0 0-1.771-1.771l-1.956-.56a.514.514 0 0 1-.27-.805.514.514 0 0 1 .27-.186l1.956-.559a2.57 2.57 0 0 0 1.771-1.77l.559-1.957a.515.515 0 0 1 .496-.374Z"
                    clipRule="evenodd"
                  />
                </g>
              </g>
            </g>
          </svg>
          
          {/* Indicator with sun/moon */}
          <span className="theme-toggle__indicator-wrapper">
            <span className="theme-toggle__indicator">
              <span className="theme-toggle__star">
                <span className="theme-toggle__sun"></span>
                <span className="theme-toggle__moon">
                  <span className="theme-toggle__crater"></span>
                  <span className="theme-toggle__crater"></span>
                  <span className="theme-toggle__crater"></span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </button>
    </>
  );
};

export default ThemeToggle;

