import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { MessageSquare, Send, CheckCircle, Star, Loader2 } from 'lucide-react'
import { feedbackService, coursesService } from '../services/api'
import { Course } from '../types'

interface FeedbackForm {
  name: string
  childName: string
  course: string
  rating: number
  comment: string
  email: string
}

const Feedback: React.FC = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    childName: '',
    course: '',
    rating: 5,
    comment: '',
    email: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FeedbackForm>>({})
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    // Load courses from database
    const loadCourses = async () => {
      try {
        setLoadingCourses(true)
        const coursesData = await coursesService.getAll()
        setCourses(coursesData)
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  const courseOptions = courses.map(course => ({
    value: course.title,
    label: `${course.title} (${course.price})`
  }))

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackForm> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Ihr Name ist erforderlich'
    if (!formData.childName.trim()) newErrors.childName = 'Name des Kindes ist erforderlich'
    if (!formData.course.trim()) newErrors.course = 'Bitte wählen Sie einen Kurs aus'
    if (!formData.comment.trim()) {
      newErrors.comment = 'Ihr Feedback ist erforderlich'
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Bitte schreiben Sie mindestens 10 Zeichen'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await feedbackService.create(formData)
      setIsSubmitted(true)
      
      // Mark that user has left feedback
      localStorage.setItem('hasLeftFeedback', 'true')
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          childName: '',
          course: '',
          rating: 5,
          comment: '',
          email: ''
        })
        navigate('/')
      }, 5000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Fehler beim Absenden des Feedbacks. Bitte versuchen Sie es später erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof FeedbackForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vielen Dank für Ihr Feedback!
                </h2>
                <p className="text-gray-600 mb-6">
                  Ihre Bewertung wurde erfolgreich übermittelt. 
                  Wir schätzen Ihr Feedback sehr und werden es zur Verbesserung unserer Kurse nutzen.
                </p>
                <Button onClick={() => navigate('/')}>
                  Zurück zur Startseite
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <MessageSquare className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Teilen Sie Ihr Feedback
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ihre Meinung ist uns wichtig! Helfen Sie anderen Eltern, indem Sie 
                Ihre Erfahrungen mit unseren Schwimmkursen teilen.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-8 pt-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Ihr Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Sarah Müller"
                        required
                      />
                      <Input
                        label="Name Ihres Kindes *"
                        name="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        error={errors.childName}
                        placeholder="Emma"
                        required
                      />
                    </div>

                    <Input
                      label="E-Mail *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="ihre.email@beispiel.de"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Besuchter Kurs *
                      </label>
                      {loadingCourses ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Kurse werden geladen...
                        </div>
                      ) : (
                        <>
                          <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                              errors.course ? 'border-red-500' : 'border-gray-300 focus:ring-primary-500'
                            }`}
                            required
                          >
                            <option value="">Bitte wählen...</option>
                            {courseOptions.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.course && (
                            <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Bewertung *
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors ${
                                star <= formData.rating || star <= hoveredStar
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {formData.rating} von 5 Sternen
                        </span>
                      </div>
                    </div>

                    <Textarea
                      label="Ihr Feedback *"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      error={errors.comment}
                      placeholder="Teilen Sie Ihre Erfahrungen mit anderen Eltern..."
                      rows={6}
                      required
                    />

                    <Button
                      type="submit"
                      size="lg"
                      loading={isSubmitting}
                      className="w-full"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Feedback absenden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Feedback
