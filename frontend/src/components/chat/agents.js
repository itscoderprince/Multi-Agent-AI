import {
  ZapIcon,
  MessageSquareIcon,
  Code2Icon,
  FileTextIcon,
  PresentationIcon,
  ImageIcon,
  GlobeIcon,
} from "lucide-react"

export const AGENTS = [
  {
    id: "auto",
    name: "Auto",
    icon: ZapIcon,
    description: "Best for general tasks & smart routing",
  },
  {
    id: "chat",
    name: "Chat",
    icon: MessageSquareIcon,
    description: "Fast conversational reasoning",
  },
  {
    id: "coding",
    name: "Coding",
    icon: Code2Icon,
    description: "Code, scripts & debugging",
  },
  {
    id: "pdf",
    name: "PDF",
    icon: FileTextIcon,
    description: "Extract & query documents",
  },
  {
    id: "ppt",
    name: "PPT",
    icon: PresentationIcon,
    description: "Generate slide presentations",
  },
  {
    id: "image",
    name: "Image",
    icon: ImageIcon,
    description: "Visual design & generation",
  },
  {
    id: "search",
    name: "Search",
    icon: GlobeIcon,
    description: "Live web research",
  },
]
