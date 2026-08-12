import { TeacherRepository } from '../ports/TeacherRepository';
import { TeacherDto } from '../dto/TeacherDto';
import { TeacherMapper } from '../mappers/TeacherMapper';

export class TeacherService {
  constructor(private readonly teacherRepo: TeacherRepository) {}

  async getAllTeachers(): Promise<TeacherDto[]> {
    const teachers = await this.teacherRepo.findAll();
    return teachers.map(TeacherMapper.toDto);
  }

  async getTeacherById(id: string): Promise<TeacherDto | null> {
    const teacher = await this.teacherRepo.findById(id);
    return teacher ? TeacherMapper.toDto(teacher) : null;
  }
}
