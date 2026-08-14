import { PrismaStudentRepository } from './infrastructure/PrismaStudentRepository';
import { PrismaParentRepository } from './infrastructure/PrismaParentRepository';
import { PrismaTeacherRepository } from './infrastructure/PrismaTeacherRepository';
import { PrismaPaymentRepository } from './infrastructure/PrismaPaymentRepository';
import { PrismaPreinscriptionRepository } from './infrastructure/PrismaPreinscriptionRepository';

import { StudentService } from './services/StudentService';
import { ParentService } from './services/ParentService';
import { TeacherService } from './services/TeacherService';
import { PaymentService } from './services/PaymentService';
import { PreinscriptionService } from './services/PreinscriptionService';

const studentRepo = new PrismaStudentRepository();
const parentRepo = new PrismaParentRepository();
const teacherRepo = new PrismaTeacherRepository();
const paymentRepo = new PrismaPaymentRepository();
const preRepo = new PrismaPreinscriptionRepository();

export const studentService = new StudentService(studentRepo);
export const parentService = new ParentService(parentRepo);
export const teacherService = new TeacherService(teacherRepo);
export const paymentService = new PaymentService(paymentRepo);
export const preinscriptionService = new PreinscriptionService(preRepo);
