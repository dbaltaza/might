// Cronómetro "tempo até ao 1.º MighT" (meta: menos de 2 minutos). JS puro, sem dependências.
//
// No ecrã 1 (Dinis):
//   import { iniciar, terminar, aoVivo, frase } from "../cronometro/cronometro.js";
//   iniciar();                         // ao abrir o ecrã 1 (pode ser chamado várias vezes: só conta a 1.ª)
//   const parar = aoVivo(el);          // opcional: mostra 0:12, 0:13... num elemento
//   // quando o MighT fica criado:
//   const r = terminar();              // { ms, segundos, dentroDaMeta }
//   el.textContent = frase(r);         // "Criaste o teu MighT em 34 s ⚡ Meta: menos de 2 min"
//
// O tempo fica guardado em sessionStorage, por isso sobrevive à mudança de ecrã ou a um refresh.
// Para a demo voltar a zero: reiniciar().

const CHAVE = "might.cronometro";
export const META_MS = 2 * 60 * 1000;

const ler = () => {
  try { return JSON.parse(sessionStorage.getItem(CHAVE)) ?? {}; } catch { return {}; }
};
const gravar = (v) => {
  try { sessionStorage.setItem(CHAVE, JSON.stringify(v)); } catch { /* modo privado: segue sem gravar */ }
  memoria = v;
};
let memoria = null; // fallback se o sessionStorage não estiver disponível
const estado = () => (Object.keys(ler()).length ? ler() : memoria ?? {});

/** Começa a contar. Não reinicia se já estiver a contar ou já tiver terminado. */
export function iniciar() {
  const e = estado();
  if (!e.inicio) gravar({ inicio: Date.now() });
}

/** Pára e devolve o resultado. Chamado mais vezes, devolve sempre o 1.º resultado. */
export function terminar() {
  const e = estado();
  if (!e.inicio) return null;
  if (!e.fim) gravar({ ...e, fim: Date.now() });
  return resultado();
}

/** Resultado atual (ou null se não terminou). */
export function resultado() {
  const e = estado();
  if (!e.inicio || !e.fim) return null;
  const ms = e.fim - e.inicio;
  return { ms, segundos: Math.round(ms / 1000), dentroDaMeta: ms < META_MS };
}

/** Tempo decorrido em ms (a contar, ou o final). */
export function decorrido() {
  const e = estado();
  if (!e.inicio) return 0;
  return (e.fim ?? Date.now()) - e.inicio;
}

/** Volta a zero (para repetir a demo). */
export function reiniciar() {
  try { sessionStorage.removeItem(CHAVE); } catch {}
  memoria = null;
}

/** "0:34" */
export function formatar(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Frase para o ecrã de sucesso. */
export function frase(r = resultado()) {
  if (!r) return "";
  const t = r.segundos < 60 ? `${r.segundos} s` : formatar(r.ms);
  return r.dentroDaMeta
    ? `Criaste o teu MighT em ${t} ⚡ Meta: menos de 2 min`
    : `Criaste o teu MighT em ${t}`;
}

/** Mostra o tempo a correr num elemento. Devolve uma função para parar. */
export function aoVivo(el) {
  const tick = () => { el.textContent = formatar(decorrido()); };
  tick();
  const id = setInterval(tick, 250);
  return () => clearInterval(id);
}
