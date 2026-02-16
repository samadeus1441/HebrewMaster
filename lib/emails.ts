// lib/emails.ts
// ═══════════════════════════════════════════════════════════
// EMAIL TEMPLATES — The Jerusalem Bridge / lashon.online
// All templates return HTML strings for Resend
// ═══════════════════════════════════════════════════════════

const BRAND = {
  navy: '#001B4D',
  gold: '#CFBA8C',
  green: '#9BAB16',
  bg: '#FAFAF8',
  border: '#e5e2db',
  text: '#1a1a1a',
  muted: '#6b7280',
}

// Shared wrapper
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:24px;">🇮🇱</span>
      <span style="font-size:20px;font-weight:700;color:${BRAND.navy};margin-left:8px;font-family:Georgia,serif;">The Jerusalem Bridge</span>
    </div>
    
    ${content}
    
    <!-- Footer -->
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid ${BRAND.border};text-align:center;">
      <p style="font-size:12px;color:${BRAND.muted};margin:0;">
        The Jerusalem Bridge · lashon.online<br>
        Built with ❤️ from Jerusalem
      </p>
    </div>
  </div>
</body>
</html>`
}


// ═══════════════════════════════════════════════════════════
// EMAIL 1: WELCOME — sent when Jack registers a new student
// ═══════════════════════════════════════════════════════════
export function welcomeEmail(params: {
  studentName: string
  email: string
  tempPassword: string
  language: string // 'Modern Hebrew' | 'Biblical Hebrew' | 'Yiddish' | 'Aramaic'
  dashboardUrl: string
}): { subject: string; html: string } {
  const { studentName, email, tempPassword, language, dashboardUrl } = params
  const firstName = studentName.split(' ')[0]

  // Language-specific greeting
  const greetings: Record<string, string> = {
    'Modern Hebrew': 'שלום',
    'Biblical Hebrew': 'שלום',
    'Yiddish': 'שלום־עליכם',
    'Aramaic': 'שלמא',
  }
  const greeting = greetings[language] || 'שלום'

  return {
    subject: `${greeting}, ${firstName}! Your learning space is ready`,
    html: emailWrapper(`
      <h1 style="font-family:Georgia,serif;color:${BRAND.navy};font-size:28px;margin:0 0 8px;">
        ${greeting}, ${firstName}!
      </h1>
      
      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:16px 0;">
        It was great talking with you — I've set up your personal learning space on the platform. 
        This is where everything from our lessons comes together: flashcards, practice exercises, 
        conversation simulations, and homework — all built specifically from what we work on together.
      </p>

      <!-- Login box -->
      <div style="background:white;border:1px solid ${BRAND.border};padding:24px;margin:24px 0;">
        <p style="font-size:13px;font-weight:700;color:${BRAND.navy};margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">
          Your Login Details
        </p>
        <table style="width:100%;font-size:14px;color:${BRAND.text};">
          <tr>
            <td style="padding:6px 0;color:${BRAND.muted};width:100px;">Email:</td>
            <td style="padding:6px 0;font-weight:600;">${email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:${BRAND.muted};">Password:</td>
            <td style="padding:6px 0;font-weight:600;font-family:monospace;background:#f3f4f6;padding:4px 8px;">${tempPassword}</td>
          </tr>
        </table>
        <p style="font-size:12px;color:${BRAND.muted};margin:12px 0 0;">
          You can change your password after logging in.
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${dashboardUrl}" style="display:inline-block;background:${BRAND.navy};color:white;padding:14px 32px;font-size:15px;font-weight:700;text-decoration:none;">
          Go to My Dashboard →
        </a>
      </div>

      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:16px 0;">
        Take a look around — there's no pressure to do everything at once. 
        But if you have 5 minutes, try the flashcards from our lesson. 
        The system learns what you struggle with and shows you those cards more often.
      </p>

      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:16px 0;">
        Questions about anything? Just reply to this email.
      </p>

      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:24px 0 0;">
        !קדימה<br>
        <strong>Jacob</strong>
      </p>
    `),
  }
}


// ═══════════════════════════════════════════════════════════
// EMAIL 2: LESSON READY — sent after Jack imports lesson JSON
// ═══════════════════════════════════════════════════════════
export function lessonReadyEmail(params: {
  studentName: string
  lessonNumber: number | string
  topicTitle: string
  wordCount: number
  scenarioCount: number
  dashboardUrl: string
  homeworkItems?: string[]
}): { subject: string; html: string } {
  const { studentName, lessonNumber, topicTitle, wordCount, scenarioCount, dashboardUrl, homeworkItems } = params
  const firstName = studentName.split(' ')[0]

  const homeworkSection = homeworkItems && homeworkItems.length > 0
    ? `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;margin:20px 0;">
        <p style="font-size:13px;font-weight:700;color:#166534;margin:0 0 8px;">📝 Homework for next time:</p>
        ${homeworkItems.map(h => `<p style="font-size:14px;color:#166534;margin:4px 0;">• ${h}</p>`).join('')}
      </div>`
    : ''

  return {
    subject: `Your lesson is ready! ${topicTitle}`,
    html: emailWrapper(`
      <h1 style="font-family:Georgia,serif;color:${BRAND.navy};font-size:24px;margin:0 0 8px;">
        ${firstName}, your lesson is ready! 🎉
      </h1>
      
      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:16px 0;">
        I just finished processing our lesson — everything from today's session is now on your dashboard, 
        personalized and ready to practice.
      </p>

      <!-- Lesson summary card -->
      <div style="background:white;border:1px solid ${BRAND.border};padding:24px;margin:24px 0;">
        <p style="font-size:12px;font-weight:700;color:${BRAND.green};margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">
          Lesson ${lessonNumber}
        </p>
        <h2 style="font-family:Georgia,serif;color:${BRAND.navy};font-size:20px;margin:0 0 16px;">
          ${topicTitle}
        </h2>
        <div style="display:flex;gap:16px;">
          <div style="flex:1;text-align:center;padding:12px;background:${BRAND.bg};">
            <div style="font-size:24px;font-weight:700;color:${BRAND.navy};">${wordCount}</div>
            <div style="font-size:12px;color:${BRAND.muted};">new words</div>
          </div>
          <div style="flex:1;text-align:center;padding:12px;background:${BRAND.bg};">
            <div style="font-size:24px;font-weight:700;color:${BRAND.navy};">${scenarioCount}</div>
            <div style="font-size:12px;color:${BRAND.muted};">practice scenarios</div>
          </div>
        </div>
      </div>

      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:16px 0;">
        <strong>What's waiting for you:</strong>
      </p>
      <p style="color:${BRAND.text};font-size:14px;line-height:1.8;margin:8px 0;">
        🃏 <strong>Flashcards</strong> — ${wordCount} cards from today, spaced repetition will prioritize what you need most<br>
        💬 <strong>Conversation simulations</strong> — practice real scenarios based on what we covered<br>
        🎯 <strong>Quiz</strong> — test yourself on today's vocabulary<br>
        📝 <strong>Lesson summary</strong> — full notes from our session
      </p>

      ${homeworkSection}

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${dashboardUrl}" style="display:inline-block;background:${BRAND.navy};color:white;padding:14px 32px;font-size:15px;font-weight:700;text-decoration:none;">
          Start Practicing →
        </a>
      </div>

      <p style="color:${BRAND.muted};font-size:13px;line-height:1.6;margin:16px 0;">
        Tip: Even 5-10 minutes of flashcard review today will make a huge difference for retention. 
        The system knows which words are hardest for you.
      </p>

      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:24px 0 0;">
        See you next week!<br>
        <strong>Jacob</strong>
      </p>
    `),
  }
}


// ═══════════════════════════════════════════════════════════
// EMAIL 3: GENTLE NUDGE — for later (day 3-5 after lesson)
// ═══════════════════════════════════════════════════════════
export function nudgeEmail(params: {
  studentName: string
  cardsRemaining: number
  dashboardUrl: string
}): { subject: string; html: string } {
  const { studentName, cardsRemaining, dashboardUrl } = params
  const firstName = studentName.split(' ')[0]

  return {
    subject: `${firstName}, ${cardsRemaining} cards waiting for you`,
    html: emailWrapper(`
      <h1 style="font-family:Georgia,serif;color:${BRAND.navy};font-size:24px;margin:0 0 8px;">
        Quick check-in, ${firstName}
      </h1>
      
      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:16px 0;">
        You've got ${cardsRemaining} flashcards due for review. 
        Takes about 5 minutes and it'll keep everything fresh for our next lesson.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${dashboardUrl}" style="display:inline-block;background:${BRAND.navy};color:white;padding:14px 32px;font-size:15px;font-weight:700;text-decoration:none;">
          Review Now (5 min) →
        </a>
      </div>

      <p style="color:${BRAND.text};font-size:15px;line-height:1.7;margin:24px 0 0;">
        <strong>Jacob</strong>
      </p>
    `),
  }
}
