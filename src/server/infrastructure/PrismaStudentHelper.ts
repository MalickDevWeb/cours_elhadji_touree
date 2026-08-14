import { StudentEntity } from '../domain/Student';
import { StudentMapper } from '../mappers/StudentMapper';

export function mapPrismaToStudent(s: any): StudentEntity {
  return StudentMapper.toEntity({
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    matricule: s.matricule,
    sex: s.sex,
    birthDate: s.birthDate,
    levelId: s.levelId,
    parentId: s.parentId,
    photoUrl: s.photoUrl ?? undefined
  });
}
