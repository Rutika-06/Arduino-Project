<<<<<<< HEAD
# ArduinoHub Dashboard

A modern, production-ready React + Vite single-page application featuring a glassmorphism navbar, animated hero section, enquiry form with EmailJS integration, and a dark-themed footer.

---

## 🚀 Installation & Running Locally

```bash
# 1. Install dependencies (only need to do this once)
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# Vite will print a URL like: http://localhost:5173
```

### Building for production
```bash
npm run build    # Outputs to /dist folder
npm run preview  # Preview the production build locally
```

---

## 📧 EmailJS Setup (5 minutes)

EmailJS lets you send emails from the browser without a backend server.

### Step 1 — Create an account
Go to [https://www.emailjs.com](https://www.emailjs.com) and sign up.  
Free tier: 200 emails/month.

### Step 2 — Add an Email Service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose Gmail (or any other provider) and connect your account
3. Copy the **Service ID** (looks like `service_xxxxxxx`)

### Step 3 — Create an Email Template
1. Dashboard → **Email Templates** → **Create New Template**
2. Set the **Subject** to: `Thank You for Contacting ArduinoHub!`
3. Paste this into the **Body**:

```
Hi {{name}},

Thank you for reaching out to ArduinoHub! We've received your inquiry regarding: {{subject}}

Our team will review your message and get back to you within 24 hours at {{email}}.

Best regards,
ArduinoHub Team
```

4. Copy the **Template ID** (looks like `template_xxxxxxx`)

### Step 4 — Get your Public Key
1. Dashboard → **Account** → **API Keys**
2. Copy your **Public Key**

### Step 5 — Paste credentials into the code
Open `src/components/EnquiryForm.jsx` and replace the three placeholders:

```js
const EMAILJS_SERVICE_ID  = 'service_xxxxxxx'   // ← your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx'  // ← your Template ID
const EMAILJS_PUBLIC_KEY  = 'xxxxxxxxxxxxxxxxx'  // ← your Public Key
```

That's it — the form is now fully wired up.

---

## 📁 Folder Structure

```
arduinohub/
├── index.html                    # App entry HTML (loads Vite + fonts)
├── vite.config.js                # Vite + React plugin config
├── package.json                  # Dependencies and npm scripts
└── src/
    ├── main.jsx                  # ReactDOM.createRoot entry point
    ├── App.jsx                   # Root layout — assembles all sections
    ├── index.css                 # CSS variables (design tokens), resets, keyframes
    ├── App.css                   # All component styles
    └── components/
        ├── Navbar.jsx            # Sticky glassmorphism nav + mobile hamburger
        ├── Hero.jsx              # Animated hero with blob shapes and stat pills
        ├── EnquiryForm.jsx       # Validated form with EmailJS send logic
        └── Footer.jsx            # Three-column dark footer with social links
```

---

## 🎨 Customisation Quick Reference

| What to change | Where |
|---|---|
| Brand colors | `src/index.css` → `:root` CSS variables |
| Logo text | `src/components/Navbar.jsx` → `navbar__logo-text` |
| Nav links | `src/components/Navbar.jsx` → `NAV_LINKS` array |
| Hero headline / stats | `src/components/Hero.jsx` → `STATS` array and JSX |
| Footer contact details | `src/components/Footer.jsx` → address block |
| EmailJS credentials | `src/components/EnquiryForm.jsx` → top three constants |

---

## ♿ Accessibility Notes

- All form fields have `<label>` elements with `htmlFor` matching `id`
- Error messages use `role="alert"` so screen readers announce them
- Buttons have `aria-busy` during loading and `aria-expanded` for the hamburger
- Decorative elements use `aria-hidden="true"`
- External links use `rel="noopener noreferrer"` for security
=======
# Arduino-Project
this project contains an arduino dashboard
>>>>>>> 4ef9633fd9c86e11b067832eb671802ee2ec9dc8
