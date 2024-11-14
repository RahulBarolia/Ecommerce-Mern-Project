import joi from "joi";

export const validateRegistration = (req, res, next) => {
  try {
    const schema = joi.object({
      name: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const validateLogin = (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const validateEmail = (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
