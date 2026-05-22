/*
 * App.jsx — Root component.
 *
 * WHY THIS STRUCTURE?
 * Keeping App.jsx as a thin "layout assembler" makes it easy to:
 *  - Reorder sections (just move the JSX lines)
 *  - Add/remove sections without touching component logic
 *  - See the full page structure at a glance
 */

import './App.css'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import EnquiryForm  from './components/EnquiryForm'
import Footer       from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  )
}

export default App
