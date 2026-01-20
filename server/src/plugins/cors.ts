import fp from "fastify-plugin";
import fastifyCors, {FastifyCorsOptions} from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  // Allow the React dev server to call the API (including PATCH for bonus model selector).
  fastify.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  })
})
