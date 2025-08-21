import Joi from "joi";
import { asyncHandler } from "./../modules/user/user.services.js";
import { json } from "express";
import { join } from "node:path";





export const signupSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': `"name" should be a string`,
      'string.empty': `"name" cannot be empty`,
      'string.min': `"name" should be at least {#limit} characters`,
      'string.max': `"name" should not exceed {#limit} characters`,
      'any.required': `"name" is required`
    }),
  age: Joi.string()

    .required()
    ,
  phone: Joi.string()

    .required()
    ,
  role: Joi.string()

    .required()
    ,

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': `"email" should be a string`,
      'string.empty': `"email" cannot be empty`,
      'string.email': `"email" must be a valid email address`,
      'any.required': `"email" is required`
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.base': `"password" should be a string`,
      'string.empty': `"password" cannot be empty`,
      'string.min': `"password" must be at least {#limit} characters`,
      'string.max': `"password" must be less than {#limit} characters`,
      'any.required': `"password" is required`
    })
});
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': `"email" should be a string`,
      'string.empty': `"email" cannot be empty`,
      'string.email': `"email" must be a valid email address`,
      'any.required': `"email" is required`
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.base': `"password" should be a string`,
      'string.empty': `"password" cannot be empty`,
      'string.min': `"password" must be at least {#limit} characters`,
      'string.max': `"password" must be less than {#limit} characters`,
      'any.required': `"password" is required`
    })
});

export const profileSchema = Joi.object({
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
  destination: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().positive().required(),
  fieldname: Joi.string().required(),
  // Include this only if you're adding it manually in your multer config or middleware
  finalPath: Joi.string().optional()
}); // ✅ allow any extra properties from multer


export const fileSchema = Joi.array().items(
  Joi.object({
    originalname: Joi.string().required(), // ⚠️ Remove `.valid("image")` unless you're literally uploading a file named "image"
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    fieldname: Joi.string().required(),
    finalPath: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().positive().required(),

  })
).min(1); // Require at least 1 file




// export const validatee =(schema)=>{ 
//   return asyncHandler(
//     async (req,res,next )=>{
       
//   const { error, value } = schema.validate(req.body);

//   if (error) {
//     // Collect all validation error messages
//     const errors = error.details.map(detail => detail.message);
//     return res.json({errors});
//   }

//   return next();


//      }

//     )
// } 
export const validatee = (schema) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "No data uploaded" });
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ errors });
    }

    req.validatedBody = value;
    next();
  });
};


