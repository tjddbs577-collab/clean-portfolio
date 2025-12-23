import { mockProjects, type Project } from "../data/mock";

export async function getProjects(): Promise<Project[]> {
  return mockProjects;
}
