export interface Course {
  id: number
  number: string
  title: string
  age: string
  description: CourseDescription[]
  duration: string
  lessons: string
  kids: string
  price: string
  image: string
  level: 'beginner' | 'intermediate' | 'advanced'
  badge: 'seepferdchen' | 'bronze' | 'silver' | 'gold'
  location?: string
  startDate?: string
  endDate?: string
  day?: string
  times?: string[]
}

export interface CourseDescription {
  rules: string[]
  about: string
  subTitle: string
}

export interface NavigationLink {
  id: string
  label: string
  path: string
  icon?: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
  course?: string
}

export interface BookingForm {
  courseId: number
  childName: string
  childAge: number
  parentName: string
  email: string
  phone: string
  preferredTime: string
  notes?: string
}

export interface ScheduleItem {
  id: string
  courseId: number
  day: string
  time: string
  instructor: string
  availableSpots: number
  maxSpots: number
}

export interface Instructor {
  id: string
  name: string
  qualifications: string[]
  experience: string
  image: string
  specialties: string[]
}

export interface Testimonial {
  id: string
  name: string
  childName: string
  course: string
  rating: number
  comment: string
  image?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'courses' | 'booking' | 'safety'
}
