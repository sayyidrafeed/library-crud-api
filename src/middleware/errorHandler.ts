import type { Context } from 'hono';

export function errorHandler(err: Error, c: Context) {
  console.error('Error:', err);
  
  // Business logic errors
  if (err.message.includes('not available') || 
      err.message.includes('not found') ||
      err.message.includes('cannot be')) {
    return c.json({ error: err.message }, 400);
  }
  
  // Not found errors
  if (err.message.includes('not found')) {
    return c.json({ error: err.message }, 404);
  }
  
  // Default server error
  return c.json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  }, 500);
}
