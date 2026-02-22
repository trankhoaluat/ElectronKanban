FROM electronuserland/builder:latest

WORKDIR /work

# Copy package files and install deps first for layer caching
COPY package.json package-lock.json* ./
RUN npm ci --production=false --ignore-scripts

# Copy rest of the source
COPY . .

# Default command builds the linux distributable
CMD ["npm", "run", "dist"]
