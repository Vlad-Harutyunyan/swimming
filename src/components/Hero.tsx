import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Waves } from 'lucide-react'
import { Button } from './ui/Button'
import { useNavigate } from 'react-router-dom'

const Hero: React.FC = () => {
  const navigate = useNavigate()

  const handleBookCourse = () => {
    navigate('/booking')
  }

  // Generate stable bubble configurations
  const largeBubbles = useMemo(() => 
    Array.from({ length: 30 }, () => ({
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 4,
      drift: Math.random() * 50 - 25,
    })),
    []
  )

  const smallBubbles = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      size: Math.random() * 15 + 5,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 3,
      drift: Math.random() * 30 - 15,
    })),
    []
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/src/assets/bgimg.jpeg)',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated Bubbles */}
      {largeBubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-50px',
          }}
          animate={{
            y: [0, -1500],
            x: [0, bubble.drift],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 1.2],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Smaller bubbles for depth */}
      {smallBubbles.map((bubble, i) => (
        <motion.div
          key={`small-${i}`}
          className="absolute rounded-full border border-white/20 bg-white/5"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-30px',
          }}
          animate={{
            y: [0, -1500],
            x: [0, bubble.drift],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Waves className="h-16 w-16 mx-auto mb-4 text-accent-400" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Swimming from{' '}
            <span className="gradient-text bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
              zero to hero
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto"
          >
            Professionelle Schwimmkurse für alle Altersgruppen. 
            Von den ersten Schwimmzügen bis zum Schwimmabzeichen Gold.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={handleBookCourse}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Kurs buchen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/courses')}
              className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
            >
              Kurse ansehen
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
