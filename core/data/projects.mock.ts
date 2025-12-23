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
    tech: ["Vercel", "Shopify Hydrogen", "TypeScript"],
    links: [
      { href: "https://example.com/case-study-3", label: "사례 보기" },
      { href: "https://github.com", label: "깃허브" }
    ]
  },
  {
    title: "버텍스 모빌리티 앱",
    description:
      "다양한 이동 수단을 아우르는 루팅과 예측 알림을 제공하는 엔드투엔드 모빌리티 동반자.",
    tech: ["React Native", "Expo", "Figma"],
    links: [
      { href: "https://example.com/case-study-4", label: "사례 보기" },
      { href: "https://medium.com", label: "미디엄" }
    ]
  },
  {
    title: "헤일로 헬스 포털",
    description:
      "원격 진단 환경에 임상급 명료함을 제공하는 텔레헬스 플랫폼.",
    tech: ["Next.js", "GraphQL", "Apollo"],
    links: [
      { href: "https://example.com/case-study-5", label: "사례 보기" },
      { href: "https://github.com", label: "깃허브" }
    ]
  },
  {
    title: "아틀라스 XR 쇼케이스",
    description:
      "산업 팀이 생각의 속도로 프로토타이핑할 수 있도록 돕는 혼합현실 구성 도구.",
    tech: ["Unity", "React Three Fiber", "Azure"],
    links: [
      { href: "https://example.com/case-study-6", label: "사례 보기" },
      { href: "https://youtube.com", label: "데모 보기" }
    ]
  }
];
