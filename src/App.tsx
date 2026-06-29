import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Plus,
  Filter,
  Phone,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Download,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Code,
  Smartphone,
  Database,
  Trash2,
  Settings,
  Menu,
  Info,
  X,
  UserPlus
} from 'lucide-react';
import { KOTLIN_CODE } from './kotlinCode';
import {
  Client,
  Motorcycle,
  Job,
  Guarantee,
  MaintenanceTask,
  Alert,
  MembershipType,
  JobStatus
} from './types';
import {
  INITIAL_CLIENTS,
  INITIAL_MOTORCYCLES,
  INITIAL_JOBS,
  INITIAL_GUARANTEES,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_ALERTS
} from './data';

export default function App() {
  // --- Persistent State ---
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('mototech_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(() => {
    const saved = localStorage.getItem('mototech_motorcycles');
    return saved ? JSON.parse(saved) : INITIAL_MOTORCYCLES;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('mototech_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [guarantees, setGuarantees] = useState<Guarantee[]>(() => {
    const saved = localStorage.getItem('mototech_guarantees');
    return saved ? JSON.parse(saved) : INITIAL_GUARANTEES;
  });

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(() => {
    const saved = localStorage.getItem('mototech_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TASKS;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('mototech_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // --- UI Control State ---
  const [activeTab, setActiveTab] = useState<string>('panel'); // panel, trabajos, finanzas, clientes, alertas
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [dbConsoleLogs, setDbConsoleLogs] = useState<string[]>([]);
  const [currentKotlinFile, setCurrentKotlinFile] = useState<keyof typeof KOTLIN_CODE>('clientEntity');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jobFilter, setJobFilter] = useState<string>('Todas'); // Todas, Pendientes, En Progreso, Completados
  const [commissionPct, setCommissionPct] = useState<number>(35); // 35% default
  const [startDate, setStartDate] = useState<string>('2023-10-01');
  const [endDate, setEndDate] = useState<string>('2023-10-31');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // --- Modals State ---
  const [showNewClientModal, setShowNewClientModal] = useState<boolean>(false);
  const [showNewJobModal, setShowNewJobModal] = useState<boolean>(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState<Job | null>(null);

  // --- New Client Form State ---
  const [newClientName, setNewClientName] = useState('');
  const [newClientMembership, setNewClientMembership] = useState<MembershipType>('Estándar');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newBikeBrandModel, setNewBikeBrandModel] = useState('');
  const [newBikeYear, setNewBikeYear] = useState<number>(2023);
  const [newBikePlate, setNewBikePlate] = useState('');

  // --- New Job Form State ---
  const [newJobClient, setNewJobClient] = useState('');
  const [newJobBike, setNewJobBike] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newJobLabor, setNewJobLabor] = useState<number>(1200);
  const [newJobParts, setNewJobParts] = useState<number>(1800);
  const [newJobStatus, setNewJobStatus] = useState<JobStatus>('En Espera');

  // --- Simulated Calls state ---
  const [activeCall, setActiveCall] = useState<string | null>(null);

  // Save changes to localStorage and log SQL
  useEffect(() => {
    localStorage.setItem('mototech_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('mototech_motorcycles', JSON.stringify(motorcycles));
  }, [motorcycles]);

  useEffect(() => {
    localStorage.setItem('mototech_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('mototech_guarantees', JSON.stringify(guarantees));
  }, [guarantees]);

  useEffect(() => {
    localStorage.setItem('mototech_maintenance', JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks]);

  useEffect(() => {
    localStorage.setItem('mototech_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Helper to add custom Room DB log
  const logSql = (sql: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDbConsoleLogs((prev) => [`[${timestamp}] ${sql}`, ...prev].slice(0, 50));
  };

  // Toast notifier
  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // --- Business Logic Helpers ---
  // Financial Overview Calculations
  const calculatedStats = React.useMemo(() => {
    // Filter jobs by date range
    const filteredJobs = jobs.filter((job) => {
      if (!job.date) return false;
      return job.date >= startDate && job.date <= endDate;
    });

    const brutoTotal = filteredJobs.reduce((sum, j) => sum + j.laborPrice + j.partsPrice, 0);
    const manoDeObra = filteredJobs.reduce((sum, j) => sum + j.laborPrice, 0);
    const repuestosGastos = filteredJobs.reduce((sum, j) => sum + j.partsPrice, 0);

    // Commission payout
    const pagoMecanico = manoDeObra * (commissionPct / 100);
    const utilidadTaller = brutoTotal - pagoMecanico;

    return {
      brutoTotal,
      manoDeObra,
      repuestosGastos,
      pagoMecanico,
      utilidadTaller,
      jobsCount: filteredJobs.length
    };
  }, [jobs, startDate, endDate, commissionPct]);

  // Workshop capacity check
  const workshopCapacity = React.useMemo(() => {
    const activeAndPendingCount = jobs.filter(
      (j) => j.status === 'En Progreso' || j.status === 'En Espera' || j.status === 'Crítico'
    ).length;
    // Let's assume a standard maximum capacity of 6 simultaneous complex jobs
    const capPct = Math.min(Math.round((activeAndPendingCount / 6) * 100), 100);
    return capPct;
  }, [jobs]);

  // --- Handlers ---
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) {
      triggerNotification('Por favor ingresa nombre y teléfono');
      return;
    }

    const clientId = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClient: Client = {
      id: clientId,
      name: newClientName,
      membership: newClientMembership,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvBLB240TKORZOtoIfKKSu-9_9Sd1-H-pCNjdQ2e_HE6-H66DInrSGTSOhhYYw-kB_L2k-1tLzsDGqjcbvYMRFrOLdSFAurwq1mJj0AOU8QA_KtFcSrCEz-u6QGi-dIuQ1vRBt5E33AS7p8xJSsRRonjS9iWpvSK4dbbLC9Sqefe19oGpmuU9pWMWiF4hHOvWnWY62nnO9CVBACvVXHZ5WJkkjw3Aaq1XX6cAj4n-W4Uyybi9M0h5kMBvW_TQAY326owxgk00Khlc',
      phone: newClientPhone,
      activeJob: newBikeBrandModel ? `Registro de ${newBikeBrandModel}` : undefined
    };

    setClients((prev) => [...prev, newClient]);

    // Handle initial motorcycle if provided
    if (newBikeBrandModel && newBikePlate) {
      const newBike: Motorcycle = {
        id: `BIKE-${Math.floor(Math.random() * 1000)}`,
        clientId: clientId,
        brandModel: newBikeBrandModel,
        year: newBikeYear,
        plate: newBikePlate.toUpperCase(),
        lastService: 'AHORA MISMO'
      };
      setMotorcycles((prev) => [...prev, newBike]);
      logSql(`INSERT INTO motorcycles (id, clientId, brandModel, year, plate, lastService) VALUES ('${newBike.id}', '${clientId}', '${newBike.brandModel}', ${newBike.year}, '${newBike.plate}', 'AHORA MISMO');`);
    }

    logSql(`INSERT INTO clients (id, name, membership, phone, avatarUrl) VALUES ('${clientId}', '${newClient.name}', '${newClient.membership}', '${newClient.phone}', '${newClient.avatar}');`);
    triggerNotification(`Cliente ${newClientName} creado exitosamente en SQLite local`);

    // Reset fields
    setNewClientName('');
    setNewClientPhone('');
    setNewBikeBrandModel('');
    setNewBikePlate('');
    setShowNewClientModal(false);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobClient || !newJobBike || !newJobType) {
      triggerNotification('Por favor completa todos los campos del trabajo');
      return;
    }

    const clientObj = clients.find((c) => c.id === newJobClient);
    const bikeObj = motorcycles.find((m) => m.id === newJobBike);

    const jobId = `JOB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newJob: Job = {
      id: jobId,
      clientId: newJobClient,
      clientName: clientObj ? clientObj.name : 'Cliente Desconocido',
      bikeModel: bikeObj ? bikeObj.brandModel : 'Motocicleta',
      plate: bikeObj ? bikeObj.plate : 'SIN PLACA',
      status: newJobStatus,
      type: newJobType,
      estimatedDelivery: 'Hoy, 6:00 PM',
      laborPrice: Number(newJobLabor),
      partsPrice: Number(newJobParts),
      progress: newJobStatus === 'Listo' ? 100 : newJobStatus === 'En Progreso' ? 50 : 0,
      date: new Date().toISOString().split('T')[0],
      isPaid: false
    };

    setJobs((prev) => [newJob, ...prev]);

    // Add alert
    const newAlert: Alert = {
      id: `A-${Math.floor(Math.random() * 1000)}`,
      type: newJobStatus === 'Crítico' ? 'urgente' : 'aviso',
      title: `${newJobType}`,
      subtitle: `${newJob.bikeModel.toUpperCase()} • ${newJob.clientName.toUpperCase()}`,
      tag: newJobStatus === 'Crítico' ? 'URGENTE' : 'NUEVO'
    };
    setAlerts((prev) => [newAlert, ...prev]);

    logSql(`INSERT INTO jobs (id, clientId, clientName, bikeModel, plate, status, type, laborPrice, partsPrice, progress, date, isPaid) VALUES ('${jobId}', '${newJob.clientId}', '${newJob.clientName}', '${newJob.bikeModel}', '${newJob.plate}', '${newJob.status}', '${newJob.type}', ${newJob.laborPrice}, ${newJob.partsPrice}, ${newJob.progress}, '${newJob.date}', 0);`);
    triggerNotification(`Orden ${jobId} añadida a la base de datos SQLite Room`);

    setShowNewJobModal(false);
  };

  const handleUpdateJobStatus = (jobId: string, status: JobStatus, progress: number) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status, progress } : j))
    );
    logSql(`UPDATE jobs SET status = '${status}', progress = ${progress} WHERE id = '${jobId}';`);
    triggerNotification(`Trabajo ${jobId} actualizado a ${status} (${progress}%)`);
  };

  const handleTogglePaid = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updatedPaid = !j.isPaid;
          logSql(`UPDATE jobs SET isPaid = ${updatedPaid ? 1 : 0} WHERE id = '${jobId}';`);
          triggerNotification(`Factura ${jobId} marcada como ${updatedPaid ? 'PAGADA' : 'PENDIENTE'}`);
          return { ...j, isPaid: updatedPaid };
        }
        return j;
      })
    );
  };

  const handleRenewWarranty = (id: string) => {
    setGuarantees((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          logSql(`UPDATE guarantees SET daysRemaining = 180, status = 'Estable' WHERE id = '${id}';`);
          triggerNotification(`Garantía ${g.certificateNumber} renovada por 180 días.`);
          return { ...g, daysRemaining: 180, status: 'Estable' };
        }
        return g;
      })
    );
  };

  const triggerCriticalAlert = (task: MaintenanceTask) => {
    // Add urgent alert
    const alertId = `A-${Math.floor(Math.random() * 1000)}`;
    const newAlert: Alert = {
      id: alertId,
      type: 'urgente',
      title: `Alerta Crítica: ${task.title}`,
      subtitle: `${task.clientName.toUpperCase()} • DEBE SER CONTACTADO`,
      tag: 'CRÍTICO'
    };
    setAlerts((prev) => [newAlert, ...prev]);
    logSql(`INSERT INTO alerts (id, type, title, subtitle, tag) VALUES ('${alertId}', 'urgente', 'Alerta Crítica: ${task.title}', '${task.clientName}', 'CRÍTICO');`);
    triggerNotification(`¡Alerta crítica enviada para ${task.clientName}!`);
  };

  const simulateCall = (name: string) => {
    setActiveCall(name);
    setTimeout(() => {
      setActiveCall(null);
      triggerNotification(`Llamada finalizada con ${name}`);
    }, 4000);
  };

  // Helper to generate WhatsApp URL for maintenance tasks
  const getWhatsAppUrl = (task: MaintenanceTask) => {
    const text = `Hola ${task.clientName}, te escribimos de Africano Motos. Te recordamos que tu motocicleta tiene programado el servicio de "${task.title}" (${task.subtitle}). Por favor contáctanos para agendar tu cita. ¡Un saludo!`;
    return `https://wa.me/${task.clientPhone}?text=${encodeURIComponent(text)}`;
  };

  // Reset database state back to initial values
  const handleResetDatabase = () => {
    if (confirm('¿Seguro que deseas reiniciar la base de datos local SQLite a los valores de fábrica?')) {
      setClients(INITIAL_CLIENTS);
      setMotorcycles(INITIAL_MOTORCYCLES);
      setJobs(INITIAL_JOBS);
      setGuarantees(INITIAL_GUARANTEES);
      setMaintenanceTasks(INITIAL_MAINTENANCE_TASKS);
      setAlerts(INITIAL_ALERTS);
      setDbConsoleLogs([]);
      logSql(`-- ROOM DATABASE INIT: REBOOT COMPLETE --`);
      logSql(`VACUUM; -- Cleaned and compacted database`);
      triggerNotification('Base de datos SQLite local reiniciada');
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-on-surface font-sans flex flex-col antialiased">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-[9999] bg-primary-container text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-primary animate-fade-in text-sm font-mono font-bold">
          <Database className="h-4 w-4 animate-bounce" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Simulated Phone Call Overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex flex-col items-center justify-center animate-fade-in">
          <div className="bg-surface-low p-8 rounded-2xl border border-primary-container max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary-container/20 border-2 border-primary-orange flex items-center justify-center mx-auto animate-pulse">
              <Phone className="h-10 w-10 text-primary-orange" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-primary">{activeCall}</h3>
              <p className="text-on-surface-variant text-xs mt-1 uppercase font-mono tracking-wider">Llamando (Simulación)...</p>
            </div>
            <p className="text-xs text-on-surface-variant">
              Utilizando la interfaz de comunicación nativa de Android de Africano Motos para conectar con el cliente.
            </p>
            <button
              onClick={() => setActiveCall(null)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-mono uppercase text-xs py-3 rounded-xl transition-all"
            >
              Colgar Llamada
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navbar (Simulator Desktop Wrapper) */}
      <nav className="bg-[#080d1a] border-b border-slate-800 px-4 py-2 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary-container p-1.5 rounded-md">
            <Wrench className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              MOTO-TECH PRO <span className="text-primary text-[10px] font-mono font-normal bg-primary-container/10 border border-primary-container/20 px-1 py-0.2 rounded">v2.4</span>
            </h1>
            <p className="text-[10px] text-on-surface-variant">Plataforma de Control e Inspección de Africano Motos</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-surface-container hover:bg-surface-high text-on-surface hover:text-white px-2 py-1 rounded border border-slate-700 text-[10px] font-mono uppercase flex items-center gap-1.5 transition-all"
          >
            <Sliders className="h-3.5 w-3.5" />
            {sidebarOpen ? 'Ocultar Consola' : 'Mostrar Consola'}
          </button>
          <button
            onClick={handleResetDatabase}
            className="bg-red-950/30 hover:bg-red-900/55 text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-900/40 text-[10px] font-mono uppercase flex items-center gap-1.5 transition-all"
            title="Reiniciar base de datos SQLite"
          >
            <Trash2 className="h-3 w-3" />
            Reiniciar DB
          </button>
        </div>
      </nav>

      {/* Simulator Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COMPONENT: Interactive Android Emulator (The actual target requested!) */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 flex items-center justify-center bg-[#05080f] custom-scrollbar">
          
          {/* High-Fidelity Android Device Frame Wrapper */}
          <div className="relative mx-auto bg-[#03060c] rounded-[44px] p-2.5 shadow-[0_0_50px_rgba(255,77,0,0.12)] border-2 border-[#152238] max-w-[395px] w-full aspect-[9/18.5] flex flex-col overflow-hidden">
            
            {/* Notch and Status Bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-50 flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-6 h-1 bg-zinc-900 rounded-full" />
            </div>

            {/* Simulated Android Top Info Bar */}
            <div className="pt-4 px-5 pb-1 flex justify-between items-center text-[10px] text-on-surface-variant font-mono z-30 select-none">
              <span className="font-bold text-white">09:41</span>
              <div className="flex items-center gap-1">
                <span className="text-[8px] bg-primary-container/20 text-primary-orange px-1 rounded border border-primary-container/20">LTE</span>
                <div className="flex gap-0.5 items-end h-2.5">
                  <div className="w-0.5 h-1 bg-on-surface-variant rounded-sm" />
                  <div className="w-0.5 h-1.5 bg-on-surface-variant rounded-sm" />
                  <div className="w-0.5 h-2 bg-on-surface-variant rounded-sm" />
                  <div className="w-0.5 h-2.5 bg-primary-orange rounded-sm" />
                </div>
                <div className="w-4 h-2.5 border border-on-surface-variant/70 rounded-xs p-0.5 flex items-center">
                  <div className="w-full h-full bg-primary-orange rounded-3xs" />
                </div>
              </div>
            </div>

            {/* Inner Mobile Screen Area */}
            <div className="flex-1 flex flex-col bg-[#080d1a] rounded-[34px] overflow-hidden relative border border-slate-800/60">
              
              {/* Top Custom Bar inside App */}
              <header className="bg-[#0c1324] border-b border-slate-800 py-2.5 px-3.5 flex justify-between items-center h-11">
                <div className="flex items-center gap-1.5">
                  <Wrench className="text-primary-orange h-4 w-4" />
                  <span className="font-display font-extrabold text-xs tracking-tight text-white">
                    AFRICANO MOTO
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-primary bg-primary-container/15 border border-primary-container/20 px-1 py-0.2 rounded uppercase">
                    Móvil Nativa
                  </span>
                </div>
              </header>

              {/* Dynamic Inner Tab View */}
              <div className="flex-1 overflow-y-auto px-3 py-2.5 pb-20 custom-scrollbar text-sm">
                
                {/* TAB 1: PANEL (Dashboard) */}
                {activeTab === 'panel' && (
                  <div className="space-y-3.5 animate-fade-in">
                    
                    {/* Welcome Banner */}
                    <div className="space-y-0.5">
                      <h2 className="font-display font-bold text-base text-white tracking-tight">Centro de Taller</h2>
                      <p className="text-[10px] text-on-surface-variant leading-none">Seguimiento de mantenimiento de precisión activo.</p>
                    </div>

                    {/* Quick Access Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        onClick={() => setShowNewJobModal(true)}
                        className="flex items-center justify-center gap-1 bg-primary-container hover:bg-primary-orange text-white font-mono uppercase text-[10px] font-bold py-2 rounded-lg transition-all shadow-sm active:scale-95"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Nuevo Trabajo
                      </button>
                      <button
                        onClick={() => setShowNewClientModal(true)}
                        className="flex items-center justify-center gap-1 border border-slate-700 text-primary font-mono uppercase text-[10px] py-2 rounded-lg hover:bg-surface-container transition-all active:scale-95"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Nuevo Cliente
                      </button>
                    </div>

                    {/* Weekly Earnings Card */}
                    <section className="bg-surface-low rounded-lg p-3 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-primary" />
                            Ingresos Semanales
                          </h3>
                          <p className="text-[8px] font-mono text-on-surface-variant">08 ABR - 14 ABR</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-sm text-primary">$4,820.00</p>
                          <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">+12% vs sem ant</span>
                        </div>
                      </div>

                      {/* Interactive Visual Bar Chart */}
                      <div className="h-20 flex items-end justify-between gap-1 pt-2 border-b border-slate-800">
                        {[
                          { day: 'Lun', pct: 40, active: false },
                          { day: 'Mar', pct: 65, active: false },
                          { day: 'Mié', pct: 45, active: false },
                          { day: 'Jue', pct: 90, active: true },
                          { day: 'Vie', pct: 70, active: false },
                          { day: 'Sáb', pct: 30, active: false },
                          { day: 'Dom', pct: 20, active: false },
                        ].map((b, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer" title={`${b.day}: $${(b.pct * 50).toFixed(0)}`}>
                            <div className="w-full relative rounded-t bg-slate-900/40 overflow-hidden flex items-end" style={{ height: '52px' }}>
                              <div
                                className={`w-full rounded-t transition-all duration-500 ${
                                  b.active ? 'bg-primary-container shadow-[0_0_6px_rgba(255,87,26,0.4)]' : 'bg-[#1b2538] group-hover:bg-[#2d3a54]'
                                }`}
                                style={{ height: `${b.pct}%` }}
                              />
                            </div>
                            <span className="text-[8px] font-mono mt-0.5 text-on-surface-variant uppercase">{b.day}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Alerts Módulo */}
                    <section className="space-y-1.5">
                      <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-white flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary-orange" />
                        Alertas Recientes ({alerts.length})
                      </h3>
                      <div className="space-y-1.5">
                        {alerts.slice(0, 3).map((alert) => (
                          <div
                            key={alert.id}
                            className={`p-2.5 rounded-lg flex justify-between items-center border ${
                              alert.type === 'urgente'
                                ? 'bg-red-950/15 border-red-950 text-red-100 animate-alert-shimmer'
                                : 'bg-[#11192e] border-slate-800 text-slate-100'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-[11px] leading-snug">{alert.title}</p>
                              <p className="text-[9px] font-mono text-on-surface-variant uppercase">{alert.subtitle}</p>
                            </div>
                            <span
                              className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold uppercase ${
                                alert.type === 'urgente' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/15 text-primary-orange'
                              }`}
                            >
                              {alert.tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Trabajos Activos List (Compact view) */}
                    <section className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-white">Trabajos Activos</h3>
                        <span className="text-[8px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase font-bold">
                          {jobs.filter(j => j.status !== 'Listo').length} EN CURSO
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {jobs.filter(j => j.status !== 'Listo').slice(0, 3).map((job) => (
                          <div
                            key={job.id}
                            onClick={() => setShowJobDetailsModal(job)}
                            className="bg-[#11192e] hover:bg-[#15213d] p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-[11px] text-white">{job.bikeModel}</p>
                              <p className="text-[9px] font-mono text-on-surface-variant uppercase">{job.clientName}</p>
                              <div className="flex gap-1">
                                <span className="text-[8px] border border-slate-800 text-on-surface-variant font-mono px-1 py-0.2 rounded uppercase">
                                  {job.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span
                                className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold uppercase block text-center ${
                                  job.status === 'Crítico'
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                                    : job.status === 'En Espera'
                                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                    : 'bg-orange-500/15 text-primary-orange border border-primary-orange/20'
                                }`}
                              >
                                {job.status}
                              </span>
                              <div className="flex items-center gap-1 justify-end">
                                <div className="w-8 h-0.5 bg-slate-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-orange" style={{ width: `${job.progress}%` }} />
                                </div>
                                <span className="text-[8px] font-mono text-primary-orange">{job.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* TAB 2: TRABAJOS (Job List & Board) */}
                {activeTab === 'trabajos' && (
                  <div className="space-y-3 animate-fade-in">
                    
                    <div className="space-y-0.5">
                      <h2 className="font-display font-bold text-base text-white tracking-tight">Gestión de Trabajos</h2>
                      <p className="text-[10px] text-on-surface-variant leading-none">Inspección de vehículos y órdenes activas.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant" />
                        <input
                          type="text"
                          placeholder="Buscar por placa o cliente..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-8 pl-8 pr-3 bg-surface-low border border-slate-800 rounded-lg focus:border-primary text-xs outline-none"
                        />
                      </div>

                      {/* Filter Badges */}
                      <div className="flex gap-1 overflow-x-auto pb-0.5 text-[9px] font-mono uppercase custom-scrollbar">
                        {['Todas', 'En Espera', 'En Progreso', 'Crítico', 'Listo'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setJobFilter(f)}
                            className={`px-2 py-1 rounded transition-all border ${
                              jobFilter === f
                                ? 'bg-primary-container text-white border-primary-orange'
                                : 'bg-surface-low text-on-surface-variant border-slate-800 hover:bg-surface-container'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-2">
                      {jobs
                        .filter((job) => {
                          const matchesSearch =
                             job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             job.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             job.bikeModel.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesFilter =
                            jobFilter === 'Todas' || job.status === jobFilter;
                          return matchesSearch && matchesFilter;
                        })
                        .map((job) => {
                          const isCritico = job.status === 'Crítico';
                          const isListo = job.status === 'Listo';
                          const isProgress = job.status === 'En Progreso';
                          
                          let borderClass = 'border-slate-800/80';
                          let indicatorClass = 'bg-zinc-600';
                          if (isCritico) {
                            borderClass = 'border-red-500/25 animate-alert-shimmer';
                            indicatorClass = 'bg-red-500';
                          } else if (isListo) {
                            borderClass = 'border-emerald-500/25';
                            indicatorClass = 'bg-emerald-500';
                          } else if (isProgress) {
                            borderClass = 'border-primary-orange/25';
                            indicatorClass = 'bg-primary-orange';
                          }

                          return (
                            <div
                              key={job.id}
                              className={`bg-surface-low rounded-lg border p-2.5 relative overflow-hidden transition-all hover:border-slate-700 ${borderClass}`}
                            >
                              {/* Left status indicator block */}
                              <div className={`absolute top-0 left-0 w-1 h-full ${indicatorClass}`} />

                              <div className="flex justify-between items-start mb-1.5 pl-1.5">
                                <div>
                                  <h4 className="font-display font-bold text-[11px] text-white leading-tight">{job.bikeModel}</h4>
                                  <p className="text-[9px] font-mono text-primary uppercase mt-0.5">Placa: {job.plate}</p>
                                </div>
                                <span
                                  className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold uppercase ${
                                    isCritico
                                      ? 'bg-red-500/15 text-red-400'
                                      : isListo
                                      ? 'bg-emerald-500/15 text-emerald-400'
                                      : isProgress
                                      ? 'bg-orange-500/15 text-primary-orange'
                                      : 'bg-zinc-800 text-zinc-300'
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </div>

                              <div className="space-y-1 mb-2 pl-1.5 text-[10px] text-on-surface-variant">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-on-surface-variant/70" />
                                  <span>{job.estimatedDelivery}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Wrench className="h-3 w-3 text-on-surface-variant/70" />
                                  <span>Mano de obra: ${job.laborPrice.toLocaleString()}</span>
                                </div>
                                <p className="text-[9px] text-on-surface-variant/60 font-mono">
                                  Cliente: {job.clientName}
                                </p>
                              </div>

                              <div className="flex gap-1.5 pl-1.5">
                                <button
                                  onClick={() => setShowJobDetailsModal(job)}
                                  className="flex-1 bg-surface-container hover:bg-surface-highest text-on-surface font-mono text-[9px] uppercase py-1.5 rounded border border-slate-700 transition-all"
                                >
                                  Ver Detalles / Editar
                                </button>
                                {isListo && (
                                  <button
                                    onClick={() => handleTogglePaid(job.id)}
                                    className={`px-2 py-1.5 rounded font-mono text-[9px] uppercase transition-all ${
                                      job.isPaid
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-primary-container text-white hover:bg-primary-orange'
                                    }`}
                                  >
                                    {job.isPaid ? 'Pagado' : 'Cobrar'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Workshop Capacity Section */}
                    <div className="bg-primary-container/5 border border-primary-container/20 rounded-lg p-3 space-y-1.5 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-5">
                        <Wrench className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="font-mono text-[10px] uppercase font-bold text-primary">Capacidad de Taller</h3>
                      <p className="text-[10px] text-on-surface-variant/90 leading-tight">
                        Taller al <span className="font-bold text-primary">{workshopCapacity}%</span> de carga activa.
                      </p>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-primary-orange h-full rounded-full transition-all duration-500"
                          style={{ width: `${workshopCapacity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: FINANZAS (Comisiones Motor) */}
                {activeTab === 'finanzas' && (
                  <div className="space-y-3.5 animate-fade-in">
                    
                    <div className="space-y-0.5">
                      <h2 className="font-display font-bold text-base text-white tracking-tight">Motor de Comisiones</h2>
                      <p className="text-[10px] text-on-surface-variant leading-none">Cálculo de ingresos netos y utilidad de taller.</p>
                    </div>

                    {/* Date Selector Banner */}
                    <div className="bg-surface-low p-2.5 rounded-lg border border-slate-800 space-y-2.5">
                      <p className="text-[9px] font-mono uppercase text-primary font-bold">Filtro de Período</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="text-[8px] text-on-surface-variant uppercase font-mono">Desde</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full h-7 bg-slate-900 text-white px-1.5 py-1 rounded text-[11px] border border-slate-800 outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[8px] text-on-surface-variant uppercase font-mono">Hasta</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full h-7 bg-slate-900 text-white px-1.5 py-1 rounded text-[11px] border border-slate-800 outline-none font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          logSql(`SELECT SUM(laborPrice + partsPrice) FROM jobs WHERE date BETWEEN '${startDate}' AND '${endDate}';`);
                          triggerNotification('Métricas recalculadas en SQLite Room');
                        }}
                        className="w-full bg-primary-container text-white font-mono uppercase text-[10px] py-1.5 rounded-md hover:bg-primary-orange transition-all"
                      >
                        Actualizar Reporte
                      </button>
                    </div>

                    {/* Financial KPIs */}
                    <div className="space-y-1.5">
                      <div className="bg-surface-low p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase">Ingreso Bruto Total</span>
                        <span className="font-mono font-bold text-xs text-white">
                          ${calculatedStats.brutoTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="bg-surface-low p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase">Mano de Obra</span>
                        <span className="font-mono font-bold text-xs text-emerald-400">
                          ${calculatedStats.manoDeObra.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="bg-surface-low p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase">Repuestos / Gastos</span>
                        <span className="font-mono text-xs text-on-surface-variant">
                          ${calculatedStats.repuestosGastos.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Slider Comisiones */}
                    <div className="bg-surface-low rounded-lg p-3 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase text-primary font-bold">Comisión Mecánico</span>
                        <span className="font-mono font-bold text-sm text-primary-orange">{commissionPct}%</span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={commissionPct}
                        onChange={(e) => {
                          setCommissionPct(Number(e.target.value));
                          logSql(`-- Adjusting commission to ${e.target.value}%`);
                        }}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary-orange"
                      />

                      <div className="flex justify-between text-[8px] font-mono text-on-surface-variant uppercase">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 space-y-1 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Pago Proyectado (Mecánico):</span>
                          <span className="font-mono font-bold text-white">${calculatedStats.pagoMecanico.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Utilidad Retenida (Taller):</span>
                          <span className="font-mono font-bold text-primary-orange">${calculatedStats.utilidadTaller.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Jobs Breakdown List */}
                    <div className="space-y-1.5">
                      <h3 className="font-mono text-[10px] uppercase font-bold text-white tracking-wider">Desglose por Trabajo</h3>
                      <div className="space-y-1.5">
                        {jobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="p-2 bg-surface-low rounded-lg border border-slate-800/80 text-[10px] flex justify-between items-center">
                            <div>
                              <p className="font-bold text-white">{job.clientName}</p>
                              <p className="text-[9px] font-mono text-on-surface-variant uppercase">{job.bikeModel}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-primary-orange">${(job.laborPrice + job.partsPrice).toLocaleString()}</p>
                              <span className="text-[8px] text-on-surface-variant font-mono">MO: ${job.laborPrice} / Rep: ${job.partsPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: CLIENTES (Directorio) */}
                {activeTab === 'clientes' && (
                  <div className="space-y-3 animate-fade-in">
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h2 className="font-display font-bold text-base text-white tracking-tight">Directorio de Clientes</h2>
                        <p className="text-[10px] text-on-surface-variant leading-none">Miembros registrados y motocicletas.</p>
                      </div>
                      <button
                        onClick={() => setShowNewClientModal(true)}
                        className="bg-primary-container hover:bg-primary-orange text-white p-1.5 rounded-lg transition-all shadow-sm"
                        title="Añadir Cliente"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant" />
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 bg-surface-low border border-slate-800 rounded-lg focus:border-primary text-xs outline-none"
                      />
                    </div>

                    {/* Client Cards Directory */}
                    <div className="space-y-2">
                      {clients
                        .filter((client) =>
                          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.phone.includes(searchQuery)
                        )
                        .map((client) => {
                          const clientBikes = motorcycles.filter((m) => m.clientId === client.id);
                          
                          return (
                            <div
                              key={client.id}
                              className="bg-surface-low border border-slate-800/80 rounded-lg overflow-hidden shadow-sm flex flex-col"
                            >
                              <div className="p-2.5 flex gap-2.5 items-start">
                                {/* Profile Avatar */}
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-900">
                                  <img className="w-full h-full object-cover" src={client.avatar} alt={client.name} />
                                </div>
                                
                                {/* Info fields */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div className="truncate pr-1.5">
                                      <h3 className="font-display font-extrabold text-[11px] text-white truncate leading-tight">{client.name}</h3>
                                      <p className="font-mono text-[8px] uppercase tracking-wider text-on-surface-variant">
                                        Miembro {client.membership} • ID: #{client.id}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                      <button
                                        onClick={() => simulateCall(client.name)}
                                        className="p-1 bg-slate-900 hover:bg-slate-800 text-primary-orange rounded-full border border-slate-800 transition-colors"
                                        title="Llamar"
                                      >
                                        <Phone className="h-3 w-3" />
                                      </button>
                                      <a
                                        href={`https://wa.me/${client.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                          logSql(`-- Simulated communication contact via WhatsApp API for ${client.name}`);
                                          triggerNotification(`WhatsApp abierto para ${client.name}`);
                                        }}
                                        className="p-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-full border border-slate-800 transition-colors flex items-center justify-center"
                                        title="WhatsApp"
                                      >
                                        <MessageSquare className="h-3 w-3" />
                                      </a>
                                    </div>
                                  </div>

                                  {/* Expandable registered bikes */}
                                  <div className="mt-2 pt-2 border-t border-slate-800 space-y-1.5">
                                    <h4 className="text-[8px] font-mono uppercase text-on-surface-variant font-bold">
                                      Motocicletas Registradas ({clientBikes.length})
                                    </h4>
                                    
                                    {clientBikes.map((bike) => (
                                      <div key={bike.id} className="bg-slate-900/40 p-1.5 rounded border border-slate-800 border-l-2 border-l-primary-orange flex justify-between items-center text-[10px]">
                                        <div>
                                          <p className="font-bold text-white leading-tight">{bike.brandModel}</p>
                                          <div className="flex gap-1.5 text-[8px] text-on-surface-variant font-mono uppercase mt-0.5">
                                            <span>{bike.year}</span>
                                            <span>PLACA: {bike.plate}</span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-[7px] uppercase text-on-surface-variant leading-none">Último Serv.</p>
                                          <p className="font-mono text-[8px] text-primary mt-0.5">{bike.lastService}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Active status footer */}
                              {client.activeJob && (
                                <div className="bg-[#0c1324] px-2.5 py-1 flex justify-between items-center border-t border-slate-800">
                                  <span className="text-[9px] text-on-surface-variant italic truncate max-w-[180px]">
                                    {client.activeJob}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setActiveTab('trabajos');
                                      setSearchQuery(client.name);
                                    }}
                                    className="text-primary font-mono text-[8px] uppercase flex items-center gap-0.5 hover:underline font-bold"
                                  >
                                    Historial <ArrowRight className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* TAB 5: ALERTAS (Garantías & Recordatorios) */}
                {activeTab === 'alertas' && (
                  <div className="space-y-3.5 animate-fade-in">
                    
                    <div className="space-y-0.5">
                      <h2 className="font-display font-bold text-base text-white tracking-tight">Garantías y Mantenimientos</h2>
                      <p className="text-[10px] text-on-surface-variant leading-none">Controles proactivos y postventa.</p>
                    </div>

                    {/* KPI Counter badges */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="bg-[#11192e] p-1.5 rounded-lg border border-slate-800 text-center">
                        <p className="text-[7px] font-mono uppercase text-on-surface-variant">Garantías</p>
                        <p className="text-xs font-mono font-bold text-primary">24</p>
                      </div>
                      <div className="bg-[#11192e] p-1.5 rounded-lg border border-slate-800 text-center">
                        <p className="text-[7px] font-mono uppercase text-on-surface-variant">Por Vencer</p>
                        <p className="text-xs font-mono font-bold text-red-400">03</p>
                      </div>
                      <div className="bg-[#11192e] p-1.5 rounded-lg border border-slate-800 text-center">
                        <p className="text-[7px] font-mono uppercase text-on-surface-variant">Pendientes</p>
                        <p className="text-xs font-mono font-bold text-[#d8e3fb]">12</p>
                      </div>
                    </div>

                    {/* Active Warranties Column */}
                    <div className="space-y-2">
                      <h3 className="font-mono text-[10px] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        Garantías Activas (Inspección)
                      </h3>

                      {guarantees.map((g) => {
                        const isUrgente = g.status === 'Urgente';
                        const isVencida = g.status === 'Vencida';
                        
                        return (
                          <div
                            key={g.id}
                            className={`p-2.5 rounded-lg border relative overflow-hidden flex flex-col gap-2 ${
                              isUrgente
                                ? 'bg-red-950/15 border-red-500/25 animate-alert-shimmer'
                                : isVencida
                                ? 'bg-zinc-950/40 border-slate-800/60 opacity-65 grayscale'
                                : 'bg-[#11192e] border-slate-800/80'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className={`font-bold text-[11px] leading-tight ${isVencida ? 'line-through text-zinc-500' : 'text-white'}`}>{g.title}</h4>
                                <p className="text-[9px] text-on-surface-variant mt-0.5">{g.bikeModel} • {g.clientName}</p>
                              </div>
                              <span
                                className={`text-[7px] font-mono px-1 py-0.2 rounded uppercase font-bold ${
                                  isUrgente
                                    ? 'bg-red-500/20 text-red-300'
                                    : isVencida
                                    ? 'bg-zinc-800 text-zinc-400'
                                    : 'bg-primary-container/20 text-primary-orange'
                                }`}
                              >
                                {g.status}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px]">
                              <div className="flex gap-3">
                                <div>
                                  <p className="text-[7px] font-mono text-on-surface-variant uppercase">Vence en</p>
                                  <p className={`font-mono font-bold text-[10px] ${isUrgente ? 'text-red-400' : 'text-white'}`}>
                                    {g.daysRemaining} {g.daysRemaining === 1 ? 'Día' : 'Días'}
                                  </p>
                                </div>
                                {g.certificateNumber && (
                                  <div>
                                    <p className="text-[7px] font-mono text-on-surface-variant uppercase">Certificado</p>
                                    <p className="font-mono text-primary text-[9px]">{g.certificateNumber}</p>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => handleRenewWarranty(g.id)}
                                className="bg-surface-container hover:bg-surface-highest border border-slate-700 px-2 py-1 rounded text-[8px] font-mono uppercase text-white transition-all"
                              >
                                {isVencida ? 'Renovar' : 'Extender'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Maintenance Tasks Column */}
                    <div className="space-y-2 pt-1">
                      <h3 className="font-mono text-[10px] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                        Mantenimientos Proactivos
                      </h3>

                      <div className="space-y-2">
                        {maintenanceTasks.map((task) => (
                          <div key={task.id} className="p-2.5 bg-[#11192e] border border-slate-800 rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className={`font-bold text-[11px] leading-tight ${task.isOverdue ? 'text-red-400' : 'text-white'}`}>
                                  {task.title}
                                </h4>
                                <p className="text-[9px] text-on-surface-variant/90 leading-tight mt-0.5">{task.subtitle}</p>
                                <p className="text-[8px] text-primary font-mono mt-1 uppercase font-bold">Cliente: {task.clientName}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[7px] font-mono text-on-surface-variant uppercase block">Fecha</span>
                                <span className="font-mono font-bold text-[10px] text-white">{task.dueDate}</span>
                              </div>
                            </div>

                            <div className="flex gap-1.5">
                              <a
                                href={getWhatsAppUrl(task)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  logSql(`-- Dispatching native WhatsApp intent notification schema to ${task.clientPhone}`);
                                  triggerNotification(`Enlace de WhatsApp enviado para ${task.clientName}`);
                                }}
                                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-1 rounded flex items-center justify-center gap-1 transition-all text-[8.5px] font-mono font-bold uppercase"
                              >
                                <MessageSquare className="h-2.5 w-2.5" />
                                WhatsApp Alert
                              </a>
                              {task.isOverdue && (
                                <button
                                  onClick={() => triggerCriticalAlert(task)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-mono uppercase text-[8.5px] px-2 rounded transition-all font-bold"
                                  title="Enviar Alerta Crítica"
                                >
                                  Crítico
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated Android Bottom Navigation Menu */}
              <nav className="absolute bottom-0 left-0 w-full bg-[#0c1324] border-t border-slate-800 shadow-xl flex justify-around items-center h-14 pb-2 px-1.5 z-40">
                {[
                  { id: 'panel', label: 'Panel', icon: Layers },
                  { id: 'trabajos', label: 'Trabajos', icon: Wrench },
                  { id: 'finanzas', label: 'Finanzas', icon: DollarSign },
                  { id: 'clientes', label: 'Clientes', icon: UserPlus },
                  { id: 'alertas', label: 'Alertas', icon: Shield }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        logSql(`-- Navigated to screen: ${item.id.toUpperCase()}`);
                      }}
                      className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 ${
                        isActive ? 'text-primary-orange' : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                      <span className="text-[7.5px] font-mono uppercase tracking-wider mt-0.5">{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0.5 w-4 h-0.5 bg-primary-orange rounded-full" />
                      )}
                      {item.id === 'alertas' && alerts.length > 0 && (
                        <span className="absolute top-0.5 right-3 bg-red-600 text-white text-[7px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-slate-900">
                          {alerts.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Simulated Bottom OS Action Line */}
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-zinc-800 rounded-full z-40 select-none pointer-events-none" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Kotlin Code & Live Database Inspection Panel */}
        {sidebarOpen && (
          <div className="w-full lg:w-[460px] bg-[#050912] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full overflow-hidden select-none">
            
            {/* Tabs selector */}
            <div className="bg-[#080d1a] border-b border-slate-800 flex">
              <div className="flex-1 flex text-center">
                <button
                  onClick={() => setCurrentKotlinFile('clientEntity')}
                  className={`flex-1 font-mono text-[11px] py-2.5 border-b-2 uppercase transition-all ${
                    currentKotlinFile !== 'appDatabase' ? 'border-primary text-primary font-bold bg-[#0a1122]' : 'border-transparent text-on-surface-variant'
                  }`}
                >
                  <Code className="h-3 w-3 inline mr-1" />
                  Código Kotlin Nativo
                </button>
                <button
                  onClick={() => setCurrentKotlinFile('appDatabase')}
                  className={`flex-1 font-mono text-[11px] py-2.5 border-b-2 uppercase transition-all ${
                    currentKotlinFile === 'appDatabase' ? 'border-primary text-primary font-bold bg-[#0a1122]' : 'border-transparent text-on-surface-variant'
                  }`}
                >
                  <Database className="h-3 w-3 inline mr-1" />
                  SQLite Setup
                </button>
              </div>
            </div>

            {/* Inner Panel body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              
              {/* Kotlin File browser (conditional) */}
              {currentKotlinFile !== 'appDatabase' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-[#0a1122] p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase">Archivo:</span>
                    <select
                      value={currentKotlinFile}
                      onChange={(e) => setCurrentKotlinFile(e.target.value as keyof typeof KOTLIN_CODE)}
                      className="bg-slate-900 text-white text-[10.5px] font-mono rounded px-1.5 py-0.5 border border-slate-800 outline-none"
                    >
                      <option value="clientEntity">ClientEntity.kt (Room)</option>
                      <option value="clientDao">ClientDao.kt (DAO)</option>
                      <option value="jobEntity">JobEntity.kt (Room)</option>
                      <option value="jobDao">JobDao.kt (DAO)</option>
                      <option value="mainActivity">MainActivity.kt (Compose)</option>
                    </select>
                  </div>

                  <div className="relative">
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(KOTLIN_CODE[currentKotlinFile]);
                          triggerNotification('Código copiado al portapapeles');
                        }}
                        className="bg-primary-container hover:bg-primary-orange text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase shadow-sm"
                      >
                        Copiar
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-2.5 rounded border border-slate-900 text-[10px] font-mono text-[#a6b5cc] overflow-x-auto select-text max-h-[250px] lg:max-h-[320px] custom-scrollbar">
                      <code>{KOTLIN_CODE[currentKotlinFile]}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase">Base de Datos SQLite</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(KOTLIN_CODE.appDatabase);
                        triggerNotification('Código copiado al portapapeles');
                      }}
                      className="bg-primary-container hover:bg-primary-orange text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase"
                    >
                      Copiar AppDatabase.kt
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-2.5 rounded border border-slate-900 text-[10px] font-mono text-[#a6b5cc] overflow-x-auto select-text max-h-[180px] custom-scrollbar">
                    <code>{KOTLIN_CODE.appDatabase}</code>
                  </pre>
                  <p className="text-[10px] text-on-surface-variant/70 italic leading-snug">
                    Este archivo provee el inicializador de Room Database nativo de Android en Kotlin que guarda los datos persistentemente en la memoria local del teléfono bajo SQLite.
                  </p>
                </div>
              )}

              {/* Simulated Room Database Console Logs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 flex-1 flex flex-col min-h-[140px]">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-mono uppercase text-primary font-bold flex items-center gap-1">
                    <Database className="h-3 w-3 text-primary-orange" />
                    Transacciones SQLite en Tiempo Real (Local)
                  </h4>
                  {dbConsoleLogs.length > 0 && (
                    <button
                      onClick={() => setDbConsoleLogs([])}
                      className="text-[8px] font-mono text-on-surface-variant hover:text-white uppercase font-bold"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="flex-1 bg-black p-2 rounded border border-slate-900 overflow-y-auto max-h-[140px] lg:max-h-[200px] font-mono text-[9px] text-emerald-400 space-y-1 custom-scrollbar select-text">
                  {dbConsoleLogs.length === 0 ? (
                    <p className="text-[#a6b5cc]/30 italic">
                      -- Las sentencias SQLite Room se imprimirán aquí en tiempo real a medida que interactúes con la interfaz móvil --
                    </p>
                  ) : (
                    dbConsoleLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap leading-tight font-mono select-all">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODALS SECTION */}

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b1326] rounded-2xl border-2 border-primary-container max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-lg text-white">Registrar Nuevo Cliente</h3>
              <button onClick={() => setShowNewClientModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-on-surface-variant">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Marcus Thorne"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant">Membresía</label>
                  <select
                    value={newClientMembership}
                    onChange={(e) => setNewClientMembership(e.target.value as MembershipType)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs outline-none text-white"
                  >
                    <option value="Estándar">Estándar</option>
                    <option value="Platinum">Platinum</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant">Teléfono</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +34600112233"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary-orange"
                  />
                </div>
              </div>

              {/* First Motorcycle registration option */}
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-3">
                <p className="text-[10px] font-mono uppercase text-primary font-bold">Registrar Primera Moto (Opcional)</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ej. Ducati Panigale V4 S"
                    value={newBikeBrandModel}
                    onChange={(e) => setNewBikeBrandModel(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-2.5 py-2 text-xs outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Año (Ej. 2023)"
                      value={newBikeYear || ''}
                      onChange={(e) => setNewBikeYear(Number(e.target.value))}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-2.5 py-2 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Placa (Ej. DX-992)"
                      value={newBikePlate}
                      onChange={(e) => setNewBikePlate(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-2.5 py-2 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-container text-white py-3 rounded-xl font-mono uppercase text-xs hover:bg-primary-orange transition-all"
              >
                Añadir Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b1326] rounded-2xl border-2 border-primary-container max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-lg text-white">Crear Nueva Orden</h3>
              <button onClick={() => setShowNewJobModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant">Cliente</label>
                  <select
                    value={newJobClient}
                    onChange={(e) => {
                      setNewJobClient(e.target.value);
                      // Auto-select first bike of selected client
                      const clientBikes = motorcycles.filter(m => m.clientId === e.target.value);
                      if (clientBikes.length > 0) {
                        setNewJobBike(clientBikes[0].id);
                      }
                    }}
                    required
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="">-- Selecciona --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant">Motocicleta</label>
                  <select
                    value={newJobBike}
                    onChange={(e) => setNewJobBike(e.target.value)}
                    required
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="">-- Selecciona --</option>
                    {motorcycles
                      .filter(m => m.clientId === newJobClient)
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.brandModel}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-on-surface-variant">Tipo de Servicio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cambio de Pastillas de Freno, Ajuste Carburador..."
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs outline-none text-white focus:border-primary-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant">Mano de Obra ($)</label>
                  <input
                    type="number"
                    required
                    value={newJobLabor}
                    onChange={(e) => setNewJobLabor(Number(e.target.value))}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs outline-none text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-on-surface-variant">Repuestos / Extras ($)</label>
                  <input
                    type="number"
                    required
                    value={newJobParts}
                    onChange={(e) => setNewJobParts(Number(e.target.value))}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs outline-none text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-on-surface-variant">Estado Inicial</label>
                <select
                  value={newJobStatus}
                  onChange={(e) => setNewJobStatus(e.target.value as JobStatus)}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="En Espera">En Espera</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Crítico">Crítico</option>
                  <option value="Listo">Listo</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-container text-white py-3 rounded-xl font-mono uppercase text-xs hover:bg-primary-orange transition-all"
              >
                Crear Orden de Trabajo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Job Details / Status Updater Modal */}
      {showJobDetailsModal && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b1326] rounded-2xl border-2 border-primary-container max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">Detalle de Trabajo</h3>
                <p className="text-[10px] font-mono text-primary-orange uppercase">{showJobDetailsModal.id}</p>
              </div>
              <button onClick={() => setShowJobDetailsModal(null)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-on-surface-variant">
              <div>
                <p className="font-mono text-[10px] uppercase text-on-surface-variant">Motocicleta y Cliente</p>
                <p className="text-white font-bold text-sm">{showJobDetailsModal.bikeModel}</p>
                <p className="text-white text-xs">{showJobDetailsModal.clientName} (Placa: {showJobDetailsModal.plate})</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/30">
                <div>
                  <p className="font-mono text-[10px] uppercase text-on-surface-variant">Mano de Obra</p>
                  <p className="text-white font-bold">${showJobDetailsModal.laborPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-on-surface-variant">Repuestos</p>
                  <p className="text-white font-bold">${showJobDetailsModal.partsPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/30 space-y-2">
                <p className="font-mono text-[10px] uppercase text-on-surface-variant">Cambiar Estado</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { s: 'En Espera', p: 10 },
                    { s: 'En Progreso', p: 50 },
                    { s: 'Crítico', p: 35 },
                    { s: 'Listo', p: 100 }
                  ].map((option) => (
                    <button
                      key={option.s}
                      onClick={() => {
                        handleUpdateJobStatus(showJobDetailsModal.id, option.s as JobStatus, option.p);
                        setShowJobDetailsModal(null);
                      }}
                      className={`py-2 px-1.5 rounded-lg border font-mono text-[10px] uppercase transition-all ${
                        showJobDetailsModal.status === option.s
                          ? 'bg-primary-container text-white border-primary-orange font-bold'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-highest'
                      }`}
                    >
                      {option.s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
