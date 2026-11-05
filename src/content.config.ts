import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/site' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    location: z.string(),
    email: z.email(),
    nav: z.array(link),
    ticker: z.array(z.string()),
    social: z.array(link),
    ui: z.object({
      skip_link: z.string(),
      menu_open: z.string(),
      menu_close: z.string(),
      nav_label: z.string(),
      footer_nav_label: z.string(),
      rights: z.string(),
      play_video: z.string(),
      pause_video: z.string(),
      sound_on: z.string(),
      sound_off: z.string(),
    }),
  }),
});

const formField = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'tel', 'select', 'textarea']),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

// One schema for every page; each page fills the fields its template uses.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    headline: z.string(),
    lede: z.string(),
    eyebrow: z.string().optional(),
    cta: link.optional(),
    strapline: z.string().optional(),
    sections: z.array(z.object({ heading: z.string(), body: z.string() })).optional(),
    footnote: z.string().optional(),
    intro_heading: z.string().optional(),
    intro: z.string().optional(),
    form_fields: z.array(formField).optional(),
    submit_label: z.string().optional(),
    email_label: z.string().optional(),
    email_button: z.string().optional(),
    // A muted background loop. Video files live in public/ (served as-is); the
    // poster is an optimised image. The mobile cut is optional (below 768px).
    hero_video: z
      .object({
        title: z.string(),
        poster: image(),
        mp4: z.string(),
        mobile_mp4: z.string().optional(),
      })
      .optional(),
    // A short section above the page's content on the home page.
    story: z.object({ title: z.string(), body: z.string() }).optional(),
    // A short title over the page's content when it's shown as a home page section.
    section_title: z.string().optional(),
    // Who the company has worked for: a lead-in, then the names as a sentence.
    customers: z
      .object({
        label: z.string(),
        list: z.string(),
      })
      .optional(),
    // A Spotify playlist embed. The ID is the last part of the playlist's URL.
    playlist: z
      .object({
        spotify_id: z.string(),
        title: z.string(),
        link_label: z.string(),
      })
      .optional(),
    // More full-screen loops, after the outro line. Same shape as hero_video.
    hero_films: z
      .array(
        z.object({
          title: z.string(),
          poster: image(),
          mp4: z.string(),
          mobile_mp4: z.string().optional(),
        }),
      )
      .optional(),
    // The line after the headline, a small note under it, and the short line shown
    // over the video after that.
    hero_closing: z
      .object({
        line: z.string(),
        note: z.string().optional(),
        outro: z.string().optional(),
      })
      .optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) => z.object({
    order: z.number().int(),
    category: z.string(),
    title: z.string(),
    summary: z.string(),
    bullets: z.array(z.string()),
    // The same services with a definition and an icon, where a design has room for them.
    offerings: z
      .array(
        z.object({
          name: z.string(),
          definition: z.string(),
          icon: z.enum(['compass', 'faders', 'microphone', 'ticket', 'waveform', 'disc', 'people', 'listen', 'setlist', 'film', 'send', 'pencil']),
        }),
      )
      .optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      category: z.string(),
      title: z.string(),
      summary: z.string(),
      image: image().optional(),
      image_alt: z.string().optional(),
      // Optional YouTube video; the image above doubles as its poster.
      video: z
        .object({
          youtube_id: z.string().regex(/^[\w-]{11}$/),
          title: z.string(),
        })
        .optional(),
    }),
});

export const collections = { site, pages, services, work };
