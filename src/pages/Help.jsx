import { useState } from "react";
import GlassCard from "../components/common/GlassCard";
import { 
  HelpCircle, Mail, Phone, MessageCircle, 
  Search, ChevronRight, FileText, Video,
  BookOpen, Users, AlertCircle, CheckCircle
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const faqs = [
    {
      id: 1,
      question: "How do I create a new delivery order?",
      answer: "To create a new delivery order, go to the Orders page and click on 'Create New Order'. Fill in the customer details, pickup and dropoff locations, quantity, and any special instructions. Click 'Create Order' to submit.",
      category: "orders"
    },
    {
      id: 2,
      question: "How does route optimization work?",
      answer: "Our route optimization algorithm uses AI to group deliveries and find the most efficient routes based on driver location, traffic patterns, and delivery priorities. Click 'Optimize Routes' on the Routes page to generate optimized delivery paths.",
      category: "routes"
    },
    {
      id: 3,
      question: "How can I track driver location in real-time?",
      answer: "On the Drivers page, you can see all active drivers on the map. Click on any driver marker to see their current location, route, and estimated delivery times. The map updates in real-time.",
      category: "drivers"
    },
    {
      id: 4,
      question: "What should I do if a delivery is delayed?",
      answer: "If a delivery is delayed, you can reassign it to another available driver. Go to the Orders page, select the delayed order, and click 'Reassign Driver'. The system will suggest the best available driver based on proximity.",
      category: "orders"
    },
    {
      id: 5,
      question: "How do I update my profile information?",
      answer: "Navigate to Settings > Profile Information. You can edit your name, email, phone number, and address. Click 'Save Changes' to update your profile.",
      category: "account"
    },
    {
      id: 6,
      question: "What are the different order priority levels?",
      answer: "Orders have three priority levels: Normal (standard delivery), High (priority delivery), and Urgent (immediate delivery). Priority orders are assigned first and have faster estimated delivery times.",
      category: "orders"
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory !== "all" && faq.category !== selectedCategory) return false;
    if (searchQuery && !faq.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [
    { id: "all", name: "All", icon: <HelpCircle size={16} /> },
    { id: "orders", name: "Orders", icon: <FileText size={16} /> },
    { id: "routes", name: "Routes", icon: <BookOpen size={16} /> },
    { id: "drivers", name: "Drivers", icon: <Users size={16} /> },
    { id: "account", name: "Account", icon: <AlertCircle size={16} /> },
  ];

  const supportOptions = [
    { icon: <Mail size={24} />, title: "Email Support", description: "Get response within 24 hours", action: "support@ecoroute.com", type: "email" },
    { icon: <MessageCircle size={24} />, title: "Live Chat", description: "Chat with support team", action: "Start Chat", type: "chat" },
    { icon: <Phone size={24} />, title: "Phone Support", description: "Call us 24/7", action: "+1 (800) 123-4567", type: "phone" },
    { icon: <Video size={24} />, title: "Video Tutorials", description: "Watch step-by-step guides", action: "Watch Now", type: "video" },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <span className="text-sm text-gray-400">We're here to help 24/7</span>
      </div>

      {/* Search Bar */}
      <GlassCard className="p-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </GlassCard>

      {/* Quick Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {supportOptions.map((option, idx) => (
          <GlassCard key={idx} className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {option.icon}
              </div>
            </div>
            <h3 className="font-semibold mb-1">{option.title}</h3>
            <p className="text-xs text-gray-400 mb-2">{option.description}</p>
            <p className="text-sm text-blue-400">{option.action}</p>
          </GlassCard>
        ))}
      </div>

      {/* FAQ Section */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No results found. Try a different search term.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight size={18} className={`transition-transform ${expandedFaq === faq.id ? "rotate-90" : ""}`} />
                </button>
                {expandedFaq === faq.id && (
                  <div className="p-4 pt-0 border-t border-white/10">
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Contact Form */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Still Need Help?</h2>
        <p className="text-gray-400 text-sm mb-4">Our support team will get back to you within 24 hours</p>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Issue Type</option>
            <option>Technical Issue</option>
            <option>Billing Question</option>
            <option>Feature Request</option>
            <option>Account Issue</option>
            <option>Other</option>
          </select>
          <textarea
            rows="4"
            placeholder="Describe your issue in detail..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
            Submit Request
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Help;