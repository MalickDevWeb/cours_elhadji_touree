import { PreinscriptionRepository } from '../ports/PreinscriptionRepository';
import { PreinscriptionEntity } from '../domain/Preinscription';
import { PreinscriptionMapper } from '../mappers/PreinscriptionMapper';
import { getPrisma } from '../db/prismaClient';
import { JsonPreinscriptionRepository } from './JsonPreinscriptionRepository';

export class PrismaPreinscriptionRepository implements PreinscriptionRepository {
  private jsonFallback = new JsonPreinscriptionRepository();

  async findAll(): Promise<PreinscriptionEntity[]> {
    try {
      const records = await getPrisma().preinscription.findMany();
      if (records.length === 0) return this.jsonFallback.findAll();
      return records.map((p) => PreinscriptionMapper.toEntity({
        id: p.id,
        childFirstName: p.childFirstName,
        childLastName: p.childLastName,
        levelId: p.levelId,
        parentName: p.parentName,
        parentPhone: p.parentPhone,
        status: p.status as any,
        date: p.date
      }));
    } catch {
      return this.jsonFallback.findAll();
    }
  }

  async save(pre: PreinscriptionEntity): Promise<PreinscriptionEntity> {
    try {
      await getPrisma().preinscription.upsert({
        where: { id: pre.id },
        update: {
          childFirstName: pre.childFirstName,
          childLastName: pre.childLastName,
          levelId: pre.levelId,
          parentName: pre.parentName,
          parentPhone: pre.parentPhone,
          status: pre.status as any,
          date: pre.date
        },
        create: {
          id: pre.id,
          childFirstName: pre.childFirstName,
          childLastName: pre.childLastName,
          levelId: pre.levelId,
          parentName: pre.parentName,
          parentPhone: pre.parentPhone,
          status: pre.status as any,
          date: pre.date
        }
      });
      await this.jsonFallback.save(pre);
      return pre;
    } catch {
      return this.jsonFallback.save(pre);
    }
  }
}
