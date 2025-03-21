
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { handleForwardedEmail } from '@/utils/emailParser';
import { toast } from 'sonner';

interface EmailInputProps {
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ onSubmit, isProcessing }) => {
  const [emailContent, setEmailContent] = useState('');
  const [forwardEmail, setForwardEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('paste');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailContent.trim()) {
      onSubmit(emailContent);
    }
  };

  const handleForwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forwardEmail.trim()) {
      try {
        const response = await handleForwardedEmail('vendor-analysis@example.com');
        toast.info(response);
      } catch (error) {
        toast.error('Error processing forwarded email');
      }
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="paste">Paste Email Thread</TabsTrigger>
          <TabsTrigger value="forward">Forward Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paste">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div 
                className={cn(
                  "glassmorphism rounded-xl p-1 transition-all duration-300",
                  isFocused ? "shadow-lg ring-1 ring-primary/10" : "shadow-soft"
                )}
              >
                <Textarea
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
        </TabsContent>
        
        <TabsContent value="forward">
          <form onSubmit={handleForwardSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Forward your email to:</h3>
              </div>
              
              <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm font-medium">vendor-analysis@example.com</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-7 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText('vendor-analysis@example.com');
                    toast.success('Email address copied to clipboard');
                  }}
                >
                  Copy
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                Forward your vendor email thread to this address. We'll automatically process it and display the results here.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Check processing status:</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={forwardEmail}
                  onChange={(e) => setForwardEmail(e.target.value)}
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isProcessing || !forwardEmail.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Check Status
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the email address you used to forward the thread to check processing status.
              </p>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Note: Demo Implementation</h4>
              <p className="text-xs text-muted-foreground">
                In a production environment, this feature would connect to an email server to retrieve and process forwarded emails.
                For this demo, the "Check Status" button will show a simulated response.
              </p>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default EmailInput;
