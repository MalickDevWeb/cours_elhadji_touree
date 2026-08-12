import { PreinscriptionEntity } from '../domain/Preinscription';

export interface PreinscriptionRepository {
  findAll(): Promise<PreinscriptionEntity[]>;
  save(pre: PreinscriptionEntity): Promise<PreinscriptionEntity>;
}
