import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 configuration file.
// We use DIRECT_URL (pooling OFF) for schema migrations and CLI commands
// to avoid transaction/session pool conflicts with PgBouncer.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
