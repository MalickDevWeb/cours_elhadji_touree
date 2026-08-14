import { TeacherEntity } from '../domain/Teacher';
import { TeacherDto } from '../dto/TeacherDto';

export class TeacherMapper {
  static toDto(entity: TeacherEntity): TeacherDto {
    return {
      id: entity.id,
      fullName: entity.fullName,
      phone: entity.phone,
      email: entity.email,
      subjectIds: [...entity.subjectIds],
      bio: entity.bio,
      isOnline: !!entity.isOnline
    };
  }

  static toEntity(raw: any): TeacherEntity {
    return {
      id: raw.id,
      fullName: raw.fullName,
      phone: raw.phone,
      email: raw.email,
      subjectIds: raw.subjectIds || [],
      bio: raw.bio,
      isOnline: raw.isOnline ?? true
    };
  }
}
