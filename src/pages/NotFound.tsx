import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Home, ArrowLeft, Waves } from 'lucide-react'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center overflow-hidden relative">
      {/* Pool water effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Water waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z"
              fill="rgba(59, 130, 246, 0.3)"
              className="animate-wave"
            />
            <path
              d="M0,80 Q300,50 600,80 T1200,80 L1200,120 L0,120 Z"
              fill="rgba(37, 99, 235, 0.2)"
              className="animate-wave-delay"
            />
          </svg>
        </div>

        {/* Pool tiles pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-700/20 to-transparent"></div>
      </div>

      {/* Floating bubbles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 30}%`,
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0.5, 0.8, 0],
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl px-4"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 text-center overflow-hidden relative">
          {/* Animated person in pool */}
          <div className="relative mb-8 h-48 flex items-center justify-center">
            {/* Pool */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-full overflow-hidden">
              {/* Water ripples */}
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 border-2 border-blue-400/30 rounded-full"
                    style={{
                      width: `${60 + i * 40}px`,
                      height: `${60 + i * 40}px`,
                      marginLeft: `-${30 + i * 20}px`,
                      marginTop: `-${30 + i * 20}px`,
                    }}
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.5, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Drowning person emoji with animation */}
            <motion.div
              className="text-8xl relative z-10"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🏊‍♂️
            </motion.div>

            {/* Help hand */}
            <motion.div
              className="absolute top-4 right-8 text-4xl"
              animate={{
                y: [0, -15, 0],
                rotate: [-30, -45, -30],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              👋
            </motion.div>
          </div>

          {/* 404 Text */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-7xl md:text-9xl font-bold text-blue-600 mb-4 drop-shadow-lg">
              404
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Waves className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Oops! Sie sind ins tiefe Wasser gefallen!
              </h2>
              <Waves className="h-6 w-6 text-blue-500" />
            </div>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Diese Seite existiert nicht - vielleicht ist sie ins Wasser gefallen? 
              Lassen Sie uns Sie zurück an Land bringen!
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <Home className="mr-2 h-5 w-5" />
              Zurück an Land
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/courses')}
              size="lg"
              className="flex items-center justify-center"
            >
              Schwimmkurse ansehen
            </Button>
          </motion.div>

          {/* Help text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center mx-auto group"
            >
              <ArrowLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Zurück zur vorherigen Seite
            </button>
          </motion.div>
        </div>

        {/* Pool depth markers */}
        <div className="absolute bottom-0 left-0 right-0 text-white/20 text-xs text-center py-2 font-mono">
          <div className="max-w-2xl mx-auto px-4">
            Tiefe: Unbekannt • Breite: Unendlich • Temperatur: Kalt ⚠️
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25px) translateY(10px); }
        }
        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
        .animate-wave-delay {
          animation: wave 10s ease-in-out infinite;
          animation-delay: -2s;
        }
      `}</style>
    </div>
  )
}

export default NotFound
