import { FiHeart, FiMapPin } from 'react-icons/fi'
import { RiGraduationCapLine } from 'react-icons/ri'
import { MdOutlineSchool } from 'react-icons/md'
import { HiOutlineCalendar, HiOutlineStatusOnline } from 'react-icons/hi'
import { RiPriceTag3Line } from 'react-icons/ri'

const DESTINATIONS = [
  { name: 'Durame 777',            price: '800 ETB'   },
  { name: 'Wondo Genet',           price: '1,600 ETB' },
  { name: 'Langano Lake',          price: '1,800 ETB' },
  { name: 'Arba Minch – Nech Sar', price: '2,000 ETB' },
]

export default function Footer() {
  return (
    <footer className="bg-[#18100a] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600
                              flex items-center justify-center shadow-glow-brand">
                <RiGraduationCapLine size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white font-sans text-sm">CS Trip Survey</p>
                <p className="text-gray-500 text-xs font-body">Wachemo University</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-body">
              A survey platform for Computer Science students at Wachemo University to
              vote on their class celebration trip destination.
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-gray-300 mb-4 text-xs uppercase tracking-[0.14em] font-sans">
              Destinations
            </h4>
            <ul className="space-y-2.5">
              {DESTINATIONS.map(d => (
                <li key={d.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400 text-sm font-body">
                    <FiMapPin size={12} className="text-brand-400 flex-shrink-0" />
                    {d.name}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold font-sans">
                    <RiPriceTag3Line size={11} />
                    {d.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-gray-300 mb-4 text-xs uppercase tracking-[0.14em] font-sans">
              Info
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-sm font-body">
              <li className="flex items-center gap-2.5">
                <RiGraduationCapLine size={15} className="text-brand-400 flex-shrink-0" />
                Computer Science Department
              </li>
              <li className="flex items-center gap-2.5">
                <MdOutlineSchool size={15} className="text-brand-400 flex-shrink-0" />
                Wachemo University
              </li>
              <li className="flex items-center gap-2.5">
                <HiOutlineCalendar size={15} className="text-brand-400 flex-shrink-0" />
                Class Celebration Trip
              </li>
              <li className="flex items-center gap-2.5">
                <HiOutlineStatusOnline size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 font-medium">Survey is open</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-7 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-gray-600 text-sm font-body">
            CS Trip Survey &middot; Wachemo University
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1.5 font-body">
            Made with <FiHeart className="text-red-500" size={13} /> for our class
          </p>
        </div>
      </div>
    </footer>
  )
}
