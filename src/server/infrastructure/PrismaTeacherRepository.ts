import { TeacherRepository } from '../ports/TeacherRepository';
import { TeacherEntity } from '../domain/Teacher';
import { TeacherMapper } from '../mappers/TeacherMapper';
import { getPrisma } from '../db/prismaClient';
import { JsonTeacherRepository } from './JsonTeacherRepository';

export class PrismaTeacherRepository implements TeacherRepository {
  private jsonFallback = new JsonTeacherRepository();

  async findAll(): Promise<TeacherEntity[]> {
    try {
      const records = await getPrisma().teacher.findMany();
      if (records.length === 0) return this.jsonFallback.findAll();
      return records.map((t) => TeacherMapper.toEntity({
        id: t.id,
        fullName: t.fullName,
        phone: t.phone,
        email: `${t.id}@school.edu`,
        subjectIds: [t.subject],
        bio: t.levels
      }));
    } catch {
      return this.jsonFallback.findAll();
    }
  }

  async findById(id: string): Promise<TeacherEntity | null> {
    try {
      const t = await getPrisma().teacher.findUnique({ where: { id } });
      if (!t) return this.jsonFallback.findById(id);
      return TeacherMapper.toEntity({
        id: t.id,
        fullName: t.fullName,
        phone: t.phone,
        email: `${t.id}@school.edu`,
        subjectIds: [t.subject],
        bio: t.levels
      });
    } catch {
      return this.jsonFallback.findById(id);
    }
  }

  async save(teacher: TeacherEntity): Promise<TeacherEntity> {
    try {
      await getPrisma().teacher.upsert({
        where: { id: teacher.id },
        update: {
          fullName: teacher.fullName,
          phone: teacher.phone,
          subject: teacher.subjectIds[0] || 'Général',
          levels: teacher.bio || ''
        },
        create: {
          id: teacher.id,
          fullName: teacher.fullName,
          phone: teacher.phone,
          subject: teacher.subjectIds[0] || 'Général',
          levels: teacher.bio || ''
        }
      });
      await this.jsonFallback.save(teacher);
      return teacher;
    } catch {
      return this.jsonFallback.save(teacher);
    }
  }
}
