
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RotateCcw } from 'lucide-react';
import { VendorData } from '@/utils/emailParser';

interface SummaryDisplayProps {
  data: VendorData | null;
  onReset: () => void;
  onDownload: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  data, 
  onReset, 
  onDownload 
}) => {
  if (!data) return null;

  // Function to render bullet points with better formatting
  const renderBulletPoints = (points: string[]) => {
    if (!points || points.length === 0) {
      return <p className="text-sm text-muted-foreground">No information available</p>;
    }
    
    if (points.length === 1 && (
      points[0].includes("not available") || 
      points[0].includes("not specified") || 
      points[0].includes("No information")
    )) {
      return <p className="text-sm text-muted-foreground italic">{points[0]}</p>;
    }
    
    return (
      <ul className="list-disc pl-4 space-y-1.5 text-sm">
        {points.map((point, index) => (
          <li key={index} className="leading-relaxed">{point}</li>
        ))}
      </ul>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="overflow-hidden border-0 shadow-soft glassmorphism">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-medium mb-1.5">Vendor Summary</CardTitle>
                <CardDescription>
                  Extracted information about {data.vendorName || "the aluminum rod vendor"}
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">GENERAL INFORMATION</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Vendor Name</p>
                    <p className="font-medium">{data.vendorName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contact</p>
                    <p className="font-medium">{data.contactInfo || "Not specified"}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">PRICING</h3>
                <div className="grid grid-cols-1 gap-4 bg-background/50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Unit Price</p>
                    <p className="font-medium">{data.pricing.unitPrice || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Additional Fees</p>
                    <p className="font-medium">{data.pricing.additionalFees || "None specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Quantity Discounts</p>
                    <p className="font-medium">{data.pricing.quantityDiscounts || "None specified"}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1"
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">ESG STANDARDS</h3>
                <div className="bg-background/50 p-4 rounded-lg">
                  {renderBulletPoints(data.standards.esg)}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-1"
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">QUALITY METRICS</h3>
                <div className="bg-background/50 p-4 rounded-lg">
                  {renderBulletPoints(data.standards.quality)}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-1"
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">SAFETY STANDARDS</h3>
                <div className="bg-background/50 p-4 rounded-lg">
                  {renderBulletPoints(data.standards.safety)}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">LOGISTICS</h3>
                <div className="grid grid-cols-2 gap-4 bg-background/50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Delivery Terms</p>
                    <p className="font-medium">{data.logistics.deliveryTerms || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Lead Time</p>
                    <p className="font-medium">{data.logistics.leadTime || "Not specified"}</p>
                  </div>
                </div>
              </motion.div>
              
              {data.additionalNotes && data.additionalNotes !== "No additional notes extracted from email thread" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">ADDITIONAL NOTES</h3>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-sm">{data.additionalNotes}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="text-xs border-muted"
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              New Analysis
            </Button>
            <Button 
              onClick={onDownload}
              className="text-xs"
            >
              <Download className="mr-2 h-3 w-3" />
              Download Excel
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SummaryDisplay;
