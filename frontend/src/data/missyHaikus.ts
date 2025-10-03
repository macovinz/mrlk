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
    "Waves stack on waves / Still, breath returns to the shore / you are not the tide",
    "Too many pages / one kind sip, one slow inhale / the mountain softens",
    "Noise in every room / choose one tiny, gentle light / let it guide you home",
    "Your hands hold too much / place one worry on the table / leave it for tomorrow",
  ],
  stressed: [
    "Strings pulled far too tight / loosen one, then one again / music finds its rest",
    "Clock keeps shouting loud / you answer with steady breaths / minutes bow to you",
    "Storm across the brow / tea steam draws a quiet path / thunder walks away",
  ],
  sad: [
    "Rain sits in your chest / let a window open wide / swallows map the blue",
    "Tears salt the shoreline / each drop grows a tender seed / small greens after rain",
    "Clouds learn to wander / they never forget the sun / neither will you, baby",
  ],
  miserable: [
    "Night will not unclench / even stars seem far from kind / still, dawn knows your name",
    "Heavy as wet wool / we hang it near morning light / it dries, thread by thread",
    "Room of dull mirrors / turn one face toward the dawn / the glass begins warm",
  ],
  frustrated: [
    "Locked door, stubborn key / tilt, breathe, try a softer hand / click — a patient yes",
    "Words knot at the tongue / step back from the rope a while / it loosens alone",
    "Brick upon brick sighs / a single weed splits the seam / you are that green will",
  ],
  stuck: [
    "Mud up to the knees / lift one heel, then let it rest / the path learns your pace",
    "Blank page stares you down / draw one small, imperfect line / the road starts right there",
    "Compass without north / touch your pocket—there's your pulse / that beat points the way",
  ],
  wantToQuit: [
    "Hands say: let this go / heart says: pause, drink water first / then choose with clear eyes",
    "Ledge feels like the end / look—there's a hidden staircase / carved by all your tries",
    "Nursing night runs long / your kindness lights quiet beds / keep one light for you",
  ],
  unappreciated: [
    "You pour from warm cups / some thank‑yous fall to the floor / still, you warmed the room",
    "Quiet good you do / moves like wind through tired leaves / trees still learn to sway",
    "Not every soft hand / receives a soft hand back / mine is reaching now",
  ],
  lowEsteem: [
    "Mirror speaks in fog / wipe it with your gentlest sleeve / your eyes still shine true",
    "Grades, glares, passing talk / none can weigh a steadfast heart / you carry a sea",
    "Count the things you are: / patient, careful, still learning / enough, enough, baby",
  ],
  okay: [
    "A small sunny patch / sit here, finish your tea slow / the day nods with you",
    "Soft wind after rain / we don't need fireworks now / just this clear, kind breath",
    "You made it this far / add a tiny joy to keep / pocket‑sized sunrise",
  ],
};