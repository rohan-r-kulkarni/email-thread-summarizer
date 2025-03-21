
// This represents the data structure we extract from the email thread
export interface VendorData {
  vendorName: string;
  contactInfo: string;
  pricing: {
    unitPrice: string;
    additionalFees: string;
    quantityDiscounts: string;
  };
  standards: {
    esg: string[];
    quality: string[];
    safety: string[];
  };
  logistics: {
    deliveryTerms: string;
    leadTime: string;
  };
  additionalNotes: string;
}

// This function simulates parsing an email thread using an LLM
// In a real implementation, this would call an API with the LLM service
export const parseEmailThread = async (emailContent: string): Promise<VendorData> => {
  // In a real implementation, this would be an API call to an LLM
  // For now, we'll simulate the processing delay and return more detailed mock data
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // This is where we'd normally process the email content with an LLM
      // For demonstration purposes, we're extracting some information using enhanced pattern matching
      
      // Try to extract vendor name
      let vendorName = "Aluminum Supplies Inc.";
      const vendorMatch = emailContent.match(/From:\s*([^<\n]*)/i);
      if (vendorMatch && vendorMatch[1]) {
        vendorName = vendorMatch[1].trim();
      }
      
      // Extract contact info (email address and phone if available)
      let contactInfo = "contact@example.com";
      const emailMatch = emailContent.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch && emailMatch[0]) {
        contactInfo = emailMatch[0];
      }
      
      // Try to extract phone number
      const phoneMatch = emailContent.match(/(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/);
      if (phoneMatch && phoneMatch[0]) {
        contactInfo += ` | ${phoneMatch[0]}`;
      }
      
      // Extract pricing information in more detail
      let unitPrice = "Not available in thread";
      const priceMatches = emailContent.match(/(\$\d+(\.\d+)?(\s*per\s*(unit|ton|kg|piece))?)|(\d+(\.\d+)?\s*(USD|dollars)(\s*per\s*(unit|ton|kg|piece))?)/gi);
      if (priceMatches && priceMatches.length > 0) {
        // Get the most specific price description
        unitPrice = priceMatches.reduce((best, current) => {
          return current.length > best.length ? current : best;
        }, priceMatches[0]);
      }
      
      // Extract additional fees with more detail
      let additionalFees = "No additional fees mentioned";
      const feePatterns = [
        /shipping\s*fee[s]?\s*(?:of|:)?\s*([^,.]*)/i,
        /handling\s*fee[s]?\s*(?:of|:)?\s*([^,.]*)/i,
        /additional\s*charge[s]?\s*(?:of|:)?\s*([^,.]*)/i,
        /setup\s*fee[s]?\s*(?:of|:)?\s*([^,.]*)/i,
        /surcharge[s]?\s*(?:of|:)?\s*([^,.]*)/i
      ];
      
      const feeDetails = [];
      for (const pattern of feePatterns) {
        const match = emailContent.match(pattern);
        if (match && match[1]) {
          feeDetails.push(`${match[0].split(/\s+/).slice(0, 2).join(' ')}: ${match[1].trim()}`);
        }
      }
      
      if (feeDetails.length > 0) {
        additionalFees = feeDetails.join('; ');
      }
      
      // Extract quantity discounts with more detail
      let quantityDiscounts = "No quantity discounts mentioned";
      const discountPatterns = [
        /(\d+%\s*discount\s*for\s*orders\s*(over|above)\s*\d+)/i,
        /discount\s*of\s*(\d+%)\s*for\s*orders\s*(over|above)\s*\d+/i,
        /bulk\s*discount\s*(?:of|:)?\s*([^,.]*)/i,
        /volume\s*discount\s*(?:of|:)?\s*([^,.]*)/i,
        /orders\s*(over|above)\s*\d+\s*units\s*receive\s*([^,.]*discount)/i
      ];
      
      const discountDetails = [];
      for (const pattern of discountPatterns) {
        const match = emailContent.match(pattern);
        if (match) {
          discountDetails.push(match[0].trim());
        }
      }
      
      if (discountDetails.length > 0) {
        quantityDiscounts = discountDetails.join('; ');
      }
      
      // Extract ESG standards in more detail
      const esgStandards = extractEnhancedBulletPoints(emailContent, "ESG", [
        "environmental", "social", "governance", "sustainability", "carbon", 
        "emissions", "renewable", "eco-friendly", "green", "ethical", "CSR",
        "corporate social responsibility", "climate", "recycled", "waste reduction"
      ]);
      
      // If ESG standards still not identified, create more specific bullet points based on context
      if (esgStandards.length === 0) {
        // Check for common ESG certifications and ratings
        const esgCertifications = [];
        
        if (emailContent.match(/carbon\s*neutral/i)) {
          esgCertifications.push("Carbon neutral certification mentioned");
        }
        
        if (emailContent.match(/ISO\s*14001/i)) {
          esgCertifications.push("ISO 14001 environmental management system compliance mentioned");
        }
        
        if (emailContent.match(/recycled\s*content/i)) {
          const recycledMatch = emailContent.match(/(\d+%)\s*recycled\s*content/i);
          if (recycledMatch && recycledMatch[1]) {
            esgCertifications.push(`Material contains ${recycledMatch[1]} recycled content`);
          } else {
            esgCertifications.push("Products include recycled content");
          }
        }
        
        if (emailContent.match(/renewable\s*energy/i)) {
          esgCertifications.push("Manufacturing powered by renewable energy sources");
        }
        
        if (esgCertifications.length > 0) {
          return esgCertifications;
        }
        
        // If nothing specific found, check for general ESG statements
        const esgMatch = emailContent.match(/ESG\s*rating\s*(?:is|:)\s*([A-Z][+-]?|[^,.\n]*)/i);
        if (esgMatch && esgMatch[1]) {
          return [`ESG Rating: ${esgMatch[1].trim()}`];
        }
        
        // If still nothing, return a general statement
        if (emailContent.toLowerCase().includes("esg") || 
            emailContent.toLowerCase().includes("environmental") ||
            emailContent.toLowerCase().includes("sustainability")) {
          return ["Vendor mentions ESG compliance but no specific details provided"];
        }
        
        return ["No ESG information available in email thread"];
      }
      
      // Extract quality metrics in more detail
      const qualityMetrics = extractEnhancedBulletPoints(emailContent, "Quality", [
        "ISO", "certification", "standard", "testing", "metric", "quality control", 
        "inspection", "tolerance", "quality assurance", "QA", "specification", 
        "compliance", "grade", "alloy", "tensile strength", "hardness"
      ]);
      
      // If quality metrics still not identified, create more specific bullet points
      if (qualityMetrics.length === 0) {
        // Check for common quality certifications
        const qualityCertifications = [];
        
        if (emailContent.match(/ISO\s*9001/i)) {
          qualityCertifications.push("ISO 9001 quality management system certified");
        }
        
        if (emailContent.match(/ASTM/i)) {
          const astmMatch = emailContent.match(/ASTM\s*([A-Z]?\d+)/i);
          if (astmMatch && astmMatch[1]) {
            qualityCertifications.push(`ASTM ${astmMatch[1]} compliance confirmed`);
          } else {
            qualityCertifications.push("ASTM standards compliance mentioned");
          }
        }
        
        // Check for quality testing procedures
        if (emailContent.match(/tensile\s*strength/i)) {
          const tensileMatch = emailContent.match(/tensile\s*strength[^\d]*(\d+)/i);
          if (tensileMatch && tensileMatch[1]) {
            qualityCertifications.push(`Tensile strength testing: ${tensileMatch[1]} MPa`);
          } else {
            qualityCertifications.push("Tensile strength testing performed on all products");
          }
        }
        
        if (emailContent.match(/hardness\s*test/i)) {
          qualityCertifications.push("Hardness testing performed on all batches");
        }
        
        if (qualityCertifications.length > 0) {
          return qualityCertifications;
        }
        
        // If nothing specific found, check for general quality statements
        if (emailContent.toLowerCase().includes("quality") || 
            emailContent.toLowerCase().includes("testing") ||
            emailContent.toLowerCase().includes("certified")) {
          return ["Vendor mentions quality control processes but no specific metrics provided"];
        }
        
        return ["No quality metrics available in email thread"];
      }
      
      // Extract safety standards in more detail
      const safetyStandards = extractEnhancedBulletPoints(emailContent, "Safety", [
        "safety", "hazard", "protection", "secure", "OSHA", "regulatory", 
        "compliance", "accident", "prevention", "PPE", "equipment", "protocol",
        "procedure", "handling", "material safety", "MSDS", "SDS"
      ]);
      
      // If safety standards still not identified, create more specific bullet points
      if (safetyStandards.length === 0) {
        // Check for common safety certifications and standards
        const safetyCertifications = [];
        
        if (emailContent.match(/OHSAS\s*18001/i) || emailContent.match(/ISO\s*45001/i)) {
          safetyCertifications.push("OHSAS 18001/ISO 45001 occupational health and safety management system certified");
        }
        
        if (emailContent.match(/MSDS|SDS|Safety\s*Data\s*Sheet/i)) {
          safetyCertifications.push("Material Safety Data Sheets (MSDS/SDS) provided with all shipments");
        }
        
        if (emailContent.match(/handling\s*instruction/i)) {
          safetyCertifications.push("Detailed safe handling instructions included with shipments");
        }
        
        if (emailContent.match(/OSHA/i)) {
          safetyCertifications.push("OSHA compliance confirmed for all materials and processes");
        }
        
        if (safetyCertifications.length > 0) {
          return safetyCertifications;
        }
        
        // If nothing specific found, check for general safety statements
        if (emailContent.toLowerCase().includes("safety") || 
            emailContent.toLowerCase().includes("hazard") ||
            emailContent.toLowerCase().includes("protection")) {
          return ["Vendor mentions safety standards but no specific details provided"];
        }
        
        return ["No safety standards information available in email thread"];
      }
      
      // Extract delivery terms with more detail
      let deliveryTerms = "Delivery terms not specified";
      const deliveryPatterns = [
        /delivery\s*terms?\s*(?:is|are|:)\s*([^,.\n]*)/i,
        /(?:FOB|CIF|EXW|DAP|DDP)\s*([^,.\n]*)/i,
        /shipping\s*(?:terms|conditions)\s*(?:is|are|:)?\s*([^,.\n]*)/i
      ];
      
      for (const pattern of deliveryPatterns) {
        const match = emailContent.match(pattern);
        if (match && match[0]) {
          deliveryTerms = match[0].trim();
          break;
        }
      }
      
      // Extract lead time with more detail
      let leadTime = "Lead time not specified";
      const leadTimePatterns = [
        /lead\s*time\s*(?:is|:)\s*([^,.\n]*)/i,
        /delivery\s*(?:in|within)\s*(\d+\s*(?:days|weeks|months))/i,
        /ships\s*(?:in|within)\s*(\d+\s*(?:days|weeks|months))/i,
        /turnaround\s*time\s*(?:is|:)?\s*([^,.\n]*)/i
      ];
      
      for (const pattern of leadTimePatterns) {
        const match = emailContent.match(pattern);
        if (match && match[0]) {
          leadTime = match[0].trim();
          break;
        }
      }
      
      // Extract additional notes with meaningful context
      let additionalNotes = "No additional notes extracted from email thread";
      
      // Check for payment terms
      const paymentMatch = emailContent.match(/payment\s*terms?\s*(?:is|are|:)?\s*([^,.\n]*)/i);
      if (paymentMatch && paymentMatch[1]) {
        additionalNotes = `Payment terms: ${paymentMatch[1].trim()}. `;
      }
      
      // Check for warranty information
      const warrantyMatch = emailContent.match(/warranty\s*(?:is|:)?\s*([^,.\n]*)/i);
      if (warrantyMatch && warrantyMatch[1]) {
        additionalNotes += `Warranty: ${warrantyMatch[1].trim()}. `;
      }
      
      // Check for minimum order quantity
      const moqMatch = emailContent.match(/minimum\s*order\s*(?:quantity|is|:)?\s*([^,.\n]*)/i);
      if (moqMatch && moqMatch[1]) {
        additionalNotes += `Minimum order: ${moqMatch[1].trim()}. `;
      }
      
      // Check for material specifications
      const materialMatch = emailContent.match(/(?:material|alloy)\s*(?:grade|specification|is|:)?\s*([^,.\n]*)/i);
      if (materialMatch && materialMatch[1]) {
        additionalNotes += `Material specification: ${materialMatch[1].trim()}.`;
      }
      
      if (additionalNotes === "No additional notes extracted from email thread" && 
          emailContent.length > 100) {
        additionalNotes = "The email thread contains additional details about the vendor's aluminum rod products. A full review is recommended for complete understanding.";
      }
      
      // Construct and return the enhanced vendor data object
      resolve({
        vendorName,
        contactInfo,
        pricing: {
          unitPrice,
          additionalFees,
          quantityDiscounts,
        },
        standards: {
          esg: esgStandards,
          quality: qualityMetrics,
          safety: safetyStandards,
        },
        logistics: {
          deliveryTerms,
          leadTime,
        },
        additionalNotes,
      });
    }, 2500); // Simulate a 2.5 second processing time
  });
};

// Enhanced helper function to extract bullet points for qualitative data
const extractEnhancedBulletPoints = (content: string, category: string, keywords: string[]): string[] => {
  // This version attempts to extract more detailed, contextual information
  
  // First try to find specific sections that might contain bullet points
  const sectionRegex = new RegExp(`${category}[^:]*:\\s*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i');
  const sectionMatch = content.match(sectionRegex);
  
  if (sectionMatch && sectionMatch[1]) {
    // Found a dedicated section, try to extract bullet points
    const bulletPoints = sectionMatch[1]
      .split(/\n/)
      .map(line => line.trim().replace(/^\s*[-•*]\s*/, ''))
      .filter(line => line.length > 0);
    
    if (bulletPoints.length > 0) {
      return bulletPoints.map(bp => bp.charAt(0).toUpperCase() + bp.slice(1));
    }
  }
  
  // If no dedicated section with bullets, look for relevant sentences
  const sentences: string[] = [];
  
  // Split content into sentences
  const contentSentences = content
    .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .filter(s => s.trim().length > 0);
  
  // Look for sentences containing the category or keywords
  for (const sentence of contentSentences) {
    const lowercaseSentence = sentence.toLowerCase();
    if (
      lowercaseSentence.includes(category.toLowerCase()) || 
      keywords.some(keyword => lowercaseSentence.includes(keyword.toLowerCase()))
    ) {
      // Extract the most relevant part of the sentence
      const cleanSentence = sentence.trim().replace(/^\s*[-•*]\s*/, '');
      
      if (cleanSentence && !sentences.some(s => s.toLowerCase().includes(cleanSentence.toLowerCase()))) {
        sentences.push(cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1));
      }
    }
  }
  
  // Remove duplicates and very similar sentences
  const filteredSentences = sentences.filter((sentence, index) => {
    for (let i = 0; i < index; i++) {
      // Check if current sentence is very similar to a previous one
      const similarity = calculateSimilarity(sentence, sentences[i]);
      if (similarity > 0.7) { // If more than 70% similar, consider it a duplicate
        return false;
      }
    }
    return true;
  });
  
  // If we found relevant sentences, use them
  if (filteredSentences.length > 0) {
    return filteredSentences;
  }
  
  // If we have the category mentioned but no details, try to infer from context
  if (content.toLowerCase().includes(category.toLowerCase())) {
    return [`${category} standards mentioned but details not specified in the email thread`];
  }
  
  // If nothing found, provide a clear indication
  return [`No ${category.toLowerCase()} information available in email thread`];
};

// Helper function to calculate text similarity (simple version)
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) {
      matches++;
    }
  }
  
  // Calculate similarity ratio
  return matches / Math.max(words1.length, words2.length);
};

// Function to handle forwarded emails
export const handleForwardedEmail = async (emailAddress: string): Promise<string> => {
  // In a real implementation, this would check an email inbox for forwarded messages
  // For this demo, we'll return a message about how this would work
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`You can forward emails to ${emailAddress}. When implemented, the application would use POP3/IMAP to check this inbox for new messages, process them using enhanced NLP techniques to extract detailed vendor information, and display comprehensive results here.`);
    }, 1000);
  });
};
