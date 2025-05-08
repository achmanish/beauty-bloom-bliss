
/**
 * Validates email belongs to approved providers
 * @param email Email address to validate
 * @returns Boolean indicating if email is from an allowed provider
 */
export const isApprovedEmailProvider = (email: string): boolean => {
  // Convert email to lowercase for case-insensitive comparison
  const lowerCaseEmail = email.toLowerCase();
  
  // Check if email ends with one of the approved domains
  const approvedDomains = [
    "@gmail.com",
    "@yahoo.com",
    "@yahoo.co.in",
    "@yahoo.co.uk",
    "@outlook.com",
    "@hotmail.com",
    "@live.com",
    "@msn.com",
    "@icloud.com",
    "@me.com",
    "@mac.com"
  ];
  
  return approvedDomains.some(domain => lowerCaseEmail.endsWith(domain));
};

/**
 * Get a list of allowed email providers as a readable string
 * @returns String listing all allowed email providers
 */
export const getAllowedEmailProviders = (): string => {
  return "Gmail, Yahoo, Microsoft (Outlook, Hotmail, Live, MSN), or Apple (iCloud, Me, Mac)";
};
