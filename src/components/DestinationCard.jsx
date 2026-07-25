import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMapPin, FiArrowRight, FiChevronLeft, FiChevronRight,
  FiInfo, FiCheckCircle,
} from 'react-icons/fi'
import { RiMapPinLine, RiPriceTag3Line } from 'react-icons/ri'
import { HiOutlineSparkles } from 'react-icons/hi'

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'

export default function DestinationCard({ destination, index, onSelect }) {
  const [imgIdx, setImgIdx]         = useState(0)
  const [showDetail, setShowDetail] = useState(false)

  const images  = destination.images?.length ? destination.images : [destination.image]
  const isOther = destination.isCustom

  const prev = e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }
  const next = e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }

  const btnGradient = isOther
    ? 'from-amber-600 to-amber-800'
    : 'from-brand-500 to-brand-600'

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden
                   shadow-card hover:shadow-card-hover transition-all duration-500
                   hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
      >
        {/* ── Image ── */}
        <div className="relative h-52 overflow-hidden flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIdx}
              src={images[imgIdx]}
              alt={destination.name}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38 }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={e => { e.target.src = FALLBACK }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                           bg-black/50 hover:bg-black/70 text-white flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <FiChevronLeft size={14} />
              </button>
              <button onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                           bg-black/50 hover:bg-black/70 text-white flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <FiChevronRight size={14} />
              </button>
              <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={e => { e.stopPropagation(); setImgIdx(i) }}
                    className={`h-1 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/45 w-1.5'}`} />
                ))}
              </div>
            </>
          )}

          {/* Distance bottom-left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/85 text-[11px] font-medium">
            <RiMapPinLine size={12} className="text-brand-300" />
            {destination.distance}
          </div>

          {/* Price / type badge top-right */}
          {isOther ? (
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-brand-600/85 backdrop-blur-sm
                             text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-brand-400/30">
              <HiOutlineSparkles size={11} /> Suggest a Place
            </span>
          ) : (
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm
                             text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <RiPriceTag3Line size={11} />
              {destination.estimatedPrice.toLocaleString()} ETB
            </span>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-display text-lg leading-tight text-gray-900 dark:text-white mb-2
                         group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {destination.name}
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1 font-body">
            {destination.description}
          </p>

          {destination.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {destination.highlights.slice(0, 2).map(h => (
                <span key={h}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold
                             bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400
                             px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-900/50 font-body">
                  <FiCheckCircle size={10} /> {h}
                </span>
              ))}
              {destination.highlights.length > 2 && (
                <span className="text-[11px] text-gray-400 font-body px-2 py-1">
                  +{destination.highlights.length - 2} more
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setShowDetail(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                         border border-gray-200 dark:border-gray-700
                         text-gray-600 dark:text-gray-300 text-xs font-semibold
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-sans">
              <FiInfo size={14} /> Details
            </button>
            <button
              onClick={() => onSelect(destination)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                         text-white text-xs font-semibold transition-all duration-300
                         hover:shadow-lg hover:scale-[1.03] active:scale-95 font-sans
                         bg-gradient-to-r ${btnGradient}`}>
              {isOther
                ? <><HiOutlineSparkles size={14} /> Suggest</>
                : <><FiArrowRight size={14} /> Vote</>}
            </button>
          </div>
        </div>
      </motion.article>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <DetailModal
            destination={destination}
            images={images}
            isOther={isOther}
            onClose={() => setShowDetail(false)}
            onVote={() => { setShowDetail(false); onSelect(destination) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Detail Modal ────────────────────────────────────────────────────────── */
function DetailModal({ destination, images, isOther, onClose, onVote }) {
  const [imgIdx, setImgIdx] = useState(0)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/72 backdrop-blur-sm z-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl
                        max-h-[90vh] overflow-y-auto pointer-events-auto
                        border border-gray-100 dark:border-gray-800">

          {/* Gallery header */}
          <div className="relative h-72 overflow-hidden rounded-t-3xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={images[imgIdx]}
                alt={destination.name}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = FALLBACK }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                             bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm">
                  <FiChevronLeft size={18} />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                             bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm">
                  <FiChevronRight size={18} />
                </button>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-6' : 'bg-white/45 w-1.5'}`} />
                  ))}
                </div>
              </>
            )}

            <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-sans">
              {imgIdx + 1} / {images.length}
            </span>
            <button onClick={onClose}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70
                         text-white flex items-center justify-center backdrop-blur-sm">
              <FiArrowRight size={16} className="rotate-180" />
            </button>

            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="font-display text-white text-2xl leading-tight">{destination.name}</h2>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-white/75 text-sm font-body">
                  <RiMapPinLine size={13} /> {destination.distance}
                </span>
                {!isOther && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full font-sans">
                    ~{destination.estimatedPrice.toLocaleString()} ETB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-500 dark:text-brand-400 mb-2 font-sans">
                About this Place
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-body">
                {destination.description}
              </p>
            </div>

            {destination.highlights?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-500 dark:text-brand-400 mb-3 font-sans">
                  Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {destination.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800/80
                                            rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-gray-700">
                      <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40
                                      flex items-center justify-center flex-shrink-0">
                        <FiCheckCircle className="text-brand-600 dark:text-brand-400" size={13} />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-body">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price box — only for real destinations */}
            {!isOther && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200
                              dark:border-amber-800/50 rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700
                               dark:text-amber-400 mb-1 flex items-center gap-2 font-sans">
                  <RiPriceTag3Line size={14} /> Estimated Cost
                </p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 font-display">
                  {destination.estimatedPrice.toLocaleString()}
                  <span className="text-lg font-normal ml-1 font-body">ETB / person</span>
                </p>
                <p className="text-amber-600/70 dark:text-amber-500/70 text-xs mt-1 font-body">
                  Includes transport, food & entrance fees (estimate only)
                </p>
              </div>
            )}

            {/* Vote / Suggest CTA */}
            <button
              onClick={onVote}
              className={`w-full py-4 rounded-2xl text-white font-semibold text-sm
                         transition-all hover:opacity-90 hover:shadow-xl flex items-center
                         justify-center gap-2.5 font-sans tracking-wide
                         ${isOther
                           ? 'bg-gradient-to-r from-amber-600 to-amber-800'
                           : 'bg-gradient-to-r from-brand-500 to-brand-600'}`}
            >
              {isOther
                ? <><HiOutlineSparkles size={18} /> Suggest a Destination</>
                : <><FiArrowRight size={18} /> Vote for {destination.name.split('–')[0].trim()}</>}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
