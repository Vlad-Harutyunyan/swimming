import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import CourseCard from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { 
  Award, 
  Users, 
  Clock, 
  Shield, 
  ArrowRight,
  Waves,
  Star,
  Quote,
  Loader2,
  Megaphone,
  X
} from 'lucide-react'
import { useAppStore } from '../hooks/useAppStore'
import { Testimonial, Course } from '../types'
import { feedbackService, coursesService } from '../services/api'
import ScrollToTop from '../components/ScrollToTop'
import CourseRecommendation from '../components/CourseRecommendation'

// Animated Counter Component for Stats
const CounterStat: React.FC<{ number: string; label: string; index: number }> = ({ number, label, index }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Extract numeric value and suffix
  const match = number.match(/^(\d+)(.*)$/)
  const targetValue = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : number

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const duration = 2000
    const steps = 60
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setDisplayValue(targetValue)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [hasStarted, targetValue])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      className="text-center"
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="text-4xl md:text-5xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.15 + 0.3 }}
      >
        {displayValue}{suffix}
      </motion.div>
      <motion.div 
        className="text-lg text-primary-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 + 0.5 }}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { setSelectedCourse } = useAppStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loadingFeedback, setLoadingFeedback] = useState(true)
  const [showReviewPrompt, setShowReviewPrompt] = useState(false)

  // Check if user has left feedback or dismissed the prompt
  useEffect(() => {
    const hasLeftFeedback = localStorage.getItem('hasLeftFeedback') === 'true'
    const hasDismissedPrompt = localStorage.getItem('reviewPromptDismissed') === 'true'
    const shouldShow = !hasLeftFeedback && !hasDismissedPrompt
    
    // Show after a delay for better UX
    const timer = setTimeout(() => {
      setShowReviewPrompt(shouldShow)
    }, 3000) // Show after 3 seconds
    
    return () => clearTimeout(timer)
  }, [])

  const handleDismissPrompt = () => {
    setShowReviewPrompt(false)
    localStorage.setItem('reviewPromptDismissed', 'true')
  }

  const handleGoToFeedback = () => {
    setShowReviewPrompt(false)
    navigate('/feedback')
  }

  useEffect(() => {
    // Load courses from database
    const loadCourses = async () => {
      try {
        setLoadingCourses(true)
        const coursesData = await coursesService.getAll()
        
        // Normalize course data - ensure all required fields exist
        const normalizedCourses = coursesData.map((course: any) => ({
          ...course,
          id: typeof course.id === 'string' ? parseInt(course.id, 10) || course.id : course.id,
          number: course.number || '00',
          description: course.description || [{ about: '', subTitle: '', rules: [] }],
          level: course.level || 'beginner',
          badge: course.badge || 'seepferdchen',
          image: course.image || '/src/assets/pool.jpg',
          age: course.age || '',
          duration: course.duration || '45 Minuten',
          lessons: course.lessons || '',
          kids: course.kids || '',
          price: course.price || '',
        }))
        
        setCourses(normalizedCourses)
        useAppStore.getState().setCourses(normalizedCourses)
      } catch (error) {
        console.error('Error loading courses:', error)
        // Set empty array on error to prevent crashes
        setCourses([])
      } finally {
        setLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  useEffect(() => {
    // Load feedback from database
    const loadFeedback = async () => {
      try {
        setLoadingFeedback(true)
        const feedbackData = await feedbackService.getAll()
        console.log('Feedback data received:', feedbackData)
        
        // Filter and map feedback to Testimonial format
        const mappedTestimonials: Testimonial[] = feedbackData
          .filter((fb: any) => fb.comment && fb.comment.trim().length > 0 && fb.approved === true) // Only show approved feedback with comments
          .map((fb: any) => ({
            id: fb.id,
            name: fb.name,
            childName: fb.childName,
            course: fb.course,
            rating: fb.rating || 5,
            comment: fb.comment,
            image: undefined,
            createdAt: fb.createdAt // Keep for sorting
          }))
          .sort((a: any, b: any) => {
            // Sort by date (newest first)
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return 0
          })
          .map(({ createdAt, ...rest }: any) => rest) // Remove createdAt from final result
        
        console.log('Mapped testimonials:', mappedTestimonials)
        setTestimonials(mappedTestimonials)
      } catch (error) {
        console.error('Error loading feedback:', error)
        // Keep empty array on error
        setTestimonials([])
      } finally {
        setLoadingFeedback(false)
      }
    }

    loadFeedback()
  }, [])

  const handleCourseSelect = (course: typeof courses[0]) => {
    setSelectedCourse(course)
    navigate(`/courses/${course.id}`)
  }

  const features = [
    {
      icon: Award,
      title: 'Zertifizierte Trainer',
      description: 'Unsere erfahrenen Trainer sind alle zertifiziert und spezialisiert auf verschiedene Altersgruppen.'
    },
    {
      icon: Users,
      title: 'Kleine Gruppen',
      description: 'Maximal 12 Kinder pro Gruppe für optimale Betreuung und individuelle Förderung.'
    },
    {
      icon: Clock,
      title: 'Flexible Zeiten',
      description: 'Verschiedene Kurszeiten für jeden Bedarf - auch am Wochenende verfügbar.'
    },
    {
      icon: Shield,
      title: 'Sicherheit',
      description: 'Höchste Sicherheitsstandards und moderne Ausrüstung für alle Kurse.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Zufriedene Kinder' },
    { number: '15+', label: 'Jahre Erfahrung' },
    { number: '98%', label: 'Erfolgsquote' },
    { number: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Hero />
      
      {/* Review Prompt - Slides in from left */}
      <AnimatePresence>
        {showReviewPrompt && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              delay: 0.5
            }}
            className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 max-w-xs md:max-w-sm"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Character/Swimmer */}
              <motion.div
                className="absolute -left-8 md:-left-12 -top-6 md:-top-8 text-5xl md:text-6xl hidden sm:block"
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                🏊‍♂️
              </motion.div>
              
              {/* Speech bubble with megaphone */}
              <Card className="bg-white shadow-2xl border-2 border-primary-500 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Megaphone icon */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="flex-shrink-0 mt-1"
                    >
                      <Megaphone className="h-6 w-6 text-primary-600" />
                    </motion.div>
                    
                    {/* Text content */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Kennen Sie uns bereits?
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        Hinterlassen Sie gerne eine Bewertung!
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleGoToFeedback}
                          className="text-xs px-3 py-1 h-auto bg-primary-600 hover:bg-primary-700"
                        >
                          Bewertung abgeben
                        </Button>
                        <button
                          onClick={handleDismissPrompt}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          aria-label="Schließen"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Pointer/Arrow */}
              <div className="absolute left-4 bottom-0 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r-2 border-b-2 border-primary-500"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Warum unsere Schwimmschule?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wir bieten professionelle Schwimmkurse mit modernsten Methoden und 
              höchsten Sicherheitsstandards für alle Altersgruppen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <motion.div 
                      className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.3,
                          ease: "easeInOut"
                        }}
                      >
                        <feature.icon className="h-8 w-8 text-primary-600" />
                      </motion.div>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Unsere Schwimmkurse
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Von Anfängern bis zu Fortgeschrittenen - für jeden das richtige Angebot
            </motion.p>
          </motion.div>

          {/* Course Recommendation Tool */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <CourseRecommendation courses={courses} />
            </motion.div>
          )}

          {loadingCourses ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Keine Kurse verfügbar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={handleCourseSelect}
                />
              ))}
            </div>
          )}

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/courses')}
                className="inline-flex items-center"
              >
                Alle Kurse ansehen
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials/Feedback Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Quote className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Überzeugen Sie sich selbst - hier sind Erfahrungsberichte von zufriedenen Eltern und Kindern
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingFeedback ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Noch kein Feedback vorhanden. Seien Sie der Erste!
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/feedback')}
                  className="mt-4"
                >
                  Feedback hinterlassen
                </Button>
              </div>
            ) : (
              testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card hover className="h-full flex flex-col">
                    <CardContent className="p-6">
                      <motion.div 
                        className="flex items-center mb-4"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
                        viewport={{ once: true }}
                      >
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ 
                              delay: index * 0.15 + 0.3 + i * 0.1,
                              type: "spring",
                              stiffness: 200
                            }}
                          >
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      <motion.p 
                        className="text-gray-700 mb-4 italic flex-1"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        viewport={{ once: true }}
                      >
                        "{testimonial.comment}"
                      </motion.p>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.childName} - {testimonial.course}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {!loadingFeedback && testimonials.length > 0 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => navigate('/feedback')}
              >
                Eigenes Feedback hinterlassen
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <CounterStat
                key={stat.label}
                number={stat.number}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Waves className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Bereit für den ersten Schritt?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Buchen Sie jetzt einen Kurs und geben Sie Ihrem Kind die 
              Fähigkeit, sicher und selbstbewusst zu schwimmen.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate('/booking')}
                  className="inline-flex items-center"
                >
                  Jetzt buchen
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Kontakt aufnehmen
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home