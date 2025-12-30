# Contributing to Kanpur FOSS

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Setting up the Environment

To run this Jekyll site locally, you'll need Ruby and Bundler installed on your system.

### Prerequisites

1.  **Ruby**: Ensure you have a recent version of Ruby installed.
    *   **Windows**: Use [RubyInstaller](https://rubyinstaller.org/). Be sure to install the formatting tool (Development Kit) as well.
    *   **macOS/Linux**: Use `rbenv` or `rvm` to install Ruby.
2.  **Bundler**: Install bundler by running `gem install bundler`.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/KanpurFOSS/KanpurFOSS.git
    cd KanpurFOSS
    ```

2.  Install dependencies:
    ```bash
    bundle install
    ```
    *Note: If you encounter issues on Windows with `nokogiri` or `wdm`, ensure you have the Ruby DevKit installed.*

3.  Run the local server:
    ```bash
    bundle exec jekyll serve
    ```

4.  Open your browser and navigate to `http://localhost:4000`.

## Project Structure

Here's a quick overview of the key directories/files:

*   **`_config.yml`**: Main configuration file (site title, description, plugins).
*   **`_posts/`**: Contains blog posts in Markdown format.
*   **`_layouts/`**: HTML templates for pages (e.g., `home.html`, `post.html`).
*   **`_includes/`**: Reusable partials (e.g., `header.html`, `head.html`, `footer.html`).
*   **`assets/`**: Static files:
    *   `css/`: Stylesheets (includes `meetup.css`).
    *   `js/`: JavaScript files (includes `meetup-api.js` for fetching events).
    *   `images/`: Images and icons.

## How to Contribute

### 1. Adding a New Meetup Group

The upcoming meetups are fetched automatically via RSS feeds in `assets/js/meetup-api.js`. To add a new group:

1.  Open `assets/js/meetup-api.js`.
2.  Add a new object to the `groups` array:
    ```javascript
    { urlname: "Your-Group-URL-Name", icon: "your-icon-name", name: "Display Name" }
    ```
3.  Add the corresponding icon PNG to `assets/images/`.

### 2. Writing a Blog Post

1.  Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`.
2.  Add the YAML front matter:
    ```markdown
    ---
    layout: post
    title:  "Your Post Title"
    date:   2024-01-01 12:00:00 +0530
    categories: jekyll update
    ---
    ```
3.  Write your content in Markdown below.

### 3. Submitting Changes

1.  Fork the repo and create your branch from `master`.
2.  If you've added code that should be tested, add tests.
3.  Ensure your code lints/builds.
4.  Issue that pull request!

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.
