export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  UPPERCASE: /[A-Z]/,
  
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
  
  PASSWORD_ALLOWED_CHARS: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/,
  
  GFG_HANDLE: /^[a-zA-Z0-9_-]+$/,
};

export const validateName = (name) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  if (trimmed.length > 50) {
    return 'Name cannot exceed 50 characters.';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email address is required.';
  }
  const trimmed = email.trim();
  if (!REGEX.EMAIL.test(trimmed)) {
    return 'Please enter a valid email address (e.g. name@college.edu).';
  }
  return null;
};

export const validateIdentifier = (identifier) => {
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    return 'Username or email address is required.';
  }
  const trimmed = identifier.trim();
  if (trimmed.length < 2) {
    return 'Must be at least 2 characters long.';
  }
  if (trimmed.includes('@')) {
    if (!REGEX.EMAIL.test(trimmed)) {
      return 'Please enter a valid email address (e.g. name@college.edu).';
    }
  } else {
    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
      return 'Username can only contain letters, numbers, underscores, dots, or hyphens.';
    }
  }
  return null;
};

export const validateRegisterPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  if (!REGEX.UPPERCASE.test(password)) {
    return 'Password must contain at least 1 uppercase letter (A-Z).';
  }
  if (!REGEX.SPECIAL_CHAR.test(password)) {
    return 'Password must contain at least 1 special character (e.g. !@#$%^&*).';
  }
  if (!REGEX.PASSWORD_ALLOWED_CHARS.test(password)) {
    return 'Password contains invalid characters. Only letters, numbers, and special characters are allowed.';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validateCurrentYear = (currentYear) => {
  if (currentYear === undefined || currentYear === null || String(currentYear).trim() === '') {
    return 'Current college year is required.';
  }
  const yearNum = Number(currentYear);
  if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 6) {
    return 'Please select a valid academic year (1st to 4th/6th year).';
  }
  return null;
};

export const validateTargetRole = (targetRole) => {
  if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
    return 'Target role is required (e.g. Software Engineer, Backend Dev).';
  }
  return null;
};

export const validateCollege = (college) => {
  if (!college || typeof college !== 'string' || !college.trim()) {
    return 'College / University name is required.';
  }
  return null;
};

export const validateGfgHandle = (gfgHandle) => {
  if (!gfgHandle || typeof gfgHandle !== 'string' || !gfgHandle.trim()) {
    return null; // Optional
  }
  const trimmed = gfgHandle.trim();
  if (trimmed.length > 50) {
    return 'GeeksforGeeks username cannot exceed 50 characters.';
  }
  if (!REGEX.GFG_HANDLE.test(trimmed)) {
    return 'GeeksforGeeks username can only contain letters, numbers, underscores, and hyphens.';
  }
  return null;
};

export const validateLoginPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
};

export const validateTopic = (topic) => {
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return 'Topic name is required (e.g. Deadlock Detection, B-Trees).';
  }
  const trimmed = topic.trim();
  if (trimmed.length < 2) {
    return 'Topic name must be at least 2 characters long.';
  }
  return null;
};


export const validateSubject = (subject) => {
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    return 'Subject is required (e.g. DBMS, OS, CN, DSA).';
  }
  return null;
};

/**
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  const nameError = validateName(formData.name || formData.username);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateRegisterPassword(formData.password);
  if (passwordError) errors.password = passwordError;

  if (formData.confirmPassword !== undefined) {
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;
  }

  const yearError = validateCurrentYear(formData.currentYear);
  if (yearError) errors.currentYear = yearError;

  const roleError = validateTargetRole(formData.targetRole);
  if (roleError) errors.targetRole = roleError;

  const collegeError = validateCollege(formData.college || formData.collegeName);
  if (collegeError) errors.college = collegeError;

  const gfgError = validateGfgHandle(formData.gfgHandle || formData.gfgName);
  if (gfgError) errors.gfgHandle = gfgError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const idVal = formData.identifier ?? formData.email ?? formData.username;
  const idError = validateIdentifier(idVal);
  if (idError) {
    errors.identifier = idError;
    errors.email = idError; // support both keys for backwards compatibility
  }

  const passwordError = validateLoginPassword(formData.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateProgressForm = (formData) => {
  const errors = {};

  const subjectError = validateSubject(formData.subject);
  if (subjectError) errors.subject = subjectError;

  const topicError = validateTopic(formData.topic || formData.topicName);
  if (topicError) errors.topic = topicError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateName,
  validateEmail,
  validateIdentifier,
  validateRegisterPassword,
  validateConfirmPassword,
  validateCurrentYear,
  validateTargetRole,
  validateCollege,
  validateGfgHandle,
  validateLoginPassword,
  validateTopic,
  validateSubject,
  validateRegisterForm,
  validateLoginForm,
  validateProgressForm,
};
