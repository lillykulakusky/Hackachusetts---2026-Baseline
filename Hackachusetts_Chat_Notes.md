# Hackachusetts — Chat with Claude (Sat Oct 24, 2026)

## Ryan's message
> What up boss. I entered a hackathon and need help figuring out directions and how to get started. I will attach as many details as I can and let me know what else you need. (https://www.sundai.club/events/boston/hackachusetts-with-kiro)
> *(Attached: Hackachusetts.pptx)*

## Claude's reply

You've got about 10 hours, and the "submit your idea" form plus team formation run 10:30–11:30, so the most important thing right now is picking a direction. Here's what I pulled from your deck and the event page.

### The rules that matter
- **Pick one track.** Teams are 4 people max, you **must use Kiro**, and the **deadline is 8:00 PM tonight**.
- **What you submit:** a description, a video of 3 minutes or less, a **public GitHub repo**, and a write-up of **how you used Kiro**.
- **How you're judged:** potential value (a real problem, scalable and easy to use), implementation (*thoughtful use of Kiro*), and quality and design. There's also a separate **"Best use of Kiro"** prize.
- **Finalists** are announced around 11 PM and pitch tomorrow (Sunday) at WHOOP headquarters, 11 AM–2 PM.
- The website lists different tracks (Energy, Education). Go with the deck: **Healthcare/Biotech, Robotics, Climate Tech, Civic Action.**

### Ideas you could finish in one day
These are software-only. Robotics is hard to do well without hardware, so skip it unless someone on your team has a simulation ready.

- **Healthcare: wearable data into a doctor-ready summary.** You upload a WHOOP or Apple Health export, and AI turns it into a one-page "what to tell your doctor" brief that flags trends in sleep, HRV and resting heart rate. It fits a listed challenge exactly, and finals are at WHOOP, which helps.
- **Healthcare: a MassHealth renewal helper.** A plain-language walkthrough of the redetermination process, with deadline reminders and a document checklist. This targets the "keep residents connected to coverage" challenge.
- **Civic: a 311 copilot.** You describe or photograph a neighborhood problem, and AI files it in the right Boston 311 category. You can add a dashboard of open requests near you using Boston's public 311 data.
- **Climate: a heat and flood readiness tool.** You enter an address and get your risk level, the nearest cooling centers, and a short prep plan. This covers both "resilient communities" and "emergency readiness."

### Scoring well on "use of Kiro"
Most teams will only chat with Kiro, so this is the easiest place to stand out:
1. **Start in Spec mode.** Have Kiro generate `requirements.md`, `design.md` and `tasks.md` before you write any code, then build task by task.
2. **Add steering files** (`.kiro/steering/`) for your tech stack and style rules.
3. **Set up at least one agent hook**, for example one that writes tests or updates the README whenever you save.
4. **Commit the whole `.kiro/` folder** to your public repo, and show it for about 20 seconds in your video. That's your evidence for the implementation criterion.

### Suggested timeline
| Time | Do |
|---|---|
| Now–11:30 | Pick a track and idea, submit it on the form, find teammates |
| 11:30–12:30 | Kiro spec: requirements → design → tasks |
| 12:30–5:00 | Build the core flow, one demo path that works end to end |
| 5:00–6:30 | Polish the UI, deploy (Vercel or Netlify is quickest), clean up the README |
| 6:30–7:30 | Record the video: problem (30s), demo (90s), how you used Kiro (45s), impact (15s) |
| 7:30–8:00 | Buffer. **Submit by 7:45.** |

### Open questions for Ryan
1. Which hub? Deck Wi-Fi is The Engine (MIT, 750 Main St, Cambridge); BU hub is CDS 1301, 665 Commonwealth Ave.
2. Solo or team, and what can you code (web/JS, Python, not much)?
3. Is Kiro installed and signed in with event credits?

---

## Quick reference (from the deck and event page)
- **Wi-Fi (The Engine):** TheEngine-Event / ToughTechWeek
- **Idea form:** tinyurl.com/submitideahack · **Browse ideas/teams:** tinyurl.com/myhackidea
- **Event info:** massaicoalition.com/hackachusetts · **Terms:** tinyurl.com/sundaiterms
- **Join Discord:** Sundai and Kiro channels
- **Saturday schedule:** 8–9 registration and breakfast · 9:00 welcome · 9:30 AI news · 9:40 playbook · 10:00 Kiro how-to · 10:30–11:30 idea pitching and team formation · 12–1 lunch · 5–6 dinner · **8 PM submission deadline**
- **Sunday finals (WHOOP HQ):** 11:00 brunch · 11:30 opening · 11:45–1:15 finalist pitches · 1:15 deliberation · 1:30–2:00 awards
