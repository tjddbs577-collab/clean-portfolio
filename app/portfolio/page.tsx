import { getProjects } from "@/core/logic/getProjects";
import { ProjectCard } from "@/components/ProjectCard";

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-10">
        <div className="space-y-3 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-sm backdrop-blur dark:bg-slate-900/60">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-600 dark:text-slate-300">
            포트폴리오
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            프로젝트 모음
          </h1>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
            core logic과 UI를 분리해 데이터 소스(mock → API → DB)를 바꿔도 UI는 그대로
            재사용할 수 있도록 설계했습니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
