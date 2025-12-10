import React, { useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const defaultFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  subject: 'General Inquiry',
  message: ''
};

const ContactPage: React.FC = () => {
  const { submitContactForm } = useData();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (feedback !== 'idle') {
      setFeedback('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValues.firstName || !formValues.email || !formValues.message) {
      setFeedback('error');
      setErrorMessage('Please fill in the required fields to send your message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactForm({
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
        subject: formValues.subject,
        message: formValues.message.trim()
      });
      setFeedback('success');
      setFormValues(defaultFormValues);
    } catch {
      setFeedback('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-cindral-blue/10 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-cindral-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email Us</p>
                    <a href="mailto:hello@cindral.com" className="text-white hover:text-cindral-blue transition-colors text-lg">hello@cindral.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500/10 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Visit Us</p>
                    <p className="text-white text-lg">
                      123 Innovation Drive,<br />
                      Tech Park, Sector 5,<br />
                      Bangalore, KA 560103, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-500/10 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Call Us</p>
                    <p className="text-white text-lg">+91 (800) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
               <h3 className="text-xl font-bold text-white mb-4">Join the Team</h3>
               <p className="text-gray-400 mb-6">We are always looking for talented individuals to join our mission.</p>
               <a href="#" className="text-cindral-blue font-semibold hover:underline">View Open Positions &rarr;</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cindral-blue focus:ring-1 focus:ring-cindral-blue transition-all" 
                    placeholder="John" 
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cindral-blue focus:ring-1 focus:ring-cindral-blue transition-all" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cindral-blue focus:ring-1 focus:ring-cindral-blue transition-all" 
                  placeholder="john@example.com" 
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <select 
                  id="subject" 
                  name="subject"
                  value={formValues.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cindral-blue focus:ring-1 focus:ring-cindral-blue transition-all"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Project Proposal">Project Proposal</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Media & Press">Media & Press</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4} 
                  value={formValues.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cindral-blue focus:ring-1 focus:ring-cindral-blue transition-all" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-cindral-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {feedback === 'success' && (
                <div className="flex items-center text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded-2xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Message received! Someone from Cindral will be in touch soon.
                </div>
              )}

              {feedback === 'error' && (
                <div className="flex items-center text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
