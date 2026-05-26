import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      onClick={() => navigate(-1)}
      style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 50,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a3a3a3',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)'
      }}
      whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
      title="返回"
    >
      <ArrowLeft size={18} />
    </motion.button>
  )
}
