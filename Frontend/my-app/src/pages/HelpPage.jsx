import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");

  const faqData = [
    {
      question: "How do I create a post?",
      answer: "Navigate to the Create page and select 'Create a Post'. Fill in the title, content, and any relevant tags. Click 'Publish' to share your post with the community."
    },
    {
      question: "How do I register for an event?",
      answer: "Go to the Events page, browse available events, and click 'Register' on the event you're interested in. You'll receive a confirmation email once registered."
    },
    {
      question: "How do I create an event (for community organizers)?",
      answer: "If you're a community organizer, go to the Create page and select 'Create an Event'. Fill in all the required details including date, time, location, and description. Publish the event to make it visible to members."
    },
    {
      question: "How do I view my published events?",
      answer: "Community organizers can access 'View Published Events' from the Create page to manage and track their events."
    },
    {
      question: "How do I earn points and badges?",
      answer: "Participate in community activities, attend events, and engage with posts to earn points. Special badges are awarded for achievements and milestones."
    },
    {
      question: "How do I contact support?",
      answer: "Use the contact form below or email us at support@communityapp.com. We're here to help!"
    }
  ];

  const guides = [
    {
      title: "Getting Started",
      content: "Welcome to our community platform! Start by creating your profile, then explore posts and events that interest you."
    },
    {
      title: "Creating Engaging Posts",
      content: "Write clear, concise posts with relevant tags. Include images or links to make your content more engaging."
    },
    {
      title: "Organizing Successful Events",
      content: "Plan events with clear objectives, detailed descriptions, and appropriate capacity limits. Promote them through posts and announcements."
    },
    {
      title: "Community Guidelines",
      content: "Be respectful, inclusive, and constructive in all interactions. Follow our code of conduct to maintain a positive community environment."
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Help & Support</h1>
            <p className="text-gray-300 text-lg">
              Find answers to common questions and get the help you need
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800/50 rounded-lg p-1 border border-gray-700/60">
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  activeTab === "faq"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab("guides")}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  activeTab === "guides"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Guides
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  activeTab === "contact"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Contact
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 hover:border-gray-500/60 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Guides Section */}
          {activeTab === "guides" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">User Guides</h2>
              {guides.map((guide, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 hover:border-gray-500/60 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{guide.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{guide.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Contact Section */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              
              {/* Contact Form */}
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl p-8 border border-gray-700/60">
                <h3 className="text-xl font-semibold text-white mb-6">Send us a message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="border border-gray-600 bg-gray-700/80 px-4 py-3 rounded-lg text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="border border-gray-600 bg-gray-700/80 px-4 py-3 rounded-lg text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                    />
                  </div>
                  <select className="w-full border border-gray-600 bg-gray-700/80 px-4 py-3 rounded-lg text-white focus:ring-2 focus:ring-purple-400">
                    <option value="">Select Category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                    placeholder="Your Message"
                    rows="6"
                    className="w-full border border-gray-600 bg-gray-700/80 px-4 py-3 rounded-lg text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-indigo-700 transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
                  <p className="text-gray-300">support@communityapp.com</p>
                </div>
                <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Phone</h4>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
                <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Response Time</h4>
                  <p className="text-gray-300">Within 24 hours</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
              <h4 className="text-lg font-semibold text-white mb-2">Need More Help?</h4>
              <p className="text-gray-400 mb-4">
                Can't find what you're looking for? Check out our comprehensive documentation or reach out to our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-indigo-700 transition">
                  View Documentation
                </button>
                <button className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-2 rounded-lg font-semibold text-white hover:from-green-700 hover:to-teal-700 transition">
                  Live Chat Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

