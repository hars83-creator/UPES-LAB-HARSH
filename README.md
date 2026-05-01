# UPES-LAB-HARSH

UPES Physics Virtual Lab Simulator

Full-stack interactive virtual physics lab for engineering students.

## Features

- React + Tailwind dashboard with dark mode and responsive sidebar navigation.
- Ten experiment simulators with aim, theory, apparatus, controls, readings, graphs, calculations, and quizzes.
- Real-time animated instruments for LEDs, sonometer strings, Hall probes, coils, magnets, optical fiber rays, diffraction, solar cells, photoelectric emission, and PN junction response.
- Recharts graph plotting, Framer Motion animations, random reading noise, slope/constant calculations, error percentage, and PDF lab report export.
- Express API for saving generated report data locally in `reports/reports.json`.

## Experiments

1. Planck's Constant using LEDs
2. Sonometer
3. Hall Effect
4. Magnetic Field of Circular Coil
5. Faraday's Law of Electromagnetic Induction
6. Optical Fiber
7. Laser Diffraction
8. Solar Cell Characteristics
9. Photoelectric Effect
10. PN Junction Diode

## Run Locally

```bash
npm install
npm run dev
```

Frontend: `http://127.0.0.1:5173/`

Backend API: `http://127.0.0.1:4000/api/health`

## Run in GitHub Codespaces

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Select **Code > Codespaces > Create codespace on main**.
4. Wait for dependencies to install.
5. Run:

```bash
npm run dev
```

Codespaces will open the React app from forwarded port `5173`.

## Build

```bash
npm run build
```
