import { z } from "zod";

export const createAgentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email"),
    phoneNumber: z.string().min(10).max(15), 
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    otp: z
      .string()
      .nonempty("OTP is required")
      .length(6, "OTP must be 6 digits"),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Password is required"),
  }),
});

export const getAgentByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
})

export const updateAgentSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6).optional(),
  }),
})

export const deleteAgentSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
  }),
})



// Forgot Password Schema (older syntax)
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please provide a valid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z
      .string()
      .nonempty("Reset token is required")
      .min(10, "Invalid token format"),
  }),
  body: z
    .object({
      newPassword: z
        .string()
        .nonempty("New password is required")
        .min(6, "Password must be at least 6 characters long"),
      
    })
   
});
