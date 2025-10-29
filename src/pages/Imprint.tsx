import React from 'react'
import { motion } from 'framer-motion'

const Imprint: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Impressum
          </h1>
          <p className="text-gray-600">
            Rechtliche Informationen und Kontaktdaten.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Imprint
