
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  link: string;
  order_index?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  contact_email: string;
  location: string;
}
