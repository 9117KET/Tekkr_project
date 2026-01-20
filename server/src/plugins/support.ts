import fp from 'fastify-plugin'
import {testUsers} from "../domain/test-users";

export default fp(async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    // Skip authentication for root route and chat routes (per challenge requirements: single user, no auth needed)
    const publicRoutes = ['/', '/api/chats'];
    const isPublicRoute = publicRoutes.some(route => request.url.startsWith(route));
    
    if (isPublicRoute) {
      // For public routes, set a default userId (challenge assumes single user)
      request.userId = 'richard' as keyof typeof testUsers;
      return;
    }
    
    // For existing /user route, keep the original authentication logic
    const userId = request.headers.authorization;
    if (!userId || !(userId in testUsers)) {
      reply.status(401).send();
      return;
    }
    request.userId = userId as keyof typeof testUsers;
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    userId: keyof typeof testUsers;
  }
}
