import { NavigationLink } from '../types'

export const navigationLinks: NavigationLink[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home'
  },
  {
    id: 'courses',
    label: 'Kurse',
    path: '/courses',
    icon: 'BookOpen'
  },
  {
    id: 'schedule',
    label: 'Kursplan',
    path: '/schedule',
    icon: 'Calendar'
  },
  {
    id: 'booking',
    label: 'Kurs buchen',
    path: '/booking',
    icon: 'UserPlus'
  },
  {
    id: 'contact',
    label: 'Kontakt',
    path: '/contact',
    icon: 'Mail'
  },
  {
    id: 'rules',
    label: 'Baderegeln',
    path: '/rules',
    icon: 'Shield'
  },
  {
    id: 'feedback',
    label: 'Feedback',
    path: '/feedback',
    icon: 'MessageSquare'
  }
]

export const footerLinks = [
  {
    id: 'imprint',
    label: 'Impressum',
    path: '/imprint'
  },
  {
    id: 'privacy',
    label: 'Datenschutz',
    path: '/privacy'
  },
  {
    id: 'terms',
    label: 'AGB',
    path: '/terms'
  }
]

export const courseLevels = {
  beginner: {
    label: 'Anfänger',
    color: 'bg-green-100 text-green-800',
    description: 'Für Kinder ab 5 Jahren ohne Schwimmerfahrung'
  },
  intermediate: {
    label: 'Fortgeschritten',
    color: 'bg-blue-100 text-blue-800',
    description: 'Für Kinder mit Grundkenntnissen'
  },
  advanced: {
    label: 'Fortgeschritten',
    color: 'bg-purple-100 text-purple-800',
    description: 'Für erfahrene Schwimmer'
  }
}

export const badgeTypes = {
  seepferdchen: {
    label: 'Seepferdchen',
    color: 'bg-green-500',
    description: 'Erste Schwimmfähigkeiten'
  },
  bronze: {
    label: 'Bronze',
    color: 'bg-yellow-600',
    description: 'Sichere Schwimmfähigkeiten'
  },
  silver: {
    label: 'Silber',
    color: 'bg-gray-400',
    description: 'Erweiterte Schwimmfähigkeiten'
  },
  gold: {
    label: 'Gold',
    color: 'bg-yellow-500',
    description: 'Höchste Schwimmfähigkeiten'
  }
}
