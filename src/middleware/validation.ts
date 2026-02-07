import { z } from 'zod';
import type { Context, Next } from 'hono';

const createBookSchema = z.object({
  isbn: z.string().regex(/^\d{13}$/, 'ISBN must be 13 digits'),
  title: z.string().min(2).max(200),
  author: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  genre: z.string(),
  publishedYear: z.number().int().min(1000).max(2100).optional()
});

const updateBookSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  author: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  genre: z.string().optional(),
  publishedYear: z.number().int().min(1000).max(2100).optional()
});

const createMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  address: z.string().optional()
});

const updateMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

const borrowSchema = z.object({
  bookId: z.string().uuid(),
  memberId: z.string().uuid()
});

export const validateCreateBook = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const result = createBookSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, 400);
    }
    
    c.set('validatedBody', result.data);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
};

export const validateUpdateBook = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const result = updateBookSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, 400);
    }
    
    c.set('validatedBody', result.data);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
};

export const validateCreateMember = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const result = createMemberSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, 400);
    }
    
    c.set('validatedBody', result.data);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
};

export const validateUpdateMember = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const result = updateMemberSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, 400);
    }
    
    c.set('validatedBody', result.data);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
};

export const validateBorrowRequest = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const result = borrowSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, 400);
    }
    
    c.set('validatedBody', result.data);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
};
