export interface ParentDto {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  childrenIds: string[];
}
