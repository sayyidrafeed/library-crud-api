import { Hono } from 'hono';
import { SearchController } from '../controllers/SearchController';

export function createSearchRoutes(controller: SearchController): Hono {
  const routes = new Hono();
  
  routes.get('/', (c) => controller.searchBooks(c));
  routes.get('/genre/:genre', (c) => controller.searchByGenre(c));
  
  return routes;
}
