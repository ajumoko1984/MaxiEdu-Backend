# Stage 1: Base image
FROM node:20-slim AS base
WORKDIR /usr/src/hmo-project
COPY package*.json ./

# Stage 2: Install dependencies
FROM base AS deps
RUN npm install --legacy-peer-deps --include=optional

# Stage 3: Build stage
FROM deps AS build
COPY . .
RUN npm run build

# -----------------------------
# Development stage
# -----------------------------
# Stage 4: Development stage (for local dev, not used in prod)
FROM deps AS development
COPY . .
EXPOSE 8004
CMD ["npm", "run", "dev"]

# -----------------------------
# Production stage
# -----------------------------
# Stage 5: Production stage
FROM node:20-slim AS production
WORKDIR /usr/src/hmo-project

# Only copy built output + node_modules
COPY --from=deps /usr/src/hmo-project/node_modules ./node_modules
COPY --from=build /usr/src/hmo-project/build ./build
COPY package*.json ./

EXPOSE 8002
CMD ["npm", "start"]