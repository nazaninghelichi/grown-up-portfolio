# Nazanin Ghelichi - Portfolio

A clean, responsive portfolio website showcasing Data Analysis, Data Science, ML/AI, and Software Engineering projects.

## 🚀 Quick Start

1. **View locally**: Open `index.html` in your browser
2. **Add projects**: Just tell Claude about your project and it will automatically update `projects.json`

## 📁 Files

- `index.html` - Main portfolio page
- `styles.css` - Styling
- `script.js` - Loads projects dynamically
- `projects.json` - All your projects (single source of truth)
- `CLAUDE.md` - Instructions for Claude to manage your portfolio

## ✨ How to Add Projects

Just chat with Claude in this directory and mention a project. Claude will:
1. Check if it exists in `projects.json`
2. Ask if you want to add or update it
3. Gather details and update the file automatically

Example: "I want to add my sentiment analysis project"

## 🌐 Publishing Options

### GitHub Pages (Recommended - Free)
```bash
cd ~/Desktop/portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/nazaninghelichi/portfolio.git
git push -u origin main
```
Then enable GitHub Pages in your repo settings → Pages → Source: main branch

Your site will be live at: `https://nazaninghelichi.github.io/portfolio/`

### Netlify (Easiest - Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `portfolio` folder
3. Done! You get a live URL instantly

### Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Deploy with one click

## 🎨 Customization

- **Colors**: Edit CSS variables in `styles.css` (lines 8-15)
- **Sections**: Edit `index.html`
- **Projects**: Just talk to Claude!

## 📊 Project Categories

- **Data Analysis**: Business insights, dashboards, SQL, Tableau
- **Data Science**: Statistical analysis, predictive modeling
- **ML/AI**: Machine learning, deep learning, NLP, computer vision
- **Software Engineering**: Web apps, APIs, tools

## 🤖 Claude Integration

The `CLAUDE.md` file teaches Claude how to manage your portfolio. When you mention a project, Claude will automatically:
- Check if it exists
- Ask relevant questions
- Update `projects.json`
- No manual JSON editing needed!
