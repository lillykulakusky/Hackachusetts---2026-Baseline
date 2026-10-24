# Hackachusetts — Setup Chat with Claude (Sat Oct 24, 2026)

Related: [[Hackachusetts_Chat_Notes]]

## 1. Ryan: "Read the rules and tell me what I may need to download / need"

### The rules (from the deck)
- **Qualifying:** choose one track (Healthcare/Biotech, Robotics, Climate Tech, Civic Action), max 4 people per team, **must use Kiro**, **deadline 8:00 PM**.
- **Submission:** description, video of **3 minutes or less**, **public GitHub repo**, explanation of **how Kiro was used**.
- **Judging:** potential value, implementation (thoughtful use of Kiro), quality and design. Separate **Best use of Kiro** prize.
- **Today:** submit idea at `tinyurl.com/submitideahack`, browse ideas/teams at `tinyurl.com/myhackidea`, join the **Sundai** and **Kiro** Discord channels.

### What the Mac had
| Tool | Status |
|---|---|
| Kiro | ✅ installed (confirm signed in with event credits) |
| git | ✅ installed, identity not set yet |
| Node 24 / npm, Python 3.13 | ✅ |
| VS Code | ✅ |
| GitHub CLI (`gh`) | ❌ missing |
| Homebrew | ❌ missing (not needed) |

### Still needed
1. GitHub account (repo must be public)
2. git identity
3. Discord (Sundai + Kiro channels)
4. Optional: Vercel or Netlify free account for a live demo link
5. Screen recording: built in, **Cmd+Shift+5**; trim in iMovie or QuickTime
6. An AI API key if the app calls an LLM (ask in Discord about AWS/Bedrock event credits)

### Scoring on "use of Kiro"
- Start in **Spec mode** (`requirements.md`, `design.md`, `tasks.md`) before any code
- Add **steering files** in `.kiro/steering/`
- Set up at least one **agent hook**
- **Commit the `.kiro/` folder** and show it in the video

## 2. Ryan: "Set up the GitHub CLI and git identity"

Done:
- `git config --global user.name "Ryan Farris"`
- `git config --global user.email "ryfarris@bu.edu"`
- `git config --global init.defaultBranch main`
- GitHub CLI **2.103.2** installed to `~/.local/bin/gh` from the official GitHub release, checksum verified
- Signed in to GitHub as **ryfarris-create** (`gh auth status` confirms)

Useful later:
```bash
gh repo create <name> --public --source=. --push
```

## 3. Ryan: "Should I see the GitHub CLI as an app?"

No. It's terminal-only (`gh` in Terminal or Kiro's terminal). The clickable app is **GitHub Desktop**, a separate download, which isn't needed for the hackathon.

## 4. Ryan: "Now what do I do?" (10:02 AM)

1. **10:00–10:30:** watch "How to use Kiro?" and confirm Kiro is signed in with event credits.
2. **By ~10:45:** pick a track and idea. Shortlist:
   - Healthcare: WHOOP / Apple Health data → one-page summary for your doctor (strong fit, finals are at WHOOP)
   - Healthcare: MassHealth renewal helper
   - Civic: Boston 311 copilot
   - Climate: address-based heat and flood readiness tool
3. **10:30–11:30:** submit the idea form, browse ideas, give a one-minute pitch to find teammates (max 4).
4. **11:30 onward:** create the project folder, run Kiro **Spec mode**, then `gh repo create <name> --public --source=. --push`.

### Next for Claude
Tell Claude which idea you're leaning toward and what you can code in, and it can write your one-minute pitch and the text for the idea form.
