import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "fitnesstracker@gmail.com",
    href: "mailto:fitnesstracker@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91-8755666110",
    href: "tel:+918755666110",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bengaluru, Karnataka, India",
  },
];

const faqs = [
  {
    q: "Can I track multiple fitness goals?",
    a: "Yes, users can create and manage multiple goals.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, JWT-based authentication is used.",
  },
  {
    q: "Can admins manage users?",
    a: "Yes, admins can manage users and monitor analytics.",
  },
  {
    q: "Is the application mobile responsive?",
    a: "Yes, it is fully responsive.",
  },
];

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/",
  },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Full Name is required.";
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is not valid.";
    }
    if (!formData.subject) tempErrors.subject = "Subject is required.";
    if (!formData.message) tempErrors.message = "Message is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      // Here you would typically send the form data to a backend
      console.log("Form data submitted:", formData);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Get In Touch
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Have questions, feedback, or suggestions? We'd love to hear from you.
        </p>
      </div>

      {/* Contact Information */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {contactInfo.map((item) => (
          <div
            key={item.label}
            className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center"
          >
            <item.icon className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="mt-4 text-xl font-bold">{item.label}</h3>
            <a
              href={item.href}
              className="mt-2 text-slate-600 dark:text-slate-400 hover:text-emerald-500"
            >
              {item.value}
            </a>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto">
        {isSubmitted ? (
          <div className="p-6 bg-emerald-100 dark:bg-emerald-900 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              Thank you!
            </h2>
            <p className="mt-2 text-emerald-700 dark:text-emerald-300">
              Your message has been received successfully.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md"
            >
              <summary className="font-semibold cursor-pointer">
                {faq.q}
              </summary>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Social Media Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold">Follow us on Social Media</h2>
        <div className="mt-8 flex justify-center space-x-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              <social.icon className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
