import React from 'react';
import { useData } from '../../context/DataContext';

export const Services: React.FC = () => {
  const { data } = useData();
  const services = (data.services || []).filter(s => s.isActive).sort((a, b) => a.order - b.order);

  const cardList = [
    {
      num: '01',
      title: 'Frontend Development',
      desc: 'Crafting responsive and interactive user interfaces using React, JavaScript, TypeScript, Tailwind CSS, and modern frontend technologies to deliver seamless user experiences.',
      rot: 'md:rotate-3',
      pos: 'md:top-[10px] md:right-[5%] lg:right-[8%]'
    },
    {
      num: '02',
      title: 'Backend Development',
      desc: 'Building secure REST APIs, authentication systems, server-side applications, and database integrations with scalable architectures using Node.js, Express, and Python.',
      rot: 'md:-rotate-3',
      pos: 'md:top-[420px] md:left-[5%] lg:left-[8%]'
    },
    {
      num: '03',
      title: 'AI & Machine Learning',
      desc: 'Developing intelligent applications using NLP, Generative AI, Computer Vision, LLMs, and data-driven machine learning solutions.',
      rot: 'md:rotate-2',
      pos: 'md:top-[740px] md:right-[5%] lg:right-[10%]'
    },
    {
      num: '04',
      title: 'Data Science & ML',
      desc: 'Building and deploying machine learning models, data analysis pipelines, feature engineering, and model optimization using Python, TensorFlow, scikit-learn, and MLOps practices.',
      rot: 'md:-rotate-2',
      pos: 'md:top-[1060px] md:left-[10%] lg:left-[15%]'
    }
  ];

  return (
    <section id="expertise" className="bg-[#0a0a0a] pt-28 pb-36 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-grid-pattern">
      <div className="max-w-6xl mx-auto relative md:h-[1420px]">
        
        {/* Header Block */}
        <div className="md:absolute top-10 left-0 md:w-[480px] z-20 mb-16 md:mb-0">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs text-white/80 font-bold mb-6 shadow-sm bg-white/5 backdrop-blur-md uppercase tracking-widest">
            My Expertise
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Building Modern Digital Solutions with <span className="text-[#ff2a2a]">Code &amp; AI</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-md font-medium leading-relaxed">
            Combining full-stack development, artificial intelligence, and cloud technologies to create scalable, intelligent, and impactful digital products.
          </p>
        </div>

        {/* Desktop Curved S-Line Path Connector */}
        <svg className="hidden md:block absolute top-0 left-0 w-full h-[1420px] pointer-events-none z-0" viewBox="0 0 1000 1420" preserveAspectRatio="none">
          <path
            d="M 650,200 C 400,320 200,420 300,640 C 400,840 750,780 700,980 C 650,1180 400,1200 300,1280"
            fill="none"
            stroke="rgba(255, 42, 42, 0.3)"
            strokeWidth="3"
            strokeDasharray="8 10"
          />
        </svg>

        {/* Numbered Cards Deck */}
        <div className="flex flex-col gap-10 md:gap-0 items-center md:block relative z-10 w-full pt-4 md:pt-0 pb-12 md:pb-0">
          {cardList.map((card, idx) => (
            <div
              key={card.num}
              className={`w-full max-w-sm sm:max-w-md rounded-[2rem] p-2 relative flex flex-col items-center hover:scale-[1.03] transition-all duration-500 z-10 md:absolute ${card.pos} ${card.rot} bg-[#141414] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group`}
            >
              {/* Metallic Gradient Pin on Top */}
              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-700 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] absolute -top-3 border border-gray-400 z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#ff2a2a] rounded-full shadow-[0_0_8px_#ff2a2a]" />
              </div>

              {/* Card Body */}
              <div className="w-full h-full rounded-[1.6rem] p-8 flex flex-col min-h-[220px] bg-[#1c1c1c] border border-white/5 group-hover:border-[#ff2a2a]/40 transition-colors duration-500">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black font-mono tracking-widest text-[#ff2a2a]">
                    {card.num}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#ff2a2a]/60 animate-ping" />
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight text-white group-hover:text-[#ff2a2a] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-white/70">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Cursive Handwriting Signature */}
          <div className="hidden md:block absolute top-[1340px] left-[55%] font-hand text-4xl text-[#ff6b6b] rotate-3 drop-shadow-[0_2px_10px_rgba(255,42,42,0.4)]">
            Turning ideas into reality! ✨
          </div>
        </div>
      </div>
    </section>
  );
};
