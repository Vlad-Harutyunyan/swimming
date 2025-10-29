import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../components/ui/Card'
import { Shield, CheckCircle, AlertCircle, LifeBuoy, Users, Waves } from 'lucide-react'

interface Rule {
  id: string
  icon: React.ElementType
  title: string
  description: string
}

const baderegeln: Rule[] = [
  {
    id: '1',
    icon: Waves,
    title: 'Nicht mit vollem oder leerem Magen schwimmen',
    description: 'Warte mindestens eine Stunde nach dem Essen, bevor du ins Wasser gehst. Ein voller Magen kann zu Übelkeit führen.'
  },
  {
    id: '2',
    icon: LifeBuoy,
    title: 'Nie alleine schwimmen gehen',
    description: 'Schwimm immer in Begleitung oder in Bereichen mit Rettungsschwimmern. Allein schwimmen ist gefährlich.'
  },
  {
    id: '3',
    icon: AlertCircle,
    title: 'Nicht ins Wasser springen, wenn du dich verletzt fühlst',
    description: 'Müdigkeit, Kälte oder Unwohlsein sind Zeichen, dass du an Land bleiben solltest.'
  },
  {
    id: '4',
    icon: Users,
    title: 'Beachte die Hinweisschilder und Anweisungen',
    description: 'Höre auf die Anweisungen der Rettungsschwimmer und beachte alle Hinweisschilder im Schwimmbad.'
  },
  {
    id: '5',
    icon: Shield,
    title: 'Kenne deine Grenzen',
    description: 'Geh nicht zu weit hinaus, wenn du unsicher bist. Bleib in Reichweite des Ufers.'
  },
  {
    id: '6',
    icon: CheckCircle,
    title: 'Warm duschen vor dem Schwimmen',
    description: 'Dusch dich warm ab, bevor du ins Wasser gehst. Das hilft deinem Körper, sich an die Temperatur zu gewöhnen.'
  }
]

const Rules: React.FC = () => {
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
            <Shield className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Baderegeln
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Für ein sicheres und angenehmes Schwimmerlebnis für alle sollten 
              diese wichtigen Baderegeln befolgt werden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rules Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {baderegeln.map((rule, index) => {
              const IconComponent = rule.icon
              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {rule.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {rule.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Wichtiger Hinweis
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Diese Baderegeln sind für deine Sicherheit gedacht. Bitte halte dich 
                      immer daran, um Unfälle zu vermeiden. Bei Fragen oder Unsicherheiten 
                      wende dich immer an einen Erwachsenen oder Rettungsschwimmer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Rules