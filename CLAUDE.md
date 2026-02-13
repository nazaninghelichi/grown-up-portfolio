# Portfolio Management Guide

## Overview
This is a portfolio website for Data Science, Machine Learning, and Computer Engineering roles.

## Structure
- `index.html` - Main portfolio page
- `projects.json` - All project data (this is the single source of truth)
- `styles.css` - Styling
- `script.js` - Dynamic project loading

## When I Mention a Project

When I mention working on a project, you MUST:

1. **Check if it exists**: Read `projects.json` and search for the project by name
2. **Ask me**:
   - If project EXISTS: "This project exists. Do you want to update it or create a new one?"
   - If project DOESN'T EXIST: "This project doesn't exist yet. Would you like to add it to your portfolio?"
3. **Gather details** (if adding/updating):
   - Project name
   - Category: "Data Science", "ML/AI", or "Software Engineering"
   - Description (2-3 sentences about what it does and the impact)
   - Technologies used (array of strings)
   - Key skills demonstrated
   - GitHub link (if available)
   - Live demo link (if available)
   - What problem it solves

4. **Update files**:
   - Add or update the project in `projects.json`
   - The website will automatically display it (no HTML editing needed)

## Project Entry Format

```json
{
  "id": "unique-slug",
  "title": "Project Name",
  "category": "ML/AI",
  "description": "Clear description of the project and its impact",
  "technologies": ["Python", "TensorFlow", "scikit-learn"],
  "skills": ["Machine Learning", "Deep Learning", "Model Deployment"],
  "github": "https://github.com/username/repo",
  "demo": "https://demo-link.com",
  "featured": true,
  "date": "2026-02"
}
```

## Categories
- **Data Science**: Statistical analysis, A/B testing, predictive modeling, Python, visualization
- **ML/AI**: Machine learning, deep learning, NLP, computer vision, model deployment
- **Software Engineering**: Web apps, APIs, tools, full-stack development

## Important
- Always check projects.json FIRST before asking me questions
- Never assume a project exists - always verify
- Keep descriptions focused on business impact and results, not just technical details
