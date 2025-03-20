
import { utils, write } from 'xlsx';
import { VendorData } from './emailParser';

export const generateExcelFile = (data: VendorData): void => {
  // Create a new workbook
  const workbook = utils.book_new();
  
  // Create sheets for different sections of data
  createVendorOverviewSheet(workbook, data);
  createPricingSheet(workbook, data);
  createStandardsSheet(workbook, data);
  createLogisticsSheet(workbook, data);
  
  // Write the workbook and trigger download
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  
  downloadExcelFile(excelBuffer, `${data.vendorName.replace(/[^a-z0-9]/gi, '_')}_summary.xlsx`);
};

// Helper function to create the main overview sheet
const createVendorOverviewSheet = (workbook: any, data: VendorData): void => {
  // Format data for the overview sheet
  const overviewData = [
    ['Vendor Summary', ''],
    ['Date', new Date().toLocaleDateString()],
    ['', ''],
    ['GENERAL INFORMATION', ''],
    ['Vendor Name', data.vendorName],
    ['Contact', data.contactInfo],
    ['', ''],
    ['PRICING', ''],
    ['Unit Price', data.pricing.unitPrice],
    ['Additional Fees', data.pricing.additionalFees],
    ['Quantity Discounts', data.pricing.quantityDiscounts],
    ['', ''],
    ['STANDARDS', ''],
    ['ESG Rating', data.standards.esg],
    ['Quality Metrics', data.standards.quality],
    ['Safety Standards', data.standards.safety],
    ['', ''],
    ['LOGISTICS', ''],
    ['Delivery Terms', data.logistics.deliveryTerms],
    ['Lead Time', data.logistics.leadTime],
    ['', ''],
    ['ADDITIONAL NOTES', ''],
    [data.additionalNotes, '']
  ];
  
  // Create worksheet and add to workbook
  const worksheet = utils.aoa_to_sheet(overviewData);
  
  // Set column widths
  const wscols = [
    { wch: 20 },
    { wch: 50 }
  ];
  worksheet['!cols'] = wscols;
  
  utils.book_append_sheet(workbook, worksheet, 'Overview');
};

// Helper function to create the pricing details sheet
const createPricingSheet = (workbook: any, data: VendorData): void => {
  // Format data for the pricing sheet
  const pricingData = [
    ['PRICING DETAILS', ''],
    ['Date', new Date().toLocaleDateString()],
    ['', ''],
    ['Vendor', data.vendorName],
    ['', ''],
    ['Unit Price', data.pricing.unitPrice],
    ['Additional Fees', data.pricing.additionalFees],
    ['Quantity Discounts', data.pricing.quantityDiscounts]
  ];
  
  // Create worksheet and add to workbook
  const worksheet = utils.aoa_to_sheet(pricingData);
  
  // Set column widths
  const wscols = [
    { wch: 20 },
    { wch: 50 }
  ];
  worksheet['!cols'] = wscols;
  
  utils.book_append_sheet(workbook, worksheet, 'Pricing');
};

// Helper function to create the standards sheet
const createStandardsSheet = (workbook: any, data: VendorData): void => {
  // Format data for the standards sheet
  const standardsData = [
    ['STANDARDS & COMPLIANCE', ''],
    ['Date', new Date().toLocaleDateString()],
    ['', ''],
    ['Vendor', data.vendorName],
    ['', ''],
    ['ESG Standards', data.standards.esg],
    ['Quality Metrics', data.standards.quality],
    ['Safety Standards', data.standards.safety]
  ];
  
  // Create worksheet and add to workbook
  const worksheet = utils.aoa_to_sheet(standardsData);
  
  // Set column widths
  const wscols = [
    { wch: 20 },
    { wch: 50 }
  ];
  worksheet['!cols'] = wscols;
  
  utils.book_append_sheet(workbook, worksheet, 'Standards');
};

// Helper function to create the logistics sheet
const createLogisticsSheet = (workbook: any, data: VendorData): void => {
  // Format data for the logistics sheet
  const logisticsData = [
    ['LOGISTICS & DELIVERY', ''],
    ['Date', new Date().toLocaleDateString()],
    ['', ''],
    ['Vendor', data.vendorName],
    ['', ''],
    ['Delivery Terms', data.logistics.deliveryTerms],
    ['Lead Time', data.logistics.leadTime]
  ];
  
  // Create worksheet and add to workbook
  const worksheet = utils.aoa_to_sheet(logisticsData);
  
  // Set column widths
  const wscols = [
    { wch: 20 },
    { wch: 50 }
  ];
  worksheet['!cols'] = wscols;
  
  utils.book_append_sheet(workbook, worksheet, 'Logistics');
};

// Helper function to trigger the download
const downloadExcelFile = (buffer: ArrayBuffer, fileName: string): void => {
  // Create a blob from the buffer
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  
  // Create a link element to trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set link properties
  link.href = url;
  link.download = fileName;
  
  // Add to document, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
