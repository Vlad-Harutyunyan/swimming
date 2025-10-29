import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Calendar, Clock, MapPin, BookOpen, Loader2 } from 'lucide-react'
import { coursesService } from '../services/api'
import { Course } from '../types'

interface ScheduleItem {
  id: string
  courseId: number
  course: string
  day: string
  time: string
  location: string
  level: string
  price: string
  startDate?: string
  endDate?: string
}

const Schedule: React.FC = () => {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState<string>('all')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load courses from database
    const loadCourses = async () => {
      try {
        setLoading(true)
        const coursesData = await coursesService.getAll()
        
        // Normalize course data
        const normalizedCourses = coursesData.map((course: any) => ({
          ...course,
          id: typeof course.id === 'string' ? parseInt(course.id, 10) || course.id : course.id,
          times: course.times || [],
          day: course.day || '',
          location: course.location || '',
        }))
        
        setCourses(normalizedCourses)
      } catch (error) {
        console.error('Error loading courses:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  // Generate schedule items from real course data
  const scheduleData: ScheduleItem[] = useMemo(() => {
    const items: ScheduleItem[] = []
    
    courses.forEach(course => {
      if (course.times && course.day && course.location) {
        course.times.forEach((time, index) => {
          items.push({
            id: `${course.id}-${index}`,
            courseId: course.id,
            course: course.title,
            day: course.day!,
            time: time,
            location: course.location!,
            level: course.level === 'beginner' ? 'Anfänger' : course.level === 'intermediate' ? 'Fortgeschritten' : 'Fortgeschritten',
            price: course.price,
            startDate: course.startDate,
            endDate: course.endDate
          })
        })
      }
    })
    
    return items
  }, [courses])

  const days = [
    { value: 'all', label: 'Alle Tage' },
    { value: 'Montag', label: 'Montag' },
    { value: 'Dienstag', label: 'Dienstag' },
    { value: 'Mittwoch', label: 'Mittwoch' },
    { value: 'Donnerstag', label: 'Donnerstag' },
    { value: 'Freitag', label: 'Freitag' },
    { value: 'Samstag', label: 'Samstag' },
    { value: 'Sonntag', label: 'Sonntag' }
  ]

  const filteredSchedule = selectedDay === 'all' 
    ? scheduleData 
    : scheduleData.filter(item => item.day === selectedDay)

  const handleBookCourse = (courseId: number) => {
    navigate(`/booking?course=${courseId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kursplan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hier finden Sie alle verfügbaren Kurszeiten und Termine. 
              Buchen Sie jetzt einen passenden Termin für Ihr Kind.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {days.map(day => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDay === day.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : filteredSchedule.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Keine Kurse im Zeitplan verfügbar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchedule.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {item.course}
                    </h3>

                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                        {item.level}
                      </span>
                    </div>

                    {item.startDate && (
                      <p className="text-xs text-gray-500 mb-3">
                        {item.startDate} {item.endDate && `- ${item.endDate}`}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                        {item.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                        {item.day}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                        {item.location}
                      </div>
                      <div className="flex items-center text-sm font-semibold text-primary-600">
                        <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                        {item.price}
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <Button 
                        className="w-full"
                        onClick={() => handleBookCourse(item.courseId)}
                      >
                        Kurs buchen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Schedule