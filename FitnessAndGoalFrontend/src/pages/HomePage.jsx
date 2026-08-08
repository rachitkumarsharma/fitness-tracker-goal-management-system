import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../context";
import { Button } from "../components";
import { Dumbbell } from "lucide-react";
import { Navbar } from "../components/layout";

const noop = () => {};

// (removed duplicate FooterTop to fix build)
function FooterTop() {
  return (
    <footer className="mt-10 border-t border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          FitTracker & Goal Management • Stay consistent. Earn your results. 💪
        </p>
      </div>
    </footer>
  );
}

export function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If already logged-in, redirect to the right dashboard
  if (!loading && user) {
    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    navigate(isAdmin ? "/admin/dashboard" : "/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
      <Navbar />
      
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-14 sm:pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/30 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-100 dark:bg-teal-900/30 rounded-full blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                <Sparkles />
                Modern fitness + goal management
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.05]">
                Track progress.
                <span className="block text-emerald-600 dark:text-emerald-500">
                  Manage goals. Stay motivated.
                </span>
              </h1>

              <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                FitTracker turns workouts into momentum—so you can set goals,
                log sessions, and monitor progress with beautiful analytics.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="solid">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatPill label="Workout tracking" value="Fast" />
                <StatPill label="Goal management" value="Simple" />
                <StatPill label="Progress analytics" value="Clear" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 blur-2xl rounded-[2rem]" />
              <div className="relative rounded-[2rem] bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-200/70 dark:border-slate-700/70 shadow-sm p-6">
                <HeroIllustration />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniCard
                    title="Calories"
                    subtitle="Track burn"
                    icon={<FireIcon />}
                  />
                  <MiniCard
                    title="Goals"
                    subtitle="Stay on track"
                    icon={<TargetIcon />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to train smarter"
            description="Log workouts, manage goals, and see progress at a glance."
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<DumbbellIcon />}
              title="Workout Tracking"
              desc="Quick logging with history and trends."
            />
            <FeatureCard
              icon={<TargetIcon />}
              title="Goal Management"
              desc="Create goals and monitor milestones."
            />
            <FeatureCard
              icon={<ChartIcon />}
              title="Progress Analytics"
              desc="Beautiful charts for workouts and weight."
            />
            <FeatureCard
              icon={<FireIcon />}
              title="Calories Tracking"
              desc="Track calories burned and activity balance."
            />
            <FeatureCard
              icon={<RulerIcon />}
              title="Body Measurements"
              desc="Record weight, BMI, and measurements."
            />
            <FeatureCard
              icon={<UsersIcon />}
              title="Social Fitness"
              desc="Celebrate wins and stay accountable."
            />
            <FeatureCard
              icon={<BellIcon />}
              title="Notifications"
              desc="Get reminders and goal updates."
            />
            <FeatureCard
              icon={<TrophyIcon />}
              title="Achievements"
              desc="Earn badges as you reach goals."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-18 bg-emerald-50/20 dark:bg-emerald-950/20 border-y border-emerald-100/60 dark:border-emerald-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="Get from day one to real results"
            description="A simple workflow designed to keep you consistent."
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StepCard
              n="1"
              title="Create Account"
              desc="Register as ROLE_USER and get started."
            />
            <StepCard
              n="2"
              title="Track Workouts"
              desc="Log exercises and calories in minutes."
            />
            <StepCard
              n="3"
              title="Set Goals"
              desc="Define targets and milestones."
            />
            <StepCard
              n="4"
              title="Monitor Progress"
              desc="Use charts to stay motivated."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            title="Built for consistency"
            description="People use FitTracker to turn plans into habits."
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <TestimonialCard
              quote="The analytics make it easy to see what’s working. I stayed consistent for the first time."
              name="Aarav"
              role="Runner"
            />
            <TestimonialCard
              quote="Goals feel realistic. The progress charts keep me motivated without guilt."
              name="Maya"
              role="Strength training"
            />
            <TestimonialCard
              quote="Workout history + quick logging is exactly what I needed."
              name="Ishan"
              role="Gym regular"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-14 sm:py-18 bg-gradient-to-b from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BigStat value="120k+" label="Workouts logged" />
            <BigStat value="35k+" label="Goals created" />
            <BigStat value="98%" label="Consistency rate" />
            <BigStat value="24/7" label="Progress visibility" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="py-14 sm:py-18 border-t border-slate-100 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you need to know before you get started."
          />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FAQItem
              q="Do I need to log workouts daily?"
              a="No. FitTracker is designed for consistency over perfection. Log whenever you train and review trends."
            />
            <FAQItem
              q="Can I track goals and progress?"
              a="Yes—create goals and monitor progress using charts for workouts, calories, and weight."
            />
            <FAQItem
              q="Is there role-based access?"
              a="Yes. Users see the user portal; admins access analytics and user management."
            />
            <FAQItem
              q="Does authentication use JWT?"
              a="Yes. The frontend reuses the existing JWT-based authentication and axios setup."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 sm:p-10 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.14),transparent_45%)]" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-3xl font-extrabold">
                  Ready to train with clarity?
                </h2>
                <p className="mt-2 text-white/85">
                  Start tracking workouts, managing goals, and staying
                  motivated.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button asChild variant="light">
                  <Link to="/register">Create your account</Link>
                </Button>
                <Button asChild variant="outlineLight">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-14 sm:pb-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-[2rem] border border-slate-200/70 dark:border-slate-700/70 p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Newsletter
                </p>
                <h3 className="mt-2 text-2xl font-bold dark:text-slate-100">
                  Get smarter workout tips
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Weekly motivation and product updates—no spam.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3 md:justify-end"
              >
                <input
                  className="w-full sm:w-[320px] rounded-xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit" variant="solid">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterTop />
    </div>
  );
}

function navigateToAnchor(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="text-center">
      <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur px-4 py-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-[1.5rem] bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur p-6 shadow-sm hover:shadow-md transition-slow">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-fast">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-lg text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function StepCard({ n, title, desc }) {
  return (
    <div className="rounded-[1.5rem] bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold">
          {n}
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function TestimonialCard({ quote, name, role }) {
  return (
    <div className="rounded-[1.5rem] bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur p-6 shadow-sm">
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        “{quote}”
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600" />
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

function BigStat({ value, label }) {
  return (
    <div className="rounded-[1.5rem] bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur p-6 shadow-sm text-center">
      <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  return (
    <div className="rounded-[1.5rem] bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur p-6 shadow-sm">
      <p className="font-bold text-slate-900 dark:text-slate-100">{q}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {a}
      </p>
    </div>
  );
}

function HeroIllustration() {
  // Lightweight SVG-like illustration using Tailwind boxes.
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 dark:from-emerald-900/15 dark:to-teal-900/10 dark:border-emerald-800/20 p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/90" />
            <div className="w-10 h-10 rounded-2xl bg-teal-600/90" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 w-4/5" />
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 w-2/3" />
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            This week
          </div>
          <div className="mt-3 text-2xl font-extrabold dark:text-slate-100">
            +18%
          </div>
          <div className="mt-3 h-20 rounded-xl bg-gradient-to-b from-emerald-500/20 to-transparent" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/90" />
            <div>
              <div className="text-sm font-bold dark:text-slate-100">
                Workout Trend
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Last 7 sessions
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-600/90" />
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2 items-end">
          {[12, 18, 10, 24, 16, 30, 22].map((h, i) => (
            <div
              key={i}
              className="w-full bg-gradient-to-t from-emerald-600/30 to-emerald-600/0 rounded-full"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title, subtitle, icon }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100">
            {title}
          </div>
        </div>
        <div className="text-emerald-700 dark:text-emerald-400">{icon}</div>
      </div>
    </div>
  );
}

function DumbbellIcon() {
  return <span className="text-lg">🏋️</span>;
}
function TargetIcon() {
  return <span className="text-lg">🎯</span>;
}
function ChartIcon() {
  return <span className="text-lg">📈</span>;
}
function FireIcon() {
  return <span className="text-lg">🔥</span>;
}
function RulerIcon() {
  return <span className="text-lg">📏</span>;
}
function UsersIcon() {
  return <span className="text-lg">🤝</span>;
}
function BellIcon() {
  return <span className="text-lg">🔔</span>;
}
function TrophyIcon() {
  return <span className="text-lg">🏆</span>;
}
function Sparkles() {
  return <span aria-hidden>✨</span>;
}

function X() {
  return <span className="text-xl">✕</span>;
}
function Menu() {
  return <span className="text-xl">☰</span>;
}
