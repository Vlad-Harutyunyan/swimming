import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Course, BookingForm, ContactForm } from '../types'

interface AppState {
  // UI State
  isMobileMenuOpen: boolean
  isLoading: boolean
  currentPage: string
  
  // Data
  courses: Course[]
  selectedCourse: Course | null
  
  // Forms
  bookingForm: Partial<BookingForm>
  contactForm: Partial<ContactForm>
  
  // Actions
  setMobileMenuOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  setCurrentPage: (page: string) => void
  setCourses: (courses: Course[]) => void
  setSelectedCourse: (course: Course | null) => void
  updateBookingForm: (form: Partial<BookingForm>) => void
  updateContactForm: (form: Partial<ContactForm>) => void
  resetForms: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isMobileMenuOpen: false,
      isLoading: false,
      currentPage: 'home',
      courses: [],
      selectedCourse: null,
      bookingForm: {},
      contactForm: {},
      
      // Actions
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setLoading: (loading) => set({ isLoading: loading }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setCourses: (courses) => set({ courses }),
      setSelectedCourse: (course) => set({ selectedCourse: course }),
      updateBookingForm: (form) => 
        set((state) => ({ 
          bookingForm: { ...state.bookingForm, ...form } 
        })),
      updateContactForm: (form) => 
        set((state) => ({ 
          contactForm: { ...state.contactForm, ...form } 
        })),
      resetForms: () => set({ bookingForm: {}, contactForm: {} })
    }),
    {
      name: 'swimming-school-storage',
      partialize: (state) => ({ 
        bookingForm: state.bookingForm,
        contactForm: state.contactForm 
      })
    }
  )
)
