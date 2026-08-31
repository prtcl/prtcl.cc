import type { Doc } from '../_generated/dataModel';

type ProjectsPromptVariables = 'PROJECTS' | 'PROJECT_COUNT';

const SYSTEM_PROMPT = `You are drafting a short line that will be appended as the final sentence of Cory O'Brien's bio on his personal site (prtcl.cc). Match the bio's voice — third-person, quiet, understated, technical-with-a-poetic-edge, no marketing gloss. Return only the Markdown — no code fences, no preamble, no trailing commentary.`;

const BIO_REFERENCE = `Cory O'Brien is a software engineer and sound artist who lives in London.
He currently works at Reuters News as lead engineer, and spends most days field recording or patching in Symbolic Sound Kyma.`;

const PROJECTS_PROMPT = `
Bio (your sentence will be rendered as the final line of this bio):
<bio>
${BIO_REFERENCE}
</bio>

Projects (in order):
<projects>
{{PROJECTS}}
</projects>

Category reference:
- "sound" — an album, release, or set of recordings
- "code" — a tool, site, or piece of software
- "text" — a piece of writing, essay, or interview
- "video" — a live performance excerpt or sound companion video

Write one or two sentences (a single sentence is ideal) that mention all {{PROJECT_COUNT}} projects, each as an inline Markdown link to its URL. Prefer short, natural phrasing, with the result flowing naturally in the bio as "intro line" -> "does this" -> "has done this".

A "project" in this context can be understood as a completed artifact, past tense, rather than an ongoing activity. The ordering may be chronological, or may highlight a favorite project for a period of time. The projects synthesis should give the reader a "has done this" understanding.

Some guidelines:
- Assume that the reader has some familiarity with technical concepts and tools; "hydrophone recordings" is preferable to "underwater", "chaotic ML model" to "AI project".
- Use the context provided for each project to inform surrounding framing, but avoid replacing artwork titles with a summary of this context
- Do not open with a list-frame like "Recent projects include..." or similar generic constructs
- Avoid inventing themes for an artwork, like "water-based", as this may not be accurate. When in doubt, just use the project title.
- The project context is sometimes a verbatim snippet of release copy, use this copy as-is when this usage would make sense
- Prefer describing projects in isolation, even if an album release and interview for the same artwork appear adjacent in the inputs
- Don't get jazzy with your adjectives, like "traces" or "surfaces"; your role should be cohesion and synthesis, not invention.
`;

export function buildProjectsPrompt(projects: Doc<'projects'>[]): {
  prompt: string;
  system: string;
} {
  const projectList = projects.map(formatProject).join('\n');

  return {
    prompt: replaceVariables<ProjectsPromptVariables>(PROJECTS_PROMPT, {
      PROJECTS: projectList,
      PROJECT_COUNT: String(projects.length),
    }),
    system: SYSTEM_PROMPT,
  };
}

function formatProject(p: Doc<'projects'>): string {
  const payload = {
    title: p.title,
    url: p.url,
    releaseDate: p.releaseDate ? new Date(p.releaseDate).toLocaleDateString() : 'unknown',
    category: p.category,
    context: p.context?.trim().replace(/\s+/g, ' ') ?? '',
  };
  return JSON.stringify(payload, null, 2);
}

function replaceVariables<V extends string>(
  template: string,
  variables: Record<V, string>,
): string {
  return Object.entries(variables)
    .reduce<string>((res, [name, value]) => {
      return typeof value === 'string' ? res.replace(`{{${name}}}`, value) : res;
    }, template)
    .trim();
}
