export interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  status: 'OPEN' | 'CLOSED';
  views: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  hr?: {
    fullName: string;
  };
}

export interface Application {
  id: string;
  coverLetter: string;
  resumeUrl: string;
  status: 'Yangi' | "Ko'rib chiqilmoqda" | 'Qabul qilindi' | 'Rad etildi';
  createdAt: string;
  updatedAt: string;
  userId: string;
  vacancyId: string;
  Vacancy?: {
    title: string;
    salary: string;
    status: string;
  };
  candidate?: {
    fullName: string;
    email: string;
  };
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  phone?: string;
  city?: string;
  birthDate?: string;
  currentJob?: string;
  position?: string;
  experience?: string;
  skills?: string;
  bio?: string;
  department?: string;
  avatarUrl?: string;
  resumeUrl?: string;
}

export type ApplicationStatus = 'Yangi' | "Ko'rib chiqilmoqda" | 'Qabul qilindi' | 'Rad etildi';
