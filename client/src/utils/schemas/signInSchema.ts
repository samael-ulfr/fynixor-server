import Joi from "joi";

  // Joi schema
  export const signInSchema = Joi.object({
    username: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please enter a valid email address.',
        'string.empty': 'Email is required.',
      }),
    password: Joi.string()
      .min(6)
      .pattern(/(?=.*[a-z])/)
      .pattern(/(?=.*[A-Z])/)
      .pattern(/(?=.*\d)/)
      .pattern(/(?=.*[@$!%*?&])/)
      .required()
      .messages({
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 6 characters.',
        'string.pattern.base':
          'Password must include uppercase, lowercase, number, and special character.',
      }),
  });