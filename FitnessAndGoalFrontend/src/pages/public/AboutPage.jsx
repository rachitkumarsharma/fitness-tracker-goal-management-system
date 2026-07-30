import {
  HeartPulse,
  Award,
  ShieldCheck,
  LineChart,
  Users,
  LayoutGrid,
  Laptop,
  Database,
  GitMerge,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    name: "Secure Authentication (JWT)",
    description:
      "JWT-based authentication ensures your data is safe and secure.",
    icon: ShieldCheck,
  },
  {
    name: "Workout Tracking",
    description: "Log your workouts and track your progress over time.",
    icon: HeartPulse,
  },
  {
    name: "Goal Management",
    description: "Set and manage your fitness goals to stay motivated.",
    icon: Award,
  },
  {
    name: "Progress Dashboard",
    description:
      "Visualize your progress with our intuitive and interactive dashboard.",
    icon: LayoutGrid,
  },
  {
    name: "Admin Dashboard",
    description: "Admins can manage users, workouts, and view analytics.",
    icon: Users,
  },
  {
    name: "Analytics & Reports",
    description: "Get detailed analytics and reports on your workouts.",
    icon: LineChart,
  },
  {
    name: "Responsive Design",
    description: "Access your fitness data from any device, anywhere.",
    icon: Laptop,
  },
  {
    name: "Role-Based Access Control",
    description: "Different roles for users and admins with different permissions.",
    icon: Users,
  },
];

const technologies = {
  frontend: [
    { name: "ReactJS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
    {
      name: "Tailwind CSS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    },
  ],
  backend: [
    { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
    { name: "Spring Security", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
    { name: "JWT", icon: ShieldCheck },
  ],
  database: [
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ],
  tools: [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", icon: Github },
    { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
  ],
};

const stats = [
  { value: "10+", label: "Features" },
  { value: "2", label: "User Roles" },
  { value: "100+", label: "Workouts Supported" },
  { value: "Unlimited", label: "Goals" },
];

const team = [
  {
    name: "Rachit Sharma",
    role: "Full Stack Developer",
    avatar: "https://avatars.githubusercontent.com/u/83669144?v=4",
    github: "https://github.com/rachit-sharma2003",
    linkedin: "https://linkedin.com/in/rachit-sharma-2003",
    twitter: "https://twitter.com/RachitS2003",
  },
  {
    name: "Member 2",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?u=member2",
  },
  {
    name: "Member 3",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/150?u=member3",
  },
];

export function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          About Fitness Tracker
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Track Workouts, Achieve Goals, and Build a Healthier Lifestyle.
        </p>
      </div>

      {/* Project Overview */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Project Overview</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Fitness Tracker & Goal Management System is a modern web application
          that enables users to monitor workouts, set fitness goals, track
          progress, and gain insights into their fitness journey. The platform
          provides a secure and user-friendly experience through JWT
          authentication, role-based access control, and real-time progress
          tracking.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Features</h2>
        <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md"
            >
              <feature.icon className="w-8 h-8 text-emerald-500" />
              <h3 className="mt-4 text-xl font-bold">{feature.name}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Technology Stack</h2>
        <div className="mt-8 space-y-8">
          {Object.entries(technologies).map(([category, techs]) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold capitalize">{category}</h3>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {techs.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md"
                  >
                    {typeof tech.icon === "string" ? (
                      <img src={tech.icon} alt={tech.name} className="w-8 h-8" />
                    ) : (
                      <tech.icon className="w-8 h-8 text-emerald-500" />
                    )}
                    <span className="font-semibold">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Statistics</h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
              <p className="text-4xl font-extrabold text-emerald-500">{stat.value}</p>
              <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Team Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Our Team</h2>
        <p className="text-center mt-2 text-slate-600 dark:text-slate-400">
          Project Group: PGCP-AC-016
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
              <p className="text-slate-600 dark:text-slate-400">{member.role}</p>
              <div className="mt-4 flex justify-center space-x-4">
                {member.github && <a href={member.github} target="_blank" rel="noreferrer"><Github /></a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer"><Linkedin /></a>}
                {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer"><Twitter /></a>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Our mission is to empower individuals to achieve their fitness goals
          through technology, data-driven insights, and an intuitive user
          experience.
        </p>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold">
          Ready to start your fitness journey?
        </h2>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700"
          >
            Get Started
          </Link>
          <Link
            to="/features"
            className="px-8 py-3 bg-white dark:bg-slate-800 font-semibold rounded-lg shadow-md"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </div>
  );
}
