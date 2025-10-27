import React, { useMemo, useRef, useEffect, useState } from "react";
import { create } from "zustand";

// =================== Utilidades ============================
function randomQuality(){
  const levels=["Alta","Media","Baja"];
  return levels[Math.floor(Math.random()*levels.length)];
}

// =================== Casos ============================
const CASES=[
  {
    id:"CASE-001",
    titulo:"Mora en proyecto de software para entidad pública",
    brief:`La Agencia de Innovación Digital de Bogotá contrató a una empresa de software para desplegar una plataforma ciudadana.\nEl proveedor alega retrasos por caída prolongada del proveedor de hosting (reportes de la CRC y del MinTIC). La contraparte invoca mala planeación y correos donde el PM admite estimaciones erradas.`,
    evidencias:[
      {id:"E-certificado",titulo:"Certificado técnico de avance (Interventoría)",explicacion:"Acta que registra 80% de módulos y detalla incidentes del hosting.",calidad:randomQuality()},
      {id:"E-correos",titulo:"Correos del PM a la Secretaría TIC",explicacion:"Reconoce retraso por mala estimación de esfuerzo.",calidad:randomQuality()},
      {id:"E-reporte_crc",titulo:"Reporte de indisponibilidad (CRC/MinTIC)",explicacion:"Documento público que evidencia caída masiva del proveedor IaaS 9 días.",calidad:randomQuality()}
    ],
    normas:[
      {id:"N-fuerza_mayor",nombre:"Fuerza mayor (art. 64 C.C.)",resumen:"Introducción: En Colombia, la fuerza mayor libera al deudor si el hecho fue imprevisible e irresistible.\nConsecuencia: Puede eximir de mora y sanciones si se demuestra nexo causal y diligencia."},
      {id:"N-cumplimiento_parcial",nombre:"Cumplimiento parcial (art. 1609 C.C.)",resumen:"Introducción: Regula efectos cuando hay ejecución sustancial del contrato.\nConsecuencia: Permite moderar cláusulas penales si el incumplimiento es leve o justificado."}
    ],
    movimientos:[
      {id:"A-defensa",nombre:"Defensa sólida",descripcion:"Argumenta nexo causal entre la caída del hosting (CRC/MinTIC) y la mora, destacando diligencia y medidas de mitigación."},
      {id:"A-conciliacion",nombre:"Conciliación 30%",descripcion:"Propone acuerdo con rebaja de sanción por avance del 80% y buena fe contractual."},
      {id:"A-cuestionar",nombre:"Cuestionar correos internos",descripcion:"Sostiene que correos con 'admisión' son contexto operativo, no aceptación de negligencia."},
      {id:"A-custom",nombre:"Otro movimiento",descripcion:"Escribe tu propio movimiento personalizado según la estrategia que consideres relevante."}
    ],
    contraparte:{
      norma:"N-cumplimiento_parcial",
      evidencias:["E-correos"],
      movimientos:["A-cuestionar"],
      relato:"La entidad insiste en mora imputable y exige la cláusula penal completa."
    }
  },
  {
    id:"CASE-002",
    titulo:"Incumplimiento en entrega de insumos médicos a hospital público",
    brief:`La ESE Hospital de Medellín firmó contrato de suministro con un distribuidor nacional. El proveedor alega fuerza mayor por bloqueo en la vía al puerto de Buenaventura; el hospital sostiene negligencia logística.`,
    evidencias:[
      {id:"E-guia",titulo:"Guías de tránsito Invías/DITRA",explicacion:"Reportan cierres totales por bloqueos de 8 días en la ruta.",calidad:randomQuality()},
      {id:"E-factura",titulo:"Factura/acta de entrega parcial",explicacion:"Acredita entregas parciales durante el periodo crítico.",calidad:randomQuality()},
      {id:"E-correos_hospital",titulo:"Correos del Hospital",explicacion:"Solicitan sanción por incumplimiento total y urgencia hospitalaria.",calidad:randomQuality()}
    ],
    normas:[
      {id:"N-cumplimiento_parcial",nombre:"Cumplimiento parcial (art. 1609 C.C.)",resumen:"Introducción: El juez puede ponderar el grado de ejecución.\nConsecuencia: Reducción de sanción si la entrega parcial es significativa y justificada."},
      {id:"N-fuerza_mayor",nombre:"Fuerza mayor (art. 64 C.C.)",resumen:"Introducción: Bloqueos y cierres externos pueden configurar imposibilidad temporal.\nConsecuencia: Exonera o atenúa responsabilidad si se demuestra imposibilidad y buena fe."}
    ],
    movimientos:[
      {id:"A-defensa",nombre:"Defensa logística",descripcion:"Explica imposibilidad real por bloqueos, gestión alternativa y priorización de críticos."},
      {id:"A-evidencia",nombre:"Exhibir reportes Invías/DITRA",descripcion:"Corrobora la fuerza mayor con fuentes oficiales y traza logística."},
      {id:"A-conciliar",nombre:"Conciliación del 50%",descripcion:"Evita litigio largo; reconoce afectación hospitalaria con compensación media."},
      {id:"A-custom",nombre:"Otro movimiento",descripcion:"Escribe tu propio movimiento personalizado según la estrategia que consideres relevante."}
    ],
    contraparte:{
      norma:"N-cumplimiento_parcial",
      evidencias:["E-correos_hospital"],
      movimientos:["A-conciliar"],
      relato:"El hospital exige cumplimiento total o resolución con sanción por mora."
    }
  },
  {
    id:"CASE-003",
    titulo:"Controversia por licitación de obra pública (ANI)",
    brief:`La ANI demandó a un contratista por retraso en la entrega de un tramo vial. El contratista alega lluvias históricas y permisos ambientales tardíos; la ANI habla de mala gestión del riesgo.`,
    evidencias:[
      {id:"E-peritaje",titulo:"Peritaje ambiental CAR",explicacion:"Confirma pluviometría extraordinaria por 3 meses.",calidad:randomQuality()},
      {id:"E-reporte_ani",titulo:"Reporte técnico ANI",explicacion:"Detalla hitos críticos no alcanzados en cronograma.",calidad:randomQuality()},
      {id:"E-fotos",titulo:"Imágenes satelitales/INSIVUMEH",explicacion:"Evidencian erosión severa en el área de trabajo.",calidad:randomQuality()}
    ],
    normas:[
      {id:"N-fuerza_mayor",nombre:"Fuerza mayor (art. 64 C.C.)",resumen:"Introducción: Fenómenos naturales extraordinarios pueden eximir.\nConsecuencia: Exonera responsabilidad si hay prueba robusta y diligencia."},
      {id:"N-responsabilidad_contratista",nombre:"Responsabilidad del contratista (Ley 80/1993, art. 50)",resumen:"Introducción: El contratista responde por incumplimientos salvo fuerza mayor.\nConsecuencia: Carga de la prueba recae en el contratista."}
    ],
    movimientos:[
      {id:"A-evidenciar",nombre:"Evidenciar fuerza mayor",descripcion:"Conecta peritaje, pluviometría e imágenes para demostrar imposibilidad objetiva."},
      {id:"A-documentar",nombre:"Documentar gestión del riesgo",descripcion:"Muestra matriz de riesgos, medidas adoptadas y comunicación oportuna con interventoría."},
      {id:"A-defender",nombre:"Defender responsabilidad parcial",descripcion:"Alega avance del 85% y solicita moderación de multa por ejecución sustancial."},
      {id:"A-custom",nombre:"Otro movimiento",descripcion:"Escribe tu propio movimiento personalizado según la estrategia que consideres relevante."}
    ],
    contraparte:{
      norma:"N-responsabilidad_contratista",
      evidencias:["E-reporte_ani"],
      movimientos:["A-defender"],
      relato:"ANI afirma que la gestión preventiva fue insuficiente y pide multas contractuales."
    }
  }
];

// =================== Reglas del juego ============================
function evaluarPartida({evidenciasSel,movimientosSel}){
  const base=40;
  const score=base + evidenciasSel.length*10 + (movimientosSel.length*5);
  const outcome=score>=55?"Victoria":score>=45?"Conciliación":"Derrota";
  return{outcome,score};
}

function redactarVeredicto({resultado,seleccion,caso,contraParte}){
  if(!resultado) return "";
  return `HECHOS: ${caso.brief}\n\nCONSIDERACIONES: Se valoran las evidencias (${seleccion.evidencias.map(e=>e.titulo+" [Calidad: "+e.calidad+"]").join(", ")}), la norma ${seleccion.norma?.nombre}, y los movimientos (${seleccion.movimientos.map(m=>m.nombre).join(", ")}${(seleccion.customMovimiento && seleccion.movimientos.some(m=>m.id==='A-custom'))?`, movimiento personalizado: ${seleccion.customMovimiento}`:""}). La contraparte alega ${contraParte.norma} con evidencias ${contraParte.evidencias.join(", ")}.\n\nFALLO: ${resultado.outcome==='Victoria'?'El juez absuelve por demostrarse la fuerza mayor.':resultado.outcome==='Conciliación'?'El juez ordena conciliación con moderación de sanción.':'Se declara incumplimiento total y se imponen sanciones.'}`;
}

// =================== Store (Zustand) ============================
const useGame=create((set,get)=>({
  caseIndex:0,
  seleccion:{evidencias:[],norma:null,movimientos:[],customMovimiento:""},
  mostrarVeredicto:false,
  getCase:()=>CASES[get().caseIndex],
  newMatch:()=>{
    const total=CASES.length;
    const next=(get().caseIndex+1)%total;
    // re-seed calidad para el nuevo caso
    const cloned=JSON.parse(JSON.stringify(CASES[next]));
    cloned.evidencias = cloned.evidencias.map(e=>({...e,calidad:randomQuality()}));
    // Reasignar en runtime (sin mutar CASES original)
    const tmp=[...CASES];
    tmp[next]=cloned;
    CASES.splice(0,CASES.length,...tmp);
    set({caseIndex:next,seleccion:{evidencias:[],norma:null,movimientos:[],customMovimiento:""},mostrarVeredicto:false});
  },
  toggleEvidence:id=>{
    const c=get().getCase();
    const sel=[...get().seleccion.evidencias];
    const idx=sel.findIndex(e=>e.id===id);
    if(idx>=0) sel.splice(idx,1);
    else if(sel.length<2){ const e=c.evidencias.find(x=>x.id===id); if(e) sel.push(e); }
    set({seleccion:{...get().seleccion,evidencias:sel}});
  },
  setNorma:id=>{ const c=get().getCase(); const n=c.normas.find(x=>x.id===id)||null; set({seleccion:{...get().seleccion,norma:n}}); },
  toggleMovimiento:id=>{
    const c=get().getCase();
    const sel=[...get().seleccion.movimientos];
    const idx=sel.findIndex(m=>m.id===id);
    if(idx>=0) sel.splice(idx,1);
    else if(sel.length<2){ const m=c.movimientos.find(x=>x.id===id); if(m) sel.push(m); }
    set({seleccion:{...get().seleccion,movimientos:sel}});
  },
  setCustomMovimiento:text=>{ set({seleccion:{...get().seleccion,customMovimiento:text}}); },
  enviar:()=> set({mostrarVeredicto:true})
}));

// =================== Componentes UI ============================
function Popup({message,onClose,color}){
  useEffect(()=>{const t=setTimeout(onClose,1800);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:'fixed',top:'40%',left:'50%',transform:'translate(-50%,-50%)',background:color,color:'#fff',padding:'20px 40px',borderRadius:12,fontSize:22,fontWeight:'bold',boxShadow:'0 10px 30px rgba(0,0,0,0.3)',zIndex:999,opacity:1}}>
      {message}
    </div>
  );
}

function ResumenPanel({seleccion,onEnviar}){
  const mostrarCustom = !!seleccion.customMovimiento && seleccion.movimientos.some(m=>m.id==="A-custom");
  return(
    <div style={{...panelBox,flexDirection:'column'}}>
      <h4>Resumen</h4>
      <div><b>Norma (1):</b> {seleccion.norma? seleccion.norma.nombre : 'Ninguna'}</div>
      <div><b>Evidencias (2):</b></div>
      <ul style={{marginTop:6}}>
        {seleccion.evidencias.map(e=> <li key={e.id}>{e.titulo} ({e.calidad})</li>)}
      </ul>
      <div><b>Movimientos (2):</b></div>
      <ul style={{marginTop:6}}>
        {seleccion.movimientos.map(m=> <li key={m.id}>{m.nombre}</li>)}
        {mostrarCustom && <li>{seleccion.customMovimiento}</li>}
      </ul>
      <button style={btnStyle} onClick={onEnviar}>Enviar</button>
    </div>
  );
}

export default function App(){
  const {seleccion,toggleEvidence,setNorma,toggleMovimiento,setCustomMovimiento,mostrarVeredicto,enviar,getCase,newMatch}=useGame();
  const caso=getCase();
  const [popup,setPopup]=useState(null);
  const endRef=useRef(null);

  const resultado=useMemo(()=>{
    if(!mostrarVeredicto||seleccion.evidencias.length<2||!seleccion.norma) return null;
    return evaluarPartida({evidenciasSel:seleccion.evidencias,normaSel:seleccion.norma,movimientosSel:seleccion.movimientos});
  },[mostrarVeredicto,seleccion]);

  const textoVeredicto=useMemo(()=>redactarVeredicto({resultado,seleccion,caso,contraParte:caso.contraparte}),[resultado,seleccion,caso]);

  useEffect(()=>{
    if(mostrarVeredicto&&endRef.current){
      endRef.current.scrollIntoView({behavior:'smooth'});
      if(resultado){
        if(resultado.outcome==='Victoria') setPopup({message:'¡Felicidades, Ganaste!',color:'#28a745'});
        else if(resultado.outcome==='Derrota') setPopup({message:'Has Perdido',color:'#dc3545'});
      }
    }
  },[mostrarVeredicto,resultado]);

  return(
    <div style={{fontFamily:'monospace',color:'#143464',padding:'16px',width:'100%',maxWidth:'100%',boxSizing:'border-box',overflowX:'clip'}}>
      {popup && <Popup message={popup.message} onClose={()=>setPopup(null)} color={popup.color}/>} 

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <h2 style={{margin:0}}>{caso.titulo}</h2>
        <button onClick={newMatch} style={btnStyle}>Nuevo caso</button>
      </div>
      <p style={{whiteSpace:'pre-wrap'}}>{caso.brief}</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        <div style={cardStyle}>
          <h4>Normas (elige 1)</h4>
          {caso.normas.map(n=> (
            <div key={n.id} style={cardStyle}>
              <b>{n.nombre}</b>
              <button style={miniBtn} onClick={()=>setNorma(n.id)}>Elegir</button>
              <p style={{whiteSpace:'pre-wrap',marginTop:6}}>{n.resumen}</p>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h4>Evidencias (elige 2)</h4>
          {caso.evidencias.map(e=>{
            const active=seleccion.evidencias.some(x=>x.id===e.id);
            return (
              <div key={e.id} style={cardStyle}>
                <b>{e.titulo}</b> <span style={{opacity:0.7}}>[Calidad: {e.calidad}]</span>
                <button style={miniBtn} onClick={()=>toggleEvidence(e.id)}>{active?'Quitar':'Elegir'}</button>
                <p style={{marginTop:6}}>{e.explicacion}</p>
              </div>
            );
          })}
        </div>

        <ResumenPanel seleccion={seleccion} onEnviar={enviar}/>
      </div>

      <div style={{marginTop:20}}>
        <h4>Movimientos (elige 2 o escribe uno propio)</h4>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10}}>
          {caso.movimientos.map(m=>{
            const active=seleccion.movimientos.some(x=>x.id===m.id);
            return (
              <div key={m.id} style={cardStyle}>
                <b>{m.nombre}</b>
                <button style={miniBtn} onClick={()=>toggleMovimiento(m.id)}>{active?'Quitar':'Elegir'}</button>
                <p style={{marginTop:6}}>{m.descripcion}</p>
                {m.id==="A-custom" && (
                  <textarea
                    placeholder="Escribe tu movimiento"
                    style={{width:'100%',marginTop:6,minHeight:70}}
                    value={seleccion.customMovimiento}
                    onChange={e=>setCustomMovimiento(e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {mostrarVeredicto && resultado && (
        <div ref={endRef} style={{...cardStyle,borderColor:'#143464',marginTop:40}}>
          <h4>Contraargumentos</h4>
          <p>{caso.contraparte.relato}</p>
          <h4>Veredicto del juez</h4>
          <pre style={{whiteSpace:'pre-wrap',fontFamily:'monospace',fontSize:13}}>{textoVeredicto}</pre>
        </div>
      )}
    </div>
  );
}

// =================== Estilos base ============================
const cardStyle={border:'1px solid #D9D9D9',borderRadius:8,padding:12,background:'#fff',boxSizing:'border-box'};
const panelBox={...cardStyle,borderColor:'#143464'};
const btnStyle={border:'1px solid #143464',background:'#FFCB40',color:'#143464',padding:'6px 12px',borderRadius:6,cursor:'pointer'};
const miniBtn={border:'1px solid #143464',background:'#FFCB40',color:'#143464',padding:'2px 6px',borderRadius:6,cursor:'pointer',fontSize:12};
