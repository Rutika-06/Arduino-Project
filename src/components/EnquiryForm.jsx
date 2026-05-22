/*
 * EnquiryForm.jsx
 *
 * KEY PATTERNS USED:
 *
 * 1. SINGLE STATE OBJECT for form data (formData) instead of one useState per field.
 *    This means one handleChange handler covers all fields — easy to add/remove fields.
 *
 * 2. SEPARATE STATE for errors (errors) — mirrors the shape of formData so each field
 *    can show its own inline error message independently.
 *
 * 3. CONTROLLED INPUTS — every <input> has value={formData.fieldName} + onChange={handleChange}.
 *    React is the "single source of truth"; the DOM never has data React doesn't know about.
 *
 * 4. LOADING STATE (isLoading) — disables the submit button and shows a spinner, preventing
 *    double-submission while the async EmailJS call is in flight.
 *
 * 5. EMAILJS — a client-side email service. No backend server needed. It calls the
 *    EmailJS REST API directly from the browser using your credentials.
 *    ⚠️  Important: the PUBLIC_KEY is safe to expose; SERVICE_ID and TEMPLATE_ID are
 *    not sensitive but should still be kept in environment variables in production.
 *
 * 6. GOOGLE SHEETS INTEGRATION — saves form data to Google Sheets using Apps Script Web App.
 *    Uses 'no-cors' mode to avoid CORS preflight issues with Google Apps Script.
 */

import { useState } from 'react'
import emailjs from 'emailjs-com'
import { MdEmail, MdCheckCircle, MdError } from 'react-icons/md'

// ─── EmailJS Configuration ────────────────────────────────────────────
// STEP 1: Sign up at https://www.emailjs.com (free tier: 200 emails/month)
// STEP 2: Create an Email Service (Gmail, Outlook, etc.) → copy the Service ID
// STEP 3: Create an Email Template using the variables below → copy Template ID
// STEP 4: Go to Account → API Keys → copy your Public Key
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// ─── Google Sheets Configuration ──────────────────────────────────────
// STEP 1: Create Google Sheet with columns: Timestamp, Name, Email, Phone, Subject, Message
// STEP 2: Go to Extensions → Apps Script → paste the doPost script
// STEP 3: Deploy as Web App (Execute as: Me, Access: Anyone) → copy Web App URL
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL
// Example: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

// Template variables used in your EmailJS template:
// {{name}}, {{email}}, {{phone}}, {{subject}}, {{message}}
// ─────────────────────────────────────────────────────────────────────

// Initial (blank) form state — extracted as a constant so we can easily reset the form
const INITIAL_FORM = {
  name:    '',
  email:   '',
  phone:   '',
  subject: '',
  message: '',
}

// ── Validation rules ──────────────────────────────────────────────────
function validate(formData) {
  const errs = {}

  if (!formData.name.trim())
    errs.name = 'Full name is required.'

  if (!formData.email.trim())
    errs.email = 'Email address is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errs.email = 'Please enter a valid email address.'

  if (!formData.phone.trim())
    errs.phone = 'Phone number is required.'
  else if (!/^\d{10}$/.test(formData.phone.replace(/\s|-/g, '')))
    errs.phone = 'Enter a valid 10-digit Indian phone number.'

  if (!formData.subject.trim())
    errs.subject = 'Subject is required.'

  if (!formData.message.trim())
    errs.message = 'Message is required.'
  else if (formData.message.trim().length < 20)
    errs.message = `Message too short (${formData.message.trim().length}/20 characters minimum).`

  return errs   // Empty object = valid
}
// ─────────────────────────────────────────────────────────────────────

export default function EnquiryForm() {
  // ── State declarations ──
  const [formData, setFormData]     = useState(INITIAL_FORM) // All field values
  const [errors,   setErrors]       = useState({})           // Per-field error messages
  const [isLoading, setIsLoading]   = useState(false)        // Prevents double-submit
  const [status,   setStatus]       = useState(null)         // 'success' | 'error' | null

  // ── Single onChange handler for all inputs/textarea ──
  // WHY: Instead of writing handleNameChange, handleEmailChange, etc.,
  // we use the input's `name` attribute to update the matching key in formData.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear that field's error as the user types (better UX than showing stale errors)
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // ── Form submission ──
  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent the browser's default page-reload on submit

    // Validate before sending
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return  // Stop here — don't call EmailJS with invalid data
    }

    setIsLoading(true)
    setStatus(null)

    // Build the template params object.
    // Keys here must exactly match the {{variables}} in your EmailJS template.
    const templateParams = {
      name:    formData.name,
      email:   formData.email,
      phone:   formData.phone,
      subject: formData.subject,
      message: formData.message,
    }

    try {
      // ─── STEP 1: Save to Google Sheets FIRST ───
      // WHY FIRST? If Google Sheets fails, we know before sending email.
      // Using 'no-cors' mode avoids CORS preflight issues with Google Apps Script.
      if (GOOGLE_SHEETS_URL) {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',  // Prevents CORS errors but we can't read response
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateParams)
        })
        console.log('✅ Data sent to Google Sheets')
      }

      // ─── STEP 2: Send email via EmailJS ───
      // emailjs.send() returns a Promise — we await it.
      // WHY emailjs-com? It handles the REST call, CORS headers, and serialization.
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      console.log('✅ EmailJS success:', result.status, result.text) // Debug log

      setStatus('success')
      setFormData(INITIAL_FORM)   // Reset all fields after success
      setErrors({})

    } catch (err) {
      console.error('❌ Error:', err)  // Debug log — check your credentials
      setStatus('error')
    } finally {
      // Always runs — whether success or error — to re-enable the button
      setIsLoading(false)
    }
  }

  // ── Derived values ──
  const msgLen = formData.message.trim().length  // For the live char counter

  return (
    <section className="form-section" id="contact" aria-labelledby="form-title">
      <div className="container">
        <div className="form-section__inner">
          <div className="form-card">

            {/* Card header */}
            <div className="form-card__header">
              <div className="form-card__icon" aria-hidden="true">
                <MdEmail />
              </div>
              <h2 className="form-card__title" id="form-title">
                Get In Touch With Us
              </h2>
              <p className="form-card__subtitle">
                Fill in the details below and we'll respond within 24 hours.
              </p>
            </div>

            {/* ── Status banners ── */}
            {status === 'success' && (
              <div className="form__banner form__banner--success" role="alert">
                <MdCheckCircle className="form__banner-icon" aria-hidden="true" />
                <span>
                  <strong>Message sent!</strong> Thank you! We've sent a confirmation to your email.
                </span>
              </div>
            )}

            {status === 'error' && (
              <div className="form__banner form__banner--error" role="alert">
                <MdError className="form__banner-icon" aria-hidden="true" />
                <span>
                  <strong>Something went wrong.</strong> Please check your connection and try again,
                  or email us directly at admin@arduinosystem.com.
                </span>
              </div>
            )}

            {/* ── Form ── */}
            {/*
              WHY noValidate?
              We want to run our own JS validation (with custom messages and red borders)
              instead of the browser's built-in popups. noValidate disables the browser UI
              while keeping the required attributes for accessibility.
            */}
            <form onSubmit={handleSubmit} noValidate aria-label="Contact enquiry form">

              {/* Row 1: Name + Email side by side */}
              <div className="form__row">

                <div className="form__field">
                  <label htmlFor="name" className="form__label">
                    Full Name <span className="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`form__input ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <span id="name-error" className="form__error-msg" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form__field">
                  <label htmlFor="email" className="form__label">
                    Email Address <span className="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form__input ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span id="email-error" className="form__error-msg" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

              </div>

              {/* Row 2: Phone + Subject side by side */}
              <div className="form__row">

                <div className="form__field">
                  <label htmlFor="phone" className="form__label">
                    Phone Number <span className="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`form__input ${errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
                    aria-invalid={!!errors.phone}
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                  />
                  {errors.phone
                    ? <span id="phone-error" className="form__error-msg" role="alert">{errors.phone}</span>
                    : <span id="phone-hint" className="form__char-count">10-digit Indian format</span>
                  }
                </div>

                <div className="form__field">
                  <label htmlFor="subject" className="form__label">
                    Subject <span className="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className={`form__input ${errors.subject ? 'error' : ''}`}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <span id="subject-error" className="form__error-msg" role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>

              </div>

              {/* Message — full width */}
              <div className="form__field">
                <label htmlFor="message" className="form__label">
                  Message <span className="required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`form__textarea ${errors.message ? 'error' : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-describedby={errors.message ? 'message-error' : 'message-count'}
                  aria-invalid={!!errors.message}
                  rows={5}
                />
                {errors.message
                  ? <span id="message-error" className="form__error-msg" role="alert">{errors.message}</span>
                  : <span id="message-count" className="form__char-count">{msgLen} / 20 min chars</span>
                }
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="form__submit"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="form__spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <MdEmail aria-hidden="true" />
                    Send Message
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}