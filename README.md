# ShqipType: Albanian Typing

Act as an expert full-stack web developer. I want to build a minimalist typing test application called "ShqipType", inspired by Monkeytype, but dedicated specifically to the Albanian language.

Core Features & Mechanics:

1. Dictionary Toggle: A clear UI toggle to switch the word bank between "Shqipja Standarde" (Standard Albanian) and "Shqipja e Kosovës" (Kosovo dialect/Gegë).

2. Typing Engine: A hidden textarea or input capturing keystrokes while displaying a styled visual overlay of the text to prevent input lag.

3. Visual Feedback: Color-coded characters (correct = active accent color, incorrect = red, untyped = muted text).

4. Live Metrics: Real-time calculation of WPM (Words Per Minute, calculated as correct characters / 5 / time in minutes) and Accuracy percentage.

5. Session Management: A countdown timer (e.g., 15s, 30s) that starts automatically on the first keystroke, and a "Restart" button that also triggers on a keyboard shortcut (Tab + Enter).

Tech Stack Requirements:

Build the frontend using React and TypeScript.

Use Tailwind CSS for all styling.

Keep the state management clean so the app can easily be integrated later with Convex or Appwrite for user leaderboards, and optimized for deployment on Vercel.

UI & Design Palette:

The UI must be extremely minimalist, dark, and entirely distraction-free.

Use a specific color palette: a deep navy blue for the main background, vibrant sky blue for active highlights/results, and a soft blue-gray for the untyped/inactive text.

Use a clean, readable monospace font for the typing area.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://shqiptype-typing-trainer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9a204845-7e88-443a-90b9-cc139cd39430).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
