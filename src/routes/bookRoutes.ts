import { Hono } from 'hono';
import { BookController } from '../controllers/BookController';
import { validateCreateBook, validateUpdateBook } from '../middleware/validation';

export function createBookRoutes(controller: BookController): Hono {
  const routes = new Hono();
  
  routes.get('/', (c) => controller.getAll(c));
  routes.get('/search', (c) => controller.search(c));
  routes.get('/:id', (c) => controller.getById(c));
  routes.post('/', validateCreateBook, (c) => controller.create(c));
  routes.patch('/:id', validateUpdateBook, (c) => controller.update(c));
  routes.delete('/:id', (c) => controller.delete(c));
  
  return routes;
}
