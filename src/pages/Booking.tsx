import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { UserPlus, Send, CheckCircle, Loader2 } from 'lucide-react'
import { bookingService, coursesService } from '../services/api'
import { Course } from '../types'

interface BookingForm {
  childName: string
  childAge: string
  parentName: string
  email: string
  phone: string
  selectedCourse: string
  preferredTime: string
  notes: string
}

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams()
  const courseIdFromUrl = searchParams.get('course')
  
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [formData, setFormData] = useState<BookingForm>({
    childName: '',
    childAge: '',
    parentName: '',
    email: '',
    phone: '',
    selectedCourse: '',
    preferredTime: '',
    notes: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<BookingForm>>({})

  // Load courses from database
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true)
        const coursesData = await coursesService.getAll()
        
        // Normalize course data
        const normalizedCourses = coursesData.map((course: any) => ({
          ...course,
          id: typeof course.id === 'string' ? parseInt(course.id, 10) || course.id : course.id,
          times: course.times || [],
          day: course.day || '',
        }))
        
        setCourses(normalizedCourses)
      } catch (error) {
        console.error('Error loading courses:', error)
        setCourses([])
      } finally {
        setLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  // Generate course options from real data
  const courseOptions = useMemo(() => {
    return courses.map(course => ({
      value: course.id.toString(),
      label: `${course.title} (${course.price}, ${course.lessons}${course.location ? `, ${course.location}` : ''})`
    }))
  }, [courses])

  // Generate time slots from selected course
  const timeSlots = useMemo(() => {
    if (!formData.selectedCourse) return []
    
    const selectedCourse = courses.find(c => c.id.toString() === formData.selectedCourse)
    if (!selectedCourse || !selectedCourse.times || !selectedCourse.day) return []
    
    return selectedCourse.times.map(time => `${selectedCourse.day} ${time}`)
  }, [formData.selectedCourse, courses])

  // Set initial course from URL parameter
  useEffect(() => {
    if (courseIdFromUrl && courses.length > 0) {
      // Only set if the course exists in the list
      const courseExists = courses.some(c => c.id.toString() === courseIdFromUrl)
      if (courseExists) {
        setFormData(prev => {
          // Only update if different to avoid unnecessary re-renders
          if (prev.selectedCourse !== courseIdFromUrl) {
            return { ...prev, selectedCourse: courseIdFromUrl, preferredTime: '' }
          }
          return prev
        })
      }
    }
  }, [courseIdFromUrl, courses])

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingForm> = {}
    
    if (!formData.childName.trim()) newErrors.childName = 'Name des Kindes ist erforderlich'
    if (!formData.childAge.trim()) newErrors.childAge = 'Alter ist erforderlich'
    if (!formData.parentName.trim()) newErrors.parentName = 'Name des Elternteils ist erforderlich'
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefon ist erforderlich'
    if (!formData.selectedCourse) newErrors.selectedCourse = 'Bitte wählen Sie einen Kurs aus'
    if (!formData.preferredTime) newErrors.preferredTime = 'Bitte wählen Sie einen Zeitpunkt aus'

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
      await bookingService.create(formData)
      setIsSubmitted(true)
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          childName: '',
          childAge: '',
          parentName: '',
          email: '',
          phone: '',
          selectedCourse: '',
          preferredTime: '',
          notes: ''
        })
      }, 5000)
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Fehler beim Absenden der Buchung. Bitte versuchen Sie es später erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      // Reset preferredTime when course changes
      if (name === 'selectedCourse') {
        return { ...prev, [name]: value, preferredTime: '' }
      }
      return { ...prev, [name]: value }
    })
    // Clear error when user starts typing
    if (errors[name as keyof BookingForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom">
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
                  Buchung erfolgreich!
                </h2>
                <p className="text-gray-600 mb-6">
                  Vielen Dank für Ihre Buchung. Wir haben Ihre Anfrage erhalten 
                  und werden uns innerhalb von 24 Stunden bei Ihnen melden.
                </p>
                <p className="text-sm text-gray-500">
                  Eine Bestätigungs-E-Mail wurde an <strong>{formData.email}</strong> gesendet.
                </p>
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
              <UserPlus className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Kurs buchen
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Buchen Sie jetzt einen Schwimmkurs für Ihr Kind. 
                Füllen Sie das Formular aus und wir melden uns bei Ihnen.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <Card>
                <CardContent className="p-8 pt-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name des Kindes *"
                        name="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        error={errors.childName}
                        placeholder="Max Mustermann"
                        required
                      />
                      <Input
                        label="Alter *"
                        name="childAge"
                        type="number"
                        value={formData.childAge}
                        onChange={handleChange}
                        error={errors.childAge}
                        placeholder="5"
                        min="4"
                        max="14"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name des Elternteils *"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        error={errors.parentName}
                        placeholder="Eltern Name"
                        required
                      />
                      <Input
                        label="Telefon *"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="+49 123 456 789"
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

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gewünschter Kurs *
                      </label>
                      {loadingCourses ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Kurse werden geladen...
                        </div>
                      ) : (
                        <>
                          <select
                            name="selectedCourse"
                            value={formData.selectedCourse}
                            onChange={handleChange}
                            className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                              errors.selectedCourse ? 'border-red-500 focus-visible:ring-red-500' : ''
                            }`}
                            required
                          >
                            <option value="">Bitte wählen...</option>
                            {courseOptions.map((course) => (
                              <option key={course.value} value={course.value}>
                                {course.label}
                              </option>
                            ))}
                          </select>
                          {errors.selectedCourse && (
                            <p className="mt-1 text-sm text-red-600">{errors.selectedCourse}</p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bevorzugte Uhrzeit *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        disabled={!formData.selectedCourse || timeSlots.length === 0}
                        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.preferredTime ? 'border-red-500 focus-visible:ring-red-500' : ''
                        } ${!formData.selectedCourse || timeSlots.length === 0 ? 'bg-gray-100' : ''}`}
                        required
                      >
                        <option value="">
                          {!formData.selectedCourse 
                            ? 'Bitte wählen Sie zuerst einen Kurs aus' 
                            : timeSlots.length === 0 
                              ? 'Keine Zeiten verfügbar'
                              : 'Bitte wählen...'}
                        </option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.preferredTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>
                      )}
                    </div>

                    <Textarea
                      label="Weitere Informationen"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Besondere Wünsche oder Anmerkungen (optional)"
                      rows={4}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      loading={isSubmitting}
                      className="w-full"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Buchung absenden
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

export default Booking