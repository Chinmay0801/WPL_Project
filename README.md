# Agentic Stock Research & Analysis Platform

This is the repository for the Agentic Stock Research & Analysis Platform, an autonomous financial analyst application powered by AI.

## Project Overview

This platform uses AI-driven agents to automate stock research by analyzing SEC filings, earnings transcripts, historical financials, real-time market data, and news sentiment. Multiple specialized AI agents collaborate to generate comprehensive institutional-grade research reports.

### Tech Stack

- **Backend Framework:** Django (Python) - Serves the API and manages the database.
- **Asynchronous Queue:** Celery & Redis - Handles long-running background processes (e.g., agent research, web scraping).
- **Database:** PostgreSQL - Relational database for storing user data and research reports.
- **AI Core:** LangChain / LlamaIndex + LLMs (OpenAI, Gemini) - Orchestrates multi-agent reasoning.
- **Data Providers:** Alpha Vantage, Yahoo Finance, News APIs.
- **Frontend:** React.js / Vue.js - Dynamic user dashboard interacting with Django REST Framework.

## Team Members (Team J)

- Chinmay Deshpande (230905264)
- Param Mehta (230905260)
- Nirav Shetty (230905213)

## Git Collaboration Guidelines

To work together on this project, please follow these guidelines:

1. **Clone the repository**: `git clone <repository_url>`
2. **Create a branch for your feature**: `git checkout -b feature/your-feature-name` (e.g., `feature/auth`, `bugfix/login-issue`)
3. **Commit your changes regularly**: Provide clear and concise commit messages.
   - Example: `git commit -m "Add Celery setup for background tasks"`
4. **Push your branch to the remote repository**: `git push origin feature/your-feature-name`
5. **Create a Pull Request (PR)**: Merging shouldn't be done directly to the `main` branch. Create a PR, and have another team member review your changes before merging.

### Before Committing

- Ensure you are not committing sensitive information (like API keys, `.env` files).
- The provided `.gitignore` file should prevent accidental commits of compiled code, virtual environments, and Node modules, but always verify using `git status` before `git add`.
