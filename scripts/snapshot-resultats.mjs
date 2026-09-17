// Snapshot de classificacions Sportmaniacs -> documents `classificacio` al Sanity.
// Ús: npm run snapshot:resultats [--any=2026]
// Llegeix els events de cada edició (camp resultatsEvents), descarrega
// general+masculina+femenina de l'API, puja el JSON com a file asset i
// crea/actualitza el doc `classificacio` (idempotent per eventId).
// Token: variable SANITY_WRITE_TOKEN o, si no, la sessió del `sanity login`
// (~/.config/sanity/config.json, Windows: %USERPROFILE%\.config\sanity).

import {createClient} from '@sanity/client';
import {buildSync} from 'esbuild';
import {readFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');

function carregaToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
  for (const p of [join(home, '.config', 'sanity', 'config.json')]) {
    try {
      if (existsSync(p)) {
        const cfg = JSON.parse(readFileSync(p, 'utf8'));
        if (cfg.authToken) return cfg.authToken;
      }
    } catch {
      // continua
    }
  }
  return null;
}

const token = carregaToken();
if (!token) {
  console.error('Falta token: exporta SANITY_WRITE_TOKEN o fes `sanity login`.');
  process.exit(1);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'e497m7tn';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';
const client = createClient({projectId, dataset, apiVersion: '2026-01-01', token, useCdn: false});

// Reutilitza el codi provat de src/lib/resultats.ts
const bundle = join(tmpdir(), `resultats-${Date.now()}.cjs`);
buildSync({entryPoints: [join(root, 'src', 'lib', 'resultats.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: bundle, logLevel: 'error'});
const {obteClassificacio} = await import(pathToFileURL(bundle).href);

const filtreAny = process.argv.find((a) => a.startsWith('--any='))?.split('=')[1];
const edicions = await client.fetch(
  `*[_type == "edicio" && defined(resultatsEvents)]{_id, any, resultatsEvents[]{nom, eventId}} | order(any desc)`
);

let fets = 0;
for (const e of edicions) {
  if (filtreAny && String(e.any) !== filtreAny) continue;
  for (const ev of e.resultatsEvents ?? []) {
    if (!ev?.eventId) continue;
    const cls = await obteClassificacio(ev.eventId);
    if (!cls) {
      console.log(`${e.any} ${ev.nom ?? ''}: API sense dades, omès`);
      continue;
    }
    const snap = {eventId: ev.eventId, nom: ev.nom ?? null, baixat: new Date().toISOString(), ...cls};
    const asset = await client.assets.upload('file', Buffer.from(JSON.stringify(snap), 'utf8'), {
      filename: `classificacio-${e.any}-${(ev.nom ?? 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`,
    });
    const existent = await client.fetch(`*[_type == "classificacio" && eventId == $id][0]{_id}`, {id: ev.eventId});
    const doc = {
      _type: 'classificacio',
      edicio: {_type: 'reference', _ref: e._id},
      nom: ev.nom ?? 'General',
      eventId: ev.eventId,
      fitxer: {_type: 'file', asset: {_type: 'reference', _ref: asset._id}},
      actualitzat: new Date().toISOString(),
    };
    if (existent?._id) await client.patch(existent._id).set(doc).commit();
    else await client.create(doc);
    console.log(`${e.any} ${ev.nom ?? ''}: ${cls.general.length} files -> snapshot`);
    fets++;
  }
}
console.log(`Fet: ${fets} snapshots.`);
