import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calculator, IndianRupee, HelpCircle, Sparkles, Check } from 'lucide-react';
import { Property } from '../types';
import { formatINR } from '../data';

interface EmiCalculatorProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmiCalculator({ property, isOpen, onClose }: EmiCalculatorProps) {
  const [downpaymentPct, setDownpaymentPct] = useState(20); // 20% down
  const [tenureYears, setTenureYears] = useState(20); // 20 years
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% interest
  const [isApplied, setIsApplied] = useState(false);

  if (!isOpen) return null;

  // Calculators
  const price = property.price;
  const downpaymentAmount = Math.round((price * downpaymentPct) / 100);
  const loanAmount = price - downpaymentAmount;

  // Monthly interest rate calculation
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;

  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = Math.round(
    loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  );

  const totalPayable = emi * n;
  const totalInterest = totalPayable - loanAmount;

  const handleApply = () => {
    setIsApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white text-brand-charcoal shadow-2xl"
      >
        {/* Top bar accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400" />

        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-light text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>

          {!isApplied ? (
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  <Calculator size={12} className="text-emerald-500" /> Payment & EMI Split
                </span>
                <h3 className="mt-2 text-2xl font-display font-medium text-brand-charcoal">
                  Financing Options
                </h3>
                <p className="text-sm text-gray-500 mt-1 lines-clamp-1 col">
                  for {property.title} • House value: <span className="font-semibold">{formatINR(property.price, 'LAKH_CRORE')}</span>
                </p>
              </div>

              {/* Numerical breakdown boxes */}
              <div className="grid grid-cols-2 gap-3.5 bg-[#fafcfb] p-4 rounded-2xl border border-emerald-50">
                <div>
                  <p className="text-xs text-gray-450 font-medium">ESTIMATED MONTHLY EMI</p>
                  <p className="text-xl font-mono sm:text-2xl font-bold text-emerald-600 mt-1">
                    {formatINR(emi, 'LAKH_CRORE')}/mo
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">For {tenureYears} Years @ {interestRate}%</p>
                </div>
                <div className="border-l border-emerald-100 pl-4">
                  <p className="text-xs text-gray-450 font-medium">REQUIRED DOWN PAYMENT</p>
                  <p className="text-xl font-mono sm:text-2xl font-bold text-brand-charcoal mt-1">
                    {formatINR(downpaymentAmount, 'LAKH_CRORE')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{downpaymentPct}% of Total Value</p>
                </div>
              </div>

              {/* Sliders container */}
              <div className="space-y-4">
                {/* 1. Downpayment Percent */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-gray-500">Down Payment ({downpaymentPct}%)</span>
                    <span className="font-mono text-brand-charcoal">{formatINR(downpaymentAmount, 'SHORT_CR')}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={downpaymentPct}
                    onChange={(e) => setDownpaymentPct(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-charcoal"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>10% (Min ₹{formatINR(price * 0.1, 'SHORT_CR')})</span>
                    <span>90% (Max)</span>
                  </div>
                </div>

                {/* 2. Tenure Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-gray-500">Loan Tenure</span>
                    <span className="font-mono text-brand-charcoal">{tenureYears} Years ({tenureYears * 12} Months)</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-charcoal"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>5 Years</span>
                    <span>30 Years (Maximum)</span>
                  </div>
                </div>

                {/* 3. Interest Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-gray-500">Bank Interest Rate</span>
                    <span className="font-mono text-brand-charcoal">{interestRate}% per annum</span>
                  </div>
                  <input
                    type="range"
                    min="6.5"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-charcoal"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>6.5% (E.g. HDFC Premium)</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {/* Total Detailed Split Info */}
              <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Principal Loan Amount:</span>
                  <span className="font-mono font-medium text-brand-charcoal">{formatINR(loanAmount, 'FULL_NUMERIC')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Total Payable Interest:</span>
                  <span className="font-mono font-medium text-amber-700">+{formatINR(totalInterest, 'FULL_NUMERIC')}</span>
                </div>
                <div className="flex justify-between text-gray-550 border-t border-dashed border-gray-100 pt-2 font-medium">
                  <span className="text-brand-charcoal">Total Amount Payable (Over {tenureYears} yrs):</span>
                  <span className="font-mono text-brand-charcoal font-semibold">{formatINR(totalPayable, 'FULL_NUMERIC')}</span>
                </div>
              </div>

              {/* Submit / Apply Action */}
              <button
                onClick={handleApply}
                className="w-full rounded-xl bg-brand-charcoal py-3.5 text-sm font-medium text-white hover:bg-neutral-800 active:scale-98 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                💼 Check Eligibility for Pre-approved Loan
              </button>
            </div>
          ) : (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-605 ring-8 ring-emerald-50">
                <Check size={32} className="text-emerald-550" />
              </div>
              <h3 className="text-2xl font-display font-medium text-black">
                Eligibility Initialized!
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Excellent! Vidarbha Estate's banking associates (HDFC, SBI, and ICICI) have initiated pre-approvals for a loan up to <span className="font-semibold">{formatINR(loanAmount, 'LAKH_CRORE')}</span>.
              </p>
              <div className="bg-emerald-50/50 p-4 rounded-xl text-left text-xs text-emerald-800 space-y-1 max-w-md mx-auto">
                <p>✓ <strong>Fast-track verification</strong> launched for Anurag Kewat (anurag.k@vidarbhaestate.in).</p>
                <p>✓ Current selected advisor <strong>{property.agent.name}</strong> has been notified of your priority financing index.</p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-brand-charcoal text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Back to Property
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
