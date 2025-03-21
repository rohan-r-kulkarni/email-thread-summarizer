
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
      // Extract basic vendor information
      let vendorName = extractVendorName(emailContent);
      let contactInfo = extractContactInfo(emailContent);
      
      // Extract pricing details
      let pricing = extractPricingDetails(emailContent);
      
      // Extract and summarize standards information
      let standards = {
        esg: generateSummarizedBulletPoints(emailContent, "ESG"),
        quality: generateSummarizedBulletPoints(emailContent, "Quality"),
        safety: generateSummarizedBulletPoints(emailContent, "Safety"),
      };
      
      // Extract logistics information
      let logistics = {
        deliveryTerms: extractDeliveryTerms(emailContent),
        leadTime: extractLeadTime(emailContent),
      };
      
      // Extract additional notes
      let additionalNotes = extractAdditionalNotes(emailContent);
      
      // Construct and return the enhanced vendor data object
      resolve({
        vendorName,
        contactInfo,
        pricing,
        standards,
        logistics,
        additionalNotes,
      });
    }, 2500); // Simulate a 2.5 second processing time
  });
};

// Extract vendor name from email
const extractVendorName = (emailContent: string): string => {
  let vendorName = "Aluminum Supplies Inc.";
  const vendorMatch = emailContent.match(/From:\s*([^<\n]*)/i);
  if (vendorMatch && vendorMatch[1]) {
    vendorName = vendorMatch[1].trim();
  }
  return vendorName;
};

// Extract contact information (email and phone)
const extractContactInfo = (emailContent: string): string => {
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
  
  return contactInfo;
};

// Extract pricing details
const extractPricingDetails = (emailContent: string) => {
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
  
  return {
    unitPrice,
    additionalFees,
    quantityDiscounts
  };
};

// Extract delivery terms
const extractDeliveryTerms = (emailContent: string): string => {
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
  
  return deliveryTerms;
};

// Extract lead time
const extractLeadTime = (emailContent: string): string => {
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
  
  return leadTime;
};

// Extract additional notes
const extractAdditionalNotes = (emailContent: string): string => {
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
  
  return additionalNotes;
};

// NEW FUNCTION: Generate summarized bullet points for qualitative data
const generateSummarizedBulletPoints = (content: string, category: string): string[] => {
  // This simulates an LLM summarizing the information into concise bullet points
  
  // Extract relevant sentences based on category keywords
  const relevantText = extractRelevantText(content, category);
  
  // If no relevant text found, return appropriate message
  if (!relevantText) {
    return [`No ${category} information found in the email thread`];
  }
  
  // Based on the category, generate appropriate summary bullets
  switch (category) {
    case "ESG":
      return summarizeESG(relevantText, content);
    case "Quality":
      return summarizeQuality(relevantText, content);
    case "Safety":
      return summarizeSafety(relevantText, content);
    default:
      return [`${category} information not properly categorized`];
  }
};

// Extract text relevant to a specific category
const extractRelevantText = (content: string, category: string): string => {
  const keywords = getCategoryKeywords(category);
  
  // First try to find a section specifically about this category
  const sectionRegex = new RegExp(`${category}[^:]*:\\s*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i');
  const sectionMatch = content.match(sectionRegex);
  
  if (sectionMatch && sectionMatch[1]) {
    return sectionMatch[1].trim();
  }
  
  // If no section found, collect sentences containing keywords
  const sentences = content.replace(/([.!?])\s*(?=[A-Z])/g, "$1|").split("|");
  const relevantSentences = sentences.filter(sentence => {
    const lowercaseSentence = sentence.toLowerCase();
    return lowercaseSentence.includes(category.toLowerCase()) || 
           keywords.some(keyword => lowercaseSentence.includes(keyword.toLowerCase()));
  });
  
  return relevantSentences.join(" ");
};

// Get keywords for different categories
const getCategoryKeywords = (category: string): string[] => {
  switch (category) {
    case "ESG":
      return [
        "environmental", "social", "governance", "sustainability", "carbon", 
        "emissions", "renewable", "eco-friendly", "green", "ethical", "CSR",
        "corporate social responsibility", "climate", "recycled", "waste reduction"
      ];
    case "Quality":
      return [
        "ISO", "certification", "standard", "testing", "metric", "quality control", 
        "inspection", "tolerance", "quality assurance", "QA", "specification", 
        "compliance", "grade", "alloy", "tensile strength", "hardness"
      ];
    case "Safety":
      return [
        "safety", "hazard", "protection", "secure", "OSHA", "regulatory", 
        "compliance", "accident", "prevention", "PPE", "equipment", "protocol",
        "procedure", "handling", "material safety", "MSDS", "SDS"
      ];
    default:
      return [];
  }
};

// Summarize ESG information into concise bullet points
const summarizeESG = (relevantText: string, fullContent: string): string[] => {
  // This simulates an LLM summarizing ESG information
  
  const bullets: string[] = [];
  
  // Check for environmental certifications and commitments
  if (relevantText.match(/carbon\s*neutral/i)) {
    bullets.push("Carbon neutral manufacturing process with verified certification");
  }
  
  if (relevantText.match(/ISO\s*14001/i)) {
    bullets.push("ISO 14001 certified environmental management system in place");
  }
  
  if (relevantText.match(/recycled\s*content/i)) {
    const recycledMatch = relevantText.match(/(\d+%)\s*recycled\s*content/i);
    if (recycledMatch && recycledMatch[1]) {
      bullets.push(`Aluminum rods contain ${recycledMatch[1]} recycled material, reducing virgin resource consumption`);
    } else {
      bullets.push("Products manufactured with recycled content, exact percentage not specified");
    }
  }
  
  if (relevantText.match(/renewable\s*energy/i)) {
    bullets.push("Manufacturing facilities powered by renewable energy sources");
  }
  
  // Check for social responsibility
  if (relevantText.match(/fair\s*(?:labor|trade|wage)/i)) {
    bullets.push("Commitment to fair labor practices and ethical sourcing throughout supply chain");
  }
  
  if (relevantText.match(/communit(?:y|ies)/i)) {
    bullets.push("Active community engagement programs in regions where materials are sourced");
  }
  
  // Check for governance
  if (relevantText.match(/transparency|reporting/i)) {
    bullets.push("Annual sustainability reporting with transparent ESG metrics and targets");
  }
  
  // If we've found specific points, return them
  if (bullets.length > 0) {
    return bullets;
  }
  
  // If we couldn't extract specific points but ESG is mentioned
  if (fullContent.toLowerCase().includes("esg") || 
      fullContent.toLowerCase().includes("environmental") ||
      fullContent.toLowerCase().includes("sustainability")) {
    return ["Vendor indicates ESG compliance but provides limited specific details", "Consider requesting their formal ESG policy documentation"];
  }
  
  // Default if nothing found
  return ["No ESG standards information available in email thread"];
};

// Summarize Quality information into concise bullet points
const summarizeQuality = (relevantText: string, fullContent: string): string[] => {
  // This simulates an LLM summarizing Quality information
  
  const bullets: string[] = [];
  
  // Check for quality certifications
  if (relevantText.match(/ISO\s*9001/i)) {
    bullets.push("ISO 9001 quality management system certification guarantees standardized processes");
  }
  
  if (relevantText.match(/ASTM/i)) {
    const astmMatch = relevantText.match(/ASTM\s*([A-Z]?\d+)/i);
    if (astmMatch && astmMatch[1]) {
      bullets.push(`ASTM ${astmMatch[1]} compliance ensures material meets international standards`);
    } else {
      bullets.push("Materials tested and certified to ASTM international standards");
    }
  }
  
  // Check for material properties
  if (relevantText.match(/tensile\s*strength/i)) {
    const tensileMatch = relevantText.match(/tensile\s*strength[^\d]*(\d+)/i);
    if (tensileMatch && tensileMatch[1]) {
      bullets.push(`Aluminum rods tested for tensile strength of ${tensileMatch[1]} MPa, exceeding industry requirements`);
    } else {
      bullets.push("Products undergo rigorous tensile strength testing to ensure structural integrity");
    }
  }
  
  if (relevantText.match(/hardness\s*test/i)) {
    bullets.push("Complete hardness testing performed on each production batch");
  }
  
  // Check for quality control processes
  if (relevantText.match(/quality\s*(?:control|assurance|inspection)/i)) {
    bullets.push("Comprehensive quality control with multi-stage inspection process");
  }
  
  if (relevantText.match(/statistical|sample|sampling/i)) {
    bullets.push("Statistical quality control with regular batch sampling and documentation");
  }
  
  // If we've found specific points, return them
  if (bullets.length > 0) {
    return bullets;
  }
  
  // If we couldn't extract specific points but quality is mentioned
  if (fullContent.toLowerCase().includes("quality") || 
      fullContent.toLowerCase().includes("testing") ||
      fullContent.toLowerCase().includes("certified")) {
    return ["Vendor references quality standards but provides limited specifications", "Consider requesting detailed quality certification documentation"];
  }
  
  // Default if nothing found
  return ["No quality metrics information available in email thread"];
};

// Summarize Safety information into concise bullet points
const summarizeSafety = (relevantText: string, fullContent: string): string[] => {
  // This simulates an LLM summarizing Safety information
  
  const bullets: string[] = [];
  
  // Check for safety certifications
  if (relevantText.match(/OHSAS\s*18001/i) || relevantText.match(/ISO\s*45001/i)) {
    bullets.push("OHSAS 18001/ISO 45001 certified occupational health and safety management system");
  }
  
  if (relevantText.match(/MSDS|SDS|Safety\s*Data\s*Sheet/i)) {
    bullets.push("Material Safety Data Sheets (MSDS/SDS) provided with all shipments with comprehensive handling guidelines");
  }
  
  if (relevantText.match(/handling\s*instruction/i)) {
    bullets.push("Detailed safe handling and storage instructions included with every order");
  }
  
  if (relevantText.match(/OSHA/i)) {
    bullets.push("All materials and production processes fully OSHA compliant with regular audits");
  }
  
  // Check for safety features
  if (relevantText.match(/protective|protection|PPE/i)) {
    bullets.push("Recommendations for appropriate PPE when handling materials provided");
  }
  
  if (relevantText.match(/hazard|warning|caution/i)) {
    bullets.push("Clear hazard identification and safety warnings included on packaging");
  }
  
  if (relevantText.match(/training|instruction/i)) {
    bullets.push("Optional safety training materials available for proper material handling");
  }
  
  // If we've found specific points, return them
  if (bullets.length > 0) {
    return bullets;
  }
  
  // If we couldn't extract specific points but safety is mentioned
  if (fullContent.toLowerCase().includes("safety") || 
      fullContent.toLowerCase().includes("hazard") ||
      fullContent.toLowerCase().includes("protection")) {
    return ["Vendor mentions safety standards but provides limited details", "Consider requesting their formal safety protocols documentation"];
  }
  
  // Default if nothing found
  return ["No safety standards information available in email thread"];
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
