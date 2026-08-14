import { PreinscriptionEntity } from '../domain/Preinscription';
import { PreinscriptionDto } from '../dto/PreinscriptionDto';

export class PreinscriptionMapper {
  static toDto(entity: PreinscriptionEntity): PreinscriptionDto {
    return {
      id: entity.id,
      childFirstName: entity.childFirstName,
      childLastName: entity.childLastName,
      levelId: entity.levelId,
      parentName: entity.parentName,
      parentPhone: entity.parentPhone,
      status: entity.status,
      date: entity.date
    };
  }

  static toEntity(raw: any): PreinscriptionEntity {
    return {
      id: raw.id,
      childFirstName: raw.childFirstName,
      childLastName: raw.childLastName,
      levelId: raw.levelId || '1',
      parentName: raw.parentName,
      parentPhone: raw.parentPhone,
      status: raw.status || 'PENDING',
      date: raw.date || new Date().toISOString().split('T')[0]
    };
  }
}
