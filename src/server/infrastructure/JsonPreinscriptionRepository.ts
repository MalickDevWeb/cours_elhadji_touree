import { PreinscriptionRepository } from '../ports/PreinscriptionRepository';
import { PreinscriptionEntity } from '../domain/Preinscription';
import { PreinscriptionMapper } from '../mappers/PreinscriptionMapper';
import { readDb, writeDb } from '../dbHelper';

export class JsonPreinscriptionRepository implements PreinscriptionRepository {
  async findAll(): Promise<PreinscriptionEntity[]> {
    const db = readDb();
    return (db.preinscriptions || []).map(PreinscriptionMapper.toEntity);
  }

  async save(pre: PreinscriptionEntity): Promise<PreinscriptionEntity> {
    const db = readDb();
    const preinscriptions = db.preinscriptions || [];
    const index = preinscriptions.findIndex((p: any) => p.id === pre.id);
    const dto = PreinscriptionMapper.toDto(pre);
    if (index >= 0) {
      preinscriptions[index] = dto;
    } else {
      preinscriptions.unshift(dto);
    }
    db.preinscriptions = preinscriptions;
    writeDb(db);
    return pre;
  }
}
