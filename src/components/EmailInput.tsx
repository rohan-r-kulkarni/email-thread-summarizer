
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmailInputProps {
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ onSubmit, isProcessing }) => {
  const [emailContent, setEmailContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailContent.trim()) {
      onSubmit(emailContent);
    }
  };

  const placeholderText = `Paste your email thread here...

Example:
From: vendor@aluminum-supply.com
To: procurement@company.com
Subject: RE: Aluminum Rods Inquiry

Thank you for your interest in our aluminum rods. Our ESG rating is A+ and we meet ISO 9001 standards. The price per unit is $24.99 with a 5% bulk discount for orders over 1000 units...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div 
            className={cn(
              "glassmorphism rounded-xl p-1 transition-all duration-300",
              isFocused ? "shadow-lg ring-1 ring-primary/10" : "shadow-soft"
            )}
          >
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholderText}
              rows={10}
              className="w-full p-4 bg-transparent rounded-lg resize-none focus:outline-none text-foreground"
              disabled={isProcessing}
            />
          </div>
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEmailContent('')}
              disabled={isProcessing || !emailContent}
              className="text-xs bg-background/70 backdrop-blur-sm"
            >
              Clear
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={isProcessing || !emailContent.trim()}
              className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            >
              {isProcessing ? "Processing..." : "Analyze"}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center max-w-md mx-auto">
          Paste an email thread containing vendor information for aluminum rods. The system will extract and organize details about ESG standards, pricing, and other specifications.
        </p>
      </form>
    </motion.div>
  );
};

export default EmailInput;
