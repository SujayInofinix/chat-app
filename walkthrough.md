# WhatsApp Chat POC Walkthrough

## Overview

This is a standalone React application implementing a "WhatsApp-style" Chat Interface POC.
It mimics the "Cocoonmail" application foundation with a custom theme, layout, and routing.

## Features

- **Theme**: Custom MUI theme with "Premium" look and specific color palette.
- **Mock API**: Simulated backend with 800ms delay for fetching conversations and messages.
- **State Management**: Zustand store handling data fetching, UI state (tabs, drawer), and message sending.
- **Routing**:
  - `/whatsapp/conversations`: Shows list and empty state.
  - `/whatsapp/conversations/:id`: Shows list and chat window for selected conversation.
- **Components**:
  - **ConversationList**: Tabs (Active, Open, Assigned), Search, and List of conversations.
  - **ChatWindow**: Header, Message Bubbles (Incoming/Outgoing), Input area.
  - **ContactDrawer**: Right panel with contact details, toggleable via store.

## Verification

The project has been successfully built using `npm run build`.

### Build Output

```
> live-chat@0.0.0 build
> vite build

vite v7.2.4 building client environment for production...
transforming...
✓ 1732 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                    0.46 kB │ gzip:   0.29 kB
dist/assets/index-DQ3P1g1z.css     0.91 kB │ gzip:   0.49 kB
dist/assets/index-DcvQ1BXc.js    667.53 kB │ gzip: 200.99 kB
✓ built in 13.21s
```

## How to Run

1. Navigate to the project directory: `cd c:/workspace/standalone-projects/live-chat`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the URL shown in the terminal (usually `http://localhost:5173`).
