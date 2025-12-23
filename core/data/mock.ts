export type Project = {
  title: string;
  description: string;
  tech: string[];
  links: { href: string; label: string }[];
};

export const mockProjects: Project[] = [
  {
    title: "시네스티지아 스튜디오",
    description:
      "생성형 아트와 반응형 조명을 결합해 사운드에 따라 변화하는 몰입형 설치 작품.",
    tech: ["Three.js", "WebGL", "Next.js"],
    links: [
      { href: "https://example.com/case-study-1", label: "사례 보기" },
      { href: "https://dribbble.com", label: "드리블" }
    ]
  },
  {
    title: "플로우 파이낸스 OS",
    description:
      "실시간 협업이 가능한 차세대 핀테크 팀을 위한 디자인 시스템과 통합 대시보드.",
    tech: ["Next.js", "Tailwind CSS", "Radix UI"],
    links: [
      { href: "https://example.com/case-study-2", label: "사례 보기" },
      { href: "https://behance.net", label: "비핸스" }
    ]
  },
  {
    title: "오로라 커머스",
    description:
      "지속 가능한 패션 하우스를 위한 헤드리스 커머스 플래그십으로 전환율을 40% 끌어올린 사례.",
    tech: ["Vercel", "TypeScript", "Next.js"],
    links: [
      { href: "https://example.com/case-study-3", label: "사례 보기" },
      { href: "https://github.com", label: "깃허브" }
    ]
  }
];
