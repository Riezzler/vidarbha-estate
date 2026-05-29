import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Building,
  Maximize2,
  SlidersHorizontal,
  ChevronDown,
  Bookmark,
  Phone,
  Mail,
  Star,
  MessageSquare,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Calculator,
  User,
  ExternalLink,
  ChevronRight,
  Heart,
  Grid,
  CheckCircle,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { Property, CurrencyFormat } from './types';
import { INITIAL_PROPERTIES, CITIES, PROPERTY_TYPES, BEDROOM_OPTIONS, formatINR } from './data';
import TourModal from './components/TourModal';
import ContactAgentDrawer from './components/ContactAgentDrawer';
import EmiCalculator from './components/EmiCalculator';

export default function App() {
  // --- APPLICATION STATE ---
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('prop-1');
  const [currencyFormat, setCurrencyFormat] = useState<CurrencyFormat>('LAKH_CRORE');
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set(['prop-2']));

  // Filter States
  const [filterCity, setFilterCity] = useState<string>('All Cities');
  const [filterType, setFilterType] = useState<string>('All Types');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('Any Price');
  const [filterBeds, setFilterBeds] = useState<string>('Any Beds');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  
  // Quick amenities filter inside Advanced
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Search execution cache (to let user change selects but only apply when clicking 'Search')
  const [activeFilters, setActiveFilters] = useState({
    city: 'All Cities',
    type: 'All Types',
    priceRange: 'Any Price',
    beds: 'Any Beds'
  });

  // Modal / Drawer States
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEmiOpen, setIsEmiOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Display View Select: 'HD Photo' | 'Floor Plan' | 'Neighborhood Map'
  const [heroViewMode, setHeroViewMode] = useState<'HD Photo' | 'Floor Plan' | 'Neighborhood Map'>('HD Photo');

  // Active Dropdowns to show/hide custom select flyouts
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- DERIVED STATE ---
  const selectedProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  // Handle price conversion for dynamic formats (including USD)
  const formatPrice = (val: number) => {
    if (currencyFormat === 'LAKH_CRORE') {
      return formatINR(val, 'LAKH_CRORE');
    }
    if (currencyFormat === 'SHORT_CR') {
      return formatINR(val, 'SHORT_CR');
    }
    // Full Indian Numeric Format, e.g. ₹13,75,00,000
    if (currencyFormat === 'FULL_NUMERIC') {
      return formatINR(val, 'FULL_NUMERIC');
    }
    return '';
  };

  // Convert and format to USD
  const formatToUSD = (inrVal: number) => {
    const usdRate = 83.3333; // Mocking exactly $1.65 Million for ₹13.75 Crores
    const usdVal = Math.round(inrVal / usdRate);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(usdVal);
  };

  // Toggle saved action
  const toggleSaveProperty = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextSaved = new Set(savedPropertyIds);
    if (nextSaved.has(id)) {
      nextSaved.delete(id);
    } else {
      nextSaved.add(id);
    }
    setSavedPropertyIds(nextSaved);
  };

  // Filter calculations applied ONLY on Search click
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // 1. City Filter
      if (activeFilters.city !== 'All Cities' && prop.city !== activeFilters.city) {
        return false;
      }
      // 2. Property Type Filter
      if (activeFilters.type !== 'All Types' && prop.type !== activeFilters.type) {
        return false;
      }
      // 3. Beds Filter
      if (activeFilters.beds !== 'Any Beds') {
        if (activeFilters.beds === '1-2 Beds' && (prop.beds < 1 || prop.beds > 2)) return false;
        if (activeFilters.beds === '3-4 Beds' && (prop.beds < 3 || prop.beds > 4)) return false;
        if (activeFilters.beds === '5+ Beds' && prop.beds < 5) return false;
      }
      // 4. Price Filter
      if (activeFilters.priceRange !== 'Any Price') {
        const priceCr = prop.price / 10000000;
        if (activeFilters.priceRange === 'Under ₹5 Cr' && priceCr >= 5) return false;
        if (activeFilters.priceRange === '₹5 Cr - ₹15 Cr' && (priceCr < 5 || priceCr > 15)) return false;
        if (activeFilters.priceRange === 'Above ₹15 Cr' && priceCr <= 15) return false;
      }
      // 5. Selected Advanced Amenities checkbox mockup
      if (selectedAmenities.length > 0) {
        // Simulating that different property types contain different features
        if (selectedAmenities.includes('Pool') && prop.type !== 'Villa' && prop.type !== 'Penthouse') return false;
        if (selectedAmenities.includes('Gym') && prop.type !== 'Penthouse' && prop.type !== 'Apartment') return false;
      }
      return true;
    });
  }, [properties, activeFilters, selectedAmenities]);

  const handleSearchClick = () => {
    setActiveFilters({
      city: filterCity,
      type: filterType,
      priceRange: filterPriceRange,
      beds: filterBeds
    });
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Pre-sets for filter selections
  const priceRanges = ['Any Price', 'Under ₹5 Cr', '₹5 Cr - ₹15 Cr', 'Above ₹15 Cr'];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#faf8f5] via-[#f7f5ef] to-[#edf3f6] text-brand-charcoal py-4 px-4 sm:px-6 lg:px-8 selection:bg-brand-cream/60">
      
      {/* Outer Premium Container Framed Exactly like the mockup design */}
      <div className="max-w-7xl mx-auto bg-white/65 backdrop-blur-md border border-white/50 rounded-2xl sm:rounded-[40px] shadow-2xl p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden">
        
        {/* =========================================================================
            1. NAVIGATION BAR (Exactly matches Navbar shown in the mockup)
            ========================================================================= */}
        <header className="flex items-center justify-between py-3 border-b border-gray-100/60 pb-5">
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold tracking-tight text-brand-charcoal cursor-pointer flex items-center gap-1">
              Vidarbha Estate
              <span className="h-2 w-2 rounded-full bg-orange-500 mt-2 animate-pulse" />
            </span>
          </div>

          {/* Nav Categories */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <span className="text-orange-900 font-semibold border-b-2 border-brand-charcoal/80 pb-1 cursor-pointer">Condos</span>
            <span className="hover:text-brand-charcoal transition-colors cursor-pointer">Houses</span>
            <span className="hover:text-brand-charcoal transition-colors cursor-pointer">Commercial</span>
            <span className="hover:text-brand-charcoal transition-colors cursor-pointer">For rent</span>
            <span className="text-gray-300 select-none">•</span>
            <span className="hover:text-brand-charcoal transition-colors cursor-pointer">About</span>
            <span className="hover:text-brand-charcoal transition-colors cursor-pointer">Contact</span>
          </nav>

          {/* Currency format switcher + logged in user details */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Real-time Indian/US Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('currency')}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gray-55 shadow-xs transition-colors cursor-pointer"
              >
                💸 Price Format: {
                  currencyFormat === 'LAKH_CRORE' ? '₹ Lac/Cr' :
                  currencyFormat === 'SHORT_CR' ? '₹ Cr Only' :
                  currencyFormat === 'FULL_NUMERIC' ? '₹ Full' : 'USD ($)'
                }
                <ChevronDown size={14} className={`transition-transform duration-250 ${activeDropdown === 'currency' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'currency' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 z-50 mt-1.5 w-60 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    <p className="text-[10px] text-gray-400 px-3 py-1 font-semibold uppercase tracking-wider">Select Currency Display</p>
                    <div className="h-px bg-gray-100 my-1" />
                    
                    <button
                      onClick={() => { setCurrencyFormat('LAKH_CRORE'); setActiveDropdown(null); }}
                      className={`w-full text-left font-medium text-xs rounded-xl px-3 py-2 transition-colors flex items-center justify-between ${
                        currencyFormat === 'LAKH_CRORE' ? 'bg-amber-50 text-amber-900' : 'text-brand-charcoal hover:bg-brand-gray-light'
                      }`}
                    >
                      <span>₹ Indian (Lakhs / Crores)</span>
                      <span className="text-[10px] opacity-75 font-mono">e.g. ₹13.75 Cr</span>
                    </button>

                    <button
                      onClick={() => { setCurrencyFormat('SHORT_CR'); setActiveDropdown(null); }}
                      className={`w-full text-left font-medium text-xs rounded-xl px-3 py-2 transition-colors flex items-center justify-between ${
                        currencyFormat === 'SHORT_CR' ? 'bg-amber-50 text-amber-900' : 'text-brand-charcoal hover:bg-brand-gray-light'
                      }`}
                    >
                      <span>₹ Short crore notation</span>
                      <span className="text-[10px] opacity-75 font-mono">e.g. ₹13.75 Cr</span>
                    </button>

                    <button
                      onClick={() => { setCurrencyFormat('FULL_NUMERIC'); setActiveDropdown(null); }}
                      className={`w-full text-left font-medium text-xs rounded-xl px-3 py-2 transition-colors flex items-center justify-between ${
                        currencyFormat === 'FULL_NUMERIC' ? 'bg-amber-50 text-amber-900' : 'text-brand-charcoal hover:bg-brand-gray-light'
                      }`}
                    >
                      <span>₹ Full Numeric Notation</span>
                      <span className="text-[10px] opacity-75 font-mono">₹13,75,00,000</span>
                    </button>

                    <div className="h-px bg-gray-100 my-1" />

                    <button
                      onClick={() => { setCurrencyFormat('FULL_NUMERIC'); /* fallback */ setActiveDropdown(null); }}
                      className={`w-full text-left font-medium text-xs rounded-xl px-3 py-2 transition-colors hover:bg-brand-gray-light text-brand-charcoal`}
                    >
                      <span className="flex items-center gap-1.5">🇺🇸 Converters (US Dollar equivalency)</span>
                      <span className="text-[10px] font-mono text-emerald-600">$1,650,000</span>
                    </button>
                    
                    <p className="text-[9px] text-gray-400 px-3 pt-2 text-center">
                      Auto-rates pegged at 1 USD = 83.33 INR
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile / Status */}
            <div className="relative group">
              <div className="flex items-center gap-2 rounded-full bg-brand-charcoal px-3 sm:px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-charcoal/90 transition-all cursor-pointer">
                <User size={13} />
                <span className="hidden sm:inline">Anurag Kewat</span>
              </div>
              <div className="absolute right-0 mt-1.5 w-64 bg-white/95 rounded-2xl border border-gray-150 p-4 shadow-xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-brand-charcoal">Anurag Kewat</p>
                  <p className="text-[11px] text-gray-500 font-mono">anurag.k@vidarbhaestate.in</p>
                </div>
                <div className="h-px bg-gray-100 my-2.5" />
                <div className="text-[11px] text-gray-400 space-y-1">
                  <p>📍 Session Location: India</p>
                  <p>📅 Live Access: May 2026</p>
                </div>
              </div>
            </div>

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-brand-charcoal shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>

          </div>
        </header>

        {/* Mobile Accordion Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden bg-brand-gray-light/60 rounded-2xl border border-gray-150 p-4 space-y-3 mt-1.5"
            >
              <div className="flex flex-col gap-2.5 text-xs font-medium text-gray-600">
                <span className="text-orange-900 font-semibold px-2.5 py-2 bg-amber-50 rounded-xl">Condos</span>
                <span className="hover:text-brand-charcoal transition-colors cursor-pointer px-2.5 py-1.5 hover:bg-white/40 rounded-lg">Houses</span>
                <span className="hover:text-brand-charcoal transition-colors cursor-pointer px-2.5 py-1.5 hover:bg-white/40 rounded-lg">Commercial</span>
                <span className="hover:text-brand-charcoal transition-colors cursor-pointer px-2.5 py-1.5 hover:bg-white/40 rounded-lg">For rent</span>
                <div className="h-px bg-gray-200/40 my-1.5" />
                <span className="hover:text-brand-charcoal transition-colors cursor-pointer px-2.5 py-1.5 hover:bg-white/40 rounded-lg">About</span>
                <span className="hover:text-brand-charcoal transition-colors cursor-pointer px-2.5 py-1.5 hover:bg-white/40 rounded-lg">Contact</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            2. HERO SECTION - TITLES & DYNAMIC PROPERTY PREVIEW
            ========================================================================= */}
        <section className="space-y-6">
          
          {/* Main Title Heading (Identical formatting to design) */}
          <div>
            <h1 className="font-display font-medium text-[32px] sm:text-[42px] lg:text-[46px] leading-tight text-brand-charcoal tracking-tight mt-1">
              Real estate for living and investments
            </h1>
          </div>

          {/* DYNAMIC TWO-COLUMN SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* HERO LEFT COLUMN: MULTI-VIEW PROPERTY DISPLAY (12 cols grid: 8 parts) */}
            <div className="lg:col-span-8 flex flex-col justify-between rounded-[32px] bg-brand-charcoal text-white overflow-hidden relative shadow-lg min-h-[320px] sm:min-h-[380px] lg:min-h-[460px]">
              
              {/* Overlays / Custom Media Switcher Tabs (Photo, Floor plan, Micro maps) */}
              <div className="absolute top-3 left-3 right-3 sm:right-auto md:top-4 md:left-4 z-20 flex flex-wrap sm:flex-nowrap gap-1 md:gap-1.5 rounded-2xl sm:rounded-full bg-black/60 p-1 backdrop-blur-md">
                {(['HD Photo', 'Floor Plan', 'Neighborhood Map'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setHeroViewMode(mode)}
                    className={`rounded-full px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-wide transition-all ${
                      heroViewMode === mode
                        ? 'bg-white text-brand-charcoal shadow-sm font-semibold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {mode === 'HD Photo' ? '📷 HD Photo' : mode === 'Floor Plan' ? '📐 Layout' : '🗺️ Area Map'}
                  </button>
                ))}
              </div>

              {/* Dynamic Rendering Based on selected Mode */}
              <div className="absolute inset-0 h-full w-full">
                <AnimatePresence mode="wait">
                  {heroViewMode === 'HD Photo' && (
                    <motion.div
                      key="photo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative h-full w-full"
                    >
                      {/* Premium Cover Image */}
                      <img
                        src={selectedProperty.imageUrl}
                        alt={selectedProperty.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover select-none filter brightness-90 hover:brightness-95 transition-all duration-500"
                      />
                      
                      {/* Gradient Backdrop shadow to overlay the footer text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

                      {/* City Badge Tag on top-right */}
                      <div className="absolute top-14 right-3 sm:top-16 md:top-4 md:right-4 z-10 flex flex-col items-end gap-1.5">
                        <span className="rounded-full bg-brand-cream/90 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold font-display text-brand-charcoal flex items-center gap-1 shadow-md">
                          📍 {selectedProperty.city}
                        </span>
                        <span className="hidden sm:inline-block rounded-full bg-black/50 backdrop-blur-xs px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-white/90">
                          {selectedProperty.type}
                        </span>
                      </div>

                    </motion.div>
                  )}

                  {heroViewMode === 'Floor Plan' && (
                    <motion.div
                       key="floor-plan"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="h-full w-full bg-[#18181b] flex flex-col items-center justify-center p-4 sm:p-8 text-neutral-300 select-none"
                    >
                      {/* Dynamic, visually captivating mockup SVG layout of the floor plan */}
                      <div className="w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between text-xs text-neutral-400 font-mono tracking-wider font-semibold border-b border-neutral-800 pb-2">
                          <span>📐 SCHEMATIC BLUEPRINT</span>
                          <span>Beds: {selectedProperty.beds} BHK • {selectedProperty.sqft} SQFT</span>
                        </div>
                        
                        {/* Blueprint grid SVG */}
                        <svg viewBox="0 0 400 240" className="w-full h-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-inner p-4 text-neutral-500 font-mono text-[9px]">
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222" strokeWidth="0.5" />
                            </pattern>
                          </defs>
                          <rect width="400" height="240" fill="url(#grid)" />
                          
                          {/* Exterior walls */}
                          <rect x="20" y="20" width="360" height="200" fill="none" stroke="#666" strokeWidth="2.5" />
                          <line x1="160" y1="20" x2="160" y2="220" stroke="#666" strokeWidth="2" strokeDasharray="4 4" />
                          <line x1="280" y1="20" x2="280" y2="220" stroke="#666" strokeWidth="2" strokeDasharray="4 4" />
                          <line x1="20" y1="120" x2="160" y2="120" stroke="#666" strokeWidth="2" />
                          
                          {/* Room Labels & Dimensions */}
                          <text x="40" y="50" fill="#bbb" className="font-semibold text-[10px]">LIVING SUITE</text>
                          <text x="40" y="65" fill="#888">24' x 16' • Double-Height</text>

                          <text x="40" y="160" fill="#bbb" className="font-semibold text-[10px]">KITCHEN & DINING</text>
                          <text x="40" y="175" fill="#888">18' x 12' • Italian Marble</text>

                          <text x="180" y="55" fill="#bbb" className="font-semibold text-[10px]">PRIMARY BR (B1)</text>
                          <text x="180" y="70" fill="#888">18' x 14' • En-Suite Bath</text>

                          <text x="180" y="150" fill="#bbb" className="font-semibold text-[10px]">GUEST SUITE (B2)</text>
                          <text x="180" y="165" fill="#888">16' x 12' • Attach Balcony</text>

                          <text x="300" y="55" fill="#bbb" className="font-semibold text-[10px]">DECK / BAR</text>
                          <text x="300" y="70" fill="#888">10' x 12'</text>

                          <text x="300" y="150" fill="#bbb" className="font-semibold text-[10px]">STUDY ROOM</text>
                          <text x="300" y="165" fill="#888">10' x 12'</text>

                          {/* Door icons */}
                          <path d="M 160,80 A 20,20 0 0,1 140,100 L 160,100 Z" fill="none" stroke="#b59f7b" strokeWidth="1.5" />
                          <path d="M 280,100 A 20,20 0 0,1 300,120 L 280,120 Z" fill="none" stroke="#b59f7b" strokeWidth="1.5" />
                        </svg>

                        <div className="flex justify-between items-center bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-800 text-[11px] text-neutral-400">
                          <span>💡 Architectural blueprints are standard representations. Final finishes customizable.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {heroViewMode === 'Neighborhood Map' && (
                    <motion.div
                       key="map"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="h-full w-full bg-[#1e222b] flex flex-col items-center justify-center p-4 sm:p-8 text-neutral-300 select-none"
                    >
                      <div className="w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between text-xs text-neutral-400 font-mono tracking-wider font-semibold border-b border-neutral-800 pb-2">
                          <span>🗺️ PREMIUM COMMUNITY LOCATOR</span>
                          <span>{selectedProperty.address}, {selectedProperty.city}</span>
                        </div>

                        {/* Simulated high-fidelity schematic map of local luxury assets */}
                        <svg viewBox="0 0 400 240" className="w-full h-auto bg-[#1b1e25] border border-neutral-800 rounded-2xl shadow-inner p-4 text-neutral-400">
                          {/* Road layout paths */}
                          <path d="M -10,120 C 120,120 280,60 410,60" fill="none" stroke="#333a4a" strokeWidth="12" />
                          <path d="M 200,-10 L 200,250" fill="none" stroke="#333a4a" strokeWidth="10" />
                          <path d="M 60,-10 C 60,180 200,220 410,220" fill="none" stroke="#333a4a" strokeWidth="8" strokeDasharray="3 3" />
                          
                          {/* Futala & Ambazari Lake custom water accents in Nagpur */}
                          {['Civil Lines', 'Dharampeth'].includes(selectedProperty.city) && (
                            <>
                              <path d="M -10,30 L 150,0 M -10,60 L 180,0 L 210,-10" fill="none" stroke="#104f55" strokeWidth="24" opacity="0.5" />
                              <text x="15" y="22" fill="#8ecae6" className="text-[7px] font-mono select-none">🌊 Futala Lake Vista</text>
                            </>
                          )}
                          {selectedProperty.city === 'Wardha Road' && (
                            <>
                              <path d="M 280,240 Q 320,180 410,180" fill="none" stroke="#1d4060" strokeWidth="16" opacity="0.4" />
                              <text x="310" y="205" fill="#93c5fd" className="text-[7px] font-mono select-none">🌊 Ambazari Lake Contour</text>
                            </>
                          )}

                          {/* Landmarks markers */}
                          <circle cx="200" cy="100" r="14" fill="#d97706" className="animate-ping opacity-15" />
                          <circle cx="200" cy="100" r="8" fill="#d97706" /> {/* Active property landmark */}
                          <text x="212" y="104" fill="#f59e0b" className="font-semibold text-[10px]">Property Site</text>

                          <circle cx="80" cy="40" r="5" fill="#3b82f6" />
                          <text x="90" y="44" fill="#93c5fd" className="text-[8px]">☕ Dharampeth Elite Club (0.3 km)</text>

                          <circle cx="280" cy="160" r="5" fill="#10b981" />
                          <text x="290" y="164" fill="#6ee7b7" className="text-[8px]">🏫 Nagpur International Academy (0.6 km)</text>

                          <circle cx="340" cy="30" r="5" fill="#8b5cf6" />
                          <text x="225" y="25" fill="#c084fc" className="text-[8px]">🚇 Nagpur Metro Line (0.2 km)</text>

                          <circle cx="110" cy="200" r="5" fill="#ef4444" />
                          <text x="120" y="204" fill="#fca5a5" className="text-[8px]">🏨 5-Star Radisson Blu Hotel (0.4 km)</text>
                        </svg>

                        <div className="flex justify-between items-center bg-neutral-900/60 px-4 py-2.5 rounded-xl border border-neutral-800 text-[10px] text-neutral-400">
                          <span className="flex items-center gap-1.5 text-amber-500 font-semibold uppercase font-mono">
                            💎 POSH Locality Ratio: Extremely Affluent (Top 1%)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Text Descriptor overlaying lower banner */}
              <div className="mt-auto p-5 sm:p-8 z-15 bg-gradient-to-t from-black/95 via-black/40 to-transparent pt-32 block space-y-2 pointer-events-none">
                <p className="text-xs uppercase tracking-widest font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  ✨ PREMIUM HIGHLIGHT
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight drop-shadow-sm font-display">
                  {selectedProperty.title}
                </h2>
                <p className="text-xs text-gray-300 max-w-2xl leading-relaxed font-sans mt-1">
                  Enjoy supreme layout aesthetics containing premium imported materials, overlooking majestic surrounding skylines of {selectedProperty.city}. Strategically located with immediate neighborhood lifestyle access.
                </p>
              </div>

            </div>

            {/* =========================================================================
                HERO RIGHT COLUMN: PROPERTY CARD (Matches card layout in mockup exactly)
                ========================================================================= */}
            <div className="lg:col-span-4 rounded-[32px] border border-gray-150/80 bg-white p-6 flex flex-col justify-between shadow-xs relative">
              
              <div className="space-y-6">
                
                {/* 1. Address Row with bookmark toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-medium text-lg leading-tight text-brand-charcoal">
                      {selectedProperty.address}
                    </h3>
                    <p className="text-xs text-brand-gray-medium font-sans mt-0.5">
                      {selectedProperty.city}, {selectedProperty.state} {selectedProperty.pincode}
                    </p>
                  </div>
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSaveProperty(selectedProperty.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                      savedPropertyIds.has(selectedProperty.id)
                        ? 'bg-amber-50 border-amber-300 text-amber-500'
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-brand-charcoal'
                    } cursor-pointer active:scale-90`}
                  >
                    <Bookmark size={16} fill={savedPropertyIds.has(selectedProperty.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* 2. Specs grid in three column exactly aligned with screenshot */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 text-center">
                  <div className="space-y-0.5">
                    <p className="text-2xl font-semibold text-brand-charcoal tracking-tight font-display">
                      {selectedProperty.beds}
                    </p>
                    <p className="text-[11px] text-gray-500 font-sans uppercase tracking-wider font-semibold">
                      beds
                    </p>
                  </div>

                  <div className="space-y-0.5 border-l border-r border-gray-100">
                    <p className="text-2xl font-semibold text-brand-charcoal tracking-tight font-display">
                      {selectedProperty.baths}
                    </p>
                    <p className="text-[11px] text-gray-500 font-sans uppercase tracking-wider font-semibold">
                      baths
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xl font-semibold text-brand-charcoal tracking-tight font-display pt-0.5">
                      {selectedProperty.sqft.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-gray-500 font-sans uppercase tracking-wider font-semibold mt-0.5">
                      sqft
                    </p>
                  </div>
                </div>

                {/* 3. Pricing Container - Indianized exactly */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2.5">
                  <div className="space-y-0.5">
                    
                    {/* Rupee Price */}
                    <div className="text-2xl font-semibold text-brand-charcoal font-display tracking-tight flex items-baseline gap-1">
                      {formatPrice(selectedProperty.price)}
                    </div>
                    
                    {/* Convertible USD equivalency tag below price */}
                    <div className="text-[10px] text-emerald-600 font-semibold font-mono tracking-wider">
                      🇺🇸 USD equiv: {formatToUSD(selectedProperty.price)}
                    </div>

                  </div>

                  {/* "Split options >" link button */}
                  <button
                    onClick={() => setIsEmiOpen(true)}
                    className="rounded-full border border-gray-200 bg-brand-gray-light hover:bg-[#eae8e4] text-brand-charcoal px-4 py-2 text-xs font-semibold hover:border-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    Calculator <Calculator size={13} />
                  </button>
                </div>

                {/* 4. Agent Info Card block exactly identical */}
                <div className="rounded-2xl border border-gray-100/85 bg-brand-gray-light/60 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-400 font-mono tracking-wider font-medium uppercase">
                        Advisor
                      </p>
                      <h4 className="font-display font-semibold text-sm text-brand-charcoal">
                        {selectedProperty.agent.name}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="rounded-full border border-gray-200 bg-white hover:bg-neutral-50 shadow-xs px-4 py-2 text-xs font-semibold text-brand-charcoal transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </div>

              </div>

              {/* 5. Request tour button block on footer (exactly matches bottom black pill in mockup) */}
              <div className="mt-6">
                <button
                  onClick={() => setIsTourOpen(true)}
                  className="w-full rounded-2xl bg-brand-charcoal text-white hover:bg-neutral-800 transition-all font-display font-medium text-sm py-4 shadow-md flex flex-col items-center justify-center cursor-pointer active:scale-98"
                >
                  <span>Request a tour</span>
                  <span className="text-[10px] font-sans text-amber-200 font-semibold mt-0.5 tracking-wider">
                    🏡 Earliest at 11:00 tomorrow
                  </span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            3. PILL FILTER SELECTION ROW (Replicates layout exactly)
            ========================================================================= */}
        <section className={`bg-white border border-gray-150 rounded-[28px] p-2 hover:shadow-md transition-shadow relative ${activeDropdown ? 'z-40' : 'z-10'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 items-center">
            
            {/* Location block selector */}
            <div
              className={`md:col-span-3 px-4 py-3 border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 cursor-pointer rounded-2xl hover:bg-brand-gray-light/50 transition-colors flex items-center gap-3.5 relative`}
              onClick={() => handleDropdownToggle('location')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fcfbf9] border border-gray-100 text-amber-600 shadow-xs">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold font-display text-brand-charcoal truncate mt-0.5">{filterCity}</p>
              </div>
              <ChevronDown size={14} className="ml-auto text-gray-400" />

              {/* Dropdown Flyout */}
              <AnimatePresence>
                {activeDropdown === 'location' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 md:right-auto md:w-64 top-full mt-2 z-50 rounded-2xl border border-gray-150 bg-white p-2 shadow-xl"
                  >
                    <p className="text-[10px] text-gray-400 pl-3 pt-1 font-semibold uppercase">Select Vidarbha Hub</p>
                    <div className="h-px bg-gray-105 my-1" />
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={(e) => { e.stopPropagation(); setFilterCity(city); setActiveDropdown(null); }}
                        className={`w-full text-left font-semibold text-xs rounded-xl px-3.5 py-2.5 transition-colors ${
                          filterCity === city ? 'bg-amber-50 text-amber-900 font-bold' : 'text-brand-charcoal hover:bg-brand-gray-light'
                        }`}
                      >
                        📍 {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Property type block selector */}
            <div
              className={`md:col-span-3 px-4 py-3 border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 cursor-pointer rounded-2xl hover:bg-brand-gray-light/50 transition-colors flex items-center gap-3.5 relative`}
              onClick={() => handleDropdownToggle('type')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fcfbf9] border border-gray-100 text-[#2563eb] shadow-xs">
                <Building size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Property Type</p>
                <p className="text-xs font-bold font-display text-brand-charcoal truncate mt-0.5">{filterType}</p>
              </div>
              <ChevronDown size={14} className="ml-auto text-gray-400" />

              {/* Dropdown Flyout */}
              <AnimatePresence>
                {activeDropdown === 'type' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 md:right-auto md:w-64 top-full mt-2 z-50 rounded-2xl border border-gray-150 bg-white p-2 shadow-xl"
                  >
                    <p className="text-[10px] text-gray-400 pl-3 pt-1 font-semibold uppercase">Property Structure</p>
                    <div className="h-px bg-gray-105 my-1" />
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={(e) => { e.stopPropagation(); setFilterType(type); setActiveDropdown(null); }}
                        className={`w-full text-left font-semibold text-xs rounded-xl px-3.5 py-2.5 transition-colors ${
                          filterType === type ? 'bg-amber-50 text-amber-900 font-bold' : 'text-brand-charcoal hover:bg-brand-gray-light'
                        }`}
                      >
                        🏢 {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price slider/tag block selector */}
            <div
              className={`md:col-span-2 px-4 py-3 border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 cursor-pointer rounded-2xl hover:bg-brand-gray-light/50 transition-colors flex items-center gap-3.5 relative`}
              onClick={() => handleDropdownToggle('price')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fcfbf9] border border-gray-100 text-emerald-600 shadow-xs text-sm font-semibold font-mono">
                ₹
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Price Range</p>
                <p className="text-xs font-bold font-display text-brand-charcoal truncate mt-0.5">{filterPriceRange}</p>
              </div>
              <ChevronDown size={14} className="ml-auto text-gray-400" />

              {/* Dropdown Flyout */}
              <AnimatePresence>
                {activeDropdown === 'price' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 md:right-auto md:w-64 top-full mt-2 z-50 rounded-2xl border border-gray-150 bg-white p-2 shadow-xl"
                  >
                    <p className="text-[10px] text-gray-400 pl-3 pt-1 font-semibold uppercase font-mono">Rupees Bracket Range</p>
                    <div className="h-px bg-gray-105 my-1" />
                    {priceRanges.map((rVal) => (
                      <button
                        key={rVal}
                        onClick={(e) => { e.stopPropagation(); setFilterPriceRange(rVal); setActiveDropdown(null); }}
                        className={`w-full text-left font-semibold text-xs rounded-xl px-3.5 py-2.5 transition-colors ${
                          filterPriceRange === rVal ? 'bg-amber-50 text-amber-900 font-bold' : 'text-brand-charcoal hover:bg-brand-gray-light'
                        }`}
                      >
                        🤑 {rVal}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bedrooms selector */}
            <div
              className={`md:col-span-2 px-4 py-3 border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 cursor-pointer rounded-2xl hover:bg-brand-gray-light/50 transition-colors flex items-center gap-3.5 relative`}
              onClick={() => handleDropdownToggle('beds')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fcfbf9] border border-gray-100 text-purple-600 shadow-xs">
                <Maximize2 size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Bedrooms</p>
                <p className="text-xs font-bold font-display text-brand-charcoal truncate mt-0.5">{filterBeds}</p>
              </div>
              <ChevronDown size={14} className="ml-auto text-gray-400" />

              {/* Dropdown Flyout */}
              <AnimatePresence>
                {activeDropdown === 'beds' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 md:right-auto md:w-64 top-full mt-2 z-50 rounded-2xl border border-gray-150 bg-white p-2 shadow-xl"
                  >
                    <p className="text-[10px] text-gray-400 pl-3 pt-1 font-semibold uppercase">Premium Configurations</p>
                    <div className="h-px bg-gray-105 my-1" />
                    {BEDROOM_OPTIONS.map((val) => (
                      <button
                        key={val}
                        onClick={(e) => { e.stopPropagation(); setFilterBeds(val); setActiveDropdown(null); }}
                        className={`w-full text-left font-semibold text-xs rounded-xl px-3.5 py-2.5 transition-colors ${
                          filterBeds === val ? 'bg-amber-50 text-amber-900' : 'text-brand-charcoal hover:bg-brand-gray-light'
                        }`}
                      >
                        🛏️ {val}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sliders and trigger button */}
            <div
              className="md:col-span-1 px-4 py-3 flex items-center justify-center cursor-pointer rounded-2xl hover:bg-brand-gray-light/60 transition-colors border-b border-gray-100 md:border-b-0"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <div className="text-center">
                <SlidersHorizontal size={18} className={`mx-auto ${showAdvancedFilters ? 'text-amber-600' : 'text-gray-400'}`} />
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">More</p>
              </div>
            </div>

            {/* BLACK SEARCH BUTTON */}
            <div className="md:col-span-1 px-2 py-1.5 flex items-center justify-center">
              <button
                onClick={handleSearchClick}
                className="w-full md:aspect-square md:rounded-full rounded-2xl bg-brand-charcoal text-white hover:bg-neutral-800 transition-all flex items-center justify-center py-3.5 px-6 md:px-0 scroll-py-3.5 hover:shadow-md cursor-pointer active:scale-95 text-xs font-semibold uppercase tracking-wider"
              >
                <Search size={18} className="md:block hidden" />
                <span className="md:hidden block">Apply Search Filters</span>
              </button>
            </div>

          </div>

          {/* ADVANCED AMENITIES FILTER DRAWER EXPANSION */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-[#fafcfb] rounded-2xl border-t border-gray-150 mt-1"
              >
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Select Amenities list */}
                  <div>
                    <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">Amenities Selectors</h4>
                    <div className="space-y-2">
                       {['Pool', 'Gym'].map((amenity) => (
                         <label key={amenity} className="flex items-center gap-2.5 text-xs font-medium cursor-pointer text-gray-600">
                           <input
                             type="checkbox"
                             checked={selectedAmenities.includes(amenity)}
                             onChange={(e) => {
                               if (e.target.checked) {
                                 setSelectedAmenities([...selectedAmenities, amenity]);
                               } else {
                                 setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                               }
                             }}
                             className="rounded border-gray-300 text-brand-charcoal focus:ring-brand-charcoal h-4 w-4"
                           />
                           {amenity === 'Pool' ? '🏊 Ambient Swimming Pool' : '🏋️ Fully Equipped Health Gym'}
                         </label>
                       ))}
                    </div>
                  </div>

                  {/* Filter summaries text */}
                  <div className="sm:col-span-2 bg-white/70 p-4 rounded-xl border border-gray-100 space-y-1 text-xs text-gray-500">
                     <p className="font-semibold text-brand-charcoal">Advanced Luxury Filters Enabled</p>
                     <p>Selected Vidarbha Hub: <span className="font-mono text-brand-charcoal font-semibold">{filterCity}</span></p>
                     <p>Property Structure Category: <span className="font-mono text-brand-charcoal font-semibold">{filterType}</span></p>
                     <p className="text-[10px] text-gray-400">Filtering is applied locally with immediate index response matching luxurious units.</p>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* =========================================================================
            4. "LATEST IN YOUR AREA" PROPERTY SERIES LISTINGS SECTION (Exactly matched)
            ========================================================================= */}
        <section className="space-y-6 pt-2">
          
          {/* Header row exactly as represented */}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-medium text-2xl sm:text-[28px] text-brand-charcoal tracking-tight">
              Latest in your area
            </h2>
            
            <button
              onClick={() => {
                // Reset all filters to show everyone
                setFilterCity('All Cities');
                setFilterType('All Types');
                setFilterPriceRange('Any Price');
                setFilterBeds('Any Beds');
                setActiveFilters({
                  city: 'All Cities',
                  type: 'All Types',
                  priceRange: 'Any Price',
                  beds: 'Any Beds'
                });
              }}
              className="rounded-full border border-gray-200 hover:border-brand-cream bg-white text-xs font-semibold px-5 py-2.5 text-brand-charcoal transition-all hover:bg-brand-gray-light cursor-pointer shadow-xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>

          {/* Fallback layout if filters return 0 listings */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16 px-4 border-2 border-dashed border-gray-150 rounded-3xl bg-brand-gray-light/30">
              <Building size={48} className="mx-auto text-gray-300 stroke-1 mb-3" />
              <h3 className="font-display text-lg font-medium text-brand-charcoal">No Matching Estates</h3>
              <p className="text-xs text-gray-450 mt-1 max-w-sm mx-auto">
                No high-end listing found matching your current filter filters. Try widening your price bracket or selecting 'All Cities'.
              </p>
              <button
                onClick={() => {
                  setFilterCity('All Cities');
                  setFilterType('All Types');
                  setFilterPriceRange('Any Price');
                  setFilterBeds('Any Beds');
                  setActiveFilters({
                    city: 'All Cities',
                    type: 'All Types',
                    priceRange: 'Any Price',
                    beds: 'Any Beds'
                  });
                }}
                className="mt-4 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg px-4 py-2 transition-all cursor-pointer"
              >
                View Ultra Estates
              </button>
            </div>
          ) : (
            
            /* Responsive Bento-Style Grid containing Interactive Property Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => {
                const isSelected = prop.id === selectedPropertyId;
                const isSaved = savedPropertyIds.has(prop.id);
                
                return (
                  <motion.div
                    key={prop.id}
                    layoutId={`prop-card-${prop.id}`}
                    onClick={() => {
                      setSelectedPropertyId(prop.id);
                      // Scroll beautifully back up to Hero element
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group cursor-pointer rounded-3xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-300/40 scale-[1.01]'
                        : 'border-gray-200/80 hover:border-gray-300'
                    }`}
                  >
                    
                    {/* Media Thumbnail Container with badges */}
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out fill-neutral-800"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                      {/* City Name Badge overlay */}
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold text-brand-charcoal shadow-xs">
                        📍 {prop.city}
                      </span>

                      {/* Bookmark Icon inside list card */}
                      <button
                        onClick={(e) => toggleSaveProperty(prop.id, e)}
                        className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-black/40 text-white/90 hover:bg-black/65 hover:text-white'
                        }`}
                      >
                        <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>

                      {/* Listing status / price label at bottom margin of image */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="rounded-md bg-brand-charcoal px-2.5 py-1 text-[10px] font-bold font-mono tracking-wider uppercase text-white shadow-xs">
                          {prop.type}
                        </span>
                      </div>
                    </div>

                    {/* Meta info container */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-1">
                        <h4 className="font-display font-semibold text-brand-charcoal text-base group-hover:text-amber-800 transition-colors line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1">{prop.address}, {prop.city}</p>
                      </div>

                      {/* Specs Row */}
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-t border-b border-gray-100 py-2.5">
                        <span className="flex items-center gap-1">🛏️ {prop.beds} BHK</span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span className="flex items-center gap-1">🛀 {prop.baths} Bath</span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span className="flex items-center gap-1 font-mono">{prop.sqft.toLocaleString('en-IN')} sqft</span>
                      </div>

                      {/* Price & selection Trigger button */}
                      <div className="flex items-center justify-between gap-2.5">
                        <div>
                          <p className="text-base font-bold text-brand-charcoal font-display">
                            {formatPrice(prop.price)}
                          </p>
                          <p className="text-[9px] text-gray-400 font-semibold font-mono tracking-wider uppercase mt-0.5">
                            🇺🇸 {formatToUSD(prop.price)} Value
                          </p>
                        </div>

                        {/* Visual Select action indicator */}
                        <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                          isSelected ? 'bg-amber-100 text-amber-900' : 'bg-brand-gray-light text-gray-400 group-hover:bg-brand-cream/60 group-hover:text-amber-800'
                        }`}>
                          <ChevronRight size={16} className={`transition-all duration-300 ${isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                        </div>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}

        </section>

        {/* =========================================================================
            5. FOOTER / LEGAL CREDITS
            ========================================================================= */}
        <footer className="border-t border-gray-150 pt-8 mt-12 text-center space-y-3 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-sans">
            <p>© 2026 Vidarbha Estate Labs. Created in accordance with MahaRERA (Maharashtra RERA) standards.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-brand-charcoal transition-colors cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-brand-charcoal transition-colors cursor-pointer">Privacy & Cookie Settings</span>
              <span>•</span>
              <span className="hover:text-brand-charcoal transition-colors cursor-pointer">RERA India Certifications</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400/80 italic font-mono">
            Pegged Live: Indian National Rupees Format (₹ Lac / ₹ Cr) • Active System UTC: {new Date().toISOString()} • anurag.k@vidarbhaestate.in
          </p>
        </footer>

      </div>

      {/* =========================================================================
          INTERACTIVE POPUPS, MODALS, AND CHAT DRAWER PORTALS
          ========================================================================= */}
      
      {/* 1. Request Virtual/Physical Tour Booking Modal */}
      <TourModal
        property={selectedProperty}
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* 2. Chat communication slider with specific property agents */}
      <ContactAgentDrawer
        property={selectedProperty}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 3. Pre-approved Loan EMI calculator with interactive sliders */}
      <EmiCalculator
        property={selectedProperty}
        isOpen={isEmiOpen}
        onClose={() => setIsEmiOpen(false)}
      />

    </div>
  );
}
