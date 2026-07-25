import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiChevronDown, FiCamera, FiInfo, FiTrendingUp, FiCheckCircle,
} from 'react-icons/fi'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { MdOutlineExplore } from 'react-icons/md'
import { RiMapPinLine, RiPriceTag3Line } from 'react-icons/ri'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DestinationCard from '../components/DestinationCard'
import SkeletonCard from '../components/SkeletonCard'
import SurveyModal from '../components/SurveyModal'
import api from '../api/axios'

const PEOPLE_AVATARS = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
]

const FALLBACK = [
  {
    _id:'1', name:'Arba Minch – Nech Sar National Park',
    distance:'216–220 km from Hossaina', estimatedPrice:2000,
    description:"Nech Sar National Park sits between Lakes Abaya and Chamo. Home to zebras, crocodiles, hippos and over 300 bird species with breathtaking grasslands and boat trips.",
    highlights:['Boat trips on Lake Chamo','Zebras & hippos','Twin-lake panoramas','300+ bird species','Crocodile Market'],
    image:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lake_Chamo_01.jpg/1280px-Lake_Chamo_01.jpg',
    images:['https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lake_Chamo_01.jpg/1280px-Lake_Chamo_01.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Monument_in_Arba_Minch.jpg/1280px-Monument_in_Arba_Minch.jpg'],
  },
  {
    _id:'2', name:'Durame 777',
    distance:'~60 km from Hossaina', estimatedPrice:800,
    description:'A peaceful hilltop destination with cool mountain air, lush green valleys — perfect for group bonding and nature walks.',
    highlights:['Cool highland climate','Panoramic green valleys','Closest destination','Most affordable','Group picnic spots'],
    image:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1280&q=85',
    images:['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1280&q=85','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=85'],
  },
  {
    _id:'3', name:'Wondo Genet',
    distance:'~100 km from Hossaina', estimatedPrice:1600,
    description:"Natural hot springs surrounded by ancient forest, hiking trails, waterfalls and refreshing swimming.",
    highlights:['Natural hot spring pools','Dense primary forest','Waterfall hikes','Abundant birdlife','Former imperial retreat'],
    image:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Etiopien-1109.jpg/1280px-Etiopien-1109.jpg',
    images:['https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Etiopien-1109.jpg/1280px-Etiopien-1109.jpg','https://images.unsplash.com/photo-1448375240586-882707db888b?w=1280&q=85'],
  },
  {
    _id:'4', name:'Langano Lake',
    distance:'~150 km from Hossaina', estimatedPrice:1800,
    description:"Ethiopia's only bilharzia-free lake — safe for swimming, with beaches, boat trips and stunning sunsets.",
    highlights:['Safe bilharzia-free swimming','Lakeside beach','Boat trips','Hippos, monkeys & birds','Stunning sunsets'],
    image:'https://upload.wikimedia.org/wikipedia/commons/0/09/Ethiopia_-_Lake_Langano.jpg',
    images:['https://upload.wikimedia.org/wikipedia/commons/0/09/Ethiopia_-_Lake_Langano.jpg','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=85'],
  },
  {
    _id:'5', name:'Other Destination',
    distance:'Your choice', estimatedPrice:0,
    description:"Have a different place in mind? Suggest it here — tell us the name and why it would be perfect for our class trip.",
    highlights:['Suggest any place you love','Share your unique idea','Help discover new spots'],
    image:'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1280&q=85',
    images:['https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1280&q=85','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1280&q=85'],
    isCustom:true,
  },
]

const PRICE_STRIP = [
  { name:'Durame 777',  price:800,  km:'60 km'  },
  { name:'Wondo Genet', price:1600, km:'100 km' },
  { name:'Langano',     price:1800, km:'150 km' },
  { name:'Arba Minch',  price:2000, km:'216 km' },
]

const STEPS = [
  { icon:FiCamera,      n:'01', title:'Browse',  desc:'Explore each destination — photos, highlights, distance and estimated cost.' },
  { icon:FiInfo,        n:'02', title:'Research', desc:'Open Details to read everything before making your decision.' },
  { icon:FiCheckCircle, n:'03', title:'Vote',     desc:'Submit your vote with your WCU Student ID. One vote per student.' },
]

export default function HomePage() {
  const [destinations, setDestinations] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState(null)

  useEffect(() => {
    api.get('/destinations')
      .then(r => setDestinations(r.data.data))
      .catch(() => setDestinations(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-[#18100a]">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=90"
            alt="Ethiopia landscape"
            className="w-full h-full object-cover object-center"
            style={{ filter:'brightness(0.38) saturate(1.2)' }}
          />
        </div>

        {/* Gold-toned overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#18100a]/70 via-[#78350f]/30 to-[#18100a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#451a03]/50 via-transparent to-transparent" />

        {/* Gold ambient orbs */}
        {[
          { x:'8%',  y:'20%', size:520, color:'rgba(245,158,11,0.08)' },
          { x:'72%', y:'55%', size:380, color:'rgba(251,191,36,0.06)' },
          { x:'42%', y:'8%',  size:300, color:'rgba(16,185,129,0.04)' },
        ].map((o,i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ left:o.x, top:o.y, width:o.size, height:o.size,
              background:`radial-gradient(circle,${o.color},transparent 70%)` }}
            animate={{ scale:[1,1.2,1], opacity:[0.5,0.9,0.5] }}
            transition={{ duration:7+i*2, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}

        {/* Floating dots */}
        {[{l:'14%',t:'28%'},{l:'82%',t:'18%'},{l:'62%',t:'72%'},{l:'28%',t:'68%'},{l:'48%',t:'14%'},{l:'90%',t:'58%'}]
          .map((p,i) => (
            <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-amber-300/30"
              style={{ left:p.l, top:p.t }}
              animate={{ y:[-8,8,-8], opacity:[0.15,0.6,0.15] }}
              transition={{ duration:3.5+i*0.6, repeat:Infinity, ease:'easeInOut', delay:i*0.3 }}
            />
          ))}

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">

          {/* Badge */}
          <motion.div
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6 }}
            className="inline-flex items-center gap-2.5 glass text-white/90 text-xs font-semibold
                       tracking-wide px-5 py-2.5 rounded-full mb-8 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Computer Science Department — Wachemo University
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity:0, y:38 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:0.1, ease:[0.22,1,0.36,1] }}
            className="font-display text-white leading-[1.08] mb-6 tracking-tight"
            style={{ fontSize:'clamp(2.6rem,6.5vw,5.2rem)' }}
          >
            Choose Our Class
            <span className="block mt-1 bg-clip-text text-transparent"
              style={{ backgroundImage:'linear-gradient(90deg,#fbbf24,#f59e0b,#fde68a)' }}>
              Celebration Trip
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.22 }}
            className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-body"
          >
            Explore stunning destinations, read the full details, and cast your vote.
            The most-voted place becomes our class trip destination.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.65, delay:0.32 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <button onClick={() => scrollTo('destinations')}
              className="btn-primary text-sm px-10 py-4">
              <FiTrendingUp size={18} /> Vote Now
            </button>
            <button onClick={() => scrollTo('destinations')}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white/85
                         border border-white/25 hover:bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:scale-105 hover:border-white/40
                         font-sans text-sm font-medium tracking-wide">
              <MdOutlineExplore size={18} /> Explore Destinations
            </button>
          </motion.div>

          {/* People avatars */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ duration:0.7, delay:0.5 }}
            className="flex flex-col items-center gap-3 mb-10"
          >
            <div className="flex items-center">
              {PEOPLE_AVATARS.map((src,i) => (
                <div key={i}
                  className="w-10 h-10 rounded-full border-2 border-brand-400/40 overflow-hidden
                             -ml-3 first:ml-0 shadow-lg ring-1 ring-black/20"
                  style={{ zIndex:PEOPLE_AVATARS.length - i }}
                >
                  <img src={src} alt="student" className="w-full h-full object-cover"
                    onError={e => { e.target.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' }} />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-brand-400/40 bg-brand-600/80
                              backdrop-blur-sm -ml-3 flex items-center justify-center shadow-lg">
                <span className="text-white text-[10px] font-bold">+60</span>
              </div>
            </div>
            <p className="text-white/50 text-xs font-body tracking-wide">
              Your classmates are waiting for your vote
            </p>
          </motion.div>

          {/* Price strip */}
          <motion.div
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.55 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {PRICE_STRIP.map(d => (
              <button key={d.name}
                onClick={() => scrollTo('destinations')}
                className="flex items-center gap-2 glass text-white/80 text-xs
                           px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200
                           border border-white/15 font-body"
              >
                <RiMapPinLine size={13} className="text-brand-300 flex-shrink-0" />
                <span className="font-medium">{d.name}</span>
                <span className="text-white/35">·</span>
                <span className="text-brand-300 font-semibold">{d.price.toLocaleString()} ETB</span>
                <span className="text-white/35 text-[11px]">{d.km}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.button
          animate={{ y:[0,10,0] }} transition={{ duration:1.7, repeat:Infinity, ease:'easeInOut' }}
          onClick={() => scrollTo('destinations')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
                     gap-1.5 text-white/40 hover:text-white/70 transition-colors"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans">Scroll</span>
          <FiChevronDown size={20} />
        </motion.button>
      </section>

      {/* ═══════════ DESTINATIONS ═══════════ */}
      <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="section-eyebrow mb-5 block"
            >
              Browse &amp; Vote
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="font-display text-4xl md:text-5xl text-gray-900 dark:text-white mb-4 tracking-tight"
            >
              Pick Your Destination
            </motion.h2>
            <motion.p
              initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto font-body leading-relaxed"
            >
              Click <strong className="text-gray-800 dark:text-gray-200 font-semibold">Details</strong> to learn about a place,
              then <strong className="text-gray-800 dark:text-gray-200 font-semibold">Vote</strong> for your favourite.
              Don't see your place? Choose <strong className="text-gray-800 dark:text-gray-200 font-semibold">Other Destination</strong>.
            </motion.p>
          </div>

          {/* Info pills */}
          <motion.div
            initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { icon:RiPriceTag3Line, text:'Price includes transport, food & entrance',         color:'text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/30' },
              { icon:FiInfo,          text:'Click Details for full destination info',            color:'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/20' },
              { icon:HiOutlineLocationMarker, text:'Suggest your own place via Other Destination', color:'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
            ].map(({ icon:Icon, text, color }) => (
              <span key={text}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full font-body ${color}`}>
                <Icon size={13} /> {text}
              </span>
            ))}
          </motion.div>

          {/* Cards — always shows 5 including Other Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(5)].map((_,i) => <SkeletonCard key={i} />)
              : destinations.map((dest, i) => (
                  <DestinationCard key={dest._id} destination={dest} index={i} onSelect={setSelected} />
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 bg-white dark:bg-[#1e140c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-eyebrow mb-4 block">Process</span>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {STEPS.map(({ icon:Icon, n, title, desc }, i) => (
              <motion.div key={n}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.12 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600
                                  flex items-center justify-center shadow-glow-brand
                                  group-hover:scale-110 transition-transform duration-300">
                    <Icon size={26} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-3 text-5xl font-black
                                   text-brand-100 dark:text-brand-900/30 select-none leading-none font-display">
                    {n}
                  </span>
                </div>
                <h4 className="font-display text-xl text-gray-900 dark:text-white mb-2">{title}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-body">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=85"
            alt="Students traveling together"
            className="w-full h-full object-cover object-center"
            style={{ filter:'brightness(0.18) saturate(0.8)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#451a03]/90 via-[#78350f]/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="section-eyebrow mb-5 block"
            >
              About This Survey
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="font-display text-4xl md:text-5xl text-white mb-5 tracking-tight leading-tight"
            >
              Your Vote Shapes <br className="hidden sm:block" />
              Our Adventure
            </motion.h2>
            <motion.p
              initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-white/70 text-lg leading-relaxed mb-10 font-body"
            >
              This platform collects votes from Computer Science students at Wachemo University
              to decide the class celebration trip destination. Browse, explore every detail, and cast your vote.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon:FiCheckCircle, title:'One Vote Per Student', desc:'Your WCU Student ID ensures every student votes exactly once.' },
                { icon:RiMapPinLine,  title:'5 Destinations',       desc:'From nearby Durame 777 to the stunning Nech Sar National Park, plus suggest your own.' },
                { icon:FiTrendingUp,  title:'Live Dashboard',       desc:'Admin monitors all votes and stats in real time.' },
              ].map(({ icon:Icon, title, desc }) => (
                <div key={title} className="glass p-5 hover:bg-white/15 transition-colors">
                  <Icon size={20} className="text-brand-300 mb-3" />
                  <h4 className="font-sans font-semibold text-white mb-1 text-sm">{title}</h4>
                  <p className="text-white/60 text-xs leading-relaxed font-body">{desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <SurveyModal destination={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
