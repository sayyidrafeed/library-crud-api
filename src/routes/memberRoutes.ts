import { Hono } from 'hono';
import { MemberController } from '../controllers/MemberController';
import { validateCreateMember, validateUpdateMember } from '../middleware/validation';

export function createMemberRoutes(controller: MemberController): Hono {
  const routes = new Hono();
  
  routes.get('/', (c) => controller.getAll(c));
  routes.get('/:id', (c) => controller.getById(c));
  routes.post('/', validateCreateMember, (c) => controller.create(c));
  routes.patch('/:id', validateUpdateMember, (c) => controller.update(c));
  routes.delete('/:id', (c) => controller.delete(c));
  routes.post('/:id/suspend', (c) => controller.suspend(c));
  routes.post('/:id/activate', (c) => controller.activate(c));
  
  return routes;
}
