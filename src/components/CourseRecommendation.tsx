import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Course } from '../types'
import { useNavigate } from 'react-router-dom'

interface CourseRecommendationProps {
  courses: Course[]
}

const CourseRecommendation: React.FC<CourseRecommendationProps> = ({ courses }) => {
  const navigate = useNavigate()
  const [age, setAge] = useState('')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('')
  const [showResults, setShowResults] = useState(false)

  const recommendedCourses = useMemo(() => {
    if (!age || !level) return []

    const ageNum = parseInt(age, 10)
    if (isNaN(ageNum) || ageNum < 4 || ageNum > 18) return []

    return courses.filter(course => {
      // Parse age range from course.age (e.g., "ab 5 Jahre" or "von 6 - 14 Jahre")
      const ageMatch = course.age?.match(/(\d+)/)
      const courseMinAge = ageMatch ? parseInt(ageMatch[1], 10) : 0
      
      // Check level match
      const levelMatch = course.level === level
      
      // Check age range
      const ageMatch_range = course.age?.includes('-')
        ? (() => {
            const rangeMatch = course.age.match(/(\d+)\s*-\s*(\d+)/)
            if (rangeMatch) {
              const min = parseInt(rangeMatch[1], 10)
              const max = parseInt(rangeMatch[2], 10)
              return ageNum >= min && ageNum <= max
            }
            return false
          })()
        : ageNum >= courseMinAge

      return levelMatch && ageMatch_range
    })
  }, [age, level, courses])

  const handleFindCourses = () => {
    if (age && level) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setAge('')
    setLevel('')
    setShowResults(false)
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-primary-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900">
            Kursempfehlung finden
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Geben Sie das Alter Ihres Kindes und das Schwimmniveau ein, um passende Kurse zu finden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Alter des Kindes"
            type="number"
            value={age}
            onChange={(e) => {
              setAge(e.target.value)
              setShowResults(false)
            }}
            placeholder="z.B. 6"
            min="4"
            max="18"
          />
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schwimmniveau
            </label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value as typeof level)
                setShowResults(false)
              }}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <option value="">Bitte wählen...</option>
              <option value="beginner">Anfänger</option>
              <option value="intermediate">Fortgeschritten</option>
              <option value="advanced">Experte</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleFindCourses} disabled={!age || !level}>
            Kurse finden
          </Button>
          {showResults && (
            <Button variant="outline" onClick={handleReset}>
              Zurücksetzen
            </Button>
          )}
        </div>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t"
          >
            {recommendedCourses.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Empfohlene Kurse ({recommendedCourses.length})
                </h3>
                <div className="space-y-3">
                  {recommendedCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-600">
                            {course.age} • {course.price} • {course.lessons}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600">
                  Keine passenden Kurse gefunden. Bitte versuchen Sie andere Kriterien.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export default CourseRecommendation

