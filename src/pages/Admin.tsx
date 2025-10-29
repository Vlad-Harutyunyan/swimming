import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { coursesService, bookingService, contactService, feedbackService } from '../services/api'
import { Trash2, PlusCircle, Loader2, Lock, Mail, Phone, User, Clock, BookOpen, Edit2, CheckCircle, XCircle, FileText, Download, BarChart3, MessageSquare, Calendar, Star } from 'lucide-react'
import { courses as staticCourses } from '../data/courses'

const ADMIN_CREDENTIALS = { username: 'admin', password: 'swimmingadmin' }

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true'
  })

  const login = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
  }

  return { isAuthenticated, login, logout }
}

const emptyCourse = {
  title: '',
  age: '',
  duration: '45 Minuten',
  lessons: '',
  kids: '',
  price: '',
  image: '',
  level: 'beginner',
  badge: 'seepferdchen',
  location: '',
  startDate: '',
  endDate: '',
  day: '',
  times: '' as unknown as string,
  about: '',
  subTitle: '',
  rules: '',
}

const LoginForm: React.FC<{ onLogin: (username: string, password: string) => boolean }> = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!onLogin(username, password)) {
      setError('Ungültige Anmeldedaten')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Admin Anmeldung
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Bitte geben Sie Ihre Anmeldedaten ein
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Benutzername"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              
              <Input
                label="Passwort"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                required
              />

              <Button type="submit" className="w-full">
                Anmelden
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'bookings' | 'contacts' | 'feedback'>('dashboard')
  const [courses, setCourses] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [loadingFeedback, setLoadingFeedback] = useState(true)
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyCourse)
  const [editingCourse, setEditingCourse] = useState<string | null>(null)
  const [timesPairs, setTimesPairs] = useState<Array<{ from: string; to: string }>>([
    { from: '', to: '' },
  ])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await coursesService.getAll()
      setCourses(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    setLoadingBookings(true)
    try {
      const data = await bookingService.getAll()
      const sorted = data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setBookings(sorted)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingBookings(false)
    }
  }

  const loadContacts = async () => {
    setLoadingContacts(true)
    try {
      const data = await contactService.getAll()
      const sorted = data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setContacts(sorted)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingContacts(false)
    }
  }

  const loadFeedback = async () => {
    setLoadingFeedback(true)
    try {
      const data = await feedbackService.getAll()
      const sorted = data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setFeedback(sorted)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingFeedback(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCourses()
      loadBookings()
      loadContacts()
      loadFeedback()
    }
  }, [isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse(course.id)
    setForm({
      title: course.title || '',
      age: course.age || '',
      duration: course.duration || '45 Minuten',
      lessons: course.lessons || '',
      kids: course.kids || '',
      price: course.price || '',
      image: course.image || '',
      level: course.level || 'beginner',
      badge: course.badge || 'seepferdchen',
      location: course.location || '',
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      day: course.day || '',
      times: '',
      about: course.description?.[0]?.about || '',
      subTitle: course.description?.[0]?.subTitle || '',
      rules: course.description?.[0]?.rules?.join('\n') || '',
    })
    
    // Parse times from array or string
    if (course.times && Array.isArray(course.times) && course.times.length > 0) {
      const parsed = course.times.map((t: string) => {
        const [from, to] = t.split(' - ')
        return { from: from || '', to: to || '' }
      })
      setTimesPairs(parsed.length > 0 ? parsed : [{ from: '', to: '' }])
    } else {
      setTimesPairs([{ from: '', to: '' }])
    }
  }

  const handleCancelEdit = () => {
    setEditingCourse(null)
    setForm(emptyCourse)
    setTimesPairs([{ from: '', to: '' }])
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const timesFromPairs = timesPairs
        .filter(t => t.from && t.to)
        .map(t => `${t.from} - ${t.to}`)
      
      const rulesArray = form.rules
        .split(/[\n;]/)
        .map(r => r.trim())
        .filter(r => r.length > 0)
      
      const description = form.about || form.subTitle || rulesArray.length > 0 ? [{
        about: form.about || '',
        subTitle: form.subTitle || '',
        rules: rulesArray
      }] : []
      
      const payload = {
        title: form.title,
        age: form.age,
        duration: form.duration,
        lessons: form.lessons,
        kids: form.kids,
        price: form.price,
        image: form.image,
        level: form.level,
        badge: form.badge,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        day: form.day,
        times: timesFromPairs,
        number: editingCourse ? courses.find(c => c.id === editingCourse)?.number : String(courses.length + 1).padStart(2, '0'),
        description: description.length > 0 ? description : undefined,
      }
      
      if (editingCourse) {
        await coursesService.update(editingCourse, payload)
      } else {
        await coursesService.create(payload)
      }
      
      setForm(emptyCourse)
      setTimesPairs([{ from: '', to: '' }])
      setEditingCourse(null)
      await loadCourses()
    } catch (e) {
      console.error(e)
      alert(editingCourse ? 'Kurs konnte nicht aktualisiert werden' : 'Kurs konnte nicht erstellt werden')
    } finally {
      setSaving(false)
    }
  }

  const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

  const updateTimePair = (idx: number, key: 'from' | 'to', value: string) => {
    setTimesPairs(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p))
  }

  const addTimePair = () => {
    setTimesPairs(prev => [...prev, { from: '', to: '' }])
  }

  const removeTimePair = (idx: number) => {
    setTimesPairs(prev => prev.filter((_, i) => i !== idx))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Diesen Kurs wirklich löschen?')) return
    try {
      await coursesService.remove(id)
      await loadCourses()
    } catch (e) {
      console.error(e)
      alert('Kurs konnte nicht gelöscht werden')
    }
  }

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await bookingService.update(id, { status })
      await loadBookings()
    } catch (e) {
      console.error(e)
      alert('Status konnte nicht aktualisiert werden')
    }
  }

  const handleMarkContactRead = async (id: string, read: boolean) => {
    try {
      await contactService.update(id, { read })
      await loadContacts()
    } catch (e) {
      console.error(e)
      alert('Status konnte nicht aktualisiert werden')
    }
  }

  const handleApproveFeedback = async (id: string) => {
    try {
      await feedbackService.update(id, { approved: true, status: 'approved' })
      await loadFeedback()
    } catch (e) {
      console.error(e)
      alert('Feedback konnte nicht genehmigt werden')
    }
  }

  const handleRejectFeedback = async (id: string) => {
    try {
      await feedbackService.update(id, { approved: false, status: 'rejected' })
      await loadFeedback()
    } catch (e) {
      console.error(e)
      alert('Feedback konnte nicht abgelehnt werden')
    }
  }

  const exportToCSV = () => {
    if (bookings.length === 0) {
      alert('Keine Buchungen zum Exportieren')
      return
    }

    const headers = ['ID', 'Kind', 'Alter', 'Elternteil', 'E-Mail', 'Telefon', 'Kurs', 'Zeit', 'Status', 'Notizen', 'Erstellt am']
    const rows = bookings.map((b: any) => [
      b.id,
      b.childName || '',
      b.childAge || '',
      b.parentName || '',
      b.email || '',
      b.phone || '',
      getCourseTitle(b.selectedCourse),
      b.preferredTime || '',
      b.status || 'pending',
      b.notes || '',
      new Date(b.createdAt).toLocaleString('de-DE')
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `buchungen_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    if (bookings.length === 0) {
      alert('Keine Buchungen zum Exportieren')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Buchungsanfragen</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-pending { background-color: #fff3cd; }
            .status-confirmed { background-color: #d4edda; }
            .status-cancelled { background-color: #f8d7da; }
            .status-processed { background-color: #d1ecf1; }
          </style>
        </head>
        <body>
          <h1>Buchungsanfragen</h1>
          <p>Exportiert am: ${new Date().toLocaleString('de-DE')}</p>
          <table>
            <thead>
              <tr>
                <th>Kind</th>
                <th>Alter</th>
                <th>Elternteil</th>
                <th>E-Mail</th>
                <th>Telefon</th>
                <th>Kurs</th>
                <th>Zeit</th>
                <th>Status</th>
                <th>Erstellt am</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map((b: any) => `
                <tr class="status-${b.status || 'pending'}">
                  <td>${b.childName || ''}</td>
                  <td>${b.childAge || ''}</td>
                  <td>${b.parentName || ''}</td>
                  <td>${b.email || ''}</td>
                  <td>${b.phone || ''}</td>
                  <td>${getCourseTitle(b.selectedCourse)}</td>
                  <td>${b.preferredTime || ''}</td>
                  <td>${b.status === 'pending' ? 'Ausstehend' : b.status === 'confirmed' ? 'Bestätigt' : b.status === 'cancelled' ? 'Storniert' : b.status === 'processed' ? 'Bearbeitet' : b.status}</td>
                  <td>${new Date(b.createdAt).toLocaleString('de-DE')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const getCourseTitle = (courseId: string) => {
    const apiCourse = courses.find((c: any) => 
      String(c.id) === courseId || c.id === Number(courseId)
    )
    if (apiCourse) return apiCourse.title
    
    const staticCourse = staticCourses.find(c => 
      String(c.id) === courseId || c.id === Number(courseId)
    )
    if (staticCourse) return staticCourse.title
    
    return `Kurs #${courseId}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      processed: 'bg-blue-100 text-blue-800 border-blue-300'
    }
    const color = colors[status as keyof typeof colors] || colors.pending
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
        {status === 'pending' ? 'Ausstehend' : 
         status === 'confirmed' ? 'Bestätigt' :
         status === 'cancelled' ? 'Storniert' :
         status === 'processed' ? 'Bearbeitet' : status}
      </span>
    )
  }

  // Calculate statistics
  const stats = {
    totalCourses: courses.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
    confirmedBookings: bookings.filter((b: any) => b.status === 'confirmed').length,
    totalContacts: contacts.length,
    unreadContacts: contacts.filter((c: any) => !c.read).length,
    totalFeedback: feedback.length,
    approvedFeedback: feedback.filter((f: any) => f.approved === true).length,
    pendingFeedback: feedback.filter((f: any) => f.approved === false && (f.status === 'pending' || !f.status)).length,
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }

  const handleLogout = () => {
    if (confirm('Möchten Sie sich abmelden?')) {
      logout()
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container-custom max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Admin Dashboard
          </motion.h1>
          <Button variant="outline" onClick={handleLogout}>
            Abmelden
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === 'dashboard'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'courses'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kurse verwalten
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === 'bookings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buchungsanfragen
            {stats.pendingBookings > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.pendingBookings}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === 'contacts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kontaktanfragen
            {stats.unreadContacts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.unreadContacts}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === 'feedback'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Feedback verwalten
            {stats.pendingFeedback > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.pendingFeedback}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Kurse</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Buchungen</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.pendingBookings} ausstehend</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Kontakte</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.unreadContacts} ungelesen</p>
                  </div>
                  <Mail className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Feedback</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFeedback}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.approvedFeedback} genehmigt</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Status Übersicht</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">Ausstehende Buchungen</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.pendingBookings}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium">Bestätigte Buchungen</p>
                    <p className="text-2xl font-bold text-green-900">{stats.confirmedBookings}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">Ungelesene Kontakte</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.unreadContacts}</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">Ausstehende Feedback</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.pendingFeedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'courses' && (
          <>
        <Card className="mb-8">
          <CardContent className="p-6 pt-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingCourse ? 'Kurs bearbeiten' : 'Neuen Kurs hinzufügen'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
              <Input label="Titel" name="title" value={form.title} onChange={handleChange} required />
              <Input label="Alter" name="age" value={form.age} onChange={handleChange} />
              <Input label="Dauer" name="duration" value={form.duration} onChange={handleChange} />
              <Input label="Einheiten" name="lessons" value={form.lessons} onChange={handleChange} />
              <Input label="Kinderanzahl" name="kids" value={form.kids} onChange={handleChange} />
              <Input label="Preis (€)" name="price" value={form.price} onChange={handleChange} />
              <Input label="Bild URL/Path" name="image" value={form.image} onChange={handleChange} />
              <Input label="Ort" name="location" value={form.location} onChange={handleChange} />
              <Input label="Startdatum" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
              <Input label="Enddatum" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                <select name="day" value={form.day} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  <option value="">Bitte wählen...</option>
                  {weekdays.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zeiten</label>
                <div className="space-y-2">
                  {timesPairs.map((t, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-start">
                      <div className="sm:col-span-2">
                        <Input label="Von" type="time" value={t.from} onChange={(e) => updateTimePair(idx, 'from', e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <Input label="Bis" type="time" value={t.to} onChange={(e) => updateTimePair(idx, 'to', e.target.value)} />
                      </div>
                      <div className="sm:col-span-1 flex items-end pb-0">
                        <Button type="button" variant="outline" onClick={() => removeTimePair(idx)} disabled={timesPairs.length === 1} className="w-full h-10">Entfernen</Button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button type="button" variant="outline" onClick={addTimePair}>Zeit hinzufügen</Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select name="level" value={form.level} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                    <option value="beginner">Anfänger</option>
                    <option value="intermediate">Fortgeschritten</option>
                    <option value="advanced">Experte</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Abzeichen</label>
                  <select name="badge" value={form.badge} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                    <option value="seepferdchen">Seepferdchen</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silber</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kursbeschreibung</h3>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Untertitel (z.B. 'Anforderungen zum Schwimmabzeichen Seepferdchen')"
                  name="subTitle"
                  value={form.subTitle}
                  onChange={handleChange}
                  placeholder="Anforderungen zum Schwimmabzeichen Seepferdchen"
                  rows={2}
                  helperText="Kurzer Titel für die Anforderungen/Beschreibung"
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Über diesen Kurs"
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  placeholder="Während unseres Anfänger- Schwimmkurses werden die Kinder auf spielerische Art und Weise, das sichere und eigenständige Bewegen, im Wasser erarbeiten..."
                  rows={6}
                  helperText="Ausführliche Beschreibung des Kurses"
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Anforderungen für das Schwimmabzeichen"
                  name="rules"
                  value={form.rules}
                  onChange={handleChange}
                  placeholder={`Ein Sprung vom Beckenrand mit anschließendem 25 m Schwimmen...
Heraufholen eines Tauchrings...
3-5 Baderegeln...`}
                  rows={8}
                  helperText="Jede Anforderung auf einer neuen Zeile (oder getrennt durch Semikolon)"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                {editingCourse && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Abbrechen
                  </Button>
                )}
                <Button type="submit" loading={saving} className="inline-flex items-center">
                  {editingCourse ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Kurs aktualisieren
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Kurs hinzufügen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Bestehende Kurse</h2>
              {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
            </div>

            {courses.length === 0 ? (
              <p className="text-gray-600">Keine Kurse vorhanden.</p>
            ) : (
              <div className="space-y-3">
                {courses.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{c.title}</div>
                      <div className="text-sm text-gray-600">{c.location} · {c.price} · {c.lessons}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditCourse(c)} 
                        className="text-primary-600 hover:text-primary-700"
                        title="Bearbeiten"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="text-red-600 hover:text-red-700"
                        title="Löschen"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {activeTab === 'bookings' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Buchungsanfragen</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    CSV Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBookings}>
                    Aktualisieren
                  </Button>
                </div>
              </div>

              {loadingBookings ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Keine Buchungsanfragen vorhanden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.childName}
                            </h3>
                            {getStatusBadge(booking.status || 'pending')}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">Elternteil:</span>
                            <span className="ml-2">{booking.parentName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">Kind:</span>
                            <span className="ml-2">{booking.childName} ({booking.childAge} Jahre)</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">E-Mail:</span>
                            <a href={`mailto:${booking.email}`} className="ml-2 text-primary-600 hover:underline">
                              {booking.email}
                            </a>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">Telefon:</span>
                            <a href={`tel:${booking.phone}`} className="ml-2 text-primary-600 hover:underline">
                              {booking.phone}
                            </a>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">Kurs:</span>
                            <span className="ml-2">{getCourseTitle(booking.selectedCourse)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">Gewünschte Uhrzeit:</span>
                            <span className="ml-2">{booking.preferredTime}</span>
                          </div>
                          {booking.notes && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Notizen:</span>
                              <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                          disabled={booking.status === 'confirmed'}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Bestätigen
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'processed')}
                          disabled={booking.status === 'processed'}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Als bearbeitet markieren
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                          disabled={booking.status === 'cancelled'}
                          className="flex-1 text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Stornieren
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'contacts' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Kontaktanfragen</h2>
                <Button variant="outline" size="sm" onClick={loadContacts}>
                  Aktualisieren
                </Button>
              </div>

              {loadingContacts ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Keine Kontaktanfragen vorhanden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact: any) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        !contact.read ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {contact.subject || 'Kein Betreff'}
                            </h3>
                            {!contact.read && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Neu
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {formatDate(contact.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">Name:</span>
                            <span className="ml-2">{contact.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="font-medium">E-Mail:</span>
                            <a href={`mailto:${contact.email}`} className="ml-2 text-primary-600 hover:underline">
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-primary-600" />
                              <span className="font-medium">Telefon:</span>
                              <a href={`tel:${contact.phone}`} className="ml-2 text-primary-600 hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {contact.message && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Nachricht:</span>
                              <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{contact.message}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        {!contact.read ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkContactRead(contact.id, true)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Als gelesen markieren
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkContactRead(contact.id, false)}
                            className="flex-1"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Als ungelesen markieren
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'feedback' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Feedback verwalten</h2>
                <Button variant="outline" size="sm" onClick={loadFeedback}>
                  Aktualisieren
                </Button>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <button
                  onClick={() => setFeedbackStatusFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    feedbackStatusFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Alle ({feedback.length})
                </button>
                <button
                  onClick={() => setFeedbackStatusFilter('pending')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    feedbackStatusFilter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ausstehend ({stats.pendingFeedback})
                </button>
                <button
                  onClick={() => setFeedbackStatusFilter('approved')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    feedbackStatusFilter === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Genehmigt ({stats.approvedFeedback})
                </button>
                <button
                  onClick={() => setFeedbackStatusFilter('rejected')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    feedbackStatusFilter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Abgelehnt ({feedback.filter((f: any) => f.status === 'rejected').length})
                </button>
              </div>

              {loadingFeedback ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                (() => {
                  const filteredFeedback = feedback.filter((f: any) => {
                    if (feedbackStatusFilter === 'all') return true
                    if (feedbackStatusFilter === 'pending') return !f.approved && (f.status === 'pending' || !f.status)
                    if (feedbackStatusFilter === 'approved') return f.approved === true
                    if (feedbackStatusFilter === 'rejected') return f.status === 'rejected'
                    return true
                  })

                  if (filteredFeedback.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {feedbackStatusFilter === 'all' 
                            ? 'Keine Feedback vorhanden.' 
                            : `Keine ${feedbackStatusFilter === 'pending' ? 'ausstehenden' : feedbackStatusFilter === 'approved' ? 'genehmigten' : 'abgelehnten'} Feedback vorhanden.`}
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-4">
                      {filteredFeedback.map((fb: any) => (
                        <motion.div
                          key={fb.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                            !fb.approved && fb.status !== 'rejected' ? 'bg-yellow-50 border-yellow-200' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {fb.name || 'Anonym'}
                                </h3>
                                {fb.approved ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                                    Genehmigt
                                  </span>
                                ) : fb.status === 'rejected' ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                                    Abgelehnt
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                                    Ausstehend
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mb-3">
                                {formatDate(fb.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              {fb.childName && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <User className="h-4 w-4 mr-2 text-primary-600" />
                                  <span className="font-medium">Kind:</span>
                                  <span className="ml-2">{fb.childName}</span>
                                </div>
                              )}
                              {fb.course && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <BookOpen className="h-4 w-4 mr-2 text-primary-600" />
                                  <span className="font-medium">Kurs:</span>
                                  <span className="ml-2">{getCourseTitle(fb.course)}</span>
                                </div>
                              )}
                              {fb.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-4 w-4 mr-2 text-primary-600" />
                                  <span className="font-medium">E-Mail:</span>
                                  <a href={`mailto:${fb.email}`} className="ml-2 text-primary-600 hover:underline">
                                    {fb.email}
                                  </a>
                                </div>
                              )}
                              {fb.rating && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Star className="h-4 w-4 mr-2 text-primary-600 fill-primary-600" />
                                  <span className="font-medium">Bewertung:</span>
                                  <span className="ml-2 flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < fb.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                    <span className="ml-2">({fb.rating}/5)</span>
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {fb.comment && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Kommentar:</span>
                                  <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{fb.comment}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {(!fb.approved && fb.status !== 'rejected') && (
                            <div className="flex gap-2 pt-4 border-t">
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveFeedback(fb.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Genehmigen
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectFeedback(fb.id)}
                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Ablehnen
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )
                })()
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Admin
