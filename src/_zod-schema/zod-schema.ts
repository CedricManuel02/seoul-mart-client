import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/_constant/constant";
import { z } from "zod";
import { CancelledOrderReason } from "@/_types/enum";

// Login Form Schema
export const formLoginSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const formForgotPasswordSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
});

export const formProfileSchema = z.object({
  user_name: z.string().min(1, {message: "Name is required"}),
  user_email: z.string().min(1, {message: "Email is required"}),
  user_phone: z
  .string()
  .regex(/^(\+?63|0)9\d{9}$/, { message: "Invalid PH mobile number format" }),
  user_profile:  z
  .instanceof(File)
  .optional()
  .nullable()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, { message: "File size must be less than 50KB" })
  .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Invalid file type" }),
})

export const formResetPasswordSchema = z
  .object({
    new_password: z.string().min(8, { message: "Password must be 8 characters long" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must be 8 characters long" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password don't match",
    path: ["confirm_password"],
  });
  export const formResetProfilePasswordSchema = z
  .object({
    user_password: z.string().min(1, {message: "Password is required"}),
    new_password: z.string().min(8, { message: "Password must be 8 characters long" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must be 8 characters long" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password don't match",
    path: ["confirm_password"],
  });



// REGISTER ZOD SCHEMA
export const formRegisterSchema = z
  .object({
    user_name: z.string().min(1, { message: "Name is required" }),
    user_email: z.string().email().min(1, { message: "Email is required" }),
    user_password: z.string().min(8, { message: "Password must be 8 characters long" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must be 8 characters long" }),
  })
  .refine((data) => data.user_password === data.confirm_password, {
    message: "Password don't match",
    path: ["confirm_password"],
  });
// CREATE CATEGORY ZOD SCHEMA
export const formCreateCategorySchema = z.object({
  category_name: z.string().min(1, { message: "Category Name is required" }),
  category_image: z
    .instanceof(File, { message: "Image is required" })
    .or(z.null())
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, { message: "File size must be less than 50KB" })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Invalid file type" }),
});

export const formUpdateCategorySchema = z.object({
  category_id: z.string().min(1, { message: "Category ID is required" }),
  category_name: z.string().min(1, { message: "Category Name is required" }),
  category_image: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, { message: "File size must be less than 50KB" })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Invalid file type" }),
});
// CREATE PRODUCT ZOD SCHEMA
export const formsCreateProduct = z.object({
  product_upc: z.string().min(1, { message: "Product UPC is required" }),
  product_name: z.string().min(1, { message: "Product name is required" }),
  product_category: z.string().min(1, { message: "Category is required" }),
  product_description: z.string().min(1, { message: "Description is required" }),
});

export const createVariantFormSchema = z.object({
  variant_name: z.string().min(1, { message: "Variant name is required" }),
  variant_price: z.string().min(1, { message: "Variant price is required" }),
  variant_stocks: z.string().min(1, { message: "Variant stocks must be 1 or greater" }),
  variant_image: z
    .instanceof(File, { message: "Variant image is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image file is too large",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid image type",
    }),
  variant_discount: z.string(),
  variant_discount_end_date: z.union([z.date(), z.null()]).refine((date) => !date || date >= new Date(), {
    message: "Invalid date",
  }),
});

export const formDeliverySchema = z.object({
  delivery_company: z.string().min(1, { message: "Delivery company is required" }),
  tracking_number: z.string().min(1, { message: "Tracking number is required" }),
  delivery_rider_name: z.string().min(1, { message: "Rider name is required" }),
  delivery_rider_phone: z
    .string()
    .min(1, { message: "Rider contact is required" })
    .regex(/^(\+?63|0)9\d{9}$/, { message: "Invalid PH mobile number format" }),
  delivery_plate_number: z.string().min(1, { message: "Plate number is required" }),
  item_image: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE), { message: "Each file must be less than 50KB" })
    .refine((files) => !files || files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), { message: "Invalid file type" }),
});

export const formCancelledOrderSchema = z.object({
  cancelled_reason: z.nativeEnum(CancelledOrderReason),
});

export const formRateOrderSchema = z.object({
  order_rating: z.number(),
  variant_id: z.string().min(1, { message: "Item to rate is required" }),
  order_rating_text: z.string().nullable().optional(),
  order_rating_image: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE), { message: "Each file must be less than 50KB" })
    .refine((files) => !files || files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), { message: "Invalid file type" }),
});
