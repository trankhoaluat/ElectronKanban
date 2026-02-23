# Electron Kanban Pomodoro

A modern Kanban board with Pomodoro timer, built with vanilla JavaScript and Electron.

## Features

✅ **Kanban Board**: Organize tasks across TODO → DOING → DONE columns  
✅ **Drag & Drop**: Move tasks between columns seamlessly  
✅ **Pomodoro Timer**: 25-minute focus timer (configurable per task)  
✅ **One Task at a Time**: Enforce single task in DOING; timer auto-starts  
✅ **Project Management**: Multiple projects with completed task tracking  
✅ **Data Export/Import**: Backup and restore board state as JSON  
✅ **Dark Theme**: Eye-friendly dark UI  
✅ **Desktop App**: Electron wrapper for native app experience  
✅ **CI/CD**: Docker-based GitHub Actions for automated builds  

## Quick Start

### Prerequisites

- **Node.js** 16+ (download from [nodejs.org](https://nodejs.org) or install via:
  ```bash
  # macOS
  brew install node

  # Or use nvm
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
  nvm install --lts
  ```

### Development (Browser)

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd ElectronKanban
   ```

2. **Open in browser**:
   - Double-click `index.html` or open it with your browser
   - Or use a local server:
     ```bash
     npx http-server
     ```

### Electron App (Desktop)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the app**:
   ```bash
   npm start
   ```

3. **Package for distribution** (macOS):
   ```bash
   npm install --save-dev electron-packager
   npm run package:mac
   ```
   Build artifacts appear in `dist/`.

### Docker Build (Linux AppImage)

1. **Build locally with Docker**:
   ```bash
   docker build -t kanban-builder .
   docker run --rm -v "$PWD":/work -w /work kanban-builder
   ```
   Output: `dist/*.AppImage`

2. **CI/CD** (GitHub Actions):
   - Push to main branch → GitHub Actions automatically builds and uploads artifact
   - Download from: Actions → Latest Run → Artifacts

## Usage

### Basic Workflow

1. **Create Project**: Click "Create New Project" in the PROJECT column
2. **Add Tasks**: Select a project, then click "Create New Task" in the TODO column
3. **Move Tasks**: Drag tasks between columns or use the modal status dropdown
4. **Start Timer**: Move a task to DOING → timer auto-starts (25 min default)
5. **Track Progress**: See completed count in the DONE header (e.g., "3/10")

### Export/Import

- Click **☰ menu** → **Export Data** to download board as JSON
- Click **☰ menu** → **Import Data** to restore from a previous export
- Useful for backups or sharing boards

### Pomodoro Settings

Edit task properties (click task card) to customize:
- **Work**: Focus session duration (default: 25 min)
- **Break**: Rest duration (default: 5 min)
- **Sessions**: Number of cycles (default: 4)

## Project Structure

```
.
├── index.html           # Main UI
├── main.js              # Electron entry point
├── package.json         # Node dependencies & scripts
├── Dockerfile           # Docker build config
├── .github/
│   └── workflows/
│       └── docker-build.yml  # GitHub Actions CI
├── css/
│   ├── base.css        # Topbar & theme
│   ├── board.css       # Kanban columns & cards
│   └── modal.css       # Edit modal styling
└── js/
    ├── app.js          # Main app controller
    ├── storage.js      # localStorage wrapper
    ├── projects.js     # Project CRUD
    ├── tasks.js        # Task CRUD & drag-drop
    ├── modal.js        # Edit modal logic
    └── export.js       # Export/import handlers
```

## Scripts

```bash
# Development
npm start              # Run Electron app
npm dev                # Same as start

# Build
npm run dist           # Build Linux AppImage (requires Docker or wine)
npm run package:mac    # Package macOS app
```

## to run simple 
```bash
npx electron-packager . ElectronKanban --platform=darwin --arch=x64 --out=dist --overwrite --asar
```

## Keyboard Shortcuts

- **No custom shortcuts yet** (planned feature)

## Troubleshooting

### Electron won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

### Docker build fails

```bash
# Ensure Docker is running
docker ps

# Rebuild from scratch
docker build --no-cache -t kanban-builder .
```

### Drag-drop not working

- Ensure JavaScript is enabled in browser
- Try a modern browser (Chrome, Firefox, Safari, Edge)

## Contributing

Contributions welcome! Feel free to:
- Report bugs via GitHub Issues
- Submit PRs for features or fixes
- Share feedback and ideas

## License

MIT

## Author

Built with ❤️ for productive focus.

### install nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

### load nvm into current shell (run the appropriate lines the installer prints too)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

### install Node 16 LTS and use it
nvm install 16
nvm use 16

### verify
node -v
npm -v