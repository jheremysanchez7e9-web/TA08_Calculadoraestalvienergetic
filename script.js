/* ═══════════════════════════════════════════════════════════════
   EcoAudit ASIR — script.js v2
   ✅ Full i18n with safe fallback
   ✅ localStorage for theme + language
   ✅ Browser language auto-detection
   ✅ Modal system
   ✅ NaN / input protection
   ✅ Optimized Chart.js (no unnecessary recreation)
   ✅ Debounced recalc
   ═══════════════════════════════════════════════════════════════ */

/* ── STATE ────────────────────────────────────────────────────── */
const S = {
  lang:  'ca',
  mesos: 12,
  mods:  { ia: 1, clima: 1, paper: 1, water: 1, clean: 1 },
  base: {
    elec:  { val: 2912, un: 'kWh',   co2: 0.321, nom: 'Electricitat'  },
    gas:   { val: 1282, un: 'kWh',   co2: 0.202, nom: 'Gas Natural'   },
    water: { val: 35,   un: 'm³',    co2: 0.20,  nom: 'Aigua'         },
    paper: { val: 20,   un: 'packs', co2: 1.20,  nom: 'Paper Oficina' },
    clean: { val: 15,   un: 'L',     co2: 0.80,  nom: 'Prod. Neteja'  }
  },
  export: {}
};

/* ── i18n DICTIONARY ─────────────────────────────────────────── */
const T = {
  ca: {
    app_title: 'EcoAudit ASIR | ITB G11',
    nav_section_analysis: 'Anàlisi',
    nav_section_status: 'Estat',
    nav_dashboard: 'Dashboard',
    nav_calc: 'Calculadora & 8 Càlculs',
    nav_var: 'Cicles Estacionals',
    nav_plan: 'Pla Reducció 3 Anys',
    nav_data: 'Exportar JSON',
    btn_authors: 'Autors del Projecte',
    footer_text: 'ITB Sostenibilitat TIC - G11',
    footer_project: 'Projecte TA08 · 2024',
    status_label: 'ITB · G11 · Actiu',
    header_title: 'Petjada Ambiental ITB',
    header_sub: 'Dades Reals · Fase 1 & 3 · G11 ASIX',
    lbl_period: 'Període',
    lbl_months: 'mesos',
    lbl_annual: 'Anual',
    lbl_language: 'Idioma',
    hero_title: 'Anàlisi de Petjada Ambiental',
    hero_sub: 'Institut Tecnologia de Barcelona · G11 ASIX · Curs 2024',
    hero_chip_active: '🌱 Projecte Actiu',
    hero_chip_phase: '📋 Fase 1 & 3',
    kpi_elec: 'Electricitat',
    kpi_gas: 'Gas Natural',
    kpi_water: 'Aigua',
    kpi_paper: 'Paper Oficina',
    kpi_clean: 'Prod. Neteja',
    kpi_elec_full: 'Electricitat (kWh/any)',
    kpi_gas_full: 'Gas (kWh/any)',
    kpi_water_full: 'Aigua (m³/any)',
    kpi_paper_full: 'Paper (packs/any)',
    kpi_clean_full: 'Prod. Neteja (L/any)',
    unit_packs: 'paquets',
    chart_radar: "Radar d'Eficiència",
    chart_doughnut: 'Distribució CO2e',
    badge_vs_base: '% vs Base',
    badge_emissions: 'Emissions',
    badge_8calc: '8 càlculs',
    badge_kpis_reals: 'KPIs Reals',
    badge_temporal: 'Temporal',
    table_title: 'Taula dels 8 Càlculs Requerits (RA 3.1a)',
    th_ind: 'Indicador',
    th_calc1: 'Consum Anual (12m)',
    th_calc2: 'Consum Set–Jun (10m)',
    th_fact: 'Factor CO2e',
    th_emis: 'Emissions Anuals CO2e',
    th_base2024: 'Base 2024',
    th_year1: 'Any 1 (−10%)',
    th_year2: 'Any 2 (−20%)',
    th_year3: 'Any 3 (−30%)',
    th_total_red: 'Reducció Total',
    calc_title: 'Calculadora & Simulació',
    calc_desc: "Ajusta els valors mensuals i activa estratègies per veure l'impacte en temps real.",
    card_base_values: 'Valors Mensuals Base (2024)',
    card_base_sources: 'Fonts: 8_KPIs_RESUM.csv · 10_DATACLEANING.csv',
    reduce_title: '💡 Com reduir cada indicador',
    reduce_elec: "Sensors presència, LED, desconnexió equips fora d'horari.",
    reduce_gas: 'Aïllament tèrmic, regulació caldera, termòstats intel·ligents.',
    reduce_water: 'Airejadors, cisternes doble descàrrega, recollida pluvial.',
    reduce_paper: 'Digitalització, impressió doble cara, comunicació electrònica.',
    reduce_clean: 'Productes concentrats, envasos reutilitzables, protocols ús eficient.',
    strat_title: 'Simulació Estratègies',
    strat_desc: "Activa per veure l'impacte en el radar en temps real.",
    btn_ia: 'IA (−15% Llum)',
    btn_clima: 'Aïllament (−25% Gas)',
    btn_paper: 'Zero Paper (−90%)',
    btn_water: 'Estalvi Aigua (−20%)',
    btn_clean: 'Neteja Eco (−40%)',
    strat_ia_desc: 'Sensors i IA gestió energètica',
    strat_clima_desc: 'Millora envolupant tèrmica',
    strat_paper_desc: 'Digitalització total processos',
    strat_water_desc: 'Airejadors i cisternes eficients',
    strat_clean_desc: 'Productes concentrats reutilitzables',
    banner_target: 'Objectiu Any 3 (−30%)',
    target_sub: "Reducció si s'activen totes les estratègies",
    var_title: 'Cicles Estacionals i Tendències',
    var_desc: 'Variabilitat mensual calculada a partir de 10_DATACLEANING.csv. Agost: centre tancat (5% del valor base).',
    seasonal_chart1_title: 'Gas & Electricitat — Tendència Anual',
    seasonal_chart2_title: 'Aigua & Productes Neteja — Tendència Anual',
    season_winter_title: '🌡️ Hivern (Oct–Feb)',
    season_summer_title: '☀️ Estiu (Jun–Ago)',
    season_back_title: '🎒 Inici Curs (Set)',
    season_spring_title: '🌸 Primavera (Mar–Mai)',
    base_label: 'base',
    pct_plus5: '+5%', pct_plus10: '+10%', pct_plus15: '+15%', pct_plus25: '+25%',
    pct_plus30: '+30%', pct_plus40: '+40%', pct_plus50: '+50%', pct_plus120: '+120%',
    pct_minus50: '−50%', pct_minus60: '−60%', pct_minus90: '−90%',
    plan_title: 'Pla de Reducció del 30% en 3 Anys',
    plan_desc: "Accions concretes, objectius mesurables, indicadors de seguiment i principis d'economia circular. Objectiu: −30% d'emissions CO2e el 2027.",
    plan_now_lbl: 'Emissions Actuals (2024)',
    plan_now_sub: 'CO2e anual base',
    plan_target_lbl: 'Objectiu 2027 (−30%)',
    plan_target_sub: 'CO2e a assolir',
    plan_saving_lbl: 'Estalvi Previst',
    plan_saving_sub: 'CO2e evitades/any',
    plan_strat_lbl: 'Amb Estratègies Actives',
    plan_strat_sub: 'Calculadora actualitzada',
    timeline_title: "📅 Cronograma d'Accions a 3 Anys",
    year1_title: 'Any 1 · 2025', year1_goal: '−10% CO2e',
    year2_title: 'Any 2 · 2026', year2_goal: '−20% acumulat',
    year3_title: 'Any 3 · 2027', year3_goal: '−30% ✓ Objectiu',
    tl1_1_title: 'LED + sensors presència', tl1_1_desc: 'Substitució il·luminació fluorescent. Sensors en passadissos i lavabos.', tl1_1_t1: '−15% Elec.',
    tl1_2_title: 'Política impressió responsable', tl1_2_desc: 'Impressió doble cara obligatòria. Migració a Google Workspace.', tl1_2_t1: '−30% Paper',
    tl1_3_title: 'Productes neteja concentrats', tl1_3_desc: "Envasos reutilitzables. Protocol d'ús eficient per equip neteja.", tl1_3_t1: '−25% Neteja',
    tl2_1_title: 'Aïllament tèrmic millorat', tl2_1_desc: 'Sellat finestres i portes. Termòstats programables. Auditoria energètica.', tl2_1_t1: '−25% Gas',
    tl2_2_title: "Sistemes estalvi d'aigua", tl2_2_desc: 'Airejadors en totes les aixetes. Cisternes doble descàrrega. Revisió fugues.', tl2_2_t1: '−20% Aigua',
    tl2_3_title: 'Digitalització total administrativa', tl2_3_desc: 'Eliminació formularis paper. Signatures electròniques. Arxiu digital.', tl2_3_t1: '−60% Paper',
    tl3_1_title: 'Panells solars fotovoltaics', tl3_1_desc: 'Cobriment del 30–40% consum elèctric. Energia verda per la resta.', tl3_1_t1: '−30% Elec.',
    tl3_2_title: 'Sistema BEMS intel·ligent', tl3_2_desc: 'Monitoratge temps real. IA per optimitzar calefacció i climatització.', tl3_2_t1: '−10% extra',
    tl3_3_title: 'Certificació ESG i compra verda', tl3_3_desc: 'Criteris sostenibilitat a tots els contractes. Proveïdors locals km0.', tl3_3_t1: 'Impacte global',
    tl_ec: '♻️ Circular', tl_digital: '♻️ Digital', tl_pack: '♻️ Envasos',
    tl_passive: '♻️ Passiu', tl_reuse: '♻️ Reutilitz.', tl_zeropaper: '♻️ Zero Paper',
    tl_renewable: '♻️ Renovable', tl_smart: '♻️ Smart', tl_resp: '♻️ Responsable',
    kpi_track_title: '📏 Indicadors de Seguiment (KPIs Reducció)',
    circular_title: '♻️ Principis d\'Economia Circular Aplicats',
    ec_reduce: 'Reduir', ec_reduce_desc: 'Minimitzar consum en origen: menys impressions, menys productes neteja, menys consum energètic innecessari.',
    ec_reuse: 'Reutilitzar', ec_reuse_desc: 'Envasos reutilitzables per neteja. Equips informàtics recondicionats. Paper reciclatge per notes internes.',
    ec_recycle: 'Reciclar', ec_recycle_desc: 'Contenidors per a cada fracció. Gestió RAEE certificada. Bateries i tòners retornats al fabricant.',
    ec_renew: 'Renovar', ec_renew_desc: 'Substitució d\'energia fòssil per renovable. Panells solars. Contracte energia verda certificada.',
    ec_resp: 'Responsabilitat', ec_resp_desc: 'Clàusules ESG en contractes proveïdors. Criteris sostenibilitat en compres públiques del centre.',
    ec_measure: 'Mesurar', ec_measure_desc: 'Auditories anuals. Indicadors en temps real amb aquesta eina. Memòria sostenibilitat publicada.',
    data_title: 'Exportació JSON',
    data_desc: 'Conté les dades del DataClean (Fase 1) i les projeccions amb estratègies actives (Fase 3).',
    data_card_title: 'Informe Complet G11',
    btn_down: 'Descarregar JSON',
    btn_close: 'Tancar',
    modal_authors_title: '👥 Autors del Projecte',
    modal_project_label: 'EcoAudit ASIR · Projecte TA08 · ITB · 2024',
    author_role: 'ASIX · Grup G11',
    modal_badge: 'Sostenibilitat TIC',
    modal_badge2: 'Mòdul 0375',
    radar_legend_base: 'Base (100%)',
    radar_legend_strat: 'Estratègia (%)',
  },
  es: {
    app_title: 'EcoAudit ASIR | ITB G11',
    nav_section_analysis: 'Análisis',
    nav_section_status: 'Estado',
    nav_dashboard: 'Panel de Control',
    nav_calc: 'Calculadora & 8 Cálculos',
    nav_var: 'Ciclos Estacionales',
    nav_plan: 'Plan Reducción 3 Años',
    nav_data: 'Exportar JSON',
    btn_authors: 'Autores del Proyecto',
    footer_text: 'ITB Sostenibilidad TIC - G11',
    footer_project: 'Proyecto TA08 · 2024',
    status_label: 'ITB · G11 · Activo',
    header_title: 'Huella Ambiental ITB',
    header_sub: 'Datos Reales · Fase 1 & 3 · G11 ASIX',
    lbl_period: 'Período',
    lbl_months: 'meses',
    lbl_annual: 'Anual',
    lbl_language: 'Idioma',
    hero_title: 'Análisis de Huella Ambiental',
    hero_sub: 'Institut Tecnologia de Barcelona · G11 ASIX · Curso 2024',
    hero_chip_active: '🌱 Proyecto Activo',
    hero_chip_phase: '📋 Fase 1 & 3',
    kpi_elec: 'Electricidad',
    kpi_gas: 'Gas Natural',
    kpi_water: 'Agua',
    kpi_paper: 'Papel Oficina',
    kpi_clean: 'Prod. Limpieza',
    kpi_elec_full: 'Electricidad (kWh/año)',
    kpi_gas_full: 'Gas (kWh/año)',
    kpi_water_full: 'Agua (m³/año)',
    kpi_paper_full: 'Papel (packs/año)',
    kpi_clean_full: 'Prod. Limpieza (L/año)',
    unit_packs: 'paquetes',
    chart_radar: 'Radar de Eficiencia',
    chart_doughnut: 'Distribución CO2e',
    badge_vs_base: '% vs Base',
    badge_emissions: 'Emisiones',
    badge_8calc: '8 cálculos',
    badge_kpis_reals: 'KPIs Reales',
    badge_temporal: 'Temporal',
    table_title: 'Tabla de los 8 Cálculos Requeridos (RA 3.1a)',
    th_ind: 'Indicador',
    th_calc1: 'Consumo Anual (12m)',
    th_calc2: 'Consumo Sep–Jun (10m)',
    th_fact: 'Factor CO2e',
    th_emis: 'Emisiones Anuales CO2e',
    th_base2024: 'Base 2024',
    th_year1: 'Año 1 (−10%)',
    th_year2: 'Año 2 (−20%)',
    th_year3: 'Año 3 (−30%)',
    th_total_red: 'Reducción Total',
    calc_title: 'Calculadora & Simulación',
    calc_desc: 'Ajusta los valores mensuales y activa estrategias para ver el impacto en tiempo real.',
    card_base_values: 'Valores Mensuales Base (2024)',
    card_base_sources: 'Fuentes: 8_KPIs_RESUM.csv · 10_DATACLEANING.csv',
    reduce_title: '💡 Cómo reducir cada indicador',
    reduce_elec: 'Sensores de presencia, LED, desconexión equipos fuera de horario.',
    reduce_gas: 'Aislamiento térmico, regulación caldera, termostatos inteligentes.',
    reduce_water: 'Aireadores, cisternas doble descarga, recogida pluvial.',
    reduce_paper: 'Digitalización, impresión doble cara, comunicación electrónica.',
    reduce_clean: 'Productos concentrados, envases reutilizables, protocolos de uso eficiente.',
    strat_title: 'Simulación Estrategias',
    strat_desc: 'Activa para ver el impacto en el radar en tiempo real.',
    btn_ia: 'IA (−15% Luz)',
    btn_clima: 'Aislamiento (−25% Gas)',
    btn_paper: 'Cero Papel (−90%)',
    btn_water: 'Ahorro Agua (−20%)',
    btn_clean: 'Limpieza Eco (−40%)',
    strat_ia_desc: 'Sensores e IA gestión energética',
    strat_clima_desc: 'Mejora envolvente térmica',
    strat_paper_desc: 'Digitalización total procesos',
    strat_water_desc: 'Aireadores y cisternas eficientes',
    strat_clean_desc: 'Productos concentrados reutilizables',
    banner_target: 'Objetivo Año 3 (−30%)',
    target_sub: 'Reducción si se activan todas las estrategias',
    var_title: 'Ciclos Estacionales y Tendencias',
    var_desc: 'Variabilidad mensual calculada a partir de 10_DATACLEANING.csv. Agosto: centro cerrado (5% del valor base).',
    seasonal_chart1_title: 'Gas & Electricidad — Tendencia Anual',
    seasonal_chart2_title: 'Agua & Productos Limpieza — Tendencia Anual',
    season_winter_title: '🌡️ Invierno (Oct–Feb)',
    season_summer_title: '☀️ Verano (Jun–Ago)',
    season_back_title: '🎒 Inicio Curso (Sep)',
    season_spring_title: '🌸 Primavera (Mar–May)',
    base_label: 'base',
    pct_plus5: '+5%', pct_plus10: '+10%', pct_plus15: '+15%', pct_plus25: '+25%',
    pct_plus30: '+30%', pct_plus40: '+40%', pct_plus50: '+50%', pct_plus120: '+120%',
    pct_minus50: '−50%', pct_minus60: '−60%', pct_minus90: '−90%',
    plan_title: 'Plan de Reducción del 30% en 3 Años',
    plan_desc: 'Acciones concretas, objetivos medibles, indicadores de seguimiento y principios de economía circular. Objetivo: −30% de emisiones CO2e en 2027.',
    plan_now_lbl: 'Emisiones Actuales (2024)',
    plan_now_sub: 'CO2e anual base',
    plan_target_lbl: 'Objetivo 2027 (−30%)',
    plan_target_sub: 'CO2e a alcanzar',
    plan_saving_lbl: 'Ahorro Previsto',
    plan_saving_sub: 'CO2e evitadas/año',
    plan_strat_lbl: 'Con Estrategias Activas',
    plan_strat_sub: 'Calculadora actualizada',
    timeline_title: '📅 Cronograma de Acciones a 3 Años',
    year1_title: 'Año 1 · 2025', year1_goal: '−10% CO2e',
    year2_title: 'Año 2 · 2026', year2_goal: '−20% acumulado',
    year3_title: 'Año 3 · 2027', year3_goal: '−30% ✓ Objetivo',
    tl1_1_title: 'LED + sensores de presencia', tl1_1_desc: 'Sustitución iluminación fluorescente. Sensores en pasillos y baños.', tl1_1_t1: '−15% Elec.',
    tl1_2_title: 'Política de impresión responsable', tl1_2_desc: 'Impresión doble cara obligatoria. Migración a Google Workspace.', tl1_2_t1: '−30% Papel',
    tl1_3_title: 'Productos limpieza concentrados', tl1_3_desc: 'Envases reutilizables. Protocolo de uso eficiente para el equipo de limpieza.', tl1_3_t1: '−25% Limpieza',
    tl2_1_title: 'Aislamiento térmico mejorado', tl2_1_desc: 'Sellado de ventanas y puertas. Termostatos programables. Auditoría energética.', tl2_1_t1: '−25% Gas',
    tl2_2_title: 'Sistemas de ahorro de agua', tl2_2_desc: 'Aireadores en todos los grifos. Cisternas doble descarga. Revisión de fugas.', tl2_2_t1: '−20% Agua',
    tl2_3_title: 'Digitalización total administrativa', tl2_3_desc: 'Eliminación formularios papel. Firmas electrónicas. Archivo digital.', tl2_3_t1: '−60% Papel',
    tl3_1_title: 'Paneles solares fotovoltaicos', tl3_1_desc: 'Cobertura del 30–40% consumo eléctrico. Energía verde para el resto.', tl3_1_t1: '−30% Elec.',
    tl3_2_title: 'Sistema BEMS inteligente', tl3_2_desc: 'Monitorización tiempo real. IA para optimizar calefacción y climatización.', tl3_2_t1: '−10% extra',
    tl3_3_title: 'Certificación ESG y compra verde', tl3_3_desc: 'Criterios sostenibilidad en todos los contratos. Proveedores locales km0.', tl3_3_t1: 'Impacto global',
    tl_ec: '♻️ Circular', tl_digital: '♻️ Digital', tl_pack: '♻️ Envases',
    tl_passive: '♻️ Pasivo', tl_reuse: '♻️ Reutiliz.', tl_zeropaper: '♻️ Zero Papel',
    tl_renewable: '♻️ Renovable', tl_smart: '♻️ Smart', tl_resp: '♻️ Responsable',
    kpi_track_title: '📏 Indicadores de Seguimiento (KPIs Reducción)',
    circular_title: '♻️ Principios de Economía Circular Aplicados',
    ec_reduce: 'Reducir', ec_reduce_desc: 'Minimizar consumo en origen: menos impresiones, menos productos de limpieza, menos consumo energético innecesario.',
    ec_reuse: 'Reutilizar', ec_reuse_desc: 'Envases reutilizables para limpieza. Equipos informáticos reacondicionados. Papel reciclado para notas internas.',
    ec_recycle: 'Reciclar', ec_recycle_desc: 'Contenedores para cada fracción. Gestión RAEE certificada. Pilas y tóneres devueltos al fabricante.',
    ec_renew: 'Renovar', ec_renew_desc: 'Sustitución de energía fósil por renovable. Paneles solares. Contrato energía verde certificada.',
    ec_resp: 'Responsabilidad', ec_resp_desc: 'Cláusulas ESG en contratos de proveedores. Criterios sostenibilidad en compras públicas del centro.',
    ec_measure: 'Medir', ec_measure_desc: 'Auditorías anuales. Indicadores en tiempo real con esta herramienta. Memoria de sostenibilidad publicada.',
    data_title: 'Exportación JSON',
    data_desc: 'Contiene los datos del DataClean (Fase 1) y las proyecciones con estrategias activas (Fase 3).',
    data_card_title: 'Informe Completo G11',
    btn_down: 'Descargar JSON',
    btn_close: 'Cerrar',
    modal_authors_title: '👥 Autores del Proyecto',
    modal_project_label: 'EcoAudit ASIR · Proyecto TA08 · ITB · 2024',
    author_role: 'ASIX · Grupo G11',
    modal_badge: 'Sostenibilidad TIC',
    modal_badge2: 'Módulo 0375',
    radar_legend_base: 'Base (100%)',
    radar_legend_strat: 'Estrategia (%)',
  },
  en: {
    app_title: 'EcoAudit ASIR | ITB G11',
    nav_section_analysis: 'Analysis',
    nav_section_status: 'Status',
    nav_dashboard: 'Dashboard',
    nav_calc: 'Calculator & 8 Calculations',
    nav_var: 'Seasonal Cycles',
    nav_plan: '3-Year Reduction Plan',
    nav_data: 'Export JSON',
    btn_authors: 'Project Authors',
    footer_text: 'ITB ICT Sustainability - G11',
    footer_project: 'Project TA08 · 2024',
    status_label: 'ITB · G11 · Active',
    header_title: 'ITB Environmental Footprint',
    header_sub: 'Real Data · Phase 1 & 3 · G11 ASIX',
    lbl_period: 'Period',
    lbl_months: 'months',
    lbl_annual: 'Annual',
    lbl_language: 'Language',
    hero_title: 'Environmental Footprint Analysis',
    hero_sub: 'Institut Tecnologia de Barcelona · G11 ASIX · 2024',
    hero_chip_active: '🌱 Active Project',
    hero_chip_phase: '📋 Phase 1 & 3',
    kpi_elec: 'Electricity',
    kpi_gas: 'Natural Gas',
    kpi_water: 'Water',
    kpi_paper: 'Office Paper',
    kpi_clean: 'Cleaning Prod.',
    kpi_elec_full: 'Electricity (kWh/yr)',
    kpi_gas_full: 'Gas (kWh/yr)',
    kpi_water_full: 'Water (m³/yr)',
    kpi_paper_full: 'Paper (packs/yr)',
    kpi_clean_full: 'Cleaning Prod. (L/yr)',
    unit_packs: 'packs',
    chart_radar: 'Efficiency Radar',
    chart_doughnut: 'CO2e Distribution',
    badge_vs_base: '% vs Base',
    badge_emissions: 'Emissions',
    badge_8calc: '8 calcs',
    badge_kpis_reals: 'Real KPIs',
    badge_temporal: 'Seasonal',
    table_title: 'Table of 8 Required Calculations (RA 3.1a)',
    th_ind: 'Indicator',
    th_calc1: 'Annual Consumption (12m)',
    th_calc2: 'Sep–Jun Period (10m)',
    th_fact: 'CO2e Factor',
    th_emis: 'Annual CO2e Emissions',
    th_base2024: 'Base 2024',
    th_year1: 'Year 1 (−10%)',
    th_year2: 'Year 2 (−20%)',
    th_year3: 'Year 3 (−30%)',
    th_total_red: 'Total Reduction',
    calc_title: 'Calculator & Simulation',
    calc_desc: 'Adjust monthly values and activate strategies to see real-time impact on all indicators.',
    card_base_values: 'Monthly Base Values (2024)',
    card_base_sources: 'Sources: 8_KPIs_RESUM.csv · 10_DATACLEANING.csv',
    reduce_title: '💡 How to reduce each indicator',
    reduce_elec: 'Presence sensors, LED lighting, equipment shutdown outside hours.',
    reduce_gas: 'Thermal insulation, boiler regulation, smart thermostats.',
    reduce_water: 'Aerators, dual-flush cisterns, rainwater collection.',
    reduce_paper: 'Digitalization, double-sided printing, electronic communication.',
    reduce_clean: 'Concentrated products, reusable containers, efficient use protocols.',
    strat_title: 'Strategy Simulation',
    strat_desc: 'Activate to see real-time impact on the radar chart.',
    btn_ia: 'AI (−15% Power)',
    btn_clima: 'Insulation (−25% Gas)',
    btn_paper: 'Zero Paper (−90%)',
    btn_water: 'Water Saving (−20%)',
    btn_clean: 'Eco Cleaning (−40%)',
    strat_ia_desc: 'AI-powered energy management',
    strat_clima_desc: 'Improved thermal envelope',
    strat_paper_desc: 'Total process digitalization',
    strat_water_desc: 'Aerators and efficient cisterns',
    strat_clean_desc: 'Concentrated reusable products',
    banner_target: 'Year 3 Target (−30%)',
    target_sub: 'Reduction if all strategies are activated',
    var_title: 'Seasonal Cycles & Trends',
    var_desc: 'Monthly variability calculated from 10_DATACLEANING.csv. August: centre closed (5% of base value).',
    seasonal_chart1_title: 'Gas & Electricity — Annual Trend',
    seasonal_chart2_title: 'Water & Cleaning Products — Annual Trend',
    season_winter_title: '🌡️ Winter (Oct–Feb)',
    season_summer_title: '☀️ Summer (Jun–Aug)',
    season_back_title: '🎒 Back to School (Sep)',
    season_spring_title: '🌸 Spring (Mar–May)',
    base_label: 'base',
    pct_plus5: '+5%', pct_plus10: '+10%', pct_plus15: '+15%', pct_plus25: '+25%',
    pct_plus30: '+30%', pct_plus40: '+40%', pct_plus50: '+50%', pct_plus120: '+120%',
    pct_minus50: '−50%', pct_minus60: '−60%', pct_minus90: '−90%',
    plan_title: '30% Reduction Plan in 3 Years',
    plan_desc: 'Concrete actions, measurable objectives, tracking indicators and circular economy principles. Target: −30% CO2e emissions by 2027.',
    plan_now_lbl: 'Current Emissions (2024)',
    plan_now_sub: 'Annual CO2e base',
    plan_target_lbl: '2027 Target (−30%)',
    plan_target_sub: 'CO2e to achieve',
    plan_saving_lbl: 'Projected Savings',
    plan_saving_sub: 'CO2e avoided/year',
    plan_strat_lbl: 'With Active Strategies',
    plan_strat_sub: 'Updated calculator',
    timeline_title: '📅 3-Year Action Roadmap',
    year1_title: 'Year 1 · 2025', year1_goal: '−10% CO2e',
    year2_title: 'Year 2 · 2026', year2_goal: '−20% cumulative',
    year3_title: 'Year 3 · 2027', year3_goal: '−30% ✓ Target',
    tl1_1_title: 'LED + presence sensors', tl1_1_desc: 'Fluorescent lighting replacement. Sensors in corridors and bathrooms.', tl1_1_t1: '−15% Elec.',
    tl1_2_title: 'Responsible printing policy', tl1_2_desc: 'Mandatory double-sided printing. Migration to Google Workspace.', tl1_2_t1: '−30% Paper',
    tl1_3_title: 'Concentrated cleaning products', tl1_3_desc: 'Reusable containers. Efficient use protocol for cleaning staff.', tl1_3_t1: '−25% Cleaning',
    tl2_1_title: 'Improved thermal insulation', tl2_1_desc: 'Sealing windows and doors. Programmable thermostats. Energy audit.', tl2_1_t1: '−25% Gas',
    tl2_2_title: 'Water saving systems', tl2_2_desc: 'Aerators on all faucets. Dual-flush cisterns. Leak inspection.', tl2_2_t1: '−20% Water',
    tl2_3_title: 'Full administrative digitalization', tl2_3_desc: 'Eliminating paper forms. Electronic signatures. Digital archive.', tl2_3_t1: '−60% Paper',
    tl3_1_title: 'Photovoltaic solar panels', tl3_1_desc: 'Covering 30–40% of electricity consumption. Green energy for the rest.', tl3_1_t1: '−30% Elec.',
    tl3_2_title: 'Smart BEMS system', tl3_2_desc: 'Real-time monitoring. AI to optimize heating and air conditioning.', tl3_2_t1: '−10% extra',
    tl3_3_title: 'ESG certification & green procurement', tl3_3_desc: 'Sustainability criteria in all contracts. Local km0 suppliers.', tl3_3_t1: 'Global impact',
    tl_ec: '♻️ Circular', tl_digital: '♻️ Digital', tl_pack: '♻️ Packaging',
    tl_passive: '♻️ Passive', tl_reuse: '♻️ Reuse', tl_zeropaper: '♻️ Zero Paper',
    tl_renewable: '♻️ Renewable', tl_smart: '♻️ Smart', tl_resp: '♻️ Responsible',
    kpi_track_title: '📏 Tracking Indicators (Reduction KPIs)',
    circular_title: '♻️ Applied Circular Economy Principles',
    ec_reduce: 'Reduce', ec_reduce_desc: 'Minimize consumption at source: fewer prints, less cleaning products, less unnecessary energy use.',
    ec_reuse: 'Reuse', ec_reuse_desc: 'Reusable cleaning containers. Refurbished IT equipment. Recycled paper for internal notes.',
    ec_recycle: 'Recycle', ec_recycle_desc: 'Bins for each waste fraction. Certified WEEE management. Batteries and toners returned to manufacturer.',
    ec_renew: 'Renew', ec_renew_desc: 'Replace fossil energy with renewables. Solar panels. Certified green energy contract.',
    ec_resp: 'Responsibility', ec_resp_desc: 'ESG clauses in supplier contracts. Sustainability criteria in all public procurement.',
    ec_measure: 'Measure', ec_measure_desc: 'Annual audits. Real-time indicators with this tool. Published sustainability report.',
    data_title: 'JSON Export',
    data_desc: 'Contains DataClean data (Phase 1) and projections with active strategies (Phase 3).',
    data_card_title: 'Full Report G11',
    btn_down: 'Download JSON',
    btn_close: 'Close',
    modal_authors_title: '👥 Project Authors',
    modal_project_label: 'EcoAudit ASIR · Project TA08 · ITB · 2024',
    author_role: 'ASIX · Group G11',
    modal_badge: 'ICT Sustainability',
    modal_badge2: 'Module 0375',
    radar_legend_base: 'Base (100%)',
    radar_legend_strat: 'Strategy (%)',
  },
  de: {
    app_title: 'EcoAudit ASIR | ITB G11',
    nav_section_analysis: 'Analyse',
    nav_section_status: 'Status',
    nav_dashboard: 'Dashboard',
    nav_calc: 'Rechner & 8 Berechnungen',
    nav_var: 'Saisonale Zyklen',
    nav_plan: '3-Jahres-Reduktionsplan',
    nav_data: 'JSON Exportieren',
    btn_authors: 'Projektautoren',
    footer_text: 'ITB IKT-Nachhaltigkeit - G11',
    footer_project: 'Projekt TA08 · 2024',
    status_label: 'ITB · G11 · Aktiv',
    header_title: 'ITB Ökologischer Fußabdruck',
    header_sub: 'Echte Daten · Phase 1 & 3 · G11 ASIX',
    lbl_period: 'Zeitraum',
    lbl_months: 'Monate',
    lbl_annual: 'Jährlich',
    lbl_language: 'Sprache',
    hero_title: 'Analyse des Ökologischen Fußabdrucks',
    hero_sub: 'Institut Tecnologia de Barcelona · G11 ASIX · Kurs 2024',
    hero_chip_active: '🌱 Aktives Projekt',
    hero_chip_phase: '📋 Phase 1 & 3',
    kpi_elec: 'Elektrizität',
    kpi_gas: 'Erdgas',
    kpi_water: 'Wasser',
    kpi_paper: 'Büropapier',
    kpi_clean: 'Reinigungsm.',
    kpi_elec_full: 'Elektrizität (kWh/Jahr)',
    kpi_gas_full: 'Gas (kWh/Jahr)',
    kpi_water_full: 'Wasser (m³/Jahr)',
    kpi_paper_full: 'Papier (Pakete/Jahr)',
    kpi_clean_full: 'Reinigungsm. (L/Jahr)',
    unit_packs: 'Pakete',
    chart_radar: 'Effizienz-Radar',
    chart_doughnut: 'CO2e-Verteilung',
    badge_vs_base: '% vs. Basis',
    badge_emissions: 'Emissionen',
    badge_8calc: '8 Berechnungen',
    badge_kpis_reals: 'Echte KPIs',
    badge_temporal: 'Saisonal',
    table_title: 'Tabelle der 8 Berechnungen (RA 3.1a)',
    th_ind: 'Indikator',
    th_calc1: 'Jahresverbrauch (12M)',
    th_calc2: 'Sep–Jun Zeitraum (10M)',
    th_fact: 'CO2e-Faktor',
    th_emis: 'Jährliche CO2e-Emissionen',
    th_base2024: 'Basis 2024',
    th_year1: 'Jahr 1 (−10%)',
    th_year2: 'Jahr 2 (−20%)',
    th_year3: 'Jahr 3 (−30%)',
    th_total_red: 'Gesamtreduktion',
    calc_title: 'Rechner & Simulation',
    calc_desc: 'Monatliche Werte anpassen und Strategien aktivieren für Echtzeit-Auswirkungen.',
    card_base_values: 'Monatliche Basiswerte (2024)',
    card_base_sources: 'Quellen: 8_KPIs_RESUM.csv · 10_DATACLEANING.csv',
    reduce_title: '💡 Wie man jeden Indikator reduziert',
    reduce_elec: 'Präsenzsensoren, LED-Beleuchtung, Geräteabschaltung außerhalb der Betriebszeiten.',
    reduce_gas: 'Wärmedämmung, Kesselregelung, intelligente Thermostate.',
    reduce_water: 'Luftsprudler, Zweispülungs-Spülkästen, Regenwassersammlung.',
    reduce_paper: 'Digitalisierung, beidseitiger Druck, elektronische Kommunikation.',
    reduce_clean: 'Konzentrierte Produkte, Mehrwegbehälter, effiziente Nutzungsprotokolle.',
    strat_title: 'Strategie-Simulation',
    strat_desc: 'Aktivieren für Echtzeit-Radar-Auswirkungen.',
    btn_ia: 'KI (−15% Strom)',
    btn_clima: 'Isolierung (−25% Gas)',
    btn_paper: 'Null Papier (−90%)',
    btn_water: 'Wassersparen (−20%)',
    btn_clean: 'Öko-Reinigung (−40%)',
    strat_ia_desc: 'KI-gestütztes Energiemanagement',
    strat_clima_desc: 'Verbesserte Wärmedämmung',
    strat_paper_desc: 'Totale Prozessdigitalisierung',
    strat_water_desc: 'Luftsprudler und effiziente Spülkästen',
    strat_clean_desc: 'Konzentrierte Mehrwegprodukte',
    banner_target: 'Ziel Jahr 3 (−30%)',
    target_sub: 'Reduktion bei Aktivierung aller Strategien',
    var_title: 'Saisonale Zyklen & Trends',
    var_desc: 'Monatliche Variabilität aus 10_DATACLEANING.csv. August: Zentrum geschlossen (5% des Basiswerts).',
    seasonal_chart1_title: 'Gas & Elektrizität — Jahrestrend',
    seasonal_chart2_title: 'Wasser & Reinigungsprodukte — Jahrestrend',
    season_winter_title: '🌡️ Winter (Okt–Feb)',
    season_summer_title: '☀️ Sommer (Jun–Aug)',
    season_back_title: '🎒 Schulbeginn (Sep)',
    season_spring_title: '🌸 Frühling (Mär–Mai)',
    base_label: 'Basis',
    pct_plus5: '+5%', pct_plus10: '+10%', pct_plus15: '+15%', pct_plus25: '+25%',
    pct_plus30: '+30%', pct_plus40: '+40%', pct_plus50: '+50%', pct_plus120: '+120%',
    pct_minus50: '−50%', pct_minus60: '−60%', pct_minus90: '−90%',
    plan_title: '30%-Reduktionsplan in 3 Jahren',
    plan_desc: 'Konkrete Maßnahmen, messbare Ziele, Tracking-Indikatoren und Kreislaufwirtschaftsprinzipien. Ziel: −30% CO2e-Emissionen bis 2027.',
    plan_now_lbl: 'Aktuelle Emissionen (2024)',
    plan_now_sub: 'Jährliche CO2e Basis',
    plan_target_lbl: 'Ziel 2027 (−30%)',
    plan_target_sub: 'Zu erreichende CO2e',
    plan_saving_lbl: 'Voraussichtliche Einsparung',
    plan_saving_sub: 'CO2e vermieden/Jahr',
    plan_strat_lbl: 'Mit Aktiven Strategien',
    plan_strat_sub: 'Rechner aktualisiert',
    timeline_title: '📅 3-Jahres-Aktionsfahrplan',
    year1_title: 'Jahr 1 · 2025', year1_goal: '−10% CO2e',
    year2_title: 'Jahr 2 · 2026', year2_goal: '−20% kumuliert',
    year3_title: 'Jahr 3 · 2027', year3_goal: '−30% ✓ Ziel',
    tl1_1_title: 'LED + Präsenzsensoren', tl1_1_desc: 'Ersatz der Leuchtstoffbeleuchtung. Sensoren in Fluren und Bädern.', tl1_1_t1: '−15% Strom',
    tl1_2_title: 'Verantwortungsvolle Druckrichtlinie', tl1_2_desc: 'Pflichtmäßiger Doppelseitendruck. Migration zu Google Workspace.', tl1_2_t1: '−30% Papier',
    tl1_3_title: 'Konzentrierte Reinigungsprodukte', tl1_3_desc: 'Mehrwegbehälter. Effizienzprotokoll für Reinigungsteam.', tl1_3_t1: '−25% Reinigung',
    tl2_1_title: 'Verbesserte Wärmedämmung', tl2_1_desc: 'Abdichtung von Fenstern und Türen. Programmierbare Thermostate. Energieaudit.', tl2_1_t1: '−25% Gas',
    tl2_2_title: 'Wassersparsysteme', tl2_2_desc: 'Luftsprudler an allen Hähnen. Zweispülungs-Spülkästen. Leckageprüfung.', tl2_2_t1: '−20% Wasser',
    tl2_3_title: 'Vollständige administrative Digitalisierung', tl2_3_desc: 'Abschaffung von Papierformularen. Elektronische Signaturen. Digitales Archiv.', tl2_3_t1: '−60% Papier',
    tl3_1_title: 'Photovoltaik-Solaranlagen', tl3_1_desc: 'Abdeckung von 30–40% des Stromverbrauchs. Grüner Strom für den Rest.', tl3_1_t1: '−30% Strom',
    tl3_2_title: 'Intelligentes BEMS-System', tl3_2_desc: 'Echtzeit-Monitoring. KI zur Optimierung von Heizung und Klimaanlage.', tl3_2_t1: '−10% extra',
    tl3_3_title: 'ESG-Zertifizierung & grüne Beschaffung', tl3_3_desc: 'Nachhaltigkeitskriterien in allen Verträgen. Lokale km0-Lieferanten.', tl3_3_t1: 'Globale Wirkung',
    tl_ec: '♻️ Kreislauf', tl_digital: '♻️ Digital', tl_pack: '♻️ Verpackung',
    tl_passive: '♻️ Passiv', tl_reuse: '♻️ Wiederverwend.', tl_zeropaper: '♻️ Null Papier',
    tl_renewable: '♻️ Erneuerbar', tl_smart: '♻️ Smart', tl_resp: '♻️ Verantwortung',
    kpi_track_title: '📏 Tracking-Indikatoren (Reduktions-KPIs)',
    circular_title: '♻️ Angewandte Kreislaufwirtschaftsprinzipien',
    ec_reduce: 'Reduzieren', ec_reduce_desc: 'Verbrauch am Ursprung minimieren: weniger Drucke, weniger Reinigungsprodukte.',
    ec_reuse: 'Wiederverwenden', ec_reuse_desc: 'Mehrwegbehälter für Reinigung. Aufbereitete IT-Geräte. Recyclingpapier für interne Notizen.',
    ec_recycle: 'Recyceln', ec_recycle_desc: 'Behälter für jede Abfallfraktion. Zertifiziertes WEEE-Management.',
    ec_renew: 'Erneuern', ec_renew_desc: 'Fossil durch erneuerbar ersetzen. Solaranlage. Zertifizierter Grünstromvertrag.',
    ec_resp: 'Verantwortung', ec_resp_desc: 'ESG-Klauseln in Lieferantenverträgen. Nachhaltigkeitskriterien bei Beschaffung.',
    ec_measure: 'Messen', ec_measure_desc: 'Jährliche Audits. Echtzeit-Indikatoren mit diesem Tool. Nachhaltigkeitsbericht veröffentlicht.',
    data_title: 'JSON-Export',
    data_desc: 'Enthält DataClean-Daten (Phase 1) und Projektionen mit aktiven Strategien (Phase 3).',
    data_card_title: 'Vollständiger Bericht G11',
    btn_down: 'JSON Herunterladen',
    btn_close: 'Schließen',
    modal_authors_title: '👥 Projektautoren',
    modal_project_label: 'EcoAudit ASIR · Projekt TA08 · ITB · 2024',
    author_role: 'ASIX · Gruppe G11',
    modal_badge: 'IKT-Nachhaltigkeit',
    modal_badge2: 'Modul 0375',
    radar_legend_base: 'Basis (100%)',
    radar_legend_strat: 'Strategie (%)',
  }
};

/* ── SAFE i18n GETTER ─────────────────────────────────────────── */
function t(key, lang) {
  const l = lang || S.lang;
  // Fallback chain: requested lang → ca → key itself
  return (T[l] && T[l][key]) || (T['ca'] && T['ca'][key]) || key;
}

/* ── APPLY TRANSLATIONS ──────────────────────────────────────── */
function applyTranslations(lang) {
  document.documentElement.lang = lang;
  document.title = t('app_title', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key, lang);
    if (val !== key) el.textContent = val;
  });
}

/* ── CHANGE LANGUAGE ─────────────────────────────────────────── */
function changeLang(lang) {
  if (!T[lang]) lang = 'ca';
  S.lang = lang;
  localStorage.setItem('ecoaudit_lang', lang);

  // Sync selector
  const sel = document.getElementById('lang-sel');
  if (sel) sel.value = lang;

  applyTranslations(lang);
  recalc(); // Re-render calculated content (table rows, chart labels)
}

/* ── DETECT BROWSER LANGUAGE ─────────────────────────────────── */
function detectLang() {
  const saved = localStorage.getItem('ecoaudit_lang');
  if (saved && T[saved]) return saved;

  const nav = (navigator.language || navigator.userLanguage || 'ca').slice(0, 2).toLowerCase();
  const map = { ca: 'ca', es: 'es', en: 'en', de: 'de' };
  return map[nav] || 'ca';
}

/* ── THEME ───────────────────────────────────────────────────── */
let isLight = false;

function applyTheme(light) {
  isLight = light;
  document.body.classList.toggle('light', light);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = light ? '☀️' : '🌙';
  if (btn) btn.setAttribute('aria-label', light ? 'Activar mode fosc' : 'Activar mode clar');
}

function toggleTheme() {
  const next = !isLight;
  localStorage.setItem('ecoaudit_theme', next ? 'light' : 'dark');
  applyTheme(next);
  destroyCharts();
  recalc();
}

/* ── NAVIGATION ──────────────────────────────────────────────── */
function go(pageId, e) {
  if (e) e.preventDefault();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + pageId);
  if (!pg) return;
  pg.classList.add('active');
  // Re-trigger animation
  pg.style.animation = 'none';
  void pg.offsetHeight;
  pg.style.animation = '';

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (e && e.currentTarget) e.currentTarget.classList.add('active');

  if (window.innerWidth <= 900) closeSB();
  if (pageId === 'seasonal') drawSeasonal();
}

function openSB() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'true');
}
function closeSB() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
}

/* ── MODAL SYSTEM ────────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus trap: focus close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function handleBackdropClick(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => closeModal(m.id));
  }
});

/* ── SEASONAL DATA ───────────────────────────────────────────── */
const MONTH_LABELS_CA = ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'];

function seasonal(base) {
  const d = {};
  const keys = Object.keys(base);

  // School calendar: Aug=closed, Dec=Christmas holidays (0), Apr=Easter holidays (0)
  // Jan back to school (high usage), Mar pre-Easter prep (slightly elevated)

  for (const k of keys) {
    const v = safeNum(base[k].val, 0);
    d[k] = MONTH_LABELS_CA.map((_, i) => {
      // Closed months: August (7), December Christmas (11), April Easter (3)
      if (i === 7  ) return +(v * 0.05).toFixed(2); // August: centre closed (minimal standby)
      if (i === 11 ) return +(v * 0.05).toFixed(2); // December: Christmas holidays closed
      if (i === 3  ) return +(v * 0.05).toFixed(2); // April: Easter holidays closed

      let f = 1.0;

      // === GAS ===
      if (k === 'gas' && [10,0,1].includes(i)) f = 2.20;  // Oct, Jan, Feb: winter heating peak
      if (k === 'gas' && i === 2)               f = 1.60;  // March: still cold
      if (k === 'gas' && [4].includes(i))       f = 0.50;  // May: warming up
      if (k === 'gas' && [5,6].includes(i))     f = 0.10;  // Jun, Jul: no heating
      if (k === 'gas' && [8,9].includes(i))     f = 0.80;  // Sep, Oct start

      // === ELECTRICITY ===
      if (k === 'elec' && [0,1].includes(i))    f = 1.15;  // Jan, Feb: winter lighting
      if (k === 'elec' && [5,6].includes(i))    f = 0.90;  // Jun, Jul: less activity
      if (k === 'elec' && i === 2)              f = 1.18;  // March: pre-Easter activity

      // === WATER ===
      if (k === 'water' && [4,5,6].includes(i)) f = 1.30;  // May–Jul: warm months
      if (k === 'water' && [8].includes(i))     f = 1.10;  // Sep: back to school cleaning
      if (k === 'water' && [0,1].includes(i))   f = 0.85;  // Jan, Feb: winter low
      if (k === 'water' && i === 2)             f = 1.20;  // March: spring cleaning

      // === PAPER ===
      if (k === 'paper' && i === 8)             f = 1.50;  // Sep: back to school
      if (k === 'paper' && [4].includes(i))     f = 1.25;  // May: post-Easter exams
      if (k === 'paper' && [5,6].includes(i))   f = 0.50;  // Jun, Jul: wind-down
      if (k === 'paper' && i === 2)             f = 1.45;  // March: pre-Easter exams/projects
      if (k === 'paper' && i === 0)             f = 1.30;  // January: new-year admin burst

      // === CLEANING PRODUCTS ===
      if (k === 'clean' && i === 8)             f = 1.40;  // Sep: big clean after summer
      if (k === 'clean' && [10,0,1].includes(i)) f = 1.10; // Oct, Jan, Feb: winter extra
      if (k === 'clean' && [5,6].includes(i))  f = 0.55;  // Jun, Jul: low activity
      if (k === 'clean' && i === 2)             f = 1.30;  // March: spring clean

      return +(v * f).toFixed(2);
    });
  }
  return { labels: MONTH_LABELS_CA, d };
}

/* ── SAFE NUMBER HELPER ──────────────────────────────────────── */
function safeNum(v, fallback = 0) {
  const n = parseFloat(v);
  return isFinite(n) ? n : fallback;
}

/* ── SLIDER SYNC ─────────────────────────────────────────────── */
function sync(k) {
  const el = document.getElementById('slide-' + k);
  if (!el) return;
  let v = safeNum(el.value, S.base[k].val);
  // Clamp to slider bounds
  v = Math.max(safeNum(el.min, 0), Math.min(safeNum(el.max, 9999), v));
  el.value = v;
  const display = document.getElementById('val-' + k);
  if (display) display.textContent = v;
  S.base[k].val = v;
  recalc();
}

/* ── STRATEGY TOGGLE ─────────────────────────────────────────── */
function toggleStrat(id, pct) {
  const btn = document.getElementById('strat-' + id);
  if (!btn) return;
  btn.classList.toggle('on');
  const isOn = btn.classList.contains('on');
  btn.setAttribute('aria-pressed', String(isOn));
  S.mods[id] = isOn ? (1 - pct) : 1.0;
  recalc();
}

/* ── MODIFIER MAP ────────────────────────────────────────────── */
const MOD_MAP = {
  elec:  'ia',
  gas:   'clima',
  water: 'water',
  paper: 'paper',
  clean: 'clean'
};

/* ── DEBOUNCE ────────────────────────────────────────────────── */
let recalcTimer = null;
function recalcDebounced() {
  clearTimeout(recalcTimer);
  recalcTimer = setTimeout(recalc, 30);
}

/* ── MAIN RECALC ─────────────────────────────────────────────── */
function recalc() {
  // Read period input safely
  const mesosEl = document.getElementById('mesos');
  let mesos = safeNum(mesosEl ? mesosEl.value : 12, 12);
  mesos = Math.max(1, Math.min(12, Math.round(mesos)));
  if (mesosEl) mesosEl.value = mesos;
  S.mesos = mesos;

  const seas = seasonal(S.base);
  const tbody = document.getElementById('tbody');
  if (tbody) tbody.innerHTML = '';

  let totalCO2anual = 0;
  let totalCO2strat = 0;
  const labels = [], baseArr = [], stratArr = [];
  let rowNum = 1;

  // Build export structure
  S.export = {
    Metadata: {
      Projecte: 'ITB Petjada Ambiental G11',
      Data_Exportacio: new Date().toISOString(),
      Fase: '1 (DataClean original) + 3 (Projeccions amb estratègies)'
    },
    Fase1_DataClean_Original: {},
    Fase3_Projeccions: {
      Mesos_Analitzats: S.mesos,
      Periode_Academia: 'Setembre–Juny (10 mesos)',
      Estrategies_Actives: {},
      Variabilitat_Mensual: seas.d,
      Resultats_Per_Indicador: {}
    }
  };

  // Strategy metadata
  const stratMeta = {
    IA_Energia:      { mod: S.mods.ia,    label: 'ia',    pct: 15 },
    Aillament_Clima: { mod: S.mods.clima, label: 'clima', pct: 25 },
    Zero_Paper:      { mod: S.mods.paper, label: 'paper', pct: 90 },
    Estalvi_Aigua:   { mod: S.mods.water, label: 'water', pct: 20 },
    Neteja_Eco:      { mod: S.mods.clean, label: 'clean', pct: 40 }
  };
  for (const [key, meta] of Object.entries(stratMeta)) {
    S.export.Fase3_Projeccions.Estrategies_Actives[key] =
      meta.mod < 1 ? `Activat (${Math.round((1-meta.mod)*100)}% reducció)` : 'Desactivat';
  }

  // Per-indicator calculation
  for (const k of Object.keys(S.base)) {
    const b   = S.base[k];
    const mod = safeNum(S.mods[MOD_MAP[k]], 1);

    const anualBase = seas.d[k].reduce((a, c) => a + safeNum(c), 0);
    if (!isFinite(anualBase) || anualBase < 0) continue;

    const co2Base    = anualBase * safeNum(b.co2, 0);
    const anualStrat = anualBase * mod;
    const co2Strat   = anualStrat * safeNum(b.co2, 0);

    // Period Sep–Jun (indexes 8,9,10,11,0,1,2,3,4,5)
    const periodeIdxs = [8,9,10,11,0,1,2,3,4,5];
    const periodeStrat = periodeIdxs.reduce((a, i) => {
      return a + safeNum(seas.d[k][i], 0) * mod;
    }, 0);

    totalCO2anual += co2Base;
    totalCO2strat += co2Strat;

    const nm = t('kpi_' + k);
    const un = b.un === 'packs' ? t('unit_packs') : b.un;
    labels.push(nm); baseArr.push(co2Base); stratArr.push(co2Strat);

    // Period display (user-selected period)
    let periodoUI = 0;
    for (let i = 0; i < S.mesos; i++) periodoUI += safeNum(seas.d[k][i], 0) * mod;

    // Update KPI cards
    setEl('kpi-' + k,   fmt(periodoUI));
    setEl('kpi-' + k + '-a', fmt(anualStrat) + ' ' + un);

    // Update slider value (thumb position) and badge to reflect strategy reduction
    const valEl  = document.getElementById('val-' + k);
    const slideEl = document.getElementById('slide-' + k);
    if (mod < 1) {
      const reducedMonthly = +(b.val * mod).toFixed(1);
      const redPct = Math.round((1 - mod) * 100);
      // Move the slider thumb to the reduced position
      if (slideEl) slideEl.value = reducedMonthly;
      if (valEl) {
        valEl.textContent = reducedMonthly;
        valEl.style.color = 'var(--mint)';
      }
      // Add/update the reduction badge next to the number
      const badgeContainer = valEl ? valEl.parentElement : null;
      if (badgeContainer) {
        let badge = badgeContainer.querySelector('.strat-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'strat-badge';
          badge.style.cssText = 'font-size:.7rem;color:var(--mint);margin-left:4px;font-weight:700;';
          badgeContainer.appendChild(badge);
        }
        badge.textContent = '−' + redPct + '%';
      }
    } else {
      // Restore slider thumb to base value
      if (slideEl) slideEl.value = b.val;
      if (valEl) {
        valEl.textContent = b.val;
        valEl.style.color = '';
      }
      const badgeContainer = valEl ? valEl.parentElement : null;
      if (badgeContainer) {
        const badge = badgeContainer.querySelector('.strat-badge');
        if (badge) badge.remove();
      }
    }

    // Update plan table base values
    setEl('pi-' + k, fmt(anualBase) + ' ' + un);

    // Table row (only required 4 get calc numbers)
    const isRequired = ['elec','water','paper','clean'].includes(k);
    const n1 = isRequired ? rowNum++ : '—';
    const n2 = isRequired ? rowNum++ : '—';

    if (tbody) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td style="color:var(--t3);font-weight:700;font-size:.78rem">${n1}/${n2}</td>` +
        `<td><strong>${nm}</strong></td>` +
        `<td>${fmt(anualStrat)} <span class="dim">${un}</span></td>` +
        `<td>${fmt(periodeStrat)} <span class="dim">${un}</span></td>` +
        `<td>${b.co2} kg/${un}</td>` +
        `<td class="hi">${fmt(co2Strat, 2)} kg</td>`;
      tbody.appendChild(tr);
    }

    // Export data
    S.export.Fase1_DataClean_Original[nm] = {
      Valor_Mensual_2024: b.val,
      Unitat: un,
      Factor_CO2e: b.co2,
      CO2e_Anual_Base_kg: +co2Base.toFixed(2)
    };
    S.export.Fase3_Projeccions.Resultats_Per_Indicador[nm] = {
      Consum_Anual_Estrategia: +anualStrat.toFixed(2),
      Consum_Periode_Set_Jun:  +periodeStrat.toFixed(2),
      CO2e_Anual_kg:           +co2Strat.toFixed(2),
      Reduccio_Aplicada_pct:   Math.round((1 - mod) * 100)
    };
  }

  // Guard against zero total
  const safeTotal = totalCO2anual > 0 ? totalCO2anual : 1;

  // Target banner
  const target30 = safeTotal * 0.70;
  setEl('target-val', fmt(target30) + ' kg CO2e');

  const actives = Object.values(S.mods).filter(v => v < 1).length;
  const pct = Math.min((actives / 5) * 100, 100);
  const bar = document.getElementById('prog-bar');
  if (bar) bar.style.width = pct + '%';
  const track = document.getElementById('prog-track');
  if (track) track.setAttribute('aria-valuenow', Math.round(pct));
  setEl('prog-pct', Math.round(pct) + '%');

  // Plan summary cards
  setEl('plan-now',    fmt(safeTotal));
  setEl('plan-target', fmt(safeTotal * 0.70));
  setEl('plan-saving', fmt(safeTotal * 0.30));
  setEl('plan-strat',  fmt(totalCO2strat));

  // Export totals
  S.export.Fase3_Projeccions.Total_CO2e_Anual_Base_kg   = +safeTotal.toFixed(2);
  S.export.Fase3_Projeccions.Total_CO2e_Anual_Estrat_kg = +totalCO2strat.toFixed(2);
  S.export.Fase3_Projeccions.Reduccio_Total_pct         =
    +((1 - totalCO2strat / safeTotal) * 100).toFixed(1);

  // JSON display
  const jsonEl = document.getElementById('json-pre');
  if (jsonEl) {
    try {
      jsonEl.textContent = JSON.stringify(S.export, null, 4);
    } catch (err) {
      jsonEl.textContent = '// Error generating JSON';
    }
  }

  drawCharts(labels, baseArr, stratArr);
  drawPlanCharts(totalCO2anual, totalCO2strat);
}

/* ── DOM HELPER ──────────────────────────────────────────────── */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── CHART SETUP ─────────────────────────────────────────────── */
let RC = null, DC = null, SC1 = null, SC2 = null, PC1 = null, PC2 = null;

const PAL = ['#4f8ef7','#f5a623','#1ed8a0','#a78bfa','#f472b6'];

function chartColors() {
  return {
    grid: isLight ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.06)',
    txt:  isLight ? '#4a607c'         : '#7f96b4'
  };
}

function drawCharts(labels, base, strat) {
  if (!labels.length || !base.length || !strat.length) return;

  const c = chartColors();
  Chart.defaults.color = c.txt;
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.size = 12;

  const pctStrat = strat.map((v, i) => {
    const b = base[i];
    if (!b || !isFinite(b) || b === 0) return 100;
    const r = (v / b) * 100;
    return isFinite(r) ? +r.toFixed(1) : 100;
  });
  const pctBase = labels.map(() => 100);

  const legendOpts = { labels: { usePointStyle: true, padding: 16, font: { size: 11 } } };

  // RADAR
  if (RC) {
    RC.data.labels = labels;
    RC.data.datasets[0].label = t('radar_legend_base');
    RC.data.datasets[1].label = t('radar_legend_strat');
    RC.data.datasets[1].data  = pctStrat;
    RC.update('active');
  } else {
    const ctx = document.getElementById('radarChart');
    if (ctx) {
      RC = new Chart(ctx, {
        type: 'radar',
        data: { labels, datasets: [
          { label: t('radar_legend_base'), data: pctBase, backgroundColor: 'rgba(248,113,113,.05)', borderColor: 'rgba(248,113,113,.4)', borderDash: [5,5], borderWidth: 1.5, pointRadius: 0 },
          { label: t('radar_legend_strat'), data: pctStrat, backgroundColor: 'rgba(30,216,160,.12)', borderColor: '#1ed8a0', borderWidth: 2, pointBackgroundColor: '#1ed8a0', pointRadius: 4, pointHoverRadius: 6 }
        ]},
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: { r: { min: 0, max: 100, angleLines: { color: c.grid }, grid: { color: c.grid }, ticks: { stepSize: 25, backdropColor: 'transparent', font: { size: 10 } }, pointLabels: { font: { size: 11, weight: '600' } } } },
          plugins: { legend: legendOpts }
        }
      });
    }
  }

  // DOUGHNUT
  if (DC) {
    DC.data.labels = labels;
    DC.data.datasets[0].data = strat.map(v => isFinite(v) ? +v.toFixed(2) : 0);
    DC.update('active');
  } else {
    const ctx = document.getElementById('doughnutChart');
    if (ctx) {
      DC = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: strat.map(v => isFinite(v) ? +v.toFixed(2) : 0), backgroundColor: PAL, borderWidth: 0, hoverOffset: 10 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '70%',
          plugins: { legend: { ...legendOpts, position: 'bottom' } }
        }
      });
    }
  }
}

function drawSeasonal() {
  const c    = chartColors();
  const seas = seasonal(S.base);
  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { grid: { color: c.grid }, ticks: { font: { size: 11 } } },
      x: { grid: { color: c.grid }, ticks: { font: { size: 11 } } }
    },
    plugins: { legend: { labels: { usePointStyle: true, padding: 18, font: { size: 11 } } } },
    interaction: { mode: 'index', intersect: false }
  };

  const mkDs = (label, data, color, gl) => ({
    label, data,
    borderColor: color, backgroundColor: gl,
    fill: true, tension: .42, borderWidth: 2,
    pointBackgroundColor: color, pointRadius: 4, pointHoverRadius: 6
  });

  if (SC1) {
    SC1.data.datasets[0].data = seas.d.gas;
    SC1.data.datasets[1].data = seas.d.elec;
    SC1.update('active');
  } else {
    const ctx = document.getElementById('seasonalChart');
    if (ctx) {
      SC1 = new Chart(ctx, {
        type: 'line',
        data: { labels: seas.labels, datasets: [
          mkDs('Gas (kWh)',        seas.d.gas,  '#f5a623', 'rgba(245,166,35,.08)'),
          mkDs('Electricitat (kWh)', seas.d.elec, '#4f8ef7', 'rgba(79,142,247,.08)')
        ]},
        options: lineOpts
      });
    }
  }

  if (SC2) {
    SC2.data.datasets[0].data = seas.d.water;
    SC2.data.datasets[1].data = seas.d.clean;
    SC2.update('active');
  } else {
    const ctx = document.getElementById('seasonalChart2');
    if (ctx) {
      SC2 = new Chart(ctx, {
        type: 'line',
        data: { labels: seas.labels, datasets: [
          mkDs('Aigua (m³)',          seas.d.water, '#1ed8a0', 'rgba(30,216,160,.08)'),
          mkDs('Prod. Neteja (L)',     seas.d.clean, '#f472b6', 'rgba(244,114,182,.08)')
        ]},
        options: lineOpts
      });
    }
  }
}

function drawPlanCharts(totalBase, totalStrat) {
  const c = chartColors();
  const safeBase = totalBase > 0 ? totalBase : 1;

  // CO2e projections per year (base → with strategies progressively applied)
  const y2024 = safeBase;
  const y2025 = safeBase * 0.90;  // −10%
  const y2026 = safeBase * 0.80;  // −20%
  const y2027 = safeBase * 0.70;  // −30%
  const yCurrent = Math.min(totalStrat, safeBase); // with active strategies

  const barLabels = ['2024 (Base)', '2025 (Any 1)', '2026 (Any 2)', '2027 (Any 3)', 'Estratègies Actives'];
  const barData   = [y2024, y2025, y2026, y2027, yCurrent];
  const barColors = [
    'rgba(127,150,180,.55)',
    'rgba(30,216,160,.55)',
    'rgba(79,142,247,.55)',
    'rgba(245,166,35,.55)',
    'rgba(167,139,250,.75)'
  ];
  const barBorders = ['#7f96b4','#1ed8a0','#4f8ef7','#f5a623','#a78bfa'];

  const commonOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { usePointStyle: true, padding: 14, font: { size: 11 }, color: c.txt } } },
    scales: {
      y: { grid: { color: c.grid }, ticks: { font: { size: 11 }, color: c.txt } },
      x: { grid: { color: c.grid }, ticks: { font: { size: 11 }, color: c.txt } }
    }
  };

  // Chart 1: CO2e evolution bar chart
  const ctx1 = document.getElementById('planBarChart');
  if (ctx1) {
    if (PC1) {
      PC1.data.datasets[0].data = barData;
      PC1.update('active');
    } else {
      PC1 = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: barLabels,
          datasets: [{
            label: 'CO2e (kg/any)',
            data: barData,
            backgroundColor: barColors,
            borderColor: barBorders,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          ...commonOpts,
          plugins: {
            ...commonOpts.plugins,
            tooltip: {
              callbacks: {
                label: ctx => `${fmt(ctx.raw, 1)} kg CO2e`,
                afterLabel: ctx => {
                  if (ctx.dataIndex === 0) return 'Línia base de referència';
                  const red = (((safeBase - ctx.raw) / safeBase) * 100).toFixed(1);
                  return `Reducció: −${red}% vs 2024`;
                }
              }
            }
          },
          scales: {
            ...commonOpts.scales,
            y: { ...commonOpts.scales.y, title: { display: true, text: 'kg CO2e', color: c.txt, font: { size: 11 } } }
          }
        }
      });
    }
  }

  // Chart 2: Resource reduction stacked/grouped by indicator
  const seas = seasonal(S.base);
  const resourceLabels = ['Electricitat','Gas','Aigua','Paper','Neteja'];
  const reductionPcts  = [
    [0, 15, 22, 30],  // Elec: 0, −15, −22, −30
    [0,  5, 18, 25],  // Gas
    [0,  5, 15, 20],  // Water
    [0, 30, 60, 90],  // Paper
    [0, 25, 35, 40]   // Clean
  ];
  const years = ['2024', '2025', '2026', '2027'];
  const palLine = ['#7f96b4','#1ed8a0','#4f8ef7','#f5a623'];
  const palFill = ['rgba(127,150,180,.08)','rgba(30,216,160,.08)','rgba(79,142,247,.08)','rgba(245,166,35,.08)'];

  // Build datasets: one per year, data = % of base remaining
  const datasets2 = years.map((yr, yi) => ({
    label: yr,
    data: reductionPcts.map(r => 100 - r[yi]),
    borderColor: palLine[yi],
    backgroundColor: palFill[yi],
    fill: false,
    tension: .35,
    borderWidth: yi === 0 ? 1.5 : 2,
    borderDash: yi === 0 ? [5,4] : [],
    pointBackgroundColor: palLine[yi],
    pointRadius: 4, pointHoverRadius: 6
  }));

  const ctx2 = document.getElementById('planResourceChart');
  if (ctx2) {
    if (PC2) {
      PC2.data.datasets.forEach((ds, i) => { ds.data = datasets2[i].data; });
      PC2.update('active');
    } else {
      PC2 = new Chart(ctx2, {
        type: 'line',
        data: { labels: resourceLabels, datasets: datasets2 },
        options: {
          ...commonOpts,
          plugins: {
            ...commonOpts.plugins,
            tooltip: {
              callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}% del consum base` }
            }
          },
          scales: {
            ...commonOpts.scales,
            y: {
              ...commonOpts.scales.y,
              min: 0, max: 110,
              title: { display: true, text: '% consum vs base 2024', color: c.txt, font: { size: 11 } }
            }
          }
        }
      });
    }
  }
}

function destroyCharts() {
  [RC, DC, SC1, SC2, PC1, PC2].forEach(ch => { try { if (ch) ch.destroy(); } catch(e){} });
  RC = DC = SC1 = SC2 = PC1 = PC2 = null;
}

/* ── DOWNLOAD JSON ───────────────────────────────────────────── */
function downloadJSON() {
  try {
    const json = JSON.stringify(S.export, null, 4);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'EcoAudit_Informe_G11_Fase1_Fase3.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    // Fallback for older browsers
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(S.export, null, 4));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'EcoAudit_Informe_G11.json');
    a.click();
  }
}

/* ── NUMBER FORMAT ───────────────────────────────────────────── */
function fmt(n, dec = 0) {
  const num = safeNum(n, 0);
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

/* ── INIT ────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Restore theme
  const savedTheme = localStorage.getItem('ecoaudit_theme');
  applyTheme(savedTheme === 'light');

  // Detect & apply language
  const lang = detectLang();
  S.lang = lang;
  const sel = document.getElementById('lang-sel');
  if (sel) sel.value = lang;
  applyTranslations(lang);

  // Initial calculation
  recalc();

  // Keyboard trap for sidebar on mobile
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('sidebar').classList.contains('open')) {
      closeSB();
    }
  });
});
