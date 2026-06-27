import type { Devotional } from "./types";

/**
 * Original devotional reflections written for Daily Communion — not quoted
 * or paraphrased from any existing devotional publication. Seven sample
 * days are included; in production you'd extend this to 365 entries (or
 * generate them with an editorial workflow / AI pipeline keyed to
 * READING_PLAN day numbers).
 */
export const DEVOTIONALS: Devotional[] = [
  {
    day: 1,
    title: "Out of Nothing, Something Good",
    basedOn: "Genesis 1",
    keyLesson: "God speaks order into chaos, and calls what He makes good.",
    reflection:
      "Before there was light, there was only the Word and the willingness to create. Every day of your life starts the same way — with a God who is still in the business of calling light out of dark places. Whatever feels formless in your life right now hasn't escaped His attention.",
    prayer:
      "Lord, You spoke the world into being. Speak into the unformed parts of my life today. Help me trust Your timing even when I can't yet see what You're making.",
    application:
      "Name one area of your life that feels unfinished or chaotic. Write a one-sentence prayer asking God to bring order to it this week.",
  },
  {
    day: 2,
    title: "A Garden, Not a Cage",
    basedOn: "Genesis 2-3",
    keyLesson: "Freedom and boundaries were both gifts from the start.",
    reflection:
      "God didn't give Adam and Eve a list of rules to ruin their fun — He gave them a garden full of 'yes' and only one 'no.' Sin convinced them the one boundary was a cage. Most temptation still works the same way: it reframes a loving limit as a locked door.",
    prayer:
      "Father, help me see Your boundaries as guardrails, not walls. Where I've believed a lie about what's truly good for me, show me the truth.",
    application:
      "Identify one boundary in your life — a habit, relationship, or limit — that you've started resenting. Ask God to help you see His care behind it.",
  },
  {
    day: 3,
    title: "Covered, Not Hidden",
    basedOn: "Genesis 4-7",
    keyLesson: "God pursues people even after they've run.",
    reflection:
      "Cain ran from his guilt; Noah's generation buried theirs under noise and distraction. In both stories, God doesn't disappear when sin shows up — He keeps showing up, asking questions, offering a way back. Grace finds people who think they're too far gone to be found.",
    prayer:
      "God, thank You for not giving up on people who run. Help me stop hiding the parts of my story I'm ashamed of, and bring them into the light with You.",
    application:
      "Is there something you've been avoiding bringing to God? Spend two minutes in honest, unfiltered prayer about it today.",
  },
  {
    day: 4,
    title: "Faith Before the Finish Line",
    basedOn: "Genesis 8-11",
    keyLesson: "Obedience often starts before you can see the outcome.",
    reflection:
      "Noah built a boat for rain he'd never seen. The builders of Babel built a tower because they could see exactly where pride leads when it's left unchecked. One story shows faith that trusts what's unseen; the other shows ambition that trusts only what it can control.",
    prayer:
      "Lord, grow my trust in what You've promised, even when I can't yet see it. Keep me from building my life on my own ability to control the outcome.",
    application:
      "Write down one promise from Scripture you're currently waiting on. Thank God for it in advance today.",
  },
  {
    day: 5,
    title: "Called While Still Wandering",
    basedOn: "Genesis 12-15",
    keyLesson: "God's call often comes before a person feels ready for it.",
    reflection:
      "Abram wasn't a finished product when God called him — he was a man from a pagan city with no map and no son yet to inherit anything. God's call rarely waits for us to feel qualified. It just asks for a first step.",
    prayer:
      "Father, I don't always feel ready for what You're asking of me. Give me the courage to take the next step anyway, trusting You with the rest of the map.",
    application:
      "What's one 'next step' you've been delaying because you don't feel ready? Take it this week, even imperfectly.",
  },
  {
    day: 6,
    title: "Waiting Doesn't Mean Forgotten",
    basedOn: "Genesis 16-19",
    keyLesson: "Taking matters into our own hands rarely speeds up God's timing — it usually complicates it.",
    reflection:
      "Abram and Sarai grew tired of waiting and tried to engineer the promise themselves. The result was pain that outlasted their patience. God's delays are not His denials, even when our timeline says otherwise.",
    prayer:
      "Lord, when waiting feels unbearable, remind me that You haven't forgotten Your promises to me. Keep me from forcing outcomes that are Yours to give.",
    application:
      "Where are you tempted to 'help God out' instead of trusting His timing? Bring that specific situation to Him in prayer today.",
  },
  {
    day: 7,
    title: "One Week In",
    basedOn: "Genesis 20-23",
    keyLesson: "A week of consistency is a milestone worth celebrating, not just a checkbox.",
    reflection:
      "You've spent a week walking through the opening pages of a story that spans the whole of human history — and your own. Abraham's story is full of detours, but God's faithfulness never took a day off. Neither has His attention on you this week.",
    prayer:
      "Thank You, Lord, for this first week. Thank You for being patient with my doubts and consistent with Your promises. Keep my heart soft and my habit steady.",
    application:
      "Look back at this week's readings. Write down one verse that stood out, and why.",
  },
];

export function getDevotional(day: number): Devotional | undefined {
  return DEVOTIONALS.find((d) => d.day === day);
}
