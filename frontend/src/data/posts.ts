// src/data/posts.ts
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;        // ISO
  cover: string;
  tags?: string[];
  // Keep body as markdown-like string for now; you can swap to MDX later.
  body: string;
};

export const POSTS: Post[] = [
  {
    slug: "bliss-in-small-moments",
    title: "Bliss in Small Moments",
    excerpt:
      "A note on quiet sunsets, kitchen music, and the calm that shows up when we let it.",
    date: "2025-01-04",
    cover:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1600&auto=format&fit=crop",
    tags: ["reflection", "sunset"],
    body: `
We talk about *big* joy, but lately I'm learning the rhythm of the smaller kind.

- The first orange slice of sky at 5:11 PM.
- The way garlic softens right when the song hits the chorus.
- A text that says “home soon.”

> I don't think peace is loud. I think it's confident.

Tonight I walked slower. I let the day set. I let the kitchen be a little messy and still felt okay. Maybe bliss isn’t a peak—maybe it’s a pattern.
`,
  },
  {
    slug: "keeping-recipes-gentle",
    title: "Keeping Recipes Gentle",
    excerpt:
      "A warm pantry philosophy, three staples, and cooking without pressure.",
    date: "2024-12-12",
    cover:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600&auto=format&fit=crop",
    tags: ["kitchen", "notes"],
    body: `
I like recipes that forgive me.

**Three pantry anchors**:
1. Chickpeas for quick texture.
2. Chili crisp for heat + crunch.
3. Lemon for brightness.

If the recipe asks for perfection, I skip to the part that tastes good.
`,
  },
];
