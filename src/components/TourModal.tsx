import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, Check, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { formatINR } from '../data';

interface TourModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function TourModal({ property, isOpen, onClose }: TourModalProps) {
  const [date, setDate] = useState('2026-05-30');
  const [time, setTime] = useState('11:00');
  const [type, setType] = useState<'in-person' | 'video'>('in-person');
  const [name, setName] = useState('Anurag Kewat');
  const [phone, setPhone] = useState('+91 91234 56789');
  const [email, setEmail] = useState('anurag.k@vidarbhaestate.in');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white text-brand-charcoal shadow-2xl"
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400" />

        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-light text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  <Sparkles size={12} className="text-amber-500" /> Virtual & Physical Tours
                </span>
                <h3 className="mt-2 text-2xl font-display font-medium text-brand-charcoal">
                  Book a Tour
                </h3>
                <p className="text-sm text-gray-500 mt-1 lines-clamp-1">
                  for {property.title} • {formatINR(property.price, 'LAKH_CRORE')}
                </p>
              </div>

              {/* Tour Type Tab */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-brand-gray-light p-1">
                <button
                  type="button"
                  onClick={() => setType('in-person')}
                  className={`rounded-lg py-2.5 text-xs font-medium transition-all ${
                    type === 'in-person'
                      ? 'bg-white text-brand-charcoal shadow-sm'
                      : 'text-gray-500 hover:text-brand-charcoal'
                  }`}
                >
                  📍 Physical Visit
                </button>
                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`rounded-lg py-2.5 text-xs font-medium transition-all ${
                    type === 'video'
                      ? 'bg-white text-brand-charcoal shadow-sm'
                      : 'text-gray-500 hover:text-brand-charcoal'
                  }`}
                >
                  📹 Video Call (Guided)
                </button>
              </div>

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-450 mb-1.5 uppercase tracking-wider">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm font-medium outline-hidden focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-450 mb-1.5 uppercase tracking-wider">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm font-medium outline-hidden focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-455 mb-1 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-455 mb-1 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-455 mb-1 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-brand-charcoal py-3.5 text-sm font-medium text-white hover:bg-neutral-800 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                Confirm Booking • {type === 'in-person' ? 'Physical Visit' : 'Video Call'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-55 text-emerald-600 ring-8 ring-emerald-50">
                <Check size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-display font-medium text-black">
                Tour Scheduled!
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Congratulations, your <span className="font-semibold">{type === 'in-person' ? 'in-person site visit' : 'guided video tour'}</span> is scheduled with <span className="font-semibold">{property.agent.name}</span> for:
              </p>
              <div className="inline-block bg-brand-gray-light rounded-2xl px-5 py-3 text-sm font-mono text-brand-charcoal">
                📅 {date} | ⏰ {time} IST
              </div>
              <p className="text-xs text-silver text-gray-400">
                A calendar invitation and confirmation SMS have been dispatched to {phone}.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-brand-charcoal text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
