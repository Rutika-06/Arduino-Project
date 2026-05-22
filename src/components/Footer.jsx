/*
 * Footer.jsx
 *
 * KEY PATTERNS USED:
 * - Data arrays (QUICK_LINKS, SOCIALS) outside the component — they never change,
 *   so defining them outside avoids recreating the array on every render.
 * - react-icons for social icons: FaLinkedin, FaTwitter, FaGithub are popular,
 *   well-maintained icons that match the brand style.
 * - rel="noopener noreferrer" on external links — security best practice.
 *   "noopener" prevents the new tab from accessing window.opener.
 *   "noreferrer" hides the referrer header.
 */

import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdArrowForwardIos,
  MdElectricBolt,
} from 'react-icons/md'
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'

// Data defined outside component — static, never changes, no need to re-declare each render
const QUICK_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Support', href: '#' },
]

const SOCIALS = [
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: FaTwitter,  label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: FaGithub,   label: 'GitHub', href: 'https://github.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()  // Dynamic year — no need to update manually

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">

        {/* ── Three-column grid ── */}
        <div className="footer__grid">

          {/* Column 1: About Us */}
          <div>
            <div className="footer__brand">
              <MdElectricBolt style={{ color: 'var(--secondary)', fontSize: '1.3rem' }} aria-hidden="true" />
              <span className="footer__brand-pill">ArduinoHub</span>
            </div>
            <h2 className="footer__col-title">About Us</h2>
            <p className="footer__about-text">
              We are a leading IoT solutions provider, specializing in Arduino-based
              automation systems. Our mission is to empower businesses with real-time
              data monitoring and intelligent dashboard solutions for smarter decision-making.
            </p>
          </div>

          {/* Column 2: Contact Information */}
          <div>
            <h2 className="footer__col-title">Contact Us</h2>
            <address style={{ fontStyle: 'normal' }}>  {/* address resets italic style */}
              <div className="footer__contact-item">
                <MdEmail className="footer__contact-icon" aria-hidden="true" />
                <a href="mailto:admin@arduinosystem.com">admin@arduinosystem.com</a>
              </div>
              <div className="footer__contact-item">
                <MdPhone className="footer__contact-icon" aria-hidden="true" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className="footer__contact-item">
                <MdLocationOn className="footer__contact-icon" aria-hidden="true" />
                <span>123 Tech Park, Khadki,<br />Pune, Maharashtra 411003</span>
              </div>
            </address>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h2 className="footer__col-title">Quick Links</h2>
            <nav aria-label="Footer navigation">
              <ul className="footer__links" role="list">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="footer__link">
                      <MdArrowForwardIos className="footer__link-arrow" aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>

        {/* ── Bottom bar: social icons + copyright ── */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} ArduinoHub Dashboard. All rights reserved.
          </p>

          <div className="footer__socials" role="list" aria-label="Social media links">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label={`Visit our ${label} page`}
                role="listitem"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
