import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    tag: "Exclusive 2026 Collection",
    title: "Next-Gen Laptops & Smart Tech",
    subtitle: "Upgrade your productivity with ultra-fast performance, stylish designs, and up to 40% discount.",
    cta: "Explore Gadgets",
    category: "Laptops",
    badge: "Limited Offer",
    bgGradient: "from-indigo-900 via-slate-900 to-indigo-950",
    accentColor: "from-sky-400 to-indigo-400",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    tag: "Flagship Smartphones",
    title: "Experience Seamless Innovation",
    subtitle: "Crystal clear OLED screens, studio-grade cameras, and all-day fast charge battery life.",
    cta: "Shop Mobiles",
    category: "Mobiles",
    badge: "Trending Now",
    bgGradient: "from-slate-900 via-indigo-950 to-blue-950",
    accentColor: "from-indigo-400 to-violet-300",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    tag: "Audio & Smart Accessories",
    title: "Immersive Sound & Everyday Comfort",
    subtitle: "Noise cancelling headphones and premium lifestyle gear crafted for music lovers.",
    cta: "View Accessories",
    category: "Accessories",
    badge: "Best Seller",
    bgGradient: "from-blue-950 via-slate-900 to-indigo-950",
    accentColor: "from-teal-300 to-sky-400",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  }
];

export default function HeroSlider({ onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200/50 mb-12">
      {/* Background glowing effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className={`relative min-h-[380px] md:min-h-[440px] flex items-center transition-all duration-700 bg-gradient-to-r ${slide.bgGradient}`}>
        <div className="w-full px-6 sm:px-12 md:px-16 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

          {/* Left Text Content */}
          <div className="md:col-span-7 space-y-4 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-300 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>{slide.badge}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/80">{slide.tag}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {slide.title.split('&')[0]} & <span className={`bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}>{slide.title.split('&')[1] || ''}</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectCategory && onSelectCategory(slide.category)}
                className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-lg transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.cta}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Delivery & 7-Day Returns
              </div>
            </div>
          </div>

          {/* Right Image Graphic */}
          <div className="md:col-span-5 flex justify-center md:justify-end z-10">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 opacity-30 blur-lg group-hover:opacity-60 transition duration-500"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="relative rounded-2xl w-full max-w-[340px] md:max-w-[380px] h-[220px] sm:h-[260px] object-cover shadow-2xl border border-white/10 transform -rotate-1 hover:rotate-0 transition duration-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Slide Navigation Dots and Arrows */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6 sm:px-12 pointer-events-none">

        {/* Indicators */}
        <div className="flex gap-2 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-sky-400' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white text-xs transition cursor-pointer"
            aria-label="Previous slide"
          >
            ❮
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white text-xs transition cursor-pointer"
            aria-label="Next slide"
          >
            ❯
          </button>
        </div>

      </div>
    </div>
  );
}
