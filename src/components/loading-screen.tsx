
"use client";

import { motion } from 'framer-motion';
import { NexchatLogo } from '@/components/icons';

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <NexchatLogo className="h-24 w-24 text-primary" />
      </motion.div>
      <motion.p 
        className="mt-4 text-lg text-muted-foreground font-headline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1}}
      >
        Connecting to the Nex-us...
      </motion.p>
    </div>
  );
}
