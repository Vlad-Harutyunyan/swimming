import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { Search, Filter, Loader2 } from 'lucide-react'
import { Course } from '../types'
import { useAppStore } from '../hooks/useAppStore'
import { coursesService } from '../services/api'

const Courses: React.FC = () => {
  const navigate = useNavigate()
  const { setSelectedCourse, setCourses } = useAppStore()
  const [courses, setCoursesState] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

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
          number: course.number || '00',
          description: course.description || [{ about: '', subTitle: '', rules: [] }],
          level: course.level || 'beginner',
          badge: course.badge || 'seepferdchen',
          image: course.image || '/src/assets/pool.jpg',
        }))
        
        setCoursesState(normalizedCourses)
        setFilteredCourses(normalizedCourses)
        setCourses(normalizedCourses)
      } catch (error) {
        console.error('Error loading courses:', error)
        setCoursesState([])
        setFilteredCourses([])
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [setCourses])

  useEffect(() => {
    let filtered = courses

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => {
        const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const aboutMatch = course.description?.[0]?.about?.toLowerCase().includes(searchTerm.toLowerCase())
        return titleMatch || aboutMatch
      })
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedLevel])

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    navigate(`/courses/${course.id}`)
  }

  const levels = [
    { value: 'all', label: 'Alle Kurse' },
    { value: 'beginner', label: 'Anfänger' },
    { value: 'intermediate', label: 'Fortgeschritten' },
    { value: 'advanced', label: 'Experte' }
  ]

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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unsere Schwimmkurse
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Entdecken Sie unsere vielfältigen Schwimmkurse für alle Altersgruppen 
              und Schwierigkeitsgrade. Von den ersten Schwimmzügen bis zum 
              Schwimmabzeichen Gold.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Kurse durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredCourses.length} Kurs{filteredCourses.length !== 1 ? 'e' : ''} gefunden
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CourseCard
                    course={course}
                    onSelect={handleCourseSelect}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Keine Kurse gefunden
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Versuchen Sie andere Suchbegriffe oder Filter.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedLevel('all')
                    }}
                  >
                    Filter zurücksetzen
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Courses
