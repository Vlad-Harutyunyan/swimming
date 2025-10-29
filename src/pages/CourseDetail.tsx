import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
  Clock, 
  Users, 
  Award, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  CheckCircle,
  BookOpen,
  Loader2,
  Share2,
  Printer
} from 'lucide-react'
import { coursesService } from '../services/api'
import { Course } from '../types'
import { courseLevels, badgeTypes } from '../constants'

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        const coursesData = await coursesService.getAll()
        
        // Normalize and find course
        const normalizedCourses = coursesData.map((c: any) => ({
          ...c,
          id: typeof c.id === 'string' ? parseInt(c.id, 10) || c.id : c.id,
          number: c.number || '00',
          description: c.description || [{ about: '', subTitle: '', rules: [] }],
          level: c.level || 'beginner',
          badge: c.badge || 'seepferdchen',
          image: c.image || '/src/assets/pool.jpg',
          age: c.age || '',
          duration: c.duration || '45 Minuten',
          lessons: c.lessons || '',
          kids: c.kids || '',
          price: c.price || '',
          times: c.times || [],
          day: c.day || '',
          location: c.location || '',
        }))
        
        const courseId = id ? parseInt(id, 10) : null
        const foundCourse = normalizedCourses.find((c: Course) => 
          c.id === courseId || c.id?.toString() === id
        )
        
        if (foundCourse) {
          setCourse(foundCourse)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error loading course:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadCourse()
    } else {
      setNotFound(true)
      setLoading(false)
    }
  }, [id])

  const handleBookCourse = () => {
    navigate(`/booking?course=${course?.id}`)
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = course?.title || 'Kursdetails'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Schauen Sie sich diesen Schwimmkurs an: ${title}`,
          url: url,
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Link wurde in die Zwischenablage kopiert!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Kurs wird geladen...</p>
        </div>
      </div>
    )
  }

  if (notFound || !course) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Kurs nicht gefunden
              </h1>
              <p className="text-gray-600 mb-6">
                Der angeforderte Kurs konnte nicht gefunden werden.
              </p>
              <Button onClick={() => navigate('/courses')}>
                Zurück zu allen Kursen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const levelInfo = courseLevels[course.level] || courseLevels.beginner
  const badgeInfo = badgeTypes[course.badge] || badgeTypes.seepferdchen
  const description = course.description?.[0] || { about: '', subTitle: '', rules: [] }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-8 border-b no-print">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/courses')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu allen Kursen
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Teilen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="hidden sm:flex"
              >
                <Printer className="h-4 w-4 mr-2" />
                Drucken
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Image */}
      {course.image && (
        <section className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${levelInfo.color}`}>
                  {levelInfo.label}
                </span>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-white ${badgeInfo.color}`}>
                  {badgeInfo.label}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{course.title}</h1>
              {course.age && (
                <p className="text-xl text-gray-200">{course.age}</p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Course Details */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Über diesen Kurs
                  </h2>
                  {description.subTitle && (
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {description.subTitle}
                    </h3>
                  )}
                  {description.about ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {description.about}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">Keine Beschreibung verfügbar.</p>
                  )}
                </CardContent>
              </Card>

              {/* Requirements Section */}
              {description.rules && description.rules.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Anforderungen für das Schwimmabzeichen
                    </h2>
                    <ul className="space-y-4">
                      {description.rules.map((rule, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 flex-1">{rule}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Schedule Section */}
              {course.times && course.times.length > 0 && course.day && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Kurszeiten
                    </h2>
                    <div className="space-y-3">
                      {course.times.map((time, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{course.day}</p>
                            <p className="text-gray-600">{time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-500">Dauer</p>
                        <p className="font-semibold text-gray-900">{course.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-500">Einheiten</p>
                        <p className="font-semibold text-gray-900">{course.lessons}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-500">Gruppengröße</p>
                        <p className="font-semibold text-gray-900">{course.kids}</p>
                      </div>
                    </div>
                    
                    {course.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-gray-500">Ort</p>
                          <p className="font-semibold text-gray-900">{course.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {course.startDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-gray-500">Zeitraum</p>
                          <p className="font-semibold text-gray-900">
                            {course.startDate}
                            {course.endDate && ` - ${course.endDate}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Price & Booking Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-2">Preis</p>
                    <p className="text-4xl font-bold text-primary-600">{course.price}</p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleBookCourse}
                    className="w-full mb-3"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Jetzt buchen
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Teilen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="flex-1"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Drucken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetail
