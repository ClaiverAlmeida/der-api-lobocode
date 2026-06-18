import {
  WorkOrderCorrectiveSlaStatus,
  WorkOrderStatus,
} from '@prisma/client';
import {
  calcularSegundosUteis,
  type CorrectiveSlaCompanyConfig,
} from './work-order-corrective-sla.util';

export type CorrectiveSlaOverdueStatus = 'ACTIVE' | 'PAUSED' | 'FROZEN';

export interface CorrectiveSlaNegativeState {
  status: WorkOrderStatus;
  slaStartAt: Date | null;
  slaDeadlineAt: Date | null;
  slaPausedAt: Date | null;
  slaResumedAt: Date | null;
  slaConsumedSeconds: number | null;
  slaStatusExtended: WorkOrderCorrectiveSlaStatus | null;
  completedAt: Date | null;
  finalApprovalCompletedAt?: Date | null;
}

function resolverFimConsumoSlaNegativo(
  ordem: CorrectiveSlaNegativeState,
  agora: Date,
): Date {
  if (ordem.status === WorkOrderStatus.COMPLETED) {
    return ordem.finalApprovalCompletedAt ?? ordem.completedAt ?? agora;
  }
  if (ordem.status === WorkOrderStatus.CANCELLED) {
    return ordem.completedAt ?? agora;
  }
  return agora;
}

function statusEncerraConsumoSlaNegativo(status: WorkOrderStatus): boolean {
  return (
    status === WorkOrderStatus.COMPLETED ||
    status === WorkOrderStatus.CANCELLED
  );
}

/**
 * Atraso (SLA negativo) contado em tempo ÚTIL após o limite — é a "sobra" além
 * do orçamento (consumo − 6h), parando fora da janela operacional assim como o
 * SLA positivo. Congela no instante da pausa quando a OS está pausada.
 */
export function calcularSegundosAtrasoExcedenteCorretiva(
  ordem: CorrectiveSlaNegativeState,
  config: CorrectiveSlaCompanyConfig,
  consumed: number,
  budgetSeconds: number,
  agora: Date,
): number {
  const porConsumo = Math.max(0, consumed - budgetSeconds);
  const { correctiveSlaWindowStart, correctiveSlaWindowEnd } = config;

  const slaDeadlineAt = ordem.slaDeadlineAt;
  if (!slaDeadlineAt) {
    return porConsumo;
  }

  // Marco final do atraso conforme o estado: pausada congela no instante da
  // pausa, encerradas usam a conclusão e ativas usam "agora".
  let fimReferencia: Date | null;
  if (ordem.status === WorkOrderStatus.PAUSED) {
    fimReferencia = ordem.slaPausedAt ?? agora;
  } else if (statusEncerraConsumoSlaNegativo(ordem.status)) {
    fimReferencia = resolverFimConsumoSlaNegativo(ordem, agora);
  } else {
    fimReferencia = agora;
  }

  if (!fimReferencia) {
    return porConsumo;
  }
  if (fimReferencia.getTime() <= slaDeadlineAt.getTime()) {
    return 0;
  }

  // Tempo ÚTIL após o limite (dentro da janela operacional). Usar como teto
  // garante atraso contado só em tempo útil e evita que uma base de consumo
  // corrida/legada infle o atraso com tempo corrido fora da janela.
  const porLimite = calcularSegundosUteis(
    slaDeadlineAt,
    fimReferencia,
    correctiveSlaWindowStart,
    correctiveSlaWindowEnd,
  );

  return Math.min(porConsumo, porLimite);
}

export interface CorrectiveSlaNegativeSnapshot {
  isOverdue: boolean;
  overdueSeconds: number;
  overdueStatus: CorrectiveSlaOverdueStatus | null;
}

/** Consumo efetivo em tempo útil — espelha `WorkOrderSlaService.calcularConsumidoAtual`. */
export function calcularConsumidoEfetivoCorretiva(
  ordem: CorrectiveSlaNegativeState,
  config: CorrectiveSlaCompanyConfig,
  agora: Date,
): number {
  const base = Math.max(0, ordem.slaConsumedSeconds ?? 0);
  const slaStartAt = ordem.slaStartAt;
  if (!slaStartAt) {
    return base;
  }

  if (
    ordem.status === WorkOrderStatus.PAUSED ||
    (ordem.slaPausedAt && !ordem.slaResumedAt)
  ) {
    return base;
  }

  const fim = resolverFimConsumoSlaNegativo(ordem, agora);

  if (statusEncerraConsumoSlaNegativo(ordem.status)) {
    if (ordem.slaPausedAt) {
      return base;
    }
    if (
      ordem.slaStatusExtended ===
        WorkOrderCorrectiveSlaStatus.COMPLETED_ON_TIME ||
      ordem.slaStatusExtended === WorkOrderCorrectiveSlaStatus.COMPLETED_LATE
    ) {
      return base;
    }
    if (!ordem.slaResumedAt) {
      if (base > 0) {
        return base;
      }
      return calcularSegundosUteis(
        slaStartAt,
        fim,
        config.correctiveSlaWindowStart,
        config.correctiveSlaWindowEnd,
      );
    }
    const extra = calcularSegundosUteis(
      ordem.slaResumedAt,
      fim,
      config.correctiveSlaWindowStart,
      config.correctiveSlaWindowEnd,
    );
    return base + extra;
  }

  if (ordem.slaResumedAt) {
    return (
      base +
      calcularSegundosUteis(
        ordem.slaResumedAt,
        fim,
        config.correctiveSlaWindowStart,
        config.correctiveSlaWindowEnd,
      )
    );
  }

  return calcularSegundosUteis(
    slaStartAt,
    fim,
    config.correctiveSlaWindowStart,
    config.correctiveSlaWindowEnd,
  );
}

export function calcularSlaNegativoCorretiva(
  ordem: CorrectiveSlaNegativeState,
  config: CorrectiveSlaCompanyConfig,
  budgetSeconds: number,
  agora: Date = new Date(),
): CorrectiveSlaNegativeSnapshot {
  if (!ordem.slaStartAt || budgetSeconds <= 0) {
    return {
      isOverdue: false,
      overdueSeconds: 0,
      overdueStatus: null,
    };
  }

  const consumed = calcularConsumidoEfetivoCorretiva(ordem, config, agora);
  const overdueSeconds = calcularSegundosAtrasoExcedenteCorretiva(
    ordem,
    config,
    consumed,
    budgetSeconds,
    agora,
  );

  if (overdueSeconds <= 0) {
    return {
      isOverdue: false,
      overdueSeconds: 0,
      overdueStatus: null,
    };
  }

  if (statusEncerraConsumoSlaNegativo(ordem.status)) {
    return {
      isOverdue: true,
      overdueSeconds,
      overdueStatus: 'FROZEN',
    };
  }

  if (ordem.status === WorkOrderStatus.PAUSED) {
    return {
      isOverdue: true,
      overdueSeconds,
      overdueStatus: 'PAUSED',
    };
  }

  return {
    isOverdue: true,
    overdueSeconds,
    overdueStatus: 'ACTIVE',
  };
}
