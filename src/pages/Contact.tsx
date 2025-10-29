import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { contactService } from '../services/api'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await contactService.create(formData)
      setIsSubmitted(true)
      
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      }, 5000)
    } catch (error) {
      console.error('Error submitting contact:', error)
      alert('Fehler beim Absenden der Nachricht. Bitte versuchen Sie es später erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Mail className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kontakt
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Haben Sie Fragen? Wir sind für Sie da! Kontaktieren Sie uns per E-Mail, 
            Telefon oder nutzen Sie unser Kontaktformular.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-600 text-sm">
                        INI School Bad Sassendorf<br />
                        Musterstraße 123<br />
                        59505 Bad Sassendorf
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                      <p className="text-gray-600 text-sm">
                        <a href="tel:+491234567890" className="hover:text-primary-600">
                          +49 (0) 123 456 7890
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">E-Mail</h3>
                      <p className="text-gray-600 text-sm">
                        <a href="mailto:info@schwimmschule.de" className="hover:text-primary-600">
                          info@schwimmschule.de
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Öffnungszeiten</h3>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Montag - Freitag:</span> 08:00 - 18:00<br />
                        <span className="font-medium">Samstag:</span> 09:00 - 15:00<br />
                        <span className="font-medium">Sonntag:</span> Geschlossen
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Nachricht gesendet!
                    </h3>
                    <p className="text-gray-600">
                      Vielen Dank für Ihre Nachricht. Wir melden uns so schnell wie möglich bei Ihnen zurück.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Senden Sie uns eine Nachricht
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ihr Name"
                        required
                      />
                      <Input
                        label="Telefon"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+49 123 456 789"
                      />
                    </div>

                    <Input
                      label="E-Mail *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ihre.email@beispiel.de"
                      required
                    />

                    <Input
                      label="Betreff *"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Betreff Ihrer Nachricht"
                      required
                    />

                    <Textarea
                      label="Nachricht *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ihre Nachricht an uns..."
                      rows={6}
                      required
                    />

                    <Button
                      type="submit"
                      size="lg"
                      loading={isSubmitting}
                      className="w-full"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Nachricht senden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact