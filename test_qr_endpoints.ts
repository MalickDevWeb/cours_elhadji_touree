import { matchStudentByQr, parseQrPayload } from './src/features/teacher/domain/qrCodeParser';
import { getFormattedId } from './src/features/admin/components/StudentCardUtils';
import { Student } from './src/types';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 TEST COMPLET DU SCANNER QR CODE & ENDPOINTS');
  console.log('====================================================\n');

  // Sample test students
  const sampleStudents: Student[] = [
    {
      id: 'std-1',
      firstName: 'Babacar',
      lastName: 'Diop',
      email: 'babacar@test.sn',
      phone: '+221 77 123 45 67',
      levelId: 'lvl-1',
      parentId: 'par-1',
      registrationDate: '2026-09-01',
      sex: 'M',
      cardNo: 'MAX-2026-01',
    },
    {
      id: 'std-2',
      firstName: 'Awa',
      lastName: 'Ndiaye',
      email: 'awa@test.sn',
      phone: '+221 77 987 65 43',
      levelId: 'lvl-2',
      parentId: 'par-2',
      registrationDate: '2026-09-01',
      sex: 'F',
      cardNo: 'MAX-2026-02',
    }
  ];

  let passed = 0;
  let failed = 0;

  function assert(title: string, condition: boolean, extra = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} - ${extra}`);
      failed++;
    }
  }

  console.log('--- 1. Tests Unitaires du Parser QR Code & Identification Élève ---');

  // Test 1: Formatted ID (Standard Elite Card QR)
  const formatted1 = getFormattedId(sampleStudents[0]);
  console.log(`  ℹ️ ID Formaté généré pour Babacar: ${formatted1}`);
  const match1 = matchStudentByQr(formatted1, sampleStudents);
  assert('Scan QR ID Formaté (SEN-2026-0001-M)', match1?.id === 'std-1');

  // Test 2: Raw ID
  const match2 = matchStudentByQr('std-1', sampleStudents);
  assert('Scan QR ID Brut (std-1)', match2?.id === 'std-1');

  // Test 3: Card Number
  const match3 = matchStudentByQr('MAX-2026-01', sampleStudents);
  assert('Scan QR Numéro de Carte (MAX-2026-01)', match3?.id === 'std-1');

  // Test 4: JSON payload
  const jsonQr = JSON.stringify({ id: 'std-2', name: 'Awa Ndiaye' });
  const match4 = matchStudentByQr(jsonQr, sampleStudents);
  assert('Scan QR Payload JSON ({"id":"std-2",...})', match4?.id === 'std-2');

  // Test 5: URL payload
  const urlQr = `https://soutien-scolaire.sn/verify?card=${formatted1}`;
  const match5 = matchStudentByQr(urlQr, sampleStudents);
  assert('Scan QR Payload URL contenant la carte', match5?.id === 'std-1');

  // Test 6: Case Insensitivity and Trimming
  const match6 = matchStudentByQr(`  ${formatted1.toLowerCase()}  `, sampleStudents);
  assert('Scan QR Minuscules avec Espaces', match6?.id === 'std-1');

  // Test 7: Non-existent student
  const match7 = matchStudentByQr('UNKNOWN-CARD-9999', sampleStudents);
  assert('Scan QR Carte Inconnue (Doit échouer proprement)', match7 === undefined);

  console.log('\n--- 2. Tests des Endpoints API Backend HTTP ---');
  const baseUrl = 'http://127.0.0.1:3000';

  try {
    // Test API: Health / Public
    const resPublic = await fetch(`${baseUrl}/api/public/site`);
    assert('GET /api/public/site', resPublic.ok);

    // Test API: Students
    const resStudents = await fetch(`${baseUrl}/api/students`);
    const studentsData = await resStudents.json();
    assert('GET /api/students', resStudents.ok && Array.isArray(studentsData));

    // Test API: Teachers
    const resTeachers = await fetch(`${baseUrl}/api/teachers`);
    assert('GET /api/teachers', resTeachers.ok);

    // Test API: Parents
    const resParents = await fetch(`${baseUrl}/api/parents`);
    assert('GET /api/parents', resParents.ok);

    // Test API: Payments
    const resPayments = await fetch(`${baseUrl}/api/payments`);
    assert('GET /api/payments', resPayments.ok);

    // Test API: Preinscriptions
    const resPreinsc = await fetch(`${baseUrl}/api/preinscriptions`);
    assert('GET /api/preinscriptions', resPreinsc.ok);

    // Test API: Attendance Scan QR endpoint
    const firstStudent = studentsData[0] || sampleStudents[0];
    const testQrCode = firstStudent.cardNo || firstStudent.id;
    const testSubject = `Matière Test ${Date.now()}`;

    const resScan1 = await fetch(`${baseUrl}/api/attendance/scan-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qrPayload: testQrCode,
        subjectName: testSubject,
        teacherName: 'Prof Test'
      })
    });
    const scan1Data = await resScan1.json();
    assert('POST /api/attendance/scan-qr (1er Scan - Présence validée)', scan1Data.success === true && scan1Data.status === 'SUCCESS');

    // Test API: Duplicate Scan on the same day
    const resScan2 = await fetch(`${baseUrl}/api/attendance/scan-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qrPayload: testQrCode,
        subjectName: testSubject,
        teacherName: 'Prof Test'
      })
    });
    const scan2Data = await resScan2.json();
    assert('POST /api/attendance/scan-qr (2nd Scan - Détection Déjà Scanné)', scan2Data.status === 'ALREADY_SCANNED');

    // Test API: Invalid QR Code payload
    const resScanInvalid = await fetch(`${baseUrl}/api/attendance/scan-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qrPayload: 'FAUX-CODE-INEXISTANT-0000000000000000000',
        subjectName: 'Mathématiques Test'
      })
    });
    const scanInvData = await resScanInvalid.json();
    assert('POST /api/attendance/scan-qr (Scan Invalide - Rejet propre 404)', resScanInvalid.status === 404 && scanInvData.status === 'INVALID');

    // Test API: Attendance History
    const resHistory = await fetch(`${baseUrl}/api/attendance/history`);
    const historyData = await resHistory.json();
    assert('GET /api/attendance/history', resHistory.ok && typeof historyData === 'object');

  } catch (err: any) {
    console.error('Erreur lors des tests HTTP:', err.message);
  }

  console.log('\n====================================================');
  console.log(`📊 RÉSULTAT FINAL: ${passed} Réussis | ${failed} Échoués`);
  console.log('====================================================');
  
  if (failed > 0) process.exit(1);
}

runTests();
