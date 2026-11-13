// Informe de partido compartido por index.html (administrador) y jugadores.html
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = `.inf{font:13px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1c2a24;background:#f4f7f9;padding:10px;border-radius:10px}
.inf *{box-sizing:border-box}.inf-h{background:#1f2d3d;color:#fff;text-align:center;border-radius:8px;padding:14px 10px}.inf-h h1{margin:0 0 3px;font-size:1.1rem;letter-spacing:.5px}.inf-h small{opacity:.75}
.inf-w{margin:8px 0;padding:8px;border-radius:8px;background:#fff;border:1px solid #dde4ea;text-align:center;font-weight:800}
.inf-s{background:#2f4558;color:#fff;font-weight:800;text-transform:uppercase;font-size:.76rem;padding:8px 12px;border-radius:8px 8px 0 0;margin-top:12px;letter-spacing:.3px}
.inf table{width:100%;border-collapse:collapse;background:#fff;font-size:.8rem}.inf th,.inf td{border:1px solid #e3e9ee;padding:6px 7px;text-align:center}.inf th{background:#eef2f5;color:#2f4558}.inf td:first-child,.inf th:first-child{text-align:left}
.inf-v{background:#fff8e1;border:1px solid #f1deaa;border-radius:6px;padding:6px 9px;margin:6px 0;font-size:.78rem;font-style:italic;color:#6b5200}
.inf-hm{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;background:#fff;border:1px solid #e3e9ee;padding:10px}
.inf-t{background:#fff;border:1px solid #e3e9ee;padding:8px 10px}.inf-tr{position:relative;height:42px;background:#eef2f5;border:1px solid #cfd8de;border-radius:4px;margin:4px 0 6px}.inf-tr:after{content:'';position:absolute;left:50%;top:0;bottom:0;border-left:1px dashed #9aa8b3}
.inf-m{position:absolute;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;background:#27ae60;color:#fff;font-size:8px;font-weight:800;display:grid;place-items:center;border:2px solid #fff}
.inf-g{background:#eef2f5;border-radius:8px;padding:9px 12px;margin-top:12px;font-size:.74rem;color:#3b4a56}.inf-g p{margin:3px 0}
.inf .ih1{background:#e3f6e8}.inf .ih2{background:#e1effb}.inf .ih3{background:#e0f5f1}.inf .ih4{background:#fdf3d0}.inf .inf-mvp{display:inline-block;background:#f4c20d;color:#4a3800;font-size:.6rem;font-weight:900;border-radius:4px;padding:1px 4px;margin-left:4px}.inf .inf-mur{background:#cfe0ee;color:#1f3b52}.inf table{table-layout:auto}@media(max-width:600px){.inf{padding:6px}.inf th,.inf td{padding:4px 2px;font-size:.66rem}.inf-s{font-size:.7rem;padding:7px 9px}.inf-mvp{display:block;margin:2px 0 0}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function model(m) {
    const T = {};
    ['white', 'black'].forEach(t => {
      const d = (m.matchData && m.matchData[t]) || {}, z = d.zones || {}; let g = 0, pt = 0, fu = 0, de = 0, fl = 0;
      const rows = (d.players || []).map(p => {
        const gg = p.goalsList ? p.goalsList.length : 0, a = p.ast || 0, q = p.p || 0, f = p.f || 0, r = p.def || 0, x = p.fl || 0, sh = gg + q + f;
        const w = p.palos ? Object.values(p.palos).reduce((s, v) => s + v, 0) : 0;
        g += gg; pt += q; fu += f; de += r; fl += x;
        return { de: r, name: p.name, g: gg, a, sh, q, w, og: p.og || 0, prec: sh ? Math.round((gg + q) / sh * 100) : 0, efe: sh ? Math.round(gg / sh * 100) : 0, pts: gg * 3 + a * 2 + q * .5 + r * .5 - x };
      });
      const sh = g + pt + fu;
      T[t] = { rows, z, g, pt, sh, de, fl, band: (z.b_tl || 0) + (z.b_tr || 0) + (z.b_bl || 0) + (z.b_br || 0), corn: (z.c_tl || 0) + (z.c_tr || 0) + (z.c_bl || 0) + (z.c_br || 0), prec: sh ? Math.round((g + pt) / sh * 100) : 0, conv: sh ? Math.round(g / sh * 100) : 0 };
    });
    const all = [...T.white.rows, ...T.black.rows].sort((a, b) => b.pts - a.pts);
    return { T, mvp: all[0] && all[0].pts > 0 ? all[0].name : null };
  }

  function heat(z, mx, id) {
    const ids = [['c_tl', 'b_tl', 'b_tr', 'c_tr'], ['c_bl', 'b_bl', 'b_br', 'c_br']];
    let cells = '', nums = '';
    const col = i => { const a = [226, 236, 244], b = [47, 84, 115]; return 'rgb(' + a.map((x, k) => Math.round(x + (b[k] - x) * i)).join(',') + ')'; };
    ids.forEach((row, r) => row.forEach((k, c) => {
      const v = z[k] || 0, i = mx ? v / mx : 0;
      if (v) cells += `<rect x="${c * 100 + 10}" y="${r * 100 + 10}" width="80" height="80" rx="30" fill="${col(i)}" opacity=".9"/>`;
      nums += `<text x="${c * 100 + 50}" y="${r * 100 + 58}" text-anchor="middle" font-size="24" font-weight="900" fill="${i > .55 ? '#fff' : '#2f4558'}">${v || ''}</text>`;
    }));
    return `<svg viewBox="0 0 400 200" style="width:100%;display:block;border-radius:8px" role="img" aria-label="Mapa de calor"><defs><filter id="b${id}"><feGaussianBlur stdDeviation="7"/></filter></defs><rect width="400" height="200" fill="#f1f5f3"/><g fill="none" stroke="#b9c7c0" stroke-width="2"><rect x="3" y="3" width="394" height="194"/><line x1="200" y1="3" x2="200" y2="197"/><circle cx="200" cy="100" r="30"/><path d="M3 55h38v90H3zM397 55h-38v90h38z"/></g><g filter="url(#b${id})">${cells}</g>${nums}</svg>`;
  }

  function html(m) {
    const { T, mvp } = model(m), W = T.white, B = T.black, sc = m.score || { white: 0, black: 0 }, v = m.varNotes || {};
    const vn = k => v[k] ? `<div class="inf-v">⚠️ VAR: ${esc(v[k])}</div>` : '';
    const mins = Math.max(1, Math.ceil((m.duration || 0) / 60), ...(m.goalsTimeline || []).map(g => g.time + 1));
    const pw = m.possWhiteSeconds || 0, pb = m.possBlackSeconds || 0, pt = pw + pb;
    const pct = x => pt ? Math.round(x / pt * 100) + '%' : '-', mn = x => (x / 60).toFixed(1) + ' min';
    const d = new Date(m.date), f = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    const win = sc.white > sc.black ? '🏆 EQUIPO BLANCO · GANADOR' : sc.black > sc.white ? '🏆 EQUIPO NEGRO · GANADOR' : '🤝 EMPATE';
    const r3 = (a, b, c) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`;
    const t3 = (title, rows) => `<div class="inf-s">${title}</div><table><tr><th>Métrica</th><th>Equipo Blanco (B)</th><th>Equipo Negro (N)</th></tr>${rows}</table>`;
    const goals = m.goalsTimeline || [];
    const track = (t, lab) => `<div class="inf-t"><b>${lab} (${t === 'white' ? sc.white : sc.black} goles)</b><div class="inf-tr">${goals.filter(g => g.team === t).map((g, i) => `<span class="inf-m" style="left:${Math.min(96, Math.max(4, (g.time + .5) / mins * 100))}%;top:${i % 2 ? 20 : 1}px" title="${esc(g.player)}">${g.time + 1}'</span>`).join('')}</div><small style="color:#6b7a86">1' · Mitad (${Math.round(mins / 2)}') · Final (${mins}')</small></div>`;
    const ind = (t, lab) => {
      const rs = T[t].rows.slice().sort((a, b) => a.name.localeCompare(b.name, 'es')), mx = k => Math.max(0, ...rs.map(r => r[k]));
      const hi = (k, c, r) => r[k] > 0 && r[k] === mx(k) ? ` class="${c}"` : '';
      return `<div class="inf-s">Rendimiento individual (${lab})</div><table><tr><th>Jugador</th><th>Goles</th><th>Asist.</th><th>Tiros</th><th>Puerta</th><th>Palos</th><th>PP</th><th>REC</th><th>Prec.</th><th>Efect.</th></tr>${rs.map(r => `<tr><td><b>${esc(r.name)}</b>${r.name === mvp ? '<span class="inf-mvp">⭐ MVP</span>' : ''}${r.name === mur ? '<span class="inf-mvp inf-mur">🛡️ MURALLA</span>' : ''}</td><td${hi('g', 'ih1', r)}>${r.g}</td><td${hi('a', 'ih2', r)}>${r.a}</td><td>${r.sh}</td><td>${r.q}</td><td>${r.w}</td><td style="color:${r.og ? '#c0392b' : 'inherit'};font-weight:${r.og ? 800 : 400}">${r.og}</td><td>${r.de}</td><td${hi('prec', 'ih3', r)}>${r.prec}%</td><td${hi('efe', 'ih4', r)}>${r.efe}%</td></tr>`).join('')}</table>`;
    };
    const mx = Math.max(1, ...Object.values(W.z), ...Object.values(B.z)), hasHeat = [...Object.values(W.z), ...Object.values(B.z)].some(x => x > 0);
    const allr = [...W.rows, ...B.rows], mxr = Math.max(0, ...allr.map(r => r.de)), mur = mxr > 0 ? allr.find(r => r.de === mxr).name : null;
    return `<div class="inf"><div class="inf-h"><h1>INFORME GRÁFICO Y ESTADÍSTICO · PARTIDO</h1><small>Fecha: ${f} · Duración: ${mn(m.duration || 0)}</small></div>
<div class="inf-w">${win} · ${sc.white} - ${sc.black}</div>
${t3('Métricas colectivas', r3('Saques de banda', W.band, B.band) + r3('Saques de córner', W.corn, B.corn) + r3('Total balón parado', W.band + W.corn + ' interrup.', B.band + B.corn + ' interrup.') + r3('Resultado final', `<b>${sc.white} goles</b>`, `<b>${sc.black} goles</b>`))}${vn('METRICAS')}
${t3('Acciones de estrategia y dinámica', (pt ? r3('Posesión de balón', pct(pw), pct(pb)) + r3('Tiempo efectivo de balón', mn(pw), mn(pb)) : '') + r3('Tiros totales', W.sh, B.sh) + r3('Tiros a puerta (efectivos)', W.g + W.pt, B.g + B.pt) + r3('Precisión de tiro', W.prec + '%', B.prec + '%') + r3('Conversión goleadora', W.conv + '%', B.conv + '%') + r3('Acciones defensivas (REC)', W.de, B.de) + r3('Faltas cometidas', W.fl, B.fl))}${vn('ESTRATEGIA')}
${hasHeat ? `<div class="inf-s">Mapa de calor: interrupciones por zona</div><div class="inf-hm"><div><b>Equipo Blanco</b>${heat(W.z, mx, 'w')}</div><div><b>Equipo Negro</b>${heat(B.z, mx, 'n')}</div></div><div style="background:#fff;border:1px solid #e3e9ee;border-top:0;padding:4px 10px 8px;font-size:.7rem;color:#6b7a86">Menos<div style="height:7px;border-radius:4px;background:linear-gradient(90deg,#e2ecf4,#2f5473)"></div><div style="text-align:right">Más interrupciones</div></div>${vn('CALOR')}` : ''}
${goals.length ? `<div class="inf-s">Línea temporal de goles (minuto a minuto)</div>${track('white', 'Equipo Blanco')}${track('black', 'Equipo Negro')}${vn('GOLES')}` : ''}
${ind('white', 'Equipo Blanco')}${vn('BLANCO')}${ind('black', 'Equipo Negro')}${vn('NEGRO')}
<div class="inf-g"><b>GLOSARIO DEL ANALISTA</b><p><b>Tiros / Puerta:</b> tiros totales y los que van a puerta sin ser gol. <b>Precisión:</b> (goles + puerta) entre tiros. <b>Efectividad:</b> goles entre tiros.</p><p><b>Palos:</b> balones al poste o larguero. <b>PP:</b> goles en propia puerta. <b>Saques de banda y córner:</b> interrupciones por zona del campo.</p></div></div>`;
  }

  const TAGS = ['METRICAS', 'ESTRATEGIA', 'CALOR', 'GOLES', 'BLANCO', 'NEGRO'];
  function parse(text) {
    const o = {}, re = new RegExp('\\[(' + TAGS.join('|') + ')\\]\\s*([\\s\\S]*?)(?=\\[(?:' + TAGS.join('|') + ')\\]|$)', 'g');
    let r; while ((r = re.exec(text || ''))) o[r[1]] = r[2].trim();
    return o;
  }

  function ia(m) {
    const { T, mvp } = model(m), sc = m.score || {};
    const L = t => T[t].rows.map(r => `${r.name}: ${r.g} goles, ${r.a} asist., ${r.sh} tiros, ${r.q} a puerta, ${r.w} palos, ${r.og} PP`).join('; ');
    const E = (n, t) => `${n}: banda ${T[t].band}, córner ${T[t].corn}, tiros ${T[t].sh}, a puerta ${T[t].g + T[t].pt}, precisión ${T[t].prec}%, conversión ${T[t].conv}%, recuperaciones ${T[t].de}, faltas ${T[t].fl}`;
    return `Eres el árbitro del VAR de unas pachangas de futsal entre amigos. Escribe un comentario breve (1 o 2 frases) por sección, con humor de revisión arbitral y sin inventar datos. Responde SOLO con estas 6 líneas, sin nada más:
[METRICAS] ...
[ESTRATEGIA] ...
[CALOR] ...
[GOLES] ...
[BLANCO] ...
[NEGRO] ...

DATOS DEL PARTIDO (${new Date(m.date).toLocaleDateString('es-ES')}): Blanco ${sc.white} - ${sc.black} Negro. Duración ${Math.round((m.duration || 0) / 60)} min. MVP: ${mvp || 'sin MVP'}.
${E('Blanco', 'white')}.
${E('Negro', 'black')}.
Jugadores blanco: ${L('white')}.
Jugadores negro: ${L('black')}.
Goles por minuto: ${(m.goalsTimeline || []).map(g => `${g.time + 1}' ${g.player} (${g.team === 'white' ? 'B' : 'N'})`).join(', ') || 'sin datos'}.`;
  }

  window.Informe = { html, ia, parse, TAGS };
})();
