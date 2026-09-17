// Classificacions Sportmaniacs descarregades en build via la seva API JSON.
// Sense auth ni dependències. Si l'API falla o canvia de format, les
// funcions retornen null i la pàgina usa l'iframe legacy.

export type FilaResultat = {
  pos: number;
  dorsal: string;
  nom: string;
  club: string;
  temps: string;
};

export type Classificacio = {
  general: FilaResultat[];
  masculina: FilaResultat[];
  femenina: FilaResultat[];
  total: number;
};

/** Normalitza noms de distància per aparellar ("24 KM" = "24km") */
export function normNom(nom?: string | null): string {
  return (nom ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const API_URL = 'https://sportmaniacs.com/ca/api/rankings';

type FilaApi = {
  pos?: string | number;
  dorsal?: string | number;
  name?: string;
  club?: string;
  officialTime?: string;
};

function normalitza(f: FilaApi): FilaResultat | null {
  const pos = Number(f.pos);
  if (!Number.isFinite(pos) || !f.name) return null;
  return {
    pos,
    dorsal: String(f.dorsal ?? ''),
    nom: f.name,
    club: f.club ?? '',
    temps: f.officialTime ?? '',
  };
}

async function baixaCategoria(eventId: string, category: string): Promise<{ files: FilaResultat[]; total: number }> {
  const files: FilaResultat[] = [];
  let total = 0;
  // Primera pàgina: diu quantes n'hi ha (totalPages)
  const primera = await baixaPagina(eventId, category, 1);
  if (!primera) throw new Error('sense dades');
  files.push(...primera.files);
  total = primera.total;
  const pagines: number[] = [];
  for (let p = 2; p <= primera.totalPages; p++) pagines.push(p);
  const resta = await Promise.all(pagines.map((p) => baixaPagina(eventId, category, p)));
  for (const r of resta) {
    if (r) files.push(...r.files);
  }
  files.sort((a, b) => a.pos - b.pos);
  return { files, total: total || files.length };
}

async function baixaPagina(
  eventId: string,
  category: string,
  pagina: number
): Promise<{ files: FilaResultat[]; total: number; totalPages: number } | null> {
  const url = `${API_URL}?event=${encodeURIComponent(eventId)}&page=${pagina}${category ? `&category=${category}` : ''}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json || !Array.isArray(json.data)) return null;
  const files = (json.data as FilaApi[]).map(normalitza).filter((f): f is FilaResultat => f !== null);
  return { files, total: Number(json.total) || 0, totalPages: Number(json.totalPages) || 1 };
}

/**
 * Descarrega general + masculina + femenina d'un event.
 * Null si la general falla (la pàgina farà fallback al legacy).
 * Si falla un gènere, la pestanya corresponent simplement no es mostra.
 */
export async function obteClassificacio(eventId: string): Promise<Classificacio | null> {
  try {
    const general = await baixaCategoria(eventId, '');
    const [masc, fem] = await Promise.all([
      baixaCategoria(eventId, 'gender_0').catch(() => ({ files: [], total: 0 })),
      baixaCategoria(eventId, 'gender_1').catch(() => ({ files: [], total: 0 })),
    ]);
    if (general.files.length === 0) return null;
    return { general: general.files, masculina: masc.files, femenina: fem.files, total: general.total };
  } catch {
    return null;
  }
}
