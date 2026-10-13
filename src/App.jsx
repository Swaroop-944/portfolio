import { ArrowDownRight, ArrowUpRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import profilePhoto from './assets/profile.jpg'
import './App.css'

const projects = [
  {
    title: 'Restaurant Ordering Web Application',
    context: 'Presidency College, Bengaluru · 2026',
    description: 'Built a full-stack ordering experience with secure authentication, menu browsing, cart management, and order tracking. Added an admin dashboard for managing menu items and customer orders.',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST API'],
  },
  {
    title: 'E-Voting System',
    context: "Bhandarkars' Arts & Science College · 2026",
    description: 'Developed a web-based voting system to support secure digital voting and reduce manual voting effort.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Apache Database Management System (DBMS)'],
  },
  {
    title: 'Booking Website',
    context: "Bhandarkars' Arts & Science College · 2025",
    description: 'Designed and built a web-based booking system to manage reservations and user details end to end.',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
  },
  {
    title: 'Internship Portal',
    context: "Bhandarkars' Arts & Science College · 2025",
    description: 'Developed a web portal for managing student internship details and applications.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Apache Database'],
  },
]

const education = [
  { qualification: 'Master of Computer Applications', institution: 'Presidency College, Bengaluru', period: 'Pursuing', result: 'SGPA 8.1 / 10' },
  { qualification: 'Bachelor of Science', institution: "Bhandarkars' Arts & Science College, Kundapura", period: '2022–2025', result: 'CGPA 8.59 / 10' },
  { qualification: 'Class XII · PCMC', institution: 'Shri Venkataramana Pre-University College, Kundapura', period: '2022', result: '85%' },
  { qualification: 'Class X · KSEEB', institution: 'Government Junior College, Byndoor', period: '2020', result: '81%' },
]

const skillGroups = [
  { category: 'Programming', items: ['Java', 'Python', 'C++', 'C'] },
  { category: 'Web development', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'REST API'] },
  { category: 'Databases & tools', items: ['MongoDB', 'MySQL', 'Git', 'GitHub'] },
  { category: 'Professional', items: ['Communication', 'Collaboration', 'Time management', 'Adaptability'] },
]

const certifications = [
  'MERN Stack Front to Back: Full Stack React, Redux & Node.js',
  'Java Programming Masterclass',
  'Foundations of Cybersecurity',
  'Verbal Mastery: Grammar, RC, Reasoning for Exams & Job Tests',
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('objective')
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const sections = ['objective', 'projects', 'education', 'skills', 'credentials', 'contact']
      .map(sectionId => document.getElementById(sectionId))
      .filter(Boolean)
    const observer = new IntersectionObserver(entries => {
      const visibleSection = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]

      if (visibleSection) setActiveSection(visibleSection.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] })

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleContactSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      message: formData.get('message')?.trim(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setSubmitState({ status: 'error', message: 'Please fill in your name, email, and message.' })
      return
    }

    setSubmitState({ status: 'loading', message: 'Sending your message...' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const fallbackMessage = `mailto:swaroop0310@gmail.com?subject=${encodeURIComponent(`Portfolio inquiry from ${payload.name}`)}&body=${encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`)}`

        if (data?.message?.includes('not configured') || data?.message?.includes('Unable to send')) {
          setSubmitState({
            status: 'error',
            message: 'Email credentials are not configured yet. Your mail app is opening so you can still send the message.',
          })
          window.location.href = fallbackMessage
          return
        }

        throw new Error(data.message || 'Unable to send your message right now.')
      }

      setSubmitState({ status: 'success', message: 'Message sent successfully. I will get back to you soon.' })
      form.reset()
    } catch (error) {
      const fallbackMessage = `mailto:swaroop0310@gmail.com?subject=${encodeURIComponent(`Portfolio inquiry from ${payload.name}`)}&body=${encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`)}`

      setSubmitState({
        status: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      })
      window.location.href = fallbackMessage
    }
  }

  return (
    <main>
      <header className="topbar">
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <a href="#objective" aria-current={activeSection === 'objective' ? 'location' : undefined} onClick={closeMenu}>Objective</a>
          <a href="#projects" aria-current={activeSection === 'projects' ? 'location' : undefined} onClick={closeMenu}>Projects</a>
          <a href="#education" aria-current={activeSection === 'education' ? 'location' : undefined} onClick={closeMenu}>Education</a>
          <a href="#skills" aria-current={activeSection === 'skills' ? 'location' : undefined} onClick={closeMenu}>Skills</a>
          <a href="#credentials" aria-current={activeSection === 'credentials' ? 'location' : undefined} onClick={closeMenu}>Credentials</a>
          <a className="nav-cta" href="#contact" aria-current={activeSection === 'contact' ? 'location' : undefined} onClick={closeMenu}>Contact <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <section className="hero section-wrap" id="home">
        <div className="hero-main" id="objective">
          <span className="eyebrow">MCA CANDIDATE <span aria-hidden="true">/</span> FULL-STACK DEVELOPER</span>
          <h1>Swaroop D Naik</h1>
          <p className="hero-intro">MCA student with a strong foundation in full-stack development, programming, and analytical problem-solving. I build end-to-end web applications with the MERN stack and am seeking a Full Stack Developer role where I can contribute to practical software solutions and continue to grow.</p>
          <div className="hero-actions">
            <a href="#projects" className="button button-dark">Explore projects <ArrowDownRight size={17} /></a>
            <a className="text-link" href="mailto:swaroop0310@gmail.com">Email me <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <aside className="hero-aside" aria-label="Portrait, contact, and professional profiles">
          <figure className="hero-portrait">
            <img src={profilePhoto} alt="Swaroop D Naik" />
          </figure>
          <span className="section-kicker">CONTACT</span>
          <a className="contact-line" href="mailto:swaroop0310@gmail.com"><Mail size={17} /><span>swaroop0310@gmail.com</span><ArrowUpRight size={14} /></a>
          <a className="contact-line" href="tel:+919448793765"><Phone size={17} /><span>+91 94487 93765</span><ArrowUpRight size={14} /></a>
          <div className="contact-line"><MapPin size={17} /><span>Bengaluru, India</span></div>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/swaroop-d-naik/" target="_blank" rel="noreferrer"><span>in</span> LinkedIn <ArrowUpRight size={13} /></a>
            <a href="https://github.com/Swaroop-944" target="_blank" rel="noreferrer"><span>GH</span> GitHub <ArrowUpRight size={13} /></a>
          </div>
        </aside>
      </section>

      <section className="content-section section-wrap" id="projects">
        <div className="section-heading">
          <div><span className="section-kicker">SELECTED ACADEMIC WORK</span><h2>Projects<span className="period">.</span></h2></div>
        </div>
        <div className="project-grid">
          {projects.map(project => (
            <article className="project-card-v2" key={project.title}>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-meta">{project.context}</p>
              <div className="tag-list" aria-label="Technologies used">
                {project.technologies.map(technology => <span key={technology}>{technology}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section section-wrap" id="education">
        <div className="section-heading">
          <div><span className="section-kicker">ACADEMIC BACKGROUND</span><h2>Education<span className="period">.</span></h2></div>
        </div>
        <div className="education-list">
          {education.map(item => (
            <article className="education-row" key={item.qualification}>
              <div><h3>{item.qualification}</h3><p>{item.institution}</p></div>
              <span className="education-period">{item.period}</span>
              <span className="education-result">{item.result}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section skills-section" id="skills">
        <div className="section-wrap">
          <div className="section-heading">
            <div><span className="section-kicker">TECHNICAL & PROFESSIONAL</span><h2>Skills<span className="period">.</span></h2></div>
          </div>
          <div className="skill-groups">
            {skillGroups.map(group => (
              <div className="skill-group" key={group.category}>
                <h3>{group.category}</h3>
                <div className="tag-list">{group.items.map(item => <span key={item}>{item}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section section-wrap" id="credentials">
        <div className="section-heading">
          <div><span className="section-kicker">CONTINUOUS LEARNING & INVOLVEMENT</span><h2>Credentials & activities<span className="period">.</span></h2></div>
        </div>
        <div className="credentials-grid">
          <div className="credential-column">
            <h3 className="subsection-title">Certifications</h3>
            <ul className="credential-list">
              {certifications.map(certification => (
                <li key={certification}><span>{certification}</span><span className="credential-source">Coursera · 2026</span></li>
              ))}
            </ul>
          </div>
          <div className="credential-column">
            <h3 className="subsection-title">Achievements & extra-curricular</h3>
            <ul className="credential-list">
              <li><span>Active Cadet, National Cadet Corps (NCC)</span><span className="credential-source">B and C Certificates · 2022–2025</span></li>
              <li><span>Active member, IT Club, Presidency College, Bengaluru</span><span className="credential-source">2026–2027</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="section-wrap contact-inner">
          <div className="contact-copy">
            <span className="section-kicker">LET&apos;S CONNECT</span>
            <h2>Open to full-stack opportunities.</h2>
            <p>Have a role or project in mind? Send me a message and I&apos;ll get back to you.</p>
            <a className="contact-email" href="mailto:swaroop0310@gmail.com"><Mail size={16} /> swaroop0310@gmail.com</a>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required />
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required />
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows="5" required />
            <div className="contact-form-footer">
              <p>Messages are sent through the site backend and delivered to your email inbox.</p>
              <button className="button button-dark" type="submit" disabled={submitState.status === 'loading'}>
                {submitState.status === 'loading' ? 'Sending...' : 'Send Message'} <ArrowUpRight size={16} />
              </button>
            </div>
            {submitState.message && (
              <p className={`form-status ${submitState.status}`} role="status" aria-live="polite">
                {submitState.message}
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="footer section-wrap">
        <a className="wordmark" href="#home">Swaroop D Naik</a>
        <span>Bengaluru, India · 2026</span>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/swaroop-d-naik/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Swaroop-944" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:swaroop0310@gmail.com">Email</a>
        </div>
      </footer>
    </main>
  )
}

export default App