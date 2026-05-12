/** Valores aceitos no body (`presetReason`) — apenas validação; persiste-se só em `reason`. */
export enum WorkOrderPausePresetReason {
  VANDALISM_THEFT = 'VANDALISM_THEFT',
  MONITORING_STRUCTURE_INCIDENT = 'MONITORING_STRUCTURE_INCIDENT',
  ROAD_WORKS = 'ROAD_WORKS',
  ADVERSE_WEATHER = 'ADVERSE_WEATHER',
  DATA_LINK_FAILURE = 'DATA_LINK_FAILURE',
  DER_INFRA_REPAIR_REPLACE = 'DER_INFRA_REPAIR_REPLACE',
  EQUIPMENT_MAINTENANCE = 'EQUIPMENT_MAINTENANCE',
  OTHER = 'OTHER',
}

/** Texto gravado no campo `reason` da tabela (sem numeração). */
export const WORK_ORDER_PAUSE_PRESET_STORED_LABELS: Record<
  WorkOrderPausePresetReason,
  string
> = {
  [WorkOrderPausePresetReason.VANDALISM_THEFT]:
    'Vandalismo/furto de equipamentos e cabeamento',
  [WorkOrderPausePresetReason.MONITORING_STRUCTURE_INCIDENT]:
    'Sinistro que envolva a estrutura do ponto de monitoração',
  [WorkOrderPausePresetReason.ROAD_WORKS]:
    'Obras nas vias (recapeamento, instalação de defensa metálica, ampliação, etc.)',
  [WorkOrderPausePresetReason.ADVERSE_WEATHER]:
    'Condições climáticas adversas, impedindo de atuar com segurança',
  [WorkOrderPausePresetReason.DATA_LINK_FAILURE]:
    'Falha no link de dados do local',
  [WorkOrderPausePresetReason.DER_INFRA_REPAIR_REPLACE]:
    'Substituir ou reparar infraestrutura de monitoração que demandem ações do DER/SP',
  [WorkOrderPausePresetReason.EQUIPMENT_MAINTENANCE]:
    'Manutenção de equipamento',
  [WorkOrderPausePresetReason.OTHER]: 'Outro',
};

export function buildWorkOrderPauseHistoryReason(
  preset: WorkOrderPausePresetReason,
  customReason?: string,
): string {
  if (preset === WorkOrderPausePresetReason.OTHER) {
    const trimmed = customReason?.trim() ?? '';
    return trimmed ? `Outro: ${trimmed}` : 'Outro';
  }
  return WORK_ORDER_PAUSE_PRESET_STORED_LABELS[preset];
}
