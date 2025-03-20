
import React from 'react';
import { motion } from 'framer-motion';

interface ProcessingIndicatorProps {
  isVisible: boolean;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50"
    >
      <div className="relative flex flex-col items-center justify-center">
        <div className="flex space-x-3">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-primary rounded-full"
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 mb-2 text-foreground font-medium"
        >
          Processing Email Thread
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 300 }}
          transition={{ duration: 8, ease: "linear" }}
          className="h-[2px] bg-primary/20 rounded-full overflow-hidden"
        >
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
            className="h-full w-1/3 bg-primary rounded-full"
          />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 text-xs text-muted-foreground max-w-xs text-center"
        >
          Analyzing content, extracting vendor specifications, and organizing data for Excel export
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ProcessingIndicator;
