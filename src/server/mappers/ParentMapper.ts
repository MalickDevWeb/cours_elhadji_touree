import { ParentEntity } from '../domain/Parent';
import { ParentDto } from '../dto/ParentDto';

export class ParentMapper {
  static toDto(entity: ParentEntity): ParentDto {
    return {
      id: entity.id,
      fullName: entity.fullName,
      phone: entity.phone,
      email: entity.email,
      address: entity.address,
      childrenIds: entity.childrenIds ? [...entity.childrenIds] : []
    };
  }

  static toEntity(raw: any): ParentEntity {
    return {
      id: raw.id,
      fullName: raw.fullName,
      phone: raw.phone,
      email: raw.email,
      address: raw.address,
      childrenIds: raw.childrenIds || []
    };
  }
}
