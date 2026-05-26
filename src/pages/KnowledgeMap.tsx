import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { NeuralNetworkCanvas } from '../components/neural-network'

import { BackButton } from '../components/BackButton'

function KnowledgeMap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a1a' }}>
      <BackButton />

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: '100%', height: '100%' }}
        >
          <NeuralNetworkCanvas />
        </motion.div>
      </main>
    </div>
  )
}

export default KnowledgeMap
