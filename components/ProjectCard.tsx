import type { Project } from "@/core/data/mock";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-slate-900/60">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {project.title}
          </h3>
          {typeof index === "number" ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              #{index + 1}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-900 underline underline-offset-4 dark:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
