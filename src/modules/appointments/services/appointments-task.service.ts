import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AppointmentsTaskService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly logger = new Logger(AppointmentsTaskService.name);

    /** Data de amanhã em YYYY-MM-DD (calculada no momento da execução). */
    private getTomorrow(): string {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString();
    }

    @Cron(CronExpression.EVERY_DAY_AT_11AM)
    async handleCron() {
        return this.getAppointmentsForTomorrow();
    }

    /**
     * Executa a task manualmente (ex.: via endpoint GET /appointments/task/run).
     * Retorna os agendamentos encontrados para amanhã.
     */
    async getAppointmentsForTomorrow() {
        const tomorrow = this.getTomorrow();
        this.logger.log(`[Task] Buscando agendamentos para ${new Date(tomorrow).toLocaleDateString('pt-BR')}`);

        const appointments = await this.prisma.appointment.findMany({
            where: {
                collectionDate: {
                    gte: tomorrow,
                    lte: tomorrow,
                },
            },
        });

        if (appointments.length === 0) {
            this.logger.log(`[Task] Nenhum agendamento para amanhã (${new Date(tomorrow).toLocaleDateString('pt-BR')})`);
            // return { date: tomorrow, count: 0, appointments: [] };
        }

        this.logger.log(`[Task] ${appointments.length} agendamento(s) para amanhã (${new Date(tomorrow).toLocaleDateString('pt-BR')})`);
        // return { date: tomorrow, count: appointments.length, appointments };
    }
}