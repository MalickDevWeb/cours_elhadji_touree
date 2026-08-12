import { StudentRepository } from '../ports/StudentRepository';
import { StudentEntity } from '../domain/Student';
import { StudentMapper } from '../mappers/StudentMapper';
import { readDb, writeDb } from '../dbHelper';

export class JsonStudentRepository implements StudentRepository {
  async findAll(): Promise<StudentEntity[]> {
    const db = readDb();
    const students = db.students || [];
    return students.map(StudentMapper.toEntity);
  }

  async findById(id: string): Promise<StudentEntity | null> {
    const db = readDb();
    const student = (db.students || []).find((s: any) => s.id === id);
    return student ? StudentMapper.toEntity(student) : null;
  }

  async findByParentId(parentId: string): Promise<StudentEntity[]> {
    const db = readDb();
    const list = (db.students || []).filter((s: any) => s.parentId === parentId);
    return list.map(StudentMapper.toEntity);
  }

  async save(student: StudentEntity): Promise<StudentEntity> {
    const db = readDb();
    const students = db.students || [];
    const index = students.findIndex((s: any) => s.id === student.id);
    const dto = StudentMapper.toDto(student);
    if (index >= 0) {
      students[index] = dto;
    } else {
      students.push(dto);
    }
    db.students = students;
    writeDb(db);
    return student;
  }

  async updatePhoto(id: string, photoUrl: string): Promise<StudentEntity | null> {
    const db = readDb();
    const students = db.students || [];
    const index = students.findIndex((s: any) => s.id === id);
    if (index < 0) return null;
    students[index].photoUrl = photoUrl;
    db.students = students;
    writeDb(db);
    return StudentMapper.toEntity(students[index]);
  }

  async delete(id: string): Promise<boolean> {
    const db = readDb();
    const students = db.students || [];
    db.students = students.filter((s: any) => s.id !== id);
    return writeDb(db);
  }
}
