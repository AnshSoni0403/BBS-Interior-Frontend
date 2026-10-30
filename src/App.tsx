import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger, resetScroll, useLenis } from './lib/motion'
import { Cursor, Footer, Navbar, PageTransition, Preloader } from './components/Chrome'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Ideas from './pages/Ideas'
import Post from './pages/Post'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  const lenis = useLenis()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <Navbar />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          resetScroll(lenis)
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }}
      >
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/journal/:slug" element={<Post />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </PageTransition>
      </AnimatePresence>
    </>
  )
}
