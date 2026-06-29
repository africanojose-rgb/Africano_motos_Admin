import { Client, Motorcycle, Job, Guarantee, MaintenanceTask, Alert } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'MT-8821',
    name: 'Marcus Thorne',
    membership: 'Platinum',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIHSjti5kjbAgft3JbMeVF9odZ9E1p8DU4v9mNhNJkA6BQzhseAxpiUB63pPpwyxme3omVAG214AI83i21bbk8O1qU5-ZCY7-dYvq-NBjHbbYYPk4xR-eVvbmenG1KnIrDWBosm8lz-y4WMjHkXxhymkfB_9zUlzTznmaISapCQEe7NgNF88-PwxrlMY8B7dCeqaY8XPmr3_yPmx1bXyFghnrsRIUQk2vzhe7A5uIMfpBysOMomB-qYAN58ZgKnBniqfzZ-jv7_mw',
    phone: '+34600112233',
    activeJob: 'Cambio de Pastillas de Freno'
  },
  {
    id: 'ER-4402',
    name: 'Elena Rodriguez',
    membership: 'Estándar',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD4VMky7owEQ-z9SksM37dBh_Jg4wGCn_fp4bDTRCSr0onG4StoOec8M8VMjwFK9bZfNy5X5w3RQkDA9FmqUxbGc8MFu_i1R11bwENbPvxqG5Dg7pvs_2w6dttS7nJDpfyLMyriBbyv7ZNGTnBhZYyNVtEQuuNHofYbIp18x-B6m0LyxRpZLpMiFDzgepZJS9rmzzz49tkJfst8pm3MCgLeq2jJPOHlvLi9ydao1g3FcC2bnqldiwNku7eMSrLqDGOmhjZavWDm9E',
    phone: '+34611223344',
    activeJob: 'Requiere Cambio de Aceite - Vencido hace 200mi'
  },
  {
    id: 'JM-9012',
    name: 'Jackson Miller',
    membership: 'Estándar',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcG9S4jh7KOcOmwpcyEkkUB5LbZo29nP-tGGLdWdlE_v9uOgP3EzFeFCsF35qsmLEjSrvJk4vy02Kd71Js-TTcuSIFwg9_GJEyC3Y2h0QKRVNzsdgYm4IZhc3tnjKZ5ZOGMwNkwh5djQ0rLuxDxpprzcPjFVKLWWTNLPyhw6pgA3rT9lpQTCANdHFh6ewLO228WNmzciQ3XRaL0Ld8c5AiEkRsWOEhRsjEkmuvLyMqGVjIt9HQbcGwAdT8wlNvBOkxonYT-G-PvvY',
    phone: '+34622334455'
  },
  {
    id: 'SA-1004',
    name: 'Sami Al-Fayed',
    membership: 'VIP',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvBLB240TKORZOtoIfKKSu-9_9Sd1-H-pCNjdQ2e_HE6-H66DInrSGTSOhhYYw-kB_L2k-1tLzsDGqjcbvYMRFrOLdSFAurwq1mJj0AOU8QA_KtFcSrCEz-u6QGi-dIuQ1vRBt5E33AS7p8xJSsRRonjS9iWpvSK4dbbLC9Sqefe19oGpmuU9pWMWiF4hHOvWnWY62nnO9CVBACvVXHZ5WJkkjw3Aaq1XX6cAj4n-W4Uyybi9M0h5kMBvW_TQAY326owxgk00Khlc',
    phone: '+34633445566',
    activeJob: 'Ajuste de Rendimiento'
  }
];

export const INITIAL_MOTORCYCLES: Motorcycle[] = [
  {
    id: 'BIKE-1',
    clientId: 'MT-8821',
    brandModel: 'Ducati Panigale V4 S',
    year: 2023,
    plate: 'DX-992-K',
    lastService: 'OCT 12, 2023'
  },
  {
    id: 'BIKE-2',
    clientId: 'MT-8821',
    brandModel: 'BMW R 1250 GS',
    year: 2021,
    plate: 'B-GS-1250',
    lastService: 'MAY 05, 2023'
  },
  {
    id: 'BIKE-3',
    clientId: 'ER-4402',
    brandModel: 'Triumph Street Triple RS',
    year: 2022,
    plate: 'TR-ST-765',
    lastService: 'AGO 19, 2023'
  },
  {
    id: 'BIKE-4',
    clientId: 'JM-9012',
    brandModel: 'Harley Davidson Iron 883',
    year: 2019,
    plate: 'HD-MIL-88',
    lastService: 'NOV 30, 2023'
  },
  {
    id: 'BIKE-5',
    clientId: 'SA-1004',
    brandModel: 'Kawasaki Ninja H2',
    year: 2024,
    plate: 'FAST-01',
    lastService: 'AHORA MISMO'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'JOB-8821',
    clientId: 'MT-8821',
    clientName: 'Marcus Thorne',
    bikeModel: 'Ducati Panigale V4 S',
    plate: 'DX-992-K',
    status: 'En Progreso',
    type: 'Cambio de Pastillas de Freno',
    estimatedDelivery: 'Hoy, 5:00 PM',
    laborPrice: 1250.00,
    partsPrice: 3420.00,
    progress: 65,
    date: '2023-10-15',
    isPaid: true
  },
  {
    id: 'JOB-8819',
    clientId: 'ER-4402',
    clientName: 'Elena Rodriguez',
    bikeModel: 'Triumph Street Triple RS',
    plate: 'TR-ST-765',
    status: 'Listo',
    type: 'Cambio de Aceite',
    estimatedDelivery: 'Completado: 24 Oct, 2:30 PM',
    laborPrice: 450.00,
    partsPrice: 180.00,
    progress: 100,
    date: '2023-10-24',
    isPaid: true
  },
  {
    id: 'JOB-8815',
    clientId: 'JM-9012',
    clientName: 'Jackson Miller',
    bikeModel: 'Harley Davidson Iron 883',
    plate: 'HD-MIL-88',
    status: 'En Espera',
    type: 'Inspección Eléctrica',
    estimatedDelivery: 'Cita: Mañana, 9:00 AM',
    laborPrice: 2800.00,
    partsPrice: 5600.00,
    progress: 15,
    date: '2023-10-28',
    isPaid: false
  },
  {
    id: 'JOB-8810',
    clientId: 'ER-4402',
    clientName: 'Elena Rodriguez',
    bikeModel: 'Triumph Scrambler 1200',
    plate: 'BK-44-LT',
    status: 'Crítico',
    type: 'Reparación de Suspensión',
    estimatedDelivery: 'Esperando repuestos',
    laborPrice: 1500.00,
    partsPrice: 2200.00,
    progress: 30,
    date: '2023-10-20',
    isPaid: false,
    notes: 'Piezas retrasadas: Pastillas traseras'
  },
  {
    id: 'JOB-1004',
    clientId: 'SA-1004',
    clientName: 'Sami Al-Fayed',
    bikeModel: 'Kawasaki Ninja H2',
    plate: 'FAST-01',
    status: 'En Progreso',
    type: 'Ajuste de Rendimiento',
    estimatedDelivery: 'Hoy, 6:00 PM',
    laborPrice: 3200.00,
    partsPrice: 4800.00,
    progress: 85,
    date: '2023-10-29',
    isPaid: false
  }
];

export const INITIAL_GUARANTEES: Guarantee[] = [
  {
    id: 'G-1',
    title: 'Revisión General de Motor',
    bikeModel: 'Ducati Panigale V4 (2022)',
    clientName: 'M. Rossi',
    status: 'Urgente',
    daysRemaining: 2,
    hoursRemaining: 14,
    certificateNumber: '#G-8812',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApcUYxZ7xSLp4I-boZ22YOlHnthiWBNT3dQ-Pt13N0S57ixHR9lyzj76sDLJ6iQ8Cg8fMP9yb7mGJgvhd-RGzm-6iKWfoxG3HISeEncApql7uzlVrgBnzRCGllTemHKx_cFB6mTc687w7BEmV969uNxIwnxQued7rqF8nHKzzOuD054JIZgbU5yDib9-TZL-Vd8xknIXUmdskB-QxTxBLhvboAulPKz_jpwAFRf5e8WEqAZXmCvb-RXeWQ0EgYpFwZDKBl0I9qG8g'
  },
  {
    id: 'G-2',
    title: 'Ajuste de Suspensión',
    bikeModel: 'BMW R1250GS',
    clientName: 'S. Johansson',
    status: 'Estable',
    daysRemaining: 184,
    certificateNumber: '#G-9021',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ITlUsv6byZpSa0DvQNdLr54tWJp02o0wN5b14oiaNm08CykDQBc0HH82hxmgIuyUV3yB5hngppnxmTjgh04qZMS0CIwhCsFrFKHajC5v8f5kEl4Z7a9RLzlqrBHLRXJaF-0uENLzZWotCdr4umTYx23wZnmcenzdRNf7iCmZuCilsY1hnJEk4TTExluvxqWsfStXV0RiUSP3zyLs1JL_OwFg6l6-o8dqX4BPadmGx-g6kQEbKO293m6rXb2GXP0h00tN9uLJKXg'
  },
  {
    id: 'G-3',
    title: 'Cambio de Pastillas de Freno',
    bikeModel: 'Kawasaki Ninja 650',
    clientName: 'J. Doe',
    status: 'Vencida',
    daysRemaining: 0,
    certificateNumber: '#G-3310',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApcUYxZ7xSLp4I-boZ22YOlHnthiWBNT3dQ-Pt13N0S57ixHR9lyzj76sDLJ6iQ8Cg8fMP9yb7mGJgvhd-RGzm-6iKWfoxG3HISeEncApql7uzlVrgBnzRCGllTemHKx_cFB6mTc687w7BEmV969uNxIwnxQued7rqF8nHKzzOuD054JIZgbU5yDib9-TZL-Vd8xknIXUmdskB-QxTxBLhvboAulPKz_jpwAFRf5e8WEqAZXmCvb-RXeWQ0EgYpFwZDKBl0I9qG8g'
  }
];

export const INITIAL_MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'M-1',
    type: 'oil',
    title: 'Cambio de Aceite y Filtro',
    subtitle: 'Vence en 5 días • Marca de 12,000 km',
    clientName: 'Alex Thompson',
    clientPhone: '34677889900',
    dueDate: '24 Oct, 2023',
    isOverdue: false
  },
  {
    id: 'M-2',
    type: 'tire',
    title: 'Inspección de Neumáticos',
    subtitle: 'Revisión programada • Estacional',
    clientName: 'Sarah Miller',
    clientPhone: '34688990011',
    dueDate: '28 Oct, 2023',
    isOverdue: false
  },
  {
    id: 'M-3',
    type: 'chain',
    title: 'Limpieza de Cadena',
    subtitle: 'RETRASADO POR 2 DÍAS',
    clientName: 'Tom Baker',
    clientPhone: '34699001122',
    dueDate: '17 Oct, 2023',
    isOverdue: true,
    delayDays: 2
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'A-1',
    type: 'urgente',
    title: 'Revisión de Pastillas',
    subtitle: 'DUCATI PANIGALE • J. DOE',
    tag: 'URGENTE'
  },
  {
    id: 'A-2',
    type: 'aviso',
    title: 'Garantía por Expirar',
    subtitle: 'HARLEY FAT BOY • S. MILLER',
    tag: 'EN 2D'
  },
  {
    id: 'A-3',
    type: 'completado',
    title: 'Repuestos Recibidos',
    subtitle: 'YAMAHA R1 • COLÍN TRASERO',
    tag: 'RECIBIDO'
  }
];
