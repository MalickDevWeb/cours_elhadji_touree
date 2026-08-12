import { PreinscriptionRepository } from '../ports/PreinscriptionRepository';
import { PreinscriptionDto } from '../dto/PreinscriptionDto';
import { PreinscriptionMapper } from '../mappers/PreinscriptionMapper';
import { createPreinscriptionEntity } from '../domain/Preinscription';

export class PreinscriptionService {
  constructor(private readonly preRepo: PreinscriptionRepository) {}

  async getAll(): Promise<PreinscriptionDto[]> {
    const list = await this.preRepo.findAll();
    return list.map(PreinscriptionMapper.toDto);
  }

  async submitPreinscription(data: any): Promise<PreinscriptionDto> {
    const entity = createPreinscriptionEntity(data);
    const saved = await this.preRepo.save(entity);
    return PreinscriptionMapper.toDto(saved);
  }
}
