import { ParentRepository } from '../ports/ParentRepository';
import { ParentDto } from '../dto/ParentDto';
import { ParentMapper } from '../mappers/ParentMapper';
import { redisService } from './RedisService';

export class ParentService {
  constructor(private readonly parentRepo: ParentRepository) {}

  async getAllParents(): Promise<ParentDto[]> {
    const cacheKey = 'parents:all';
    const cached = await redisService.getJson<ParentDto[]>(cacheKey);
    if (cached) return cached;

    const parents = await this.parentRepo.findAll();
    const dtos = parents.map(ParentMapper.toDto);
    await redisService.setJson(cacheKey, dtos, 300);
    return dtos;
  }

  async getParentByPhone(phone: string): Promise<ParentDto | null> {
    const cacheKey = `parent:phone:${phone}`;
    const cached = await redisService.getJson<ParentDto>(cacheKey);
    if (cached) return cached;

    const parent = await this.parentRepo.findByPhone(phone);
    if (!parent) return null;
    const dto = ParentMapper.toDto(parent);
    await redisService.setJson(cacheKey, dto, 300);
    return dto;
  }
}
