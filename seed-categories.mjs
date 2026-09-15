import { createClient } from '@sanity/client';

const TOKEN = 'POSA-AQUI-EL-TOKEN';

const c = createClient({
  projectId: 'e497m7tn', dataset: 'production', apiVersion: '2026-01-01', useCdn: false, token: TOKEN,
});

// Els 6 de la part alta de l'original → principals
const principals = ['Càmping Massanet', 'La Tramuntana', 'Can Mach', 'Batlle Arquitectura', 'Impex Subministres', 'Fruiver'];
for (const nom of principals) {
  const doc = await c.fetch('*[_type == "sponsor" && nom == $nom][0]{_id}', { nom });
  if (!doc) { console.log(`NO TROBAT: ${nom}`); continue; }
  await c.patch(doc._id).set({ categoria: 'principal' }).commit();
  console.log(`OK principal: ${nom}`);
}
// Ajuntament amfitrió → institucional (amb Albanyà i Diputació)
const aj = await c.fetch('*[_type == "sponsor" && nom == "Ajuntament de Maçanet de Cabrenys"][0]{_id}');
if (aj) {
  await c.patch(aj._id).set({ categoria: 'institucional' }).commit();
  console.log('OK institucional: Ajuntament de Maçanet de Cabrenys');
}
console.log('CATEGORIES FETES');
