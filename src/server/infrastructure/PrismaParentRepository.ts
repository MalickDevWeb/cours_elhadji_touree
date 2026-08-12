import { ParentRepository } from '../ports/ParentRepository';
import { ParentEntity } from '../domain/Parent';
import { ParentMapper } from '../mappers/ParentMapper';
import { getPrisma } from '../db/prismaClient';
import { JsonParentRepository } from './JsonParentRepository';

export class PrismaParentRepository implements ParentRepository {
  private jsonFallback = new JsonParentRepository();

  async findAll(): Promise<ParentEntity[]> {
    try {
      const records = await getPrisma().parent.findMany();
      if (records.length === 0) return this.jsonFallback.findAll();
      return records.map((p) => ParentMapper.toEntity({
        id: p.id,
        fullName: p.fullName,
        phone: p.phone,
        email: p.email ?? undefined,
        address: p.address ?? undefined
      }));
    } catch {
      return this.jsonFallback.findAll();
    }
  }

  async findById(id: string): Promise<ParentEntity | null> {
    try {
      const p = await getPrisma().parent.findUnique({ where: { id } });
      if (!p) return this.jsonFallback.findById(id);
      return ParentMapper.toEntity({
        id: p.id,
        fullName: p.fullName,
        phone: p.phone,
        email: p.email ?? undefined,
        address: p.address ?? undefined
      });
    } catch {
      return this.jsonFallback.findById(id);
    }
  }

  async findByPhone(phone: string): Promise<ParentEntity | null> {
    try {
      const p = await getPrisma().parent.findFirst({ where: { phone } });
      if (!p) return this.jsonFallback.findByPhone(phone);
      return ParentMapper.toEntity({
        id: p.id,
        fullName: p.fullName,
        phone: p.phone,
        email: p.email ?? undefined,
        address: p.address ?? undefined
      });
    } catch {
      return this.jsonFallback.findByPhone(phone);
    }
  }

  async save(parent: ParentEntity): Promise<ParentEntity> {
    try {
      await getPrisma().parent.upsert({
        where: { id: parent.id },
        update: {
          fullName: parent.fullName,
          phone: parent.phone,
          email: parent.email,
          address: parent.address
        },
        create: {
          id: parent.id,
          fullName: parent.fullName,
          phone: parent.phone,
          email: parent.email,
          address: parent.address
        }
      });
      await this.jsonFallback.save(parent);
      return parent;
    } catch {
      return this.jsonFallback.save(parent);
    }
  }
}
