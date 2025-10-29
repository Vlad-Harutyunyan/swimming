import React from 'react'
import { motion } from 'framer-motion'

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Datenschutz
          </h1>
          <p className="text-gray-600">
            Informationen zum Datenschutz und zur Verarbeitung Ihrer Daten.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy
