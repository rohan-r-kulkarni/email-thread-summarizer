
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import EmailInput from '@/components/EmailInput';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import SummaryDisplay from '@/components/SummaryDisplay';
import { parseEmailThread, VendorData } from '@/utils/emailParser';
import { generateExcelFile } from '@/utils/excelGenerator';

const Index = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Add the XLSX dependency
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleEmailSubmit = async (content: string) => {
    setEmailContent(content);
    setIsProcessing(true);
    setShowResults(false);
    
    try {
      // Process the email content (in a real app, this would call an LLM API)
      const data = await parseEmailThread(content);
      
      // Update state with the processed data
      setVendorData(data);
      
      // Show success message
      toast.success('Email thread processed successfully');
      
      // Show the results
      setShowResults(true);
    } catch (error) {
      console.error('Error processing email:', error);
      toast.error('Failed to process email thread');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setEmailContent('');
    setVendorData(null);
    setShowResults(false);
    toast.info('Reset complete');
  };
  
  const handleDownload = () => {
    if (vendorData) {
      try {
        generateExcelFile(vendorData);
        toast.success('Excel file downloaded successfully');
      } catch (error) {
        console.error('Error generating Excel:', error);
        toast.error('Failed to generate Excel file');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8 sm:mb-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-3"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-soft">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path 
                d="M21 7L13 15L9 11M3 15L9 21L21 9M12 3L9 5.5L12 8" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-3xl sm:text-4xl font-medium text-foreground mb-2 tracking-tight"
        >
          Email Thread Analyzer
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-muted-foreground max-w-md mx-auto"
        >
          Transform vendor email threads into structured Excel reports with AI-powered analysis
        </motion.p>
      </motion.div>
      
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <EmailInput 
              onSubmit={handleEmailSubmit} 
              isProcessing={isProcessing} 
            />
          ) : (
            <SummaryDisplay 
              data={vendorData} 
              onReset={handleReset} 
              onDownload={handleDownload} 
            />
          )}
        </AnimatePresence>
      </div>
      
      <ProcessingIndicator isVisible={isProcessing} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 text-xs text-muted-foreground text-center"
      >
        <p>This application analyzes email threads about aluminum rod vendors and extracts structured data.</p>
        <p className="mt-1">Upload any email thread to automatically generate a downloadable Excel report.</p>
      </motion.div>
    </div>
  );
};

export default Index;
