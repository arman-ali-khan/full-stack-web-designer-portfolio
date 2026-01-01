import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  data: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ data }) => {
  const [index, setIndex] = useState(0);
  
  const testimonials = data.length > 0 ? data : [
    { text: "Nexus transformed our digital presence.", author: "Alex Rivers", role: "CEO, Stellar Media" }
  ];

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 px-10 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-10 flex justify-center">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center text-purple-400">
            <Quote size={32} />
          </div>
        </div>

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-10"
            >
              <p className="text-2xl md:text-4xl font-light italic leading-relaxed mb-8">
                "{testimonials[index]?.text}"
              </p>
              <div>
                <h4 className="text-xl font-bold">{testimonials[index]?.author}</h4>
                <p className="text-purple-400 text-sm tracking-widest uppercase font-mono">{testimonials[index]?.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-6 mt-12">
            <button onClick={prev} className="p-4 glass rounded-full hover:bg-white/10 transition-all">
              <ChevronLeft />
            </button>
            <button onClick={next} className="p-4 glass rounded-full hover:bg-white/10 transition-all">
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;