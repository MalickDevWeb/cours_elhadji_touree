import { StudentRepository } from '../ports/StudentRepository';
import { StudentDto, CreateStudentRequestDto } from '../dto/StudentDto';
import { StudentMapper } from '../mappers/StudentMapper';
import { createStudentEntity } from '../domain/Student';
import { redisService } from './RedisService';

export class StudentService {
  constructor(private readonly studentRepo: StudentRepository) {}

  async getAllStudents(): Promise<StudentDto[]> {
    const cacheKey = 'students:all';
    const cached = await redisService.getJson<StudentDto[]>(cacheKey);
    if (cached) return cached;

    const entities = await this.studentRepo.findAll();
    const dtos = entities.map(StudentMapper.toDto);
    await redisService.setJson(cacheKey, dtos, 300);
    return dtos;
  }

  async getStudentById(id: string): Promise<StudentDto | null> {
    const cacheKey = `student:${id}`;
    const cached = await redisService.getJson<StudentDto>(cacheKey);
    if (cached) return cached;

    const entity = await this.studentRepo.findById(id);
    if (!entity) return null;
    const dto = StudentMapper.toDto(entity);
    await redisService.setJson(cacheKey, dto, 300);
    return dto;
  }

  async getStudentsByParentId(parentId: string): Promise<StudentDto[]> {
    const cacheKey = `students:parent:${parentId}`;
    const cached = await redisService.getJson<StudentDto[]>(cacheKey);
    if (cached) return cached;

    const entities = await this.studentRepo.findByParentId(parentId);
    const dtos = entities.map(StudentMapper.toDto);
    await redisService.setJson(cacheKey, dtos, 300);
    return dtos;
  }

  async createStudent(req: CreateStudentRequestDto): Promise<StudentDto> {
    const entity = createStudentEntity(req);
    const saved = await this.studentRepo.save(entity);
    await redisService.invalidatePattern('students:*');
    return StudentMapper.toDto(saved);
  }

  async updateStudentPhoto(id: string, photoUrl: string): Promise<StudentDto | null> {
    const updated = await this.studentRepo.updatePhoto(id, photoUrl);
    if (!updated) return null;
    await redisService.invalidatePattern('student*');
    return StudentMapper.toDto(updated);
  }
}
