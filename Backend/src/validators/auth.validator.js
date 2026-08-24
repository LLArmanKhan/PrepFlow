const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/`~]/,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
};


export const validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword, currentYear, targetRole } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!REGEX.EMAIL.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  } else {
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    } else if (!REGEX.UPPERCASE.test(password)) {
      errors.password = 'Password must contain at least 1 uppercase letter.';
    } else if (!REGEX.SPECIAL_CHAR.test(password)) {
      errors.password = 'Password must contain at least 1 special character.';
    }
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!currentYear || typeof currentYear !== 'string' || !currentYear.trim()) {
    errors.currentYear = 'Please select your current college year.';
  }

  if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
    errors.targetRole = 'Target role is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateLogin = (req, res, next) => {
  const { identifier, email, username, password } = req.body;
  const id = identifier || email || username;

  const errors = {};

  if (!id || typeof id !== 'string' || !id.trim()) {
    errors.identifier = 'Username or email address is required.';
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body.identifier = id.trim();
  next();
};

export const validateVerify = (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required"
    });
  }
  next();
};