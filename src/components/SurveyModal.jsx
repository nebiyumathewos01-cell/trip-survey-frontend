import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  FiX, FiUser, FiMessageSquare,
  FiCheckCircle, FiMapPin, FiAlertCircle, FiLock,
  FiRefreshCw,
} from 'react-icons/fi'
import { RiContactsLine } from 'react-icons/ri'
import { HiOutlineSparkles } from 'react-icons/hi'
import api from '../api/axios'

export default function SurveyModal({ destination, onClose }) {
  const [step,       setStep]      = useState('form')   // 'form' | 'success' | 'locked'
  const [loading,    setLoading]   = useState(false)
  const [checking,   setChecking]  = useState(false)
  const [serverErr,  setServerErr] = useState('')
  const [voteStatus, setVoteStatus] = useState(null)    // { exists, changesLeft, destination, locked }
  const [submitResult, setSubmitResult] = useState(null) // { isUpdate, changesLeft, locked, message }

  const isOther = destination?.isCustom

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // When modal opens with a destination, reset state
  useEffect(() => {
    if (!destination) return
    setStep('form')
    setServerErr('')
    setVoteStatus(null)
    setSubmitResult(null)
    reset()
  }, [destination, reset])

  // Check if this student ID already voted — called onBlur of ID field
  const checkStudentId = async (id) => {
    const clean = id?.trim().toUpperCase()
    if (!clean || !/^WCU\d+$/i.test(clean)) return
    setChecking(true)
    try {
      const res = await api.get(`/student/${clean}`)
      setVoteStatus(res.data)
    } catch { /* ignore */ }
    finally { setChecking(false) }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setServerErr('')
    try {
      const res = await api.post('/student', {
        ...data,
        destination: destination.name,
      })
      setSubmitResult(res.data)
      if (res.data.locked) {
        setStep('locked')
      } else {
        setStep('success')
      }
    } catch (err) {
      const data = err.response?.data
      if (data?.locked) {
        setStep('locked')
      } else {
        setServerErr(
          data?.message ||
          data?.errors?.[0]?.msg ||
          'Something went wrong. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {destination && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity:0, scale:0.92, y:24 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.92, y:24 }}
            transition={{ type:'spring', stiffness:300, damping:30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-[#1e140c] rounded-3xl shadow-2xl w-full max-w-lg
                            max-h-[92vh] overflow-y-auto pointer-events-auto
                            border border-brand-100 dark:border-brand-900/30">

              {/* Header image */}
              <div className="relative h-28 overflow-hidden rounded-t-3xl">
                <img
                  src={destination.images?.[0] || destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/78" />
                <div className="absolute bottom-3 left-5 right-10">
                  <p className="text-white/55 text-[10px] uppercase tracking-[0.18em] font-sans">
                    {isOther ? 'Suggest your destination' : 'Voting for'}
                  </p>
                  <h3 className="text-white font-display text-lg leading-tight">
                    {destination.name}
                  </h3>
                </div>
                <button onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70
                             text-white rounded-full flex items-center justify-center transition-colors">
                  <FiX size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {step === 'locked' && <LockedView onClose={onClose} />}
                {step === 'success' && (
                  <SuccessView
                    onClose={onClose}
                    destination={destination}
                    isOther={isOther}
                    result={submitResult}
                  />
                )}
                {step === 'form' && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                    <div className="mb-1">
                      <h2 className="font-display text-xl text-gray-900 dark:text-white">
                        {isOther ? 'Suggest a Destination' : 'Submit Your Vote'}
                      </h2>
                      <p className="text-gray-400 text-sm mt-0.5 font-body">
                        {isOther
                          ? 'Tell us the place you have in mind and why it would be great.'
                          : 'You can change your vote up to 2 times after submitting.'}
                      </p>
                    </div>

                    {/* Existing vote info banner */}
                    {voteStatus?.exists && !voteStatus.locked && (
                      <motion.div
                        initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                        className="flex items-start gap-2.5 bg-brand-50 dark:bg-brand-900/20
                                   border border-brand-200 dark:border-brand-800
                                   text-brand-700 dark:text-brand-300 text-sm rounded-xl px-4 py-3 font-body"
                      >
                        <FiRefreshCw className="flex-shrink-0 mt-0.5 text-brand-500" size={15} />
                        <span>
                          You previously voted for <strong>{voteStatus.destination}</strong>.
                          Submitting now will change it.{' '}
                          <strong>{voteStatus.changesLeft} change{voteStatus.changesLeft === 1 ? '' : 's'} remaining.</strong>
                        </span>
                      </motion.div>
                    )}

                    {/* Server error */}
                    {serverErr && (
                      <motion.div
                        initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                        className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20
                                   border border-red-200 dark:border-red-800
                                   text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 font-body"
                      >
                        <FiAlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                        {serverErr}
                      </motion.div>
                    )}

                    {/* Full name */}
                    <Field label="Full Name" required error={errors.name?.message}>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          {...register('name', {
                            required: 'Full name is required',
                            minLength: { value:3, message:'At least 3 characters' },
                          })}
                          placeholder="e.g. Abebe Kebede"
                          className={`input-field pl-9 ${errors.name ? 'input-error' : ''}`}
                        />
                      </div>
                    </Field>

                    {/* Student ID */}
                    <Field
                      label="Student ID"
                      required
                      hint="Format: WCU followed by numbers — e.g. WCU170167"
                      error={errors.studentId?.message}
                    >
                      <div className="relative">
                        <RiContactsLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          {...register('studentId', {
                            required: 'Student ID is required',
                            pattern: {
                              value: /^[Ww][Cc][Uu]\d+$/,
                              message: 'Must be WCU followed by numbers (e.g. WCU170167)',
                            },
                          })}
                          placeholder="WCU170167"
                          className={`input-field pl-9 pr-9 ${errors.studentId ? 'input-error' : ''}`}
                          style={{ textTransform:'uppercase' }}
                          onBlur={e => checkStudentId(e.target.value)}
                        />
                        {checking && (
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-brand-400"
                            viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75"/>
                          </svg>
                        )}
                      </div>
                    </Field>

                    {/* Section */}
                    <Field label="Section" required error={errors.section?.message}>
                      <select
                        {...register('section', { required:'Please select your section' })}
                        className={`input-field ${errors.section ? 'input-error' : ''}`}
                      >
                        <option value="">Select your section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                      </select>
                    </Field>

                    {/* Other Destination fields */}
                    {isOther && (
                      <div className="rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200
                                      dark:border-brand-800/50 p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <HiOutlineSparkles className="text-brand-600 dark:text-brand-400" size={16} />
                          <p className="text-xs font-bold uppercase tracking-[0.14em]
                                        text-brand-700 dark:text-brand-400 font-sans">
                            Your Destination Suggestion
                          </p>
                        </div>
                        <Field label="Suggested Place Name" required error={errors.customDestination?.message}>
                          <div className="relative">
                            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                            <input
                              {...register('customDestination', {
                                required: 'Please enter the place name',
                                minLength: { value:2, message:'At least 2 characters' },
                              })}
                              placeholder="e.g. Hawassa Lake"
                              className={`input-field pl-9 ${errors.customDestination ? 'input-error' : ''}`}
                            />
                          </div>
                        </Field>
                        <Field label="Why do you recommend this place?" required error={errors.customReason?.message}>
                          <textarea
                            {...register('customReason', {
                              required: 'Please explain why you recommend this place',
                              minLength: { value:10, message:'Write at least 10 characters' },
                            })}
                            rows={3}
                            placeholder="Tell us what makes this place special..."
                            className={`input-field resize-none ${errors.customReason ? 'input-error' : ''}`}
                          />
                        </Field>
                      </div>
                    )}

                    {/* Reason */}
                    <Field
                      label={isOther ? 'Any additional comments?' : 'Why do you want to visit this destination?'}
                      required={!isOther}
                      error={errors.reason?.message}
                    >
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-3 text-gray-400" size={15} />
                        <textarea
                          {...register('reason', {
                            required: isOther ? false : 'Please share your reason',
                            minLength: isOther ? undefined : { value:10, message:'Write at least 10 characters' },
                          })}
                          rows={3}
                          placeholder={isOther ? 'Optional — any extra comments...' : 'Share why you love this destination...'}
                          className={`input-field pl-9 resize-none ${errors.reason ? 'input-error' : ''}`}
                        />
                      </div>
                    </Field>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full
                                 text-white font-semibold text-sm tracking-wide font-sans
                                 bg-gradient-to-r from-brand-500 to-brand-600 shadow-glow-brand
                                 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                                 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                                 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75"/>
                          </svg>
                          Submitting...
                        </>
                      ) : voteStatus?.exists ? (
                        <><FiRefreshCw size={17} /> Update My Vote</>
                      ) : isOther ? (
                        <><HiOutlineSparkles size={17} /> Submit My Suggestion</>
                      ) : (
                        <><FiCheckCircle size={17} /> Submit My Vote</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Field wrapper ── */
function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 font-sans">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-gray-400 text-xs mt-1 font-body">{hint}</p>}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-body">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

/* ── Success screen ── */
function SuccessView({ onClose, destination, isOther, result }) {
  const changesLeft = result?.changesLeft ?? 0

  return (
    <motion.div
      initial={{ opacity:0, scale:0.85 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ type:'spring', stiffness:260, damping:22 }}
      className="flex flex-col items-center text-center py-8 px-4"
    >
      <motion.div
        initial={{ scale:0 }} animate={{ scale:1 }}
        transition={{ delay:0.15, type:'spring', stiffness:220 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600
                   flex items-center justify-center mb-4 shadow-glow-brand"
      >
        <FiCheckCircle className="text-white" size={38} />
      </motion.div>

      <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-2">
        {result?.isUpdate ? 'Vote Updated!' : isOther ? 'Suggestion Submitted!' : 'Vote Submitted!'}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 font-body mb-1">
        {result?.message}
      </p>

      {/* Changes remaining indicator */}
      {changesLeft > 0 ? (
        <div className="mt-3 flex items-center gap-1.5 text-sm font-body">
          <span className="text-gray-400">Changes remaining:</span>
          <div className="flex gap-1.5">
            {[...Array(2)].map((_, i) => (
              <span key={i}
                className={`w-3 h-3 rounded-full ${
                  i < changesLeft
                    ? 'bg-brand-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-brand-600 dark:text-brand-400 font-semibold">{changesLeft} left</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-body">
          <FiLock size={14} />
          <span>Your vote is now locked — no more changes allowed.</span>
        </div>
      )}

      <button onClick={onClose} className="btn-primary px-10 mt-6">Done</button>
    </motion.div>
  )
}

/* ── Locked screen ── */
function LockedView({ onClose }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.85 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ type:'spring', stiffness:260, damping:22 }}
      className="flex flex-col items-center text-center py-8 px-4"
    >
      <motion.div
        initial={{ scale:0 }} animate={{ scale:1 }}
        transition={{ delay:0.15, type:'spring', stiffness:220 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600
                   flex items-center justify-center mb-4 shadow-lg"
      >
        <FiLock className="text-white" size={36} />
      </motion.div>

      <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-2">
        Your Vote is Up
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-body leading-relaxed mb-2">
        You have used all your allowed changes.
      </p>
      <p className="text-gray-400 dark:text-gray-500 font-body text-sm mb-6">
        Each student gets 1 vote + 2 changes. Your final vote has been recorded.
      </p>

      {/* Lock dots — all used */}
      <div className="flex items-center gap-2 mb-6">
        {[...Array(2)].map((_, i) => (
          <span key={i} className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
        ))}
        <span className="text-xs text-gray-400 font-body ml-1">0 changes left</span>
      </div>

      <button onClick={onClose} className="btn-primary px-10">Close</button>
    </motion.div>
  )
}
