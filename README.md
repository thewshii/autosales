# Auto Sales Landing Page

Public website for promoting a bot network offer and collecting inbound inquiries.

## What This Project Does

- Presents a marketing landing page (`index.html` + `styles.css`).
- `Start Application` jumps users to an application form section.
- Form submission opens the visitor's default email client (Apple Mail, Gmail app, Outlook, etc.) using a `mailto:` link.
- The email is prefilled and addressed to:
  - `ampliftsllc@icloud.com`
  - `thewshii@gmail.com`
- Subject used: `Inquiry About Joining the Bot Network`.

## Important Behavior (Public Repo Note)

This project does **not** send email from a backend server.  
It relies on the visitor having an email app configured and pressing send.

That means:
- You receive inquiries directly in your inbox when users send.
- If a user closes their mail app draft and does not send, no inquiry is delivered.

## Project Files

- `index.html`: page structure and form markup
- `styles.css`: layout and visual styles
- `script.js`: form handling and `mailto:` generation
- `server.js`: simple static file server for local testing

## Local Development

```powershell
cd C:\Users\thews\auto_sales
node server.js
```

Then open `http://localhost:8080`.

## Deploy (Vercel)

This site can be deployed as a static project on Vercel by importing this GitHub repository.

