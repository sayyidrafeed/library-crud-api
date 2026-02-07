import { Hono } from 'hono';
import { DashboardController } from '../controllers/DashboardController';

export function createDashboardRoutes(controller: DashboardController): Hono {
  const routes = new Hono();
  
  routes.get('/stats', (c) => controller.getStats(c));
  routes.get('/activity', (c) => controller.getRecentActivity(c));
  
  return routes;
}
