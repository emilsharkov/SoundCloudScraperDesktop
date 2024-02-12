# SoundCloudScraperDesktop
## Overview
This is a desktop app where you can download songs from SoundCloud and listen to them locally. You can choose to either export them into your computer or listen in the app's built in music player and queue system.

## Tech Stack:
- Frontend: React, TypeScript, shadcn ui, Tailwind, ReduxToolkit
- Backend: Electron, Node, Express, SQLite

## How to Run Myself:
This will only run the program in dev through node. To generate an executable look at install program below
1. Run ```git clone https://github.com/emilsharkov/SoundCloudScraperDesktop``` to clone the repository
2. Run ```npm install``` to install node dependencies
3. Run ```npm start``` to start the app

## Install Program
To install the app to your computer via an executable:
- Windows: https://www.dropbox.com/scl/fi/qgj2r9m6y6vfonog0ns9i/SoundCloudScraper_2.4.0.zip?rlkey=6xt583wenr1zdncskpq9cgcil&e=2&dl=0
- MacOS: after setting up your repo, run ```tsc && vite build && electron-builder -m``` to build (has to be built on mac)
- Linux: after setting up your repo, run ```tsc && vite build && electron-builder -l``` to build (has to be built on linux)
