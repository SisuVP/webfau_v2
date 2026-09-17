// Perfil d'elevació generat en build a partir del GPX del recorregut.
// Sense dependències ni tercers: el navegador rep un SVG inline de pocs KB
// amb l'estil de marca. Si el GPX falla o no existeix, la pàgina usa la
// imatge `perfil` del Sanity com a fallback.

export type PuntPerfil = { km: number; ele: number };
export type MarcadorPerfil = { km: number; etiqueta: string };

const W = 1200;
const H = 400;
// Esquerra ampla: les etiquetes Y ("1.250 m") no queden tallades.
// A dalt dues carrils per a etiquetes d'avituallament sense tocar la corba.
const MARGE = { esq: 88, dre: 20, sup: 100, inf: 66 };

// Taronja del botó Inscriu-t'hi (fau-500), també als punts com a la llegenda;
// l'anell blanc els separa de la corba.
const COLOR_CORBA = '#dd9933';
const COLOR_PUNT = '#dd9933';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function extreuAtribut(attrs: string, nom: string): number | null {
  const m = attrs.match(new RegExp(`${nom}="([\\d.\\-]+)"`));
  return m ? Number(m[1]) : null;
}

/** Descarrega el GPX i retorna punts {km acumulats, elevació}. Null si falla. */
export async function carregaPerfil(gpxUrl: string): Promise<PuntPerfil[] | null> {
  try {
    const res = await fetch(gpxUrl);
    if (!res.ok) return null;
    const xml = await res.text();
    const punts: PuntPerfil[] = [];
    let km = 0;
    let prev: { lat: number; lon: number } | null = null;
    // Per <trkpt> (tolera ordre d'atributs i segments múltiples)
    const re = /<trkpt([^>]*)>([\s\S]*?)<\/trkpt>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
      const lat = extreuAtribut(m[1], 'lat');
      const lon = extreuAtribut(m[1], 'lon');
      const eleM = m[2].match(/<ele>([\d.\-]+)<\/ele>/);
      if (lat == null || lon == null || !eleM) continue;
      if (prev) km += haversineKm(prev.lat, prev.lon, lat, lon);
      prev = { lat, lon };
      punts.push({ km, ele: Number(eleM[1]) });
    }
    return punts.length > 10 ? punts : null;
  } catch {
    return null;
  }
}

/** Suavitzat per mitjana mòbil: l'elevació GPS ve amb soroll. */
function suavitza(punts: PuntPerfil[]): PuntPerfil[] {
  const finestra = Math.min(25, Math.max(1, Math.floor(punts.length / 250)));
  if (finestra <= 1) return punts;
  const meitat = Math.floor(finestra / 2);
  return punts.map((p, i) => {
    let suma = 0;
    let n = 0;
    for (let j = Math.max(0, i - meitat); j <= Math.min(punts.length - 1, i + meitat); j++) {
      suma += punts[j].ele;
      n++;
    }
    return { km: p.km, ele: suma / n };
  });
}

function pasAgradable(rang: number, maximDivisions: number): number {
  const candidats = [0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  for (const c of candidats) {
    if (rang / c <= maximDivisions) return c;
  }
  return 1000;
}

function escapaXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function eleAPunt(punts: PuntPerfil[], km: number): number {
  if (km <= punts[0].km) return punts[0].ele;
  for (let i = 1; i < punts.length; i++) {
    if (punts[i].km >= km) {
      const a = punts[i - 1];
      const b = punts[i];
      const t = b.km === a.km ? 0 : (km - a.km) / (b.km - a.km);
      return a.ele + t * (b.ele - a.ele);
    }
  }
  return punts[punts.length - 1].ele;
}

/**
 * Genera el SVG del perfil. `marcadors` (p. ex. avituallaments amb km)
 * es dibuixen com a línies verticals amb etiqueta alternada.
 */
export function generaSvgPerfil(
  puntsBruts: PuntPerfil[],
  opcions: { nom: string; marcadors?: MarcadorPerfil[] }
): string {
  const punts = suavitza(puntsBruts);
  const totalKm = punts[punts.length - 1].km;
  const eles = punts.map((p) => p.ele);
  let min = Math.min(...eles);
  let max = Math.max(...eles);
  if (max - min < 10) {
    min -= 5;
    max += 5;
  }
  // Aire al voltant de la corba: ni el pic toca les etiquetes
  // ni la vall toca l'eix X
  min -= (max - min) * 0.12;
  max += (max - min) * 0.2;

  const ample = W - MARGE.esq - MARGE.dre;
  const alt = H - MARGE.sup - MARGE.inf;
  const x = (km: number) => MARGE.esq + (km / totalKm) * ample;
  const y = (ele: number) => MARGE.sup + (1 - (ele - min) / (max - min)) * alt;

  // Delma a ~400 punts per a un path lleuger
  const pas = Math.max(1, Math.ceil(punts.length / 400));
  const mostra = punts.filter((_, i) => i % pas === 0 || i === punts.length - 1);
  const linia = mostra.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.km).toFixed(1)},${y(p.ele).toFixed(1)}`).join(' ');

  const pasY = pasAgradable(max - min, 6);
  let reixeta = '';
  for (let v = Math.ceil(min / pasY) * pasY; v <= max; v += pasY) {
    const yy = y(v);
    reixeta += `<line x1="${MARGE.esq}" y1="${yy.toFixed(1)}" x2="${W - MARGE.dre}" y2="${yy.toFixed(1)}" stroke="#e7e5e4" stroke-dasharray="4 4"/><text x="${MARGE.esq - 8}" y="${(yy + 6).toFixed(1)}" text-anchor="end" font-size="20" fill="#57534e">${Math.round(v)} m</text>`;
  }
  const pasX = pasAgradable(totalKm, 8);
  let eixX = '';
  for (let v = 0; v <= totalKm + 1e-9; v += pasX) {
    const xx = x(Math.min(v, totalKm));
    eixX += `<text x="${xx.toFixed(1)}" y="${H - 18}" text-anchor="middle" font-size="20" fill="#57534e">${v % 1 === 0 ? v : v.toFixed(1)} km</text>`;
  }

  // Marcadors (avituallaments): etiqueta alternada per evitar solapaments
  const marcadors = (opcions.marcadors ?? []).filter((mc) => mc.km >= 0 && mc.km <= totalKm);
  let capaMarcadors = '';
  marcadors.forEach((mc, i) => {
    const xx = x(mc.km);
    const yyCorba = y(eleAPunt(punts, mc.km));
    const yEtiq = i % 2 === 0 ? 30 : 56;
    const ancora = xx < MARGE.esq + 40 ? 'start' : xx > W - MARGE.dre - 100 ? 'end' : 'middle';
    const xEtiq = ancora === 'middle' ? xx : ancora === 'start' ? xx + 6 : xx - 6;
    capaMarcadors += `<g><title>${escapaXml(mc.etiqueta)} · km ${mc.km}</title><line x1="${xx.toFixed(1)}" y1="${MARGE.sup}" x2="${xx.toFixed(1)}" y2="${(H - MARGE.inf).toFixed(1)}" stroke="${COLOR_CORBA}" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.8"/><circle cx="${xx.toFixed(1)}" cy="${yyCorba.toFixed(1)}" r="6" fill="${COLOR_PUNT}" stroke="#fff" stroke-width="2.5"/><text x="${xEtiq.toFixed(1)}" y="${yEtiq}" text-anchor="${ancora}" font-size="17" font-weight="600" fill="#1c1917">${escapaXml(mc.etiqueta)}</text></g>`;
  });

  const gid = `pg-${Math.abs([...opcions.nom].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7))}`;
  return `<svg viewBox="0 0 ${W} ${H}" class="block h-auto w-full" role="img" aria-label="Perfil d'elevació: ${escapaXml(opcions.nom)}"><title>Perfil d'elevació: ${escapaXml(opcions.nom)} (${totalKm.toFixed(1)} km)</title><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COLOR_CORBA}" stop-opacity="0.5"/><stop offset="1" stop-color="${COLOR_CORBA}" stop-opacity="0.05"/></linearGradient></defs>${reixeta}${eixX}<path d="${linia} L${x(totalKm).toFixed(1)},${(H - MARGE.inf).toFixed(1)} L${MARGE.esq},${(H - MARGE.inf).toFixed(1)} Z" fill="url(#${gid})"/><path d="${linia}" fill="none" stroke="${COLOR_CORBA}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>${capaMarcadors}</svg>`;
}
