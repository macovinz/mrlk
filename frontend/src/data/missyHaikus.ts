export type MoodKey =
  | "overwhelmed"
  | "stressed"
  | "sad"
  | "miserable"
  | "frustrated"
  | "stuck"
  | "wantToQuit"
  | "unappreciated"
  | "lowEsteem"
  | "okay";

export const HAIKUS: Record<MoodKey, string[]> = {
  overwhelmed: [
    "waves stack on waves / still, breath returns to the shore / you are not the tide",
    "too many pages / one kind sip, one slow inhale / the mountain softens",
    "noise in every room / choose one tiny, gentle light / let it guide you home",
    "your hands hold too much / place one worry on the table / leave it for tomorrow",
  ],
  stressed: [
    "strings pulled far too tight / loosen one, then one again / music finds its rest",
    "clock keeps shouting loud / you answer with steady breaths / minutes bow to you",
    "storm across the brow / tea steam draws a quiet path / thunder walks away",
  ],
  sad: [
    "rain sits in your chest / let a window open wide / swallows map the blue",
    "tears salt the shoreline / each drop grows a tender seed / small greens after rain",
    "clouds learn to wander / they never forget the sun / neither will you, love",
  ],
  miserable: [
    "night will not unclench / even stars seem far from kind / still, dawn knows your name",
    "heavy as wet wool / we hang it near morning light / it dries, thread by thread",
    "room of dull mirrors / turn one face toward the dawn / the glass begins warm",
  ],
  frustrated: [
    "locked door, stubborn key / tilt, breathe, try a softer hand / click — a patient yes",
    "words knot at the tongue / step back from the rope a while / it loosens alone",
    "brick upon brick sighs / a single weed splits the seam / you are that green will",
  ],
  stuck: [
    "mud up to the knees / lift one heel, then let it rest / the path learns your pace",
    "blank page stares you down / draw one small, imperfect line / the road starts right there",
    "compass without north / touch your pocket—there's your pulse / that beat points the way",
  ],
  wantToQuit: [
    "hands say: let this go / heart says: pause, drink water first / then choose with clear eyes",
    "ledge feels like the end / look—there's a hidden staircase / carved by all your tries",
    "nursing night runs long / your kindness lights quiet beds / keep one light for you",
  ],
  unappreciated: [
    "you pour from warm cups / some thank‑yous fall to the floor / still, you warmed the room",
    "quiet good you do / moves like wind through tired leaves / trees still learn to sway",
    "not every soft hand / receives a soft hand back / mine is reaching now",
  ],
  lowEsteem: [
    "mirror speaks in fog / wipe it with your gentlest sleeve / your eyes still shine true",
    "grades, glares, passing talk / none can weigh a steadfast heart / you carry a sea",
    "count the things you are: / patient, careful, still learning / enough, enough, love",
  ],
  okay: [
    "a small sunny patch / sit here, finish your tea slow / the day nods with you",
    "soft wind after rain / we don't need fireworks now / just this clear, kind breath",
    "you made it this far / add a tiny joy to keep / pocket‑sized sunrise",
  ],
};