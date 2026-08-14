import { StudentEntity } from '../domain/Student';
import { StudentDto } from '../dto/StudentDto';

export class StudentMapper {
  static toDto(entity: StudentEntity): StudentDto {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      matricule: entity.matricule,
      sex: entity.sex,
      birthDate: entity.birthDate,
      levelId: entity.levelId,
      parentId: entity.parentId,
      photoUrl: entity.photoUrl
    };
  }

  static toEntity(raw: any): StudentEntity {
    return {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      matricule: raw.matricule,
      sex: raw.sex || 'M',
      birthDate: raw.birthDate || '2012-01-01',
      levelId: raw.levelId || '1',
      parentId: raw.parentId || 'p1',
      photoUrl: raw.photoUrl
    };
  }
}
