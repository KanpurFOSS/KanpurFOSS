# Contributing to Kanpur FOSS

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Setting up the Environment

This Jekyll site uses Node.js for fetching Meetup events and Ruby for building the site.

### Prerequisites

1. **Node.js**: Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. **Ruby**: Ensure you have a recent version of Ruby installed.
    * **Windows**: Use [RubyInstaller](https://rubyinstaller.org/). Be sure to install the Development Kit as well.
    * **macOS/Linux**: Use `rbenv` or `rvm` to install Ruby.
3. **Bundler**: Install bundler by running `gem install bundler`

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/KanpurFOSS/KanpurFOSS.git
    cd KanpurFOSS
    ```

2. Install Ruby dependencies:
    ```bash
    bundle install
    ```

3. Fetch latest Meetup events and start development server:
    ```bash
    npm run dev
    ```
    This will fetch events from Meetup and start the Jekyll server with live reload.

4. Open your browser and navigate to `http://localhost:4000`

### Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run fetch` | Fetch latest events from Meetup |
| `npm run serve` | Start Jekyll development server |
| `npm run dev` | Fetch events + start server (recommended) |
| `npm run build` | Build Jekyll for production |
| `npm run update` | Fetch + build (for deployment) |

## Branch Structure

- **`development`** - Active development branch. Push your changes here first.
- **`master`** - Production branch. Merged from development after testing.

### Workflow

1. Fork the repo
2. Create your feature branch from `development`:
   ```bash
   git checkout development
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test locally with `npm run dev`
5. Push and create a Pull Request to `development`

## Project Structure

```
KanpurFOSS/
├── _config.yml          # Jekyll configuration
├── _posts/              # Blog posts (Markdown)
├── _layouts/            # HTML templates
├── _includes/           # Reusable partials (header, footer)
├── assets/
│   ├── css/             # Stylesheets
│   │   ├── custom.css   # Main custom styles
│   │   └── meetup.css   # Meetup card styles
│   ├── js/
│   │   └── meetup-api.js # Frontend event display
│   ├── data/
│   │   └── meetup-events.json # Cached events (auto-updated)
│   └── images/          # Icons and images
├── scripts/
│   └── fetch-meetup-events.js # Node.js script to fetch events
├── package.json         # NPM scripts
└── .github/workflows/   # GitHub Actions for auto-updates
```

## How to Contribute

### 1. Adding a New Meetup Group

1. Open `scripts/fetch-meetup-events.js`
2. Add a new object to the `groups` array:
    ```javascript
    { urlname: "Your-Group-URL-Name", icon: "your-icon-name", name: "Display Name" }
    ```
3. Also add the same entry in `assets/js/meetup-api.js` (for fallback display)
4. Add the corresponding icon PNG to `assets/images/`
5. Run `npm run fetch` to test

### 2. Writing a Blog Post

1. Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`
2. Add the YAML front matter:
    ```markdown
    ---
    layout: post
    title:  "Your Post Title"
    date:   2024-01-01 12:00:00 +0530
    categories: community meetup
    ---
    ```
3. Write your content in Markdown below

### 3. Updating Styles

- Global styles: `assets/css/custom.css`
- Meetup cards: `assets/css/meetup.css`
- Follow the Golden Ratio design system (base: 16px, scale: 1.618)

### 4. Submitting Changes

1. Fork the repo and create your branch from `development`
2. Make your changes and test locally
3. Ensure your code builds without errors: `npm run build`
4. Issue a Pull Request to `development`
5. After review, it will be merged to `master` for deployment

## Automatic Meetup Updates

Meetup events are automatically fetched and updated:

- **Daily at 6 AM IST** via GitHub Actions
- **On every push** to development or master
- Stored in `assets/data/meetup-events.json`

To manually update events locally:
```bash
npm run fetch
```

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

## Questions?

Feel free to open an issue or reach out to us at [kanpurfoss@gmail.com](mailto:kanpurfoss@gmail.com)
