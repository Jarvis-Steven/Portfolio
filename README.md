# Stage 3 — Jarvis Steven J's student portfolio

## 1. Open in Windows VS Code

If VS Code is already installed, open it. Otherwise install Microsoft's Visual Studio Code for Windows. Choose **File → Open Folder**, select this `portfolio` folder, and open `index.html` in the editor. No packages, frameworks, extensions or build steps are required.

```text
portfolio/
├── index.html         All seven assignment sections and project content
├── css/
│   └── style.css      Cream/coral design, responsive layout and themes
├── js/
│   └── script.js      Menu, theme, active navigation, reveals and top link
├── images/
│   └── README.md      Instructions for adding your real local images
└── README.md          Setup, development steps and review checklist
```

## 2. Preview locally

In Windows File Explorer, open this folder and double-click `index.html`. It opens in your default browser with local CSS and JavaScript. Save changes in VS Code with Ctrl+S, then refresh the browser with Ctrl+R. This site does not need a server or an internet connection. Theme persistence can vary under file URLs; toggling still works if storage is blocked.

## 3. Design decisions

The enhanced reference design uses a warm cream background, coral actions, bold system typography, a portrait area and three pastel project cards. The scrolling order is Home → About → Skills → Projects → Contact → Footer. Tablet and phone layouts stack appropriately. Dark mode follows the system initially and allows a saved user choice.

Navigation and theme switching use vanilla JavaScript. Project expansion uses accessible native HTML details/summary, which also works without JavaScript. A floating top link, active section indication and subtle scroll entrances complete the interactions. Reduced-motion disables smooth scrolling and entrances. Content is never hidden pending an animation. Keyboard focus is visible; the mobile menu supports Escape. No external fonts, icons, libraries, network requests, backend or templates are used.

## 4. Next development increment: finish the real content

1. Read the HTML section by section and rewrite the draft introduction in your own voice. Add your course or institution only if you want it public; none has been assumed.
2. Add your portrait using `images/README.md`. The current monogram is an explicit placeholder.
3. For each project, replace pending details with an accurate purpose, actual tools, your contribution and what you learned. Add real screenshots or include a local project folder in your submission when no live version exists. No URLs or working features have been invented.
4. Preserve the status distinctions: Oceantrace AI is a research prototype; VitalGuard is a prototype with unverified functionality; REIM is a concept. Ask your teacher whether a concept counts toward the three-project requirement. If not, replace it with a completed practice project. Polaris is excluded.
5. Replace the contact placeholder with a safe public email link, e.g. an actual `mailto:` address you choose to share. There is no pretend send-message form. Resume is deferred.

React, Node.js and FastAPI appear only as experience, not as technologies used to implement this portfolio.

## 5. Review in small increments

- First preview the HTML content; verify names and statuses before changing styling.
- Then resize to approximately 390px, 768px and 1280px. Check readable text, no horizontal scrolling and usable navigation.
- Use Tab and Enter to reach all links, theme control and project disclosures. On mobile, test Menu → link and Menu → Escape.
- Toggle the theme, refresh, and test with browser storage restricted if possible.
- Enable reduced motion in Windows accessibility settings and confirm scrolling and section entrances no longer animate.
- Test with JavaScript disabled: navigation, project disclosures and footer top link should remain usable.
- Check all real images and links once added. Review both themes, keyboard focus and phone layout again.

This is a working design starter, not a submission-ready content package. The remaining blockers are your portrait (optional under the assignment), verified project descriptions/tools/contributions and supporting files, teacher acceptance of REIM as a concept, and your chosen contact details. The assignment requires your own work: understand and adapt each file rather than submitting unexplained code.
