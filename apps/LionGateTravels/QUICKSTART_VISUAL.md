# LionGateOS Travels — Visual Run (You can actually SEE it)

## What changed
This package includes a **real visual UI** (Overview / Lodging / Cars / Activities / Settings) so you can immediately see a difference in the browser.

## How to run (Windows PowerShell)
1) Open PowerShell in the project folder:
`/mnt/data/_liongatetravels_work/LionGateTravels`

2) Install dependencies (first time only):
`npm install`

3) Run the dev server:
`npm run dev`

4) Open the URL it prints (usually):
`http://localhost:5173`

## If you want Expedia content
- This UI supports **Live mode via a Proxy URL** (Settings → Data source).
- You must run a small server/proxy that holds your Expedia secrets and calls the partner API.
- For now, **Demo mode** shows realistic cards immediately so you can validate UI/UX and partner posture.

## If you’re loading an HTML file directly
That will NOT show this app. This is a React/Vite project, so you must run `npm run dev`.
