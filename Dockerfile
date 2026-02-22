FROM electronuserland/builder:latest

WORKDIR /work

# Copy package files and install deps first for layer caching
COPY package.json package-lock.json* ./
# Use `npm ci` when a lockfile is present, otherwise fall back to `npm install`
RUN if [ -f package-lock.json ]; then \
			npm ci --production=false --ignore-scripts; \
		else \
			npm install --production=false --ignore-scripts; \
		fi

# Copy rest of the source
COPY . .

# Default command builds the linux distributable
CMD ["npm", "run", "dist"]
