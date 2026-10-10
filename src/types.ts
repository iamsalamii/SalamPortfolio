export type AvailabilityStatus = 'available' | 'employed' | 'freelance' | 'not_available';

export interface CvItem {
  id: string;
  label: string;
  language: string;
  url: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface HeroStatCard {
  id: string;
  indexLabel: string; // e.g. "01 // EXP"
  value: string;      // e.g. "+2 ANS"
  subtitle: string;   // e.g. "DIRECTSOFT INGÉNIERIE" or customized company/stack
  icon?: 'terminal' | 'code' | 'database' | 'layers' | 'sparkles';
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  headline: string;
  bioShort: string;
  bioLong: string[];
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  heroBackgroundUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
  availabilityStatus: AvailabilityStatus;
  availabilityText: string;
  yearsOfExperience: number;
  specialties: string[];
  principles?: { title: string; description: string }[];
  heroStats?: HeroStatCard[];
  cvList: CvItem[];
  translations?: Record<string, any>;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  translations?: Record<string, any>;
}

export type ProjectStatus = 'published' | 'draft' | 'archived';

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  gallery: string[];
  videoUrl?: string;
  technologyIds: string[];
  categoryId: string;
  categoryName?: string;
  client?: string;
  role: string;
  duration?: string;
  status: ProjectStatus;
  isFeatured: boolean;
  order: number;
  features: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  architectureNotes?: string;
  githubUrl?: string;
  showSourceCode?: boolean;
  liveDemoUrl?: string;
  docUrl?: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  translations?: Record<string, any>;
}

export interface TechCategory {
  id: string;
  name: string;
  slug?: string;
  key?: string;
  description?: string;
  order: number;
}

export interface Technology {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  icon?: string;
  logoUrl?: string;
  description?: string;
  brandColor?: string;
  officialDocsUrl?: string;
  order: number;
  isActive: boolean;
  isPrimary: boolean;
}

export type ContractType = 'Full-time' | 'Contract' | 'Freelance' | 'Part-time' | 'Internship' | string;

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string;
  period?: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  highlights?: string[];
  technologyIds: string[];
  companyLogo?: string;
  companyUrl?: string;
  order: number;
  translations?: Record<string, any>;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate?: string;
  period?: string;
  status?: 'graduated' | 'in_progress' | 'completed' | 'ongoing' | string;
  description?: string;
  logoUrl?: string;
  institutionUrl?: string;
  order: number;
  translations?: Record<string, any>;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  expirationDate?: string;
  badgeImageUrl?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificatePdfUrl?: string;
  logoUrl?: string;
  description?: string;
  isActive: boolean;
  order: number;
  translations?: Record<string, any>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon: string;
  features: string[];
  ctaText?: string;
  ctaUrl?: string;
  isActive: boolean;
  order: number;
  translations?: Record<string, any>;
}

export type ServiceOffering = Service;

export type SocialPlatform = 'GitHub' | 'LinkedIn' | 'X' | 'YouTube' | 'GitLab' | 'StackOverflow' | 'Discord' | 'Email' | 'Other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  icon: string;
  order: number;
  displayLocation: 'header' | 'footer' | 'hero' | 'contact' | 'all';
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  isFeatured?: boolean;
  publishedAt: string;
  readTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  translations?: Record<string, any>;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isArchived: boolean;
  repliedAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  href?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isVisible?: boolean;
  openInNewTab: boolean;
  sectionId?: string;
}

export type SectionKey = 
  | 'hero' 
  | 'about' 
  | 'tech_stack' 
  | 'technologies' 
  | 'projects' 
  | 'experience' 
  | 'education' 
  | 'certifications' 
  | 'services' 
  | 'blog' 
  | 'contact';

export interface PageSection {
  id: string;
  sectionKey: SectionKey;
  title: string;
  subtitle: string;
  isEnabled: boolean;
  order: number;
}

export interface Language {
  id?: string;
  code: string;
  name: string;
  nativeName?: string;
  flag: string;
  isDefault: boolean;
  isEnabled?: boolean;
  isActive?: boolean;
  order?: number;
}

export interface MediaItem {
  id: string;
  name?: string;
  title?: string;
  type?: 'image' | 'document' | 'video';
  url: string;
  thumbnailUrl?: string;
  sizeBytes?: number;
  altText: string;
  category: string;
  uploadedAt: string;
}

export interface SiteSettings {
  siteName: string;
  ownerName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timezone: string;
  googleAnalyticsId: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeSettings {
  mode?: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius?: 'sm' | 'md' | 'lg' | 'full' | string;
  fontHeading?: string;
  fontBody?: string;
}

export interface ThemeConfig {
  mode?: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robotsPolicy: string;
}

export interface SeoConfig {
  siteTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogImage?: string;
  twitterHandle?: string;
  robotsTxt?: string;
}

export type AdminRole = 'Super Admin' | 'Admin' | 'Editor' | 'superadmin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  username: string;
  name?: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface ActivityLog {
  id: string;
  user?: string;
  userName?: string;
  action: string;
  entityType?: string;
  target?: string;
  details: string;
  timestamp: string;
}

export interface AppData {
  personalInfo: PersonalInfo;
  projects: Project[];
  projectCategories: ProjectCategory[];
  technologies: Technology[];
  techCategories: TechCategory[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  services: Service[];
  serviceOfferings?: Service[];
  socialLinks: SocialLink[];
  blogPosts: BlogPost[];
  contactMessages: ContactMessage[];
  navigationItems: NavigationItem[];
  pageSections: PageSection[];
  languages: Language[];
  translations: Record<string, Record<string, string>>;
  mediaItems: MediaItem[];
  siteSettings: SiteSettings;
  themeSettings: ThemeSettings;
  themeConfig?: ThemeConfig;
  seoSettings: SeoSettings;
  seoConfig?: SeoConfig;
  users: AdminUser[];
  activityLogs: ActivityLog[];
  securitySettings?: {
    otpEmail?: string;
  };
}
