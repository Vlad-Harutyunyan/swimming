import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, Award, ArrowRight, BookOpen } from 'lucide-react'
import { Course } from '../types'
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card'
import { Button } from './ui/Button'
import { cn } from '../utils'
import { courseLevels, badgeTypes } from '../constants'

interface CourseCardProps {
  course: Course
  onSelect?: (course: Course) => void
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  const navigate = useNavigate()
  const levelInfo = courseLevels[course.level] || courseLevels.beginner
  const badgeInfo = badgeTypes[course.badge] || badgeTypes.seepferdchen
  const description = course.description?.[0] || {}
  const courseId = typeof course.id === 'string' ? course.id : course.id.toString()

  const handleBookCourse = () => {
    navigate(`/booking?course=${courseId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card hover className="h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-lg font-bold text-primary-600">
              {course.number || '00'}
            </span>
          </div>
        </div>

        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {course.age || ''} {course.age && description?.subTitle ? '•' : ''} {description?.subTitle || ''}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold',
              levelInfo.color
            )}>
              {levelInfo.label}
            </span>
            <span className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold text-white',
              badgeInfo.color
            )}>
              {badgeInfo.label}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-0">
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {description?.about || 'Keine Beschreibung verfügbar.'}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-primary-600" />
              {course.duration}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-primary-600" />
              {course.kids}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Award className="h-4 w-4 mr-2 text-primary-600" />
              {course.lessons}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-2xl font-bold text-primary-600">
              {course.price}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect?.(course)}
              className="flex items-center gap-1"
            >
              Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleBookCourse}
            className="w-full flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Kurs buchen
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CourseCard
