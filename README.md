# PulseChainBot.com Website

This repository contains the source code for PulseChainBot.com, a community-focused website providing access to an AI support chatbot for the PulseChain ecosystem.

## Project Overview

The site is built with Node.js and Express. It serves static HTML pages and includes a backend API for the contact form. The goal is to provide a transparent and helpful tool for PulseChain users and gather feedback for improvement.

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone [your-repo-url]
    cd pulsechainbot.com
    ```

2.  **Create `config.json`:**
    Copy the `config-template.json` to a new file named `config.json`.
    ```bash
    cp config-template.json config.json
    ```
    **IMPORTANT:** `config.json` contains sensitive information and is listed in `.gitignore`. **Never commit this file to your repository.**

3.  **Edit `config.json`:**
    Fill in the details for your domain, port, SSL certificate paths, and email service (for the contact form).
    -   **hostname**: Your domain name (e.g., `pulsechainbot.com`).
    -   **https**: Paths to your SSL certificate files. Use Certbot to generate these for free.
    -   **email**: Configure with your email provider's SMTP details. For Gmail, you'll need to generate an "App Password".

4.  **Install Dependencies:**
    ```bash
    npm install
    ```

5.  **Place Chatbot Embed Code:**
    Open `public/index.html`. Find the placeholder comment `<!-- PASTE YOUR AI12Z EMBED CODE HERE -->` and replace it with the script/embed code provided by ai12z.

6.  **Start the Server:**
    -   For development: `npm run dev`
    -   For production (using forever): `npm run forever`

7.  **Updating the Server:**
    The `update.sh` script automates the process of pulling the latest code from Git, installing dependencies, and restarting the server. Make it executable (`chmod +x update.sh`) and run it with `./update.sh`.