/*
 * Navbar.jsx
 *
 * KEY PATTERNS USED:
 * - useState(false) for menuOpen toggle — the simplest way to track boolean UI state.
 * - Conditional className strings — e.g. `navbar__hamburger ${menuOpen ? 'open' : ''}`
 *   lets CSS handle the animation logic (X icon, drawer visibility) purely via classes,
 *   keeping JavaScript free of animation details.
 * - Sticky positioning is done in CSS (position: sticky; top: 0) — no JS scroll listeners needed.
 */

import { useState } from 'react'
import { MdElectricBolt } from 'react-icons/md'  // WHY react-icons? Tree-shakeable SVG icons,
                                                   // no separate icon font download needed.

const NAV_LINKS = ['Home', 'Services', 'About', 'Contact']

export default function Navbar() {
  // Track whether the mobile menu drawer is open
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(prev => !prev)

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar__inner" aria-label="Main navigation">

          {/* ── Logo ── */}
          <a href="#" className="navbar__logo" aria-label="ArduinoHub home">
            <MdElectricBolt className="navbar__logo-icon" aria-hidden="true" />
            <span className="navbar__logo-text">ArduinoHub</span>
          </a>

          {/* ── Desktop Links ── */}
          <ul className="navbar__links" role="list">
            {NAV_LINKS.map(link => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="navbar__link"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Hamburger (mobile only, hidden via CSS on desktop) ── */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

        </nav>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        id="mobile-menu"
        className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}  // Close drawer when a link is tapped
          >
            {link}
          </a>
        ))}
      </div>
    </header>
  )
}
