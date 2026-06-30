import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  GraduationCap,
  MessagesSquare,
  Play,
  Plus,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'

import { Button } from '#/shared/ui'

const SECTION = 'mx-auto max-w-6xl px-6'

// ---------------------------------------------------------------- Hero
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/40">
      <div className={`${SECTION} grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink shadow-sm">
            <span className="flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-xs text-white">
              <Play className="size-3" /> New
            </span>
            AI Hackathon C.C.C.
            <ArrowRight className="size-4 text-brand-600" />
          </span>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-ink sm:text-6xl">
            Learn <span className="text-brand-600">AI</span>
            <br />
            and shape your future.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/50">
            Master Artificial Intelligence through hands-on projects, real data challenges, and
            expert-led mentorship. Whether you're just starting out or advancing your skills, unlock
            your creative power and become part of the next generation of AI innovators.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/courses">
              <Button className="gap-2 px-6 py-3">
                <Sparkles className="size-4" strokeWidth={2} />
                Explore Courses
              </Button>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-medium text-ink transition hover:text-brand-600"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <ArrowRight className="size-4" />
              </span>
              Start Your Journey
            </Link>
          </div>
        </div>

        {/* Decorative student arches (image placeholders) */}
        <div className="relative hidden h-[460px] lg:block">
          <div className="absolute left-4 top-8 h-[420px] w-64 rounded-t-[140px] bg-[#f7d9c4]" />
          <div className="absolute left-6 top-12 flex h-[400px] w-60 items-end justify-center overflow-hidden rounded-t-[130px]">
            <Users className="mb-10 size-28 text-ink/15" />
          </div>
          <div className="absolute right-24 top-0 flex size-44 items-center justify-center rounded-3xl bg-[#fdf0c3]">
            <GraduationCap className="size-16 text-ink/15" />
          </div>
          <div className="absolute bottom-4 right-10 flex size-48 items-center justify-center rounded-[40px] rounded-tr-3xl bg-[#cdeede]">
            <Users className="size-16 text-ink/15" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------- Features
const FEATURES = [
  {
    tint: 'bg-brand-100 text-brand-600',
    title: 'Hands-On Learning',
    text: 'Learn by doing — every course includes projects, labs, and real data challenges.',
  },
  {
    tint: 'bg-red-100 text-red-500',
    title: 'Mentor-Led Experience',
    text: 'Grow with the help of instructors and industry mentors who guide you step-by-step.',
  },
  {
    tint: 'bg-amber-100 text-amber-500',
    title: 'Flexible and Affordable',
    text: 'Access high-quality education on your own schedule, from anywhere in the world.',
  },
  {
    tint: 'bg-green-100 text-green-600',
    title: 'Recognized Certificates',
    text: 'Earn verified certificates that prove your skills and open global opportunities.',
  },
]

const CHECKLIST = [
  'Flexible Learning Path',
  'Affordable Access',
  'Expert-Led Courses',
  'Active Community',
]

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-lg border border-brand-200 bg-brand-50/60 px-3 py-1 text-sm font-medium text-brand-700">
      {children}
    </span>
  )
}

function Features() {
  return (
    <section className={`${SECTION} grid items-center gap-12 py-20 lg:grid-cols-2`}>
      <div>
        <Pill>Features</Pill>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Learn Smarter. Build Faster. Grow Together.
        </h2>
        <p className="mt-5 max-w-md text-ink/50">
          Empower your AI journey with interactive tools, real projects, and expert-led learning.
          Our platform is designed to help you master skills that shape tomorrow.
        </p>
        <ul className="mt-6 space-y-3">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex items-center gap-2 text-ink/70">
              <Check className="size-5 text-green-600" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
        <Link to="/courses" className="mt-8 inline-block">
          <Button className="gap-2 px-6 py-3">
            <Sparkles className="size-4" />
            Learn more
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(16,35,85,0.15)]"
          >
            <span className={`flex size-12 items-center justify-center rounded-2xl ${f.tint}`}>
              <GraduationCap className="size-6" strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/50">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ------------------------------------------------------------- Partners
const PARTNERS = [
  'zypl.ai',
  'aic',
  'tajrupt',
  'TECHNO HUB',
  'FREEDOM BANK',
  'freedom it hub',
  'IT PARK',
  'Хумо',
  'QIS',
  'imon',
  'zehn',
  'epsilon3.ai',
]

function Partners() {
  return (
    <section className="py-12">
      <div
        className={`${SECTION} grid items-center gap-12 rounded-[40px] bg-[#eaeef3] px-8 py-14 lg:grid-cols-2`}
      >
        <div>
          <Pill>Partners</Pill>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Collaborating with Tajikistan's Innovators
          </h2>
          <p className="mt-5 max-w-md text-ink/50">
            AI Academy collaborates with leading organizations and tech communities across
            Tajikistan to create opportunities for learning, innovation, and real-world experience.
            Together, we're building the foundation of the country's AI future.
          </p>
          <Link to="/courses" className="mt-8 inline-block">
            <Button className="gap-2 px-6 py-3">
              <Sparkles className="size-4" />
              Explore Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="flex h-20 items-center justify-center rounded-2xl bg-white px-3 text-center text-sm font-semibold text-ink/40"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ FAQ
const FAQS = [
  'What knowledge is required for admission?',
  'How are classes conducted at AI Academy?',
  'How can I get a certificate?',
  'How can I apply for a course?',
  'How long does the training last?',
  'Are there mentors and support available?',
]

function FaqItem({ q }: { q: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl bg-white px-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <span className="flex items-center gap-3 font-display font-bold text-ink">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-xs text-white">
            ?
          </span>
          {q}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-ink/40 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 pl-10 text-sm text-ink/55">
          Свяжитесь с нами для подробностей — наши кураторы ответят на все вопросы по обучению,
          сертификатам и поддержке.
        </p>
      )}
    </div>
  )
}

function Faq() {
  return (
    <section className={`${SECTION} grid items-start gap-12 py-20 lg:grid-cols-2`}>
      <div>
        <Pill>FAQ</Pill>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Everything You Need to Know Before You Start Learning
        </h2>
        <p className="mt-5 max-w-md text-ink/50">
          Find quick, clear answers about joining AI Academy, how classes work, getting your
          certificate, and more. Whether you're just starting your AI journey or exploring your next
          course — we're here to guide you.
        </p>
        <Link to="/support" className="mt-8 inline-block">
          <Button className="gap-2 px-6 py-3">
            <MessagesSquare className="size-4" />
            Get in Touch
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {FAQS.map((q) => (
          <FaqItem key={q} q={q} />
        ))}
      </div>
    </section>
  )
}

// --------------------------------------------------------------- Forums
const FORUM_AVATARS = [
  'bg-amber-200',
  'bg-green-200',
  'bg-brand-100',
  'bg-brand-200',
  'bg-amber-100',
  'bg-red-200',
  'bg-ink/10',
]

function Forums() {
  return (
    <section className="bg-brand-600 py-16">
      <div className={SECTION}>
        <div className="mx-auto max-w-3xl rounded-[40px] bg-white px-6 py-14 text-center shadow-xl sm:px-12">
          <Pill>Forums</Pill>
          <h2 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
            Connect. Collaborate. Create.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/50">
            Be part of a global AI learning community where every question sparks a new idea.
            Exchange experiences, discover teaching strategies, and grow alongside passionate
            educators and innovators.
          </p>
          <div className="my-8 flex items-center justify-center">
            {FORUM_AVATARS.map((tint, i) => (
              <span
                key={i}
                className={`-ml-2 flex size-12 items-center justify-center rounded-full border-4 border-white first:ml-0 ${tint}`}
              >
                <Users className="size-5 text-ink/40" />
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses">
              <Button className="gap-2 px-6 py-3">
                <MessagesSquare className="size-4" />
                Explore Forums
              </Button>
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 font-medium text-ink transition hover:text-brand-600"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Plus className="size-4" />
              </span>
              Create a Topic
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------- Testimonials
const TESTIMONIALS = [
  {
    text: 'I completed the Basic ML and Data Analytics courses at zypl.ai and continue studying Data Science. I gained valuable knowledge and hands-on experience, and the final projects helped apply it in practice. zypl.ai is a great opportunity to grow in Data Science!',
    name: 'Alexandra Leshukovich',
    course: 'Graduate of the "Data Science Jr" course',
  },
  {
    text: 'I completed the Data Analytics course and was very satisfied. We covered Python, SQL, statistics, and visualization — all with practice and no unnecessary theory. Real cases, instructor support, and useful projects helped me gain confidence in data analytics. A great start for beginners!',
    name: 'Aziz Abdullaev',
    course: 'Graduate of the "Data Analytics" course',
  },
  {
    text: 'The journey from the Basic Course to the full Data Science Junior program at AI Academy was truly transformative. Step by step, I learned data analysis, machine learning, and intelligent solution design. I now apply these skills in real projects and keep growing.',
    name: 'Saidolim Soliev',
    course: 'Graduate of the "Math for DS" course',
  },
]

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(16,35,85,0.15)]">
      <p className="flex-1 text-sm leading-relaxed text-ink/60">{t.text}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Users className="size-5" />
          </span>
          <div>
            <p className="font-display font-bold text-ink">{t.name}</p>
            <p className="text-xs text-ink/50">{t.course}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-0.5 text-amber-400">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="size-4 fill-current" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  return (
    <section className={`${SECTION} py-20 text-center`}>
      <Pill>Testimonials</Pill>
      <h2 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
        Real Stories. Real Growth.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-ink/50">
        Hear from students who turned curiosity into skill. Explore their journeys of learning,
        challenge, and success at AI Academy.
      </p>
      <div className="mt-12 grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ CTA
function CtaBand() {
  return (
    <section className="py-12">
      <div className={`${SECTION} rounded-[40px] bg-[#eaeef3] px-6 py-16 text-center`}>
        <Pill>Узнать больше</Pill>
        <h2 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
          Продвиньте своё обучение на новый уровень
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-ink/50">
          Изучайте специализированные курсы по ИИ, созданные для расширения ваших знаний, развития
          навыков и приближения к мастерству.
        </p>
        <Link to="/courses" className="mt-8 inline-block">
          <Button className="gap-2 px-7 py-3.5">
            <ArrowRight className="size-4" />
            Просмотреть курсы
          </Button>
        </Link>
      </div>
    </section>
  )
}

export function LandingPage() {
  return (
    <div className="bg-white">
      <Hero />
      <Features />
      <Partners />
      <Faq />
      <Forums />
      <Testimonials />
      <CtaBand />
    </div>
  )
}
