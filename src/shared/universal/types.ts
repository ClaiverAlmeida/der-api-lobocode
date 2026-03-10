// ============================================================================
// 🏷️ TIPOS DE ENTIDADES
// ============================================================================

export type EntityNameModel =
  | 'user'
  | 'company'
  | 'post'
  | 'patrol'
  | 'checkpoint'
  | 'vehicle'
  | 'shift'
  | 'occurrence'
  | 'supply'
  | 'motorizedService'
  | 'vehicleChecklist'
  | 'motorcycleChecklist'
  | 'occurrenceDispatch'
  | 'doormanChecklist'
  | 'armamentChecklist'
  | 'vacationSchedule'
  | 'termination'
  | 'disciplinaryWarning'
  | 'foodBasket'
  | 'panicEvent'
  // Departamento Estadual Rodovias
  | 'client'
  | 'deliveryPrice'
  | 'productPrice'
  | 'stock'
  | 'highway'
  | 'asset'
  | 'workOrder'
  | 'appointment'
  | 'container';

export type EntityNameCasl =
  | 'User'
  | 'Company'
  | 'Post'
  | 'Patrol'
  | 'Checkpoint'
  | 'Vehicle'
  | 'Shift'
  | 'Occurrence'
  | 'VehicleChecklist'
  | 'Supply'
  | 'MotorizedService'
  | 'MotorcycleChecklist'
  | 'OccurrenceDispatch'
  | 'DoormanChecklist'
  | 'ArmamentChecklist'
  | 'VacationSchedule'
  | 'Termination'
  | 'DisciplinaryWarning'
  | 'FoodBasket'
  | 'PanicEvent'
  // Departamento Estadual Rodovias
  | 'Client'
  | 'DeliveryPrice'
  | 'ProductPrice'
  | 'Stock'
  | 'Highway'
  | 'Asset'
  | 'WorkOrder'
  | 'Appointment'
  | 'Container';

// ============================================================================
// 🔄 MAPEAMENTO AUTOMÁTICO MODEL ↔ CASL
// ============================================================================

/**
 * Mapeamento entre nomes de entidade do Prisma (model) e CASL (permissions)
 */
export const ENTITY_MAPPING = {
  // Core entities
  user: 'User',
  company: 'Company',
  post: 'Post',
  patrol: 'Patrol',
  checkpoint: 'Checkpoint',
  // Operational entities
  vehicle: 'Vehicle',
  shift: 'Shift',
  occurrence: 'Occurrence',
  motorizedService: 'MotorizedService',
  supply: 'Supply',
  vehicleChecklist: 'VehicleChecklist',
  motorcycleChecklist: 'MotorcycleChecklist',
  occurrenceDispatch: 'OccurrenceDispatch',
  doormanChecklist: 'DoormanChecklist',
  armamentChecklist: 'ArmamentChecklist',
  vacationSchedule: 'VacationSchedule',
  termination: 'Termination',
  disciplinaryWarning: 'DisciplinaryWarning',
  foodBasket: 'FoodBasket',
  panicEvent: 'PanicEvent',
  // Departamento Estadual Rodovias
  client: 'Client',
  deliveryPrice: 'DeliveryPrice',
  productPrice: 'ProductPrice',
  stock: 'Stock',
  highway: 'Highway',
  asset: 'Asset',
  workOrder: 'WorkOrder',
  appointment: 'Appointment',
  container: 'Container',
} as const;

/**
 * Mapeamento reverso CASL → Model
 */
export const CASL_TO_MODEL_MAPPING = {
  User: 'user',
  Company: 'company',
  Post: 'post',
  Patrol: 'patrol',
  Checkpoint: 'checkpoint',
  Vehicle: 'vehicle',
  Shift: 'shift',
  Occurrence: 'occurrence',
  MotorizedService: 'motorizedService',
  Supply: 'supply',
  VehicleChecklist: 'vehicleChecklist',
  MotorcycleChecklist: 'motorcycleChecklist',
  OccurrenceDispatch: 'occurrenceDispatch',
  DoormanChecklist: 'doormanChecklist',
  ArmamentChecklist: 'armamentChecklist',
  VacationSchedule: 'vacationSchedule',
  Termination: 'termination',
  DisciplinaryWarning: 'disciplinaryWarning',
  FoodBasket: 'foodBasket',
  PanicEvent: 'panicEvent',
  // Departamento Estadual Rodovias
  Client: 'client',
  DeliveryPrice: 'deliveryPrice',
  ProductPrice: 'productPrice',
  Stock: 'stock',
  Highway: 'highway',
  Asset: 'asset',
  WorkOrder: 'workOrder',
  Appointment: 'appointment',
  Container: 'container',
} as const;

// ============================================================================
// 🛠️ FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Converte nome da entidade do Prisma para nome do CASL
 * @param modelName Nome da entidade no Prisma (ex: 'company')
 * @returns Nome da entidade no CASL (ex: 'Company')
 */
export function getCaslName(modelName: EntityNameModel): EntityNameCasl {
  return ENTITY_MAPPING[modelName];
}

/**
 * Converte nome da entidade do CASL para nome do Prisma
 * @param caslName Nome da entidade no CASL (ex: 'Company')
 * @returns Nome da entidade no Prisma (ex: 'company')
 */
export function getModelName(caslName: EntityNameCasl): EntityNameModel {
  return CASL_TO_MODEL_MAPPING[caslName];
}

/**
 * Verifica se um nome de entidade é válido
 * @param entityName Nome da entidade para validar
 * @returns true se válido
 */
export function isValidEntityName(
  entityName: string,
): entityName is EntityNameModel {
  return Object.keys(ENTITY_MAPPING).includes(entityName);
}

/**
 * Obtém lista de todas as entidades disponíveis
 * @returns Array com todos os nomes de entidade do modelo
 */
export function getAllEntityNames(): EntityNameModel[] {
  return Object.keys(ENTITY_MAPPING) as EntityNameModel[];
}

/**
 * 🚀 Helper para criar configuração completa da entidade
 * @param modelName Nome da entidade no modelo (ex: 'company')
 * @returns Objeto com ambos os nomes para usar no constructor
 */
export function createEntityConfig(modelName: EntityNameModel) {
  return {
    model: modelName,
    casl: getCaslName(modelName),
  } as const;
}

// ============================================================================
// 📋 INTERFACES PARA CONFIGURAÇÃO DE INCLUDES E TRANSFORMAÇÕES
// ============================================================================

/** Permite select com campos boolean ou relações aninhadas (ex: product: { select: { id: true } }) */
export type SelectConfig = Record<
  string,
  boolean | { select?: SelectConfig; include?: IncludeConfig }
>;

export interface IncludeConfig {
  [key: string]:
  | boolean
  | {
    select?: SelectConfig;
    include?: IncludeConfig;
  };
}

export interface TransformConfig {
  // Mapeia campos de relacionamento para campos planos
  // Pode ser string simples ou objeto com configuração específica
  flatten?: Record<
    string,
    string | { field: string; target: string; keep?: boolean }
  >;
  // Função customizada de transformação
  custom?: (data: any) => any;
  // Remove campos específicos após transformação
  exclude?: string[];
}

export interface EntityConfig {
  includes?: IncludeConfig;
  transform?: TransformConfig;
  /** Cláusula where padrão para listagens/export (ex: { deletedAt: null }) */
  where?: Record<string, unknown>;
  /** orderBy padrão para listagens (ex: { updatedAt: 'desc' } para modelos sem createdAt) */
  orderBy?: Record<string, 'asc' | 'desc'>;
}

// ============================================================================
// 🔧 TIPOS EXISTENTES
// ============================================================================
