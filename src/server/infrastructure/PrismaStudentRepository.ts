import { StudentRepository } from '../ports/StudentRepository';
import { StudentEntity } from '../domain/Student';
import { getPrisma } from '../db/prismaClient';
import { JsonStudentRepository } from './JsonStudentRepository';
import { mapPrismaToStudent } from './PrismaStudentHelper';

export class PrismaStudentRepository implements StudentRepository {
  private jsonFallback = new JsonStudentRepository();

  async findAll(): Promise<StudentEntity[]> {
    try {
      const records = await getPrisma().student.findMany();
      if (records.length === 0) return this.jsonFallback.findAll();
      return records.map(mapPrismaToStudent);
    } catch {
      return this.jsonFallback.findAll();
    }
  }

  async findById(id: string): Promise<StudentEntity | null> {
    try {
      const s = await getPrisma().student.findUnique({ where: { id } });
      if (!s) return this.jsonFallback.findById(id);
      return mapPrismaToStudent(s);
    } catch {
      return this.jsonFallback.findById(id);
    }
  }

  async findByParentId(parentId: string): Promise<StudentEntity[]> {
    try {
      const records = await getPrisma().student.findMany({ where: { parentId } });
      if (records.length === 0) return this.jsonFallback.findByParentId(parentId);
      return records.map(mapPrismaToStudent);
    } catch {
      return this.jsonFallback.findByParentId(parentId);
    }
  }

  async save(student: StudentEntity): Promise<StudentEntity> {
    try {
      await getPrisma().student.upsert({
        where: { id: student.id },
        update: {
          firstName: student.firstName,
          lastName: student.lastName,
          sex: student.sex,
          birthDate: student.birthDate,
          levelId: student.levelId,
          parentId: student.parentId,
          photoUrl: student.photoUrl
        },
        create: {
          id: student.id,
          matricule: student.matricule,
          firstName: student.firstName,
          lastName: student.lastName,
          sex: student.sex,
          birthDate: student.birthDate,
          levelId: student.levelId,
          parentId: student.parentId,
          photoUrl: student.photoUrl
        }
      });
      await this.jsonFallback.save(student);
      return student;
    } catch {
      return this.jsonFallback.save(student);
    }
  }

  async updatePhoto(id: string, photoUrl: string): Promise<StudentEntity | null> {
    try {
      await getPrisma().student.update({ where: { id }, data: { photoUrl } });
      await this.jsonFallback.updatePhoto(id, photoUrl);
      return this.findById(id);
    } catch {
      return this.jsonFallback.updatePhoto(id, photoUrl);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await getPrisma().student.delete({ where: { id } });
      await this.jsonFallback.delete(id);
      return true;
    } catch {
      return this.jsonFallback.delete(id);
    }
  }
}
