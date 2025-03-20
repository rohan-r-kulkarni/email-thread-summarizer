
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
                className="space-y-4"
              >
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">PRODUCT DETAILS</h3>
                <div className="overflow-x-auto -mx-6">
                  <div className="px-6 pb-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Specification</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Unit Price</TableCell>
                          <TableCell>{data.pricing?.unitPrice || "Not specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Additional Fees</TableCell>
                          <TableCell>{data.pricing?.additionalFees || "None specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Quantity Discounts</TableCell>
                          <TableCell>{data.pricing?.quantityDiscounts || "None specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">ESG Standards</TableCell>
                          <TableCell>{data.standards?.esg || "Not specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Quality Metrics</TableCell>
                          <TableCell>{data.standards?.quality || "Not specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Safety Standards</TableCell>
                          <TableCell>{data.standards?.safety || "Not specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Delivery Terms</TableCell>
                          <TableCell>{data.logistics?.deliveryTerms || "Not specified"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Lead Time</TableCell>
                          <TableCell>{data.logistics?.leadTime || "Not specified"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
              
              {data.additionalNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">ADDITIONAL NOTES</h3>
                  <p className="text-sm">{data.additionalNotes}</p>
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
