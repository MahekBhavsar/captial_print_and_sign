import { z } from "zod";

// ==========================================
// 1. User & Admin Schema
// ==========================================
export const UserSchema = z.object({
  id: z.string().optional(),
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  role: z.enum(["admin", "user"]),
  createdAt: z.date(),
  lastLoginAt: z.date().optional(),
});
export type UserDocument = z.infer<typeof UserSchema>;

// ==========================================
// 2. Quote Request Schema
// ==========================================
export const QuoteSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  companyName: z.string().optional(),
  serviceRequested: z.array(z.string()).min(1, "Select at least one service"),
  description: z.string().optional(),
  artworkUrls: z.array(z.string()).optional(), // URLs from Firebase Storage
  status: z.enum(["Pending", "Reviewed", "In Progress", "Completed", "Cancelled"]).default("Pending"),
  createdAt: z.date(),
  updatedAt: z.date(),
  quoteData: z.any().optional(),
});
export type QuoteDocument = z.infer<typeof QuoteSchema>;

// ==========================================
// 3. Portfolio Schema
// ==========================================
export const PortfolioItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string(),
  clientName: z.string().optional(),
  category: z.enum([
    "Vehicle Wraps", 
    "Shopfront Signs", 
    "Business Printing", 
    "Corporate Branding", 
    "Construction", 
    "Events"
  ]),
  imageUrl: z.string().url(),
  beforeImageUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  createdAt: z.date(),
});
export type PortfolioDocument = z.infer<typeof PortfolioItemSchema>;

// ==========================================
// 4. Testimonial Schema
// ==========================================
export const TestimonialSchema = z.object({
  id: z.string().optional(),
  clientName: z.string(),
  companyName: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  createdAt: z.date(),
});
export type TestimonialDocument = z.infer<typeof TestimonialSchema>;

// ==========================================
// 5. Blog Post Schema
// ==========================================
export const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  slug: z.string(), // For SEO friendly URLs
  content: z.string(), // HTML or Markdown
  excerpt: z.string(),
  coverImageUrl: z.string().url().optional(),
  authorId: z.string(),
  tags: z.array(z.string()),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type BlogPostDocument = z.infer<typeof BlogPostSchema>;

// ==========================================
// 6. Settings Schema
// ==========================================
export const SettingsSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().default("Capital Print & Sign"),
  phone: z.string().default("0430 123 456"),
  email: z.string().default("sales@capitalprintandsign.com.au"),
  address: z.string().default("21 Huddart Court, Mitchell ACT 2911"),
  whatsapp: z.string().default("61430123456"),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  notificationEmail: z.string().email().optional(),
  maintenanceMode: z.boolean().default(false),
  updatedAt: z.date().optional(),
});
export type SettingsDocument = z.infer<typeof SettingsSchema>;

// ==========================================
// 7. Service Schema
// ==========================================
export const ServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  desc: z.string(), // Short description
  longContent: z.string().optional(), // For popup
  iconName: z.string(), // store lucide icon name as string
  color: z.string(),
  importantWords: z.array(z.string()).optional(), // Words to highlight in description/content
  order: z.number().default(0),
  createdAt: z.date().optional(),
});
export type ServiceDocument = z.infer<typeof ServiceSchema>;
