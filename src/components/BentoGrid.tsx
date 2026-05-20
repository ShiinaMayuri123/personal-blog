import React from 'react';
import { motion } from 'motion/react';

export function BentoGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        gridAutoRows: 'minmax(200px, auto)',
        gridAutoFlow: 'dense'
      }}
    >
      {children}
    </div>
  );
}

export function BentoItem({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}) {
  return (
    <motion.div
      className={`bento-item ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`
      }}
    >
      {children}
    </motion.div>
  );
}
