
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  link: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SiteSettings {
  name: string;
  bio: string;
  email: string;
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}
