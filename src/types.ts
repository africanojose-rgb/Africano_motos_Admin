export type MembershipType = 'Platinum' | 'Estándar' | 'VIP';

export type JobStatus = 'En Espera' | 'En Progreso' | 'Crítico' | 'Listo';

export interface Client {
  id: string;
  name: string;
  membership: MembershipType;
  avatar: string;
  phone: string;
  activeJob?: string;
}

export interface Motorcycle {
  id: string;
  clientId: string;
  brandModel: string;
  year: number;
  plate: string;
  lastService: string;
}

export interface Job {
  id: string; // e.g., JOB-8821
  clientId: string;
  clientName: string;
  bikeModel: string;
  plate: string;
  status: JobStatus;
  type: string;
  estimatedDelivery: string;
  laborPrice: number;
  partsPrice: number;
  progress: number; // 0 to 100
  date: string; // YYYY-MM-DD
  isPaid: boolean;
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'urgente' | 'aviso' | 'completado';
  title: string;
  subtitle: string;
  tag: string;
}

export interface Guarantee {
  id: string;
  title: string;
  bikeModel: string;
  clientName: string;
  status: 'Urgente' | 'Estable' | 'Vencida';
  daysRemaining: number;
  hoursRemaining?: number;
  certificateNumber: string;
  imageUrl: string;
}

export interface MaintenanceTask {
  id: string;
  type: 'oil' | 'tire' | 'chain' | 'other';
  title: string;
  subtitle: string;
  clientName: string;
  clientPhone: string;
  dueDate: string;
  isOverdue: boolean;
  delayDays?: number;
}
