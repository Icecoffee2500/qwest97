export type Category = "all" | "research" | "paper_review" | "project" | "about";

export interface Item {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  subtitle?: string | null;
  description: string;
  tags?: string[] | null;
  links?: { label: string; url: string }[] | null;
  year?: number | null;
  publication?: string | null;
}

export const categories: { key: Category; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "research", label: "RESEARCH" },
  { key: "paper_review", label: "PAPER REVIEW" },
  { key: "project", label: "PROJECTS" },
  { key: "about", label: "ABOUT" },
];

export const publications = [
  "CVPR",
  "ICCV",
  "ECCV",
  "NeurIPS",
  "ICML",
  "ICLR",
  "AAAI",
  "IJCAI",
  "ACL",
  "EMNLP",
  "NAACL",
  "SIGIR",
  "KDD",
  "ICRA",
  "IROS",
  "TPAMI",
  "IJCV",
  "TIP",
  "JMLR",
  "Other",
] as const;

export const items: Item[] = [
  {
    id: "research-1",
    category: "research",
    title: "Sample Research Paper Title",
    subtitle: "NeurIPS 2025",
    description:
      "이곳에 논문의 초록을 작성하세요. 연구의 동기, 방법론, 주요 결과를 간결하게 요약합니다. 이 텍스트는 카드를 클릭했을 때 상세 뷰에서 보여집니다.",
    tags: ["Machine Learning", "Deep Learning"],
    links: [
      { label: "Paper", url: "#" },
      { label: "Code", url: "#" },
    ],
    year: 2025,
  },
  {
    id: "research-2",
    category: "research",
    title: "Another Research Paper",
    subtitle: "ICML 2024",
    description:
      "두 번째 연구 논문에 대한 설명입니다. 새로운 방법론을 제안하고 기존 방법 대비 우수한 성능을 보여줍니다.",
    tags: ["Natural Language Processing", "Transformer"],
    links: [
      { label: "Paper", url: "#" },
      { label: "Slides", url: "#" },
    ],
    year: 2024,
  },
  {
    id: "research-3",
    category: "research",
    title: "Early Research Work",
    subtitle: "Workshop Paper — CVPR 2023",
    description:
      "초기 연구 성과물입니다. 워크샵 논문으로 발표되었으며, 이후 연구의 기반이 되었습니다.",
    tags: ["Computer Vision"],
    links: [{ label: "Paper", url: "#" }],
    year: 2023,
  },
  {
    id: "project-1",
    category: "project",
    title: "Open Source Project",
    subtitle: "Personal Project",
    description:
      "오픈소스 프로젝트에 대한 설명입니다. 어떤 문제를 해결하기 위해 만들었고, 어떤 기술 스택을 사용했는지 기술합니다.",
    tags: ["React", "TypeScript", "Next.js"],
    links: [
      { label: "GitHub", url: "#" },
      { label: "Demo", url: "#" },
    ],
    year: 2024,
  },
  {
    id: "project-2",
    category: "project",
    title: "Research Visualization Tool",
    subtitle: "Lab Internal Tool",
    description:
      "연구실 내부에서 사용하는 데이터 시각화 도구입니다. 실험 결과를 효과적으로 분석할 수 있도록 개발했습니다.",
    tags: ["Python", "D3.js", "Data Visualization"],
    links: [{ label: "GitHub", url: "#" }],
    year: 2023,
  },
  {
    id: "about-1",
    category: "about",
    title: "About Me",
    subtitle: "Ph.D. Student",
    description:
      "안녕하세요. 저는 [대학교] [학과] 박사과정에 재학 중인 [이름]입니다.\n\n[지도교수]님의 연구실에서 [연구 분야]를 연구하고 있습니다.\n\n주요 관심사:\n• 관심 분야 1\n• 관심 분야 2\n• 관심 분야 3\n\n학력:\n• [대학교] 박사과정 재학 (2022–현재)\n• [대학교] 석사 (2020–2022)\n• [대학교] 학사 (2016–2020)",
    links: [
      { label: "Email", url: "mailto:your@email.com" },
      { label: "Google Scholar", url: "#" },
      { label: "GitHub", url: "#" },
      { label: "CV", url: "#" },
    ],
  },
];
