import { useState, useEffect } from "react";

/* ─────────────────────────── TEMA ─────────────────────────── */
const T = {
  bg:"#07041a", card:"#0f0a2e", card2:"#170f3d", border:"#2d235a",
  gold:"#e9a81c", goldLight:"#f5c84a", text:"#ede9fe", dim:"#7c6fab",
  green:"#34d399", red:"#f87171", orange:"#fb923c", blue:"#818cf8",
  pink:"#f472b6",
};
const sc = (extra={}) => ({ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:16, ...extra });
const sb = (extra={}) => ({ cursor:"pointer", border:"none", borderRadius:8, padding:"8px 16px", fontWeight:600, fontSize:13, transition:"opacity .15s, transform .1s", ...extra });
const si = (extra={}) => ({ background:T.card2, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 12px", color:T.text, fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", ...extra });

/* ─────────────────────────── HELPERS ─────────────────────────── */
const fmt = v => v!=null ? v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
const uid = () => Math.random().toString(36).slice(2,9);
const toDate = s => { const [d,m,y]=s.split("/"); return new Date(+y,+m-1,+d); };
const gcalDate = s => { const [d,m,y]=s.split("/"); return `${y}${m}${d}`; };
const ML = {"06/2026":"Jun/26","07/2026":"Jul/26","08/2026":"Ago/26","09/2026":"Set/26","10/2026":"Out/26","12/2026":"Dez/26","01/2027":"Jan/27","03/2027":"Mar/27"};

const getStatus = c => {
  if (!c.vf)        return {label:"⚠ Pendente", color:T.orange};
  if (c.vp>=c.vf)   return {label:"✓ Pago",     color:T.green };
  if (c.vp>0)       return {label:"◑ Parcial",   color:T.blue  };
  return                   {label:"○ A pagar",   color:T.red   };
};

/* ─────────────────────────── SEED (36 CLIENTES) ─────────────────────────── */
const SEED = [
  {id:"c01",nome:"ISABEL CHAVES",    tel:"21974591129",bairro:"Bento Ribeiro",    data:"20/06/2026",tipo:"Chá de Bebê",       vf:500, vp:250,  gastos:[]},
  {id:"c02",nome:"ANA CAROLINA",     tel:"21970300450",bairro:"Taquara",           data:"20/06/2026",tipo:"Chá Revelação",     vf:650, vp:585,  gastos:[]},
  {id:"c03",nome:"FLAVIA GUIMARAES", tel:"21988794893",bairro:"Ilha do Governador",data:"27/06/2026",tipo:"80 Anos",           vf:500, vp:250,  gastos:[]},
  {id:"c04",nome:"THAISA SOUTO",     tel:"21965563035",bairro:"Pilares",           data:"04/07/2026",tipo:"1 Ano",             vf:400, vp:0,    gastos:[]},
  {id:"c05",nome:"DAIANE X",         tel:null,         bairro:null,                data:"04/07/2026",tipo:null,                vf:null,vp:0,    gastos:[]},
  {id:"c06",nome:"THAMIRES",         tel:null,         bairro:"Valqueire",         data:"06/07/2026",tipo:"3 Anos",            vf:null,vp:0,    gastos:[]},
  {id:"c07",nome:"AGATHA ALVES",     tel:"21974704773",bairro:"Praça Seca",        data:"11/07/2026",tipo:"Chá de Bebê",       vf:500, vp:250,  gastos:[]},
  {id:"c08",nome:"DANIELE",          tel:"21988875415",bairro:"Penha",             data:"11/07/2026",tipo:"1 Ano",             vf:650, vp:650,  gastos:[]},
  {id:"c09",nome:"LETICIA",          tel:"21970215513",bairro:"Pilares",           data:"11/07/2026",tipo:"15 Anos",           vf:1090,vp:900,  gastos:[]},
  {id:"c10",nome:"BRUNA",            tel:"21975661266",bairro:"Jardim Botânico",   data:"18/07/2026",tipo:"Ariel",             vf:660, vp:330,  gastos:[]},
  {id:"c11",nome:"REGINA",           tel:"21993507108",bairro:"Bento Ribeiro",     data:"18/07/2026",tipo:"60 Anos",           vf:400, vp:300,  gastos:[]},
  {id:"c12",nome:"ADRIANA DE PAULA", tel:"21993863916",bairro:"Curicica",          data:"19/07/2026",tipo:"1 Ano",             vf:490, vp:225,  gastos:[]},
  {id:"c13",nome:"ANINHA",           tel:"21982836132",bairro:"Curicica",          data:"19/07/2026",tipo:"Chá de Bebê",       vf:600, vp:300,  gastos:[]},
  {id:"c14",nome:"SILEYNE",          tel:"21991323883",bairro:"Madureira",         data:"25/07/2026",tipo:"Mundo Doce",        vf:500, vp:300,  gastos:[]},
  {id:"c15",nome:"RENATA",           tel:null,         bairro:null,                data:"25/07/2026",tipo:null,                vf:null,vp:0,    gastos:[]},
  {id:"c16",nome:"JULIANA DE BRITO", tel:"21982635820",bairro:"Rocha Jardim",      data:"25/07/2026",tipo:"—",                 vf:490, vp:245,  gastos:[]},
  {id:"c17",nome:"AYSHA DIAS",       tel:"21990599519",bairro:"Vilar dos Teles",   data:"26/07/2026",tipo:"Jardim Chá de Bebê",vf:480, vp:240,  gastos:[]},
  {id:"c18",nome:"LARISSA FRAZAO",   tel:"21980320068",bairro:"Sulacap",           data:"01/08/2026",tipo:"Adulto",            vf:500, vp:250,  gastos:[]},
  {id:"c19",nome:"NATHY AZEVEDO",    tel:"21999432442",bairro:"Irajá",             data:"08/08/2026",tipo:"1 Ano",             vf:400, vp:200,  gastos:[]},
  {id:"c20",nome:"MICHELE",          tel:"21992918234",bairro:"Bento Ribeiro",     data:"15/08/2026",tipo:"Adulto",            vf:400, vp:200,  gastos:[]},
  {id:"c21",nome:"SIDNI",            tel:null,         bairro:null,                data:"16/08/2026",tipo:"Adulto",            vf:null,vp:0,    gastos:[]},
  {id:"c22",nome:"RAQUEL",           tel:null,         bairro:null,                data:"22/08/2026",tipo:"Casamento",         vf:null,vp:0,    gastos:[]},
  {id:"c23",nome:"DARA SANTOS",      tel:null,         bairro:null,                data:"23/08/2026",tipo:"Infantil",          vf:null,vp:0,    gastos:[]},
  {id:"c24",nome:"NATH",             tel:null,         bairro:null,                data:"29/08/2026",tipo:null,                vf:null,vp:0,    gastos:[]},
  {id:"c25",nome:"VICTORIA",         tel:"21978746965",bairro:"Turiaçu",           data:"29/08/2026",tipo:"Casamento",         vf:500, vp:200,  gastos:[]},
  {id:"c26",nome:"ANNA BEATRIZ",     tel:"21966070180",bairro:null,                data:"12/09/2026",tipo:null,                vf:null,vp:0,    gastos:[]},
  {id:"c27",nome:"BEATRIZ",          tel:"21975014518",bairro:null,                data:"19/09/2026",tipo:"1 Ano",             vf:590, vp:272.5,gastos:[]},
  {id:"c28",nome:"ANDREZZA",         tel:"21994818658",bairro:"Bento Ribeiro",     data:"20/09/2026",tipo:"1 Ano",             vf:545, vp:0,    gastos:[]},
  {id:"c29",nome:"EDUARDA",          tel:"21993561719",bairro:null,                data:"20/09/2026",tipo:null,                vf:null,vp:0,    gastos:[]},
  {id:"c30",nome:"CAROLINE",         tel:"21966921005",bairro:"Coelho Neto",       data:"26/09/2026",tipo:"Adulto",            vf:300, vp:290,  gastos:[]},
  {id:"c31",nome:"LAIS",             tel:"21983319053",bairro:"Madureira",         data:"10/10/2026",tipo:"Adulto",            vf:250, vp:125,  gastos:[]},
  {id:"c32",nome:"BARBARA",          tel:"21964045198",bairro:null,                data:"11/10/2026",tipo:null,                vf:null,vp:0,    gastos:[]},
  {id:"c33",nome:"ISAMARA",          tel:"21982967374",bairro:"Bento Ribeiro",     data:"12/12/2026",tipo:"Casamento",         vf:900, vp:400,  gastos:[]},
  {id:"c34",nome:"JULIANA DE BRITO", tel:"21970037402",bairro:"Madureira",         data:"16/01/2027",tipo:"1 Ano",             vf:320, vp:320,  gastos:[]},
  {id:"c35",nome:"NUBIA",            tel:null,         bairro:"Nova Iguaçu",       data:"13/03/2027",tipo:"Casamento",         vf:3000,vp:1000, gastos:[]},
  {id:"c36",nome:"ELLEN",            tel:"21965279265",bairro:"Barra da Tijuca",   data:"14/03/2027",tipo:"2 Anos",            vf:460, vp:460,  gastos:[]},
];

/* ─────────────────────────── DriveModal ─────────────────────────── */
function DriveModal({clients, onImport, onClose, lastBackup, setLastBackup}) {
  const [tab,      setTab]      = useState("backup");
  const [clientId, setClientId] = useState(()=>{ try{return localStorage.getItem("celebrar-gcid")||"";}catch{return "";} });
  const [token,    setToken]    = useState(null);
  const [status,   setStatus]  = useState("idle"); // idle|loading|saving|loading_drive
  const [msg,      setMsg]      = useState("");
  const isFile = typeof window!=="undefined" && window.location.protocol==="file:";

  const fmtDate = iso => iso ? new Date(iso).toLocaleString("pt-BR") : null;

  /* Export JSON */
  const doExport = () => {
    const blob = new Blob([JSON.stringify(clients,null,2)],{type:"application/json"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `celebrar-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const now = new Date().toISOString();
    localStorage.setItem("celebrar-last-backup", now);
    setLastBackup(now);
    setMsg("✅ Backup baixado! Guarde o arquivo com segurança.");
  };

  /* Import JSON */
  const doImport = file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data) && data.length > 0) {
          onImport(data.map(c=>({...c, gastos:c.gastos||[]})));
          setMsg("✅ " + data.length + " eventos restaurados com sucesso!");
        } else { setMsg("❌ Arquivo inválido ou vazio."); }
      } catch { setMsg("❌ Erro ao ler o arquivo. Verifique se é um backup válido."); }
    };
    reader.readAsText(file);
  };

  /* OAuth → Google Drive */
  const connectDrive = () => {
    const id = clientId.trim();
    if (!id) { setMsg("⚠️ Digite o Client ID primeiro."); return; }
    localStorage.setItem("celebrar-gcid", id);
    setStatus("loading"); setMsg("");
    const doOAuth = () => {
      try {
        const tc = window.google.accounts.oauth2.initTokenClient({
          client_id: id,
          scope: "https://www.googleapis.com/auth/drive.file",
          callback: resp => {
            if (resp.access_token) { setToken(resp.access_token); setStatus("idle"); setMsg("✅ Google Drive conectado com sucesso!"); }
            else { setStatus("idle"); setMsg("❌ Autenticação cancelada ou falhou."); }
          },
        });
        tc.requestAccessToken({prompt:"consent"});
      } catch(e) { setStatus("idle"); setMsg("❌ Erro: "+e.message); }
    };
    if (window.google?.accounts?.oauth2) { doOAuth(); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = doOAuth;
    s.onerror = () => { setStatus("idle"); setMsg("❌ Sem internet. Use o Backup Manual."); };
    document.head.appendChild(s);
  };

  /* Save to Drive */
  const saveDrive = async () => {
    if (!token) return;
    setStatus("saving"); setMsg("");
    try {
      const json = JSON.stringify(clients, null, 2);
      const search = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=name%3D%22celebrar-dados.json%22%20and%20trashed%3Dfalse&fields=files(id)',
        {headers:{Authorization:`Bearer ${token}`}}
      );
      const {files=[]} = await search.json();
      const boundary = "celebrar_mp_boundary";
      const meta = JSON.stringify({name:"celebrar-dados.json",mimeType:"application/json"});
      const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${json}\r\n--${boundary}--`;
      if (files[0]) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${files[0].id}?uploadType=media`,
          {method:"PATCH", headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"}, body:json});
      } else {
        await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          {method:"POST", headers:{Authorization:`Bearer ${token}`,"Content-Type":`multipart/related; boundary=${boundary}`}, body});
      }
      const now = new Date().toISOString();
      localStorage.setItem("celebrar-last-backup", now);
      setLastBackup(now);
      setStatus("idle"); setMsg("✅ Dados salvos no Google Drive!");
    } catch(e) { setStatus("idle"); setMsg("❌ Erro ao salvar: "+e.message); }
  };

  /* Load from Drive */
  const loadDrive = async () => {
    if (!token) return;
    setStatus("loading_drive"); setMsg("");
    try {
      const search = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=name%3D%22celebrar-dados.json%22%20and%20trashed%3Dfalse&fields=files(id)',
        {headers:{Authorization:`Bearer ${token}`}}
      );
      const {files=[]} = await search.json();
      if (!files[0]) { setStatus("idle"); setMsg("⚠️ Nenhum arquivo encontrado no Drive. Salve primeiro."); return; }
      const content = await fetch(`https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media`,
        {headers:{Authorization:`Bearer ${token}`}});
      const data = await content.json();
      if (Array.isArray(data)) {
        onImport(data.map(c=>({...c,gastos:c.gastos||[]})));
        setStatus("idle"); setMsg("✅ "+data.length+" eventos carregados do Google Drive!");
      }
    } catch(e) { setStatus("idle"); setMsg("❌ Erro ao carregar: "+e.message); }
  };

  const isBusy = status!=="idle";
  const TABS = [["backup","💾 Backup"],["drive","☁️ Google Drive"],["guide","📖 Tutorial"]];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:150,overflowY:"auto",padding:"20px 16px"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={sc({width:"100%",maxWidth:500,margin:"0 auto 20px",position:"relative"})}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontWeight:800,fontSize:18,color:T.gold}}>☁️ Backup & Google Drive</div>
            <div style={{fontSize:12,color:T.dim,marginTop:2}}>{lastBackup?`Último backup: ${fmtDate(lastBackup)}`:"Nenhum backup registrado"}</div>
          </div>
          <button onClick={onClose} style={sb({background:"transparent",color:T.dim,padding:"4px 10px",fontSize:22,lineHeight:1})}>×</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,background:T.card2,padding:4,borderRadius:10}}>
          {TABS.map(([k,l])=>(
            <button key={k} onClick={()=>{setTab(k);setMsg("");}}
              style={sb({flex:1,background:tab===k?T.gold:"transparent",color:tab===k?"#000":T.dim,padding:"6px 4px",fontSize:12})}>
              {l}
            </button>
          ))}
        </div>

        {/* Mensagem de status */}
        {msg&&(
          <div style={{padding:"10px 14px",borderRadius:8,marginBottom:12,fontSize:13,fontWeight:500,
            background:msg.startsWith("✅")?T.green+"22":msg.startsWith("⚠")?T.orange+"22":T.red+"22",
            border:`1px solid ${msg.startsWith("✅")?T.green:msg.startsWith("⚠")?T.orange:T.red}`,
            color:msg.startsWith("✅")?T.green:msg.startsWith("⚠")?T.orange:T.red}}>
            {msg}
          </div>
        )}

        {/* ── Tab: Backup Manual ── */}
        {tab==="backup"&&(
          <div>
            <div style={{fontSize:13,color:T.dim,marginBottom:16,lineHeight:1.7}}>
              Salve todos os seus dados em um arquivo <strong style={{color:T.text}}>.json</strong>. Funciona offline, sem precisar de conta. Guarde no computador, pendrive ou Google Drive.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={doExport}
                style={sb({background:T.green,color:"#000",padding:"13px 16px",display:"flex",alignItems:"center",gap:8,justifyContent:"center",fontSize:14})}>
                📥 Baixar Backup · {clients.length} eventos
              </button>
              <label style={{...sb({background:T.blue+"22",color:T.blue,padding:"13px 16px",display:"flex",alignItems:"center",gap:8,justifyContent:"center",fontSize:14,border:`1px solid ${T.blue}44`}),cursor:"pointer"}}>
                📤 Restaurar de um Arquivo...
                <input type="file" accept=".json" style={{display:"none"}} onChange={e=>doImport(e.target.files[0])}/>
              </label>
              <div style={{borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",gap:8}}>
                <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer"
                  style={{...sb({background:T.card2,color:T.text,border:`1px solid ${T.border}`,textDecoration:"none",display:"flex",alignItems:"center",gap:6,justifyContent:"center",flex:1})}}>
                  🌐 Abrir Google Drive
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Google Drive OAuth ── */}
        {tab==="drive"&&(
          <div>
            {isFile?(
              <div style={{padding:16,borderRadius:10,background:T.orange+"11",border:`1px solid ${T.orange}`,marginBottom:12}}>
                <div style={{fontWeight:700,color:T.orange,marginBottom:6,fontSize:14}}>⚠️ App aberto como arquivo local</div>
                <div style={{fontSize:13,color:T.dim,lineHeight:1.6}}>
                  A integração automática requer <code style={{color:T.gold,background:T.card2,padding:"1px 5px",borderRadius:4}}>http://</code> ou <code style={{color:T.gold,background:T.card2,padding:"1px 5px",borderRadius:4}}>https://</code>. Por isso, o Drive só funciona quando o app é servido por um servidor web.<br/><br/>
                  <strong style={{color:T.text}}>Solução fácil:</strong> Use a aba <strong style={{color:T.gold}}>Backup</strong> para exportar o .json e arraste para o Drive. Veja o <strong style={{color:T.gold,cursor:"pointer"}} onClick={()=>setTab("guide")}>Tutorial</strong>.
                </div>
              </div>
            ):(
              <div>
                <div style={{fontSize:13,color:T.dim,marginBottom:14,lineHeight:1.6}}>
                  Configure uma vez com seu Client ID e sincronize com um clique. Veja o <strong style={{color:T.gold,cursor:"pointer"}} onClick={()=>setTab("guide")}>Tutorial</strong> para criar o Client ID gratuito.
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:T.dim,display:"block",marginBottom:4}}>OAuth 2.0 Client ID</label>
                  <input placeholder="ex: 123456789-abc.apps.googleusercontent.com" value={clientId}
                    onChange={e=>setClientId(e.target.value)} style={si()}/>
                </div>
                {!token?(
                  <button onClick={connectDrive} disabled={isBusy}
                    style={sb({background:"#4285F4",color:"#fff",padding:"13px 16px",width:"100%",opacity:isBusy?.6:1,fontSize:14})}>
                    {status==="loading"?"⏳ Conectando...":"🔗 Conectar ao Google Drive"}
                  </button>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{textAlign:"center",color:T.green,fontWeight:700,fontSize:14}}>✅ Drive conectado!</div>
                    <button onClick={saveDrive} disabled={isBusy}
                      style={sb({background:T.green,color:"#000",padding:"13px 16px",fontSize:14,opacity:isBusy?.6:1})}>
                      {status==="saving"?"⏳ Salvando...":"☁️ Salvar no Google Drive"}
                    </button>
                    <button onClick={loadDrive} disabled={isBusy}
                      style={sb({background:T.blue+"22",color:T.blue,border:`1px solid ${T.blue}44`,padding:"13px 16px",fontSize:14,opacity:isBusy?.6:1})}>
                      {status==="loading_drive"?"⏳ Carregando...":"📥 Carregar do Google Drive"}
                    </button>
                    <button onClick={()=>setToken(null)}
                      style={sb({background:T.red+"22",color:T.red,padding:"8px 16px",fontSize:12})}>
                      Desconectar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Tutorial ── */}
        {tab==="guide"&&(
          <div>
            <div style={{fontWeight:700,color:T.green,marginBottom:10,fontSize:13}}>Opção 1 — Backup Manual (funciona sempre, offline)</div>
            {[["1","Clique em ☁️ Drive no topo do app"],["2","Vá para a aba 💾 Backup"],["3","Clique em Baixar Backup"],["4","Abra o Google Drive e arraste o arquivo baixado"],["5","Pronto! Arquivo salvo na nuvem"]].map(([n,t])=>(
              <div key={n} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <span style={{background:T.green,color:"#000",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{n}</span>
                <span style={{fontSize:13,color:T.dim,lineHeight:1.5,paddingTop:2}}>{t}</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${T.border}`,margin:"16px 0"}}/>
            <div style={{fontWeight:700,color:"#4285F4",marginBottom:10,fontSize:13}}>Opção 2 — Sincronização Automática (Drive API)</div>
            {[
              ["1","Acesse console.cloud.google.com e crie um projeto"],
              ["2","Vá em Biblioteca → ative Google Drive API"],
              ["3","Vá em Credenciais → Criar credencial → ID do cliente OAuth 2.0 → Aplicativo da web"],
              ["4","Em Origens autorizadas, adicione a URL onde o app está hospedado"],
              ["5","Copie o Client ID gerado"],
              ["6","Cole na aba ☁️ Google Drive deste app e clique em Conectar"],
            ].map(([n,t])=>(
              <div key={n} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <span style={{background:"#4285F4",color:"#fff",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{n}</span>
                <span style={{fontSize:13,color:T.dim,lineHeight:1.5,paddingTop:2}}>{t}</span>
              </div>
            ))}
            <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer"
              style={{...sb({background:"#4285F4",color:"#fff",textDecoration:"none",display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginTop:8,padding:"12px 16px"})}}>
              🔧 Abrir Google Cloud Console
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── ClientCard ─────────────────────────── */
function ClientCard({c, onSelect}) {
  const [hov,setHov] = useState(false);
  const badge  = getStatus(c);
  const pct    = c.vf ? Math.min(100,(c.vp/c.vf)*100) : 0;
  const totalG = c.gastos.reduce((s,g)=>s+g.val,0);
  const result = c.vf!=null ? c.vp-totalG : null;
  return (
    <div onClick={onSelect} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={sc({cursor:"pointer",borderColor:hov?T.gold:T.border,transform:hov?"translateY(-2px)":"none",transition:"all .2s"})}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div style={{flex:1,marginRight:8}}>
          <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:2}}>{c.nome}</div>
          <div style={{fontSize:12,color:T.dim}}>{c.data} · {c.bairro||"Local não informado"}</div>
        </div>
        <span style={{fontSize:11,fontWeight:600,color:badge.color,background:badge.color+"22",padding:"2px 8px",borderRadius:99,flexShrink:0}}>
          {badge.label}
        </span>
      </div>
      {c.tipo&&c.tipo!=="—"&&<div style={{fontSize:12,color:T.blue,marginBottom:6}}>{c.tipo}</div>}
      {c.vf&&(
        <>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.dim,marginBottom:4}}>
            <span>{fmt(c.vf)}</span><span>Rec: {fmt(c.vp)}</span>
          </div>
          <div style={{background:T.border,borderRadius:3,height:4,overflow:"hidden",marginBottom:c.gastos.length>0?6:0}}>
            <div style={{width:`${pct}%`,height:"100%",background:pct>=100?T.green:T.blue,transition:"width .3s"}}/>
          </div>
        </>
      )}
      {result!=null&&(
        <div style={{fontSize:12,fontWeight:700,color:result>=0?T.green:T.red,marginTop:4}}>
          {result>=0?"▲":"▼"} {fmt(Math.abs(result))}
          {totalG>0&&<span style={{fontWeight:400,color:T.dim,fontSize:11}}> (após gastos)</span>}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── ClientFormModal ─────────────────────────── */
function ClientFormModal({initial,onSave,onClose,title}) {
  const [f,setF] = useState(initial);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const valid = f.nome?.trim() && f.data?.trim();
  const fields = [
    {k:"nome",  label:"Nome *",                type:"text"},
    {k:"tel",   label:"Telefone",              type:"tel"},
    {k:"bairro",label:"Bairro / Local",        type:"text"},
    {k:"data",  label:"Data (DD/MM/AAAA) *",   type:"text",  ph:"20/06/2026"},
    {k:"tipo",  label:"Tipo de Festa",         type:"text"},
    {k:"vf",    label:"Valor do Contrato (R$)",type:"number"},
    {k:"vp",    label:"Já Recebido (R$)",      type:"number"},
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,overflowY:"auto",padding:"20px 16px"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={sc({width:"100%",maxWidth:440,margin:"0 auto"})}>
        <div style={{fontWeight:800,fontSize:18,color:T.gold,marginBottom:16}}>{title}</div>
        {fields.map(({k,label,type,ph})=>(
          <div key={k} style={{marginBottom:10}}>
            <label style={{fontSize:12,color:T.dim,display:"block",marginBottom:4}}>{label}</label>
            <input type={type} value={f[k]??""} placeholder={ph||""}
              onChange={e=>set(k,type==="number"?(e.target.value===""?null:+e.target.value):e.target.value)}
              style={si()}/>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button onClick={()=>valid&&onSave(f)}
            style={sb({flex:1,background:valid?T.gold:"#333",color:valid?"#000":T.dim})}>
            Salvar
          </button>
          <button onClick={onClose}
            style={sb({background:T.card2,color:T.text,border:`1px solid ${T.border}`})}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── APP PRINCIPAL ─────────────────────────── */
export default function Celebrar() {
  const [clients,setClients] = useState(SEED);
  const [view,   setView]    = useState("dash");
  const [selId,  setSelId]   = useState(null);
  const [search, setSearch]  = useState("");
  const [monthF, setMonthF]  = useState("");
  const [ready,  setReady]   = useState(false);
  const [showAdd,setShowAdd] = useState(false);
  const [editC,  setEditC]   = useState(null);
  const [expDesc,setExpDesc] = useState("");
  const [expVal, setExpVal]  = useState("");
  const [confirm,   setConfirm]    = useState(null);
  const [showDrive, setShowDrive]  = useState(false);
  const [lastBackup,setLastBackup] = useState(()=>{ try{return localStorage.getItem("celebrar-last-backup")||null;}catch{return null;} });

  useEffect(()=>{setExpDesc("");setExpVal("");},[selId]);

  /* Storage */
  useEffect(()=>{
    (async()=>{
      try{
        const r = localStorage.getItem("celebrar-v3") ? {value: localStorage.getItem("celebrar-v3")} : null;
        if(r?.value){const d=JSON.parse(r.value);setClients(d.map(c=>({...c,gastos:c.gastos||[]})));}
      }catch{}
      setReady(true);
    })();
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try{localStorage.setItem("celebrar-v3",JSON.stringify(clients));}catch{}
  },[clients,ready]);

  /* Derivados */
  const sel      = clients.find(c=>c.id===selId)||null;
  const now      = new Date();
  const totalVF  = clients.reduce((a,c)=>a+(c.vf||0),0);
  const totalVP  = clients.reduce((a,c)=>a+(c.vp||0),0);
  const totalGAll= clients.reduce((a,c)=>a+c.gastos.reduce((s,g)=>s+g.val,0),0);
  const aReceber = clients.reduce((a,c)=>c.vf?a+Math.max(0,c.vf-c.vp):a,0);
  const monthKeys= [...new Set(clients.map(c=>c.data.slice(3)))].sort();
  const byMonth  = {};
  clients.forEach(c=>{const k=c.data.slice(3);if(!byMonth[k])byMonth[k]={count:0,vf:0};byMonth[k].count++;byMonth[k].vf+=(c.vf||0);});
  const maxCount = Math.max(...Object.values(byMonth).map(v=>v.count));
  const filtered = clients
    .filter(c=>{if(!search)return true;const q=search.toLowerCase();return c.nome.toLowerCase().includes(q)||(c.bairro||"").toLowerCase().includes(q);})
    .filter(c=>!monthF||c.data.slice(3)===monthF)
    .sort((a,b)=>toDate(a.data)-toDate(b.data));
  const upcoming = [...clients].filter(c=>toDate(c.data)>=now).sort((a,b)=>toDate(a.data)-toDate(b.data)).slice(0,8);
  const incomplete= clients.filter(c=>!c.vf||!c.tel||!c.bairro);

  /* Mutações */
  const addGasto=()=>{
    if(!expDesc.trim()||!expVal||isNaN(+expVal)||+expVal<=0)return;
    setClients(cs=>cs.map(c=>c.id===selId?{...c,gastos:[...c.gastos,{id:uid(),desc:expDesc.trim(),val:+expVal}]}:c));
    setExpDesc("");setExpVal("");
  };
  const delGasto=gid=>setClients(cs=>cs.map(c=>c.id===selId?{...c,gastos:c.gastos.filter(g=>g.id!==gid)}:c));
  const saveEdit=upd=>{setClients(cs=>cs.map(c=>c.id===upd.id?{...upd,gastos:c.gastos}:c));setEditC(null);};
  const addClient=nc=>{setClients(cs=>[...cs,{...nc,id:uid(),gastos:[]}]);setShowAdd(false);};
  const delClient=id=>{setClients(cs=>cs.filter(c=>c.id!==id));setSelId(null);setConfirm(null);};

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div style={{background:T.bg,minHeight:"100vh",color:T.text,fontFamily:"'Inter',system-ui,sans-serif"}}>

      {/* ───── HEADER ───── */}
      <header style={{background:T.card,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 20px rgba(0,0,0,.4)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",gap:12,height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <span style={{fontSize:22}}>🎉</span>
            <span style={{fontWeight:900,fontSize:20,background:`linear-gradient(90deg,${T.gold},${T.pink})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:1}}>CELEBRAR</span>
          </div>
          <div style={{display:"flex",gap:4,flex:1}}>
            {[["dash","📊 Dashboard"],["clients","🎈 Eventos"]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={sb({background:view===v?T.gold:"transparent",color:view===v?"#000":T.dim,padding:"6px 14px"})}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={()=>setShowDrive(true)} style={sb({background:lastBackup?"#1a3a1a":"#2a1a1a",color:lastBackup?T.green:T.orange,border:`1px solid ${lastBackup?T.green+"44":T.orange+"44"}`,flexShrink:0,display:"flex",alignItems:"center",gap:5})}>
            ☁️ Drive
          </button>
          <button onClick={()=>setShowAdd(true)} style={sb({background:T.gold,color:"#000",flexShrink:0})}>
            + Novo
          </button>
        </div>
      </header>

      {/* ═══════════════ DASHBOARD ═══════════════ */}
      {view==="dash"&&(
        <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>

          {/* KPIs */}
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
            {[
              {l:"Total Contratado", v:fmt(totalVF),  sub:`${clients.length} eventos`,                                              col:T.gold  },
              {l:"Já Recebido",      v:fmt(totalVP),  sub:`${totalVF?((totalVP/totalVF)*100).toFixed(1):0}% do total`,              col:T.green },
              {l:"A Receber",        v:fmt(aReceber), sub:"saldo pendente",                                                          col:T.orange},
              {l:"Gastos Lançados",  v:fmt(totalGAll),sub:"extras registrados",                                                      col:T.red   },
            ].map(({l,v,sub,col})=>(
              <div key={l} style={sc({flex:"1 1 175px"})}>
                <div style={{fontSize:10,color:T.dim,textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>{l}</div>
                <div style={{fontSize:22,fontWeight:800,color:col}}>{v}</div>
                <div style={{fontSize:11,color:T.dim,marginTop:2}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Barra de recebimento geral */}
          {totalVF>0&&(
            <div style={sc({marginBottom:16})}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.dim}}>Progresso Geral de Recebimentos</span>
                <span style={{fontWeight:700,color:T.green}}>{((totalVP/totalVF)*100).toFixed(1)}%</span>
              </div>
              <div style={{background:T.border,borderRadius:6,height:10,overflow:"hidden"}}>
                <div style={{width:`${(totalVP/totalVF)*100}%`,height:"100%",background:`linear-gradient(90deg,${T.blue},${T.green})`,borderRadius:6,transition:"width .5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.dim,marginTop:4}}>
                <span>Recebido: {fmt(totalVP)}</span><span>Total: {fmt(totalVF)}</span>
              </div>
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:16}}>

            {/* Gráfico de barras por mês */}
            <div style={sc()}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>📅 Eventos por Mês</div>
              {Object.entries(byMonth).sort(([a],[b])=>a<b?-1:1).map(([k,v])=>(
                <div key={k} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                    <span style={{fontWeight:600}}>{ML[k]||k}</span>
                    <span style={{color:T.dim}}>{v.count} festa{v.count!==1?"s":""} · {fmt(v.vf)}</span>
                  </div>
                  <div style={{background:T.border,borderRadius:4,height:7,overflow:"hidden"}}>
                    <div style={{width:`${(v.count/maxCount)*100}%`,height:"100%",background:`linear-gradient(90deg,${T.blue},${T.gold})`,borderRadius:4,transition:"width .4s"}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Próximas festas */}
            <div style={sc()}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>🔔 Próximas Festas</div>
              {upcoming.length===0&&<div style={{color:T.dim,fontSize:13}}>Nenhum evento futuro.</div>}
              {upcoming.map(c=>{
                const badge=getStatus(c);
                const diff=Math.ceil((toDate(c.data)-now)/86400000);
                const urgente=diff<=7;
                return(
                  <div key={c.id} onClick={()=>{setSelId(c.id);setView("clients");}}
                    style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{c.nome}</div>
                      <div style={{fontSize:11,color:T.dim}}>{c.data}{c.bairro?` · ${c.bairro}`:""}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                      <div style={{fontSize:11,color:badge.color,fontWeight:600}}>{badge.label}</div>
                      <div style={{fontSize:11,color:urgente?T.orange:T.dim,fontWeight:urgente?700:400}}>
                        {diff===0?"🎉 Hoje!":diff===1?"⚡ Amanhã!":diff<=7?`⏰ ${diff}d`:`em ${diff}d`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerta de dados incompletos */}
          {incomplete.length>0&&(
            <div style={sc({borderColor:T.orange,background:T.orange+"11"})}>
              <div style={{fontWeight:700,color:T.orange,marginBottom:6,fontSize:13}}>⚠️ {incomplete.length} registros com dados incompletos</div>
              <div style={{fontSize:12,color:T.dim,lineHeight:1.8}}>
                {incomplete.map(c=>(
                  <span key={c.id} onClick={()=>{setSelId(c.id);setView("clients");}}
                    style={{cursor:"pointer",marginRight:12,textDecoration:"underline",textDecorationStyle:"dotted"}}
                    onMouseEnter={e=>e.target.style.color=T.gold} onMouseLeave={e=>e.target.style.color=T.dim}>
                    {c.nome}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ EVENTOS ═══════════════ */}
      {view==="clients"&&(
        <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <input placeholder="🔍 Buscar nome ou bairro…" value={search} onChange={e=>setSearch(e.target.value)}
              style={si({maxWidth:280,width:"auto",flex:"1 1 200px"})}/>
            <select value={monthF} onChange={e=>setMonthF(e.target.value)}
              style={si({width:"auto",flex:"0 0 150px"})}>
              <option value="">Todos os meses</option>
              {monthKeys.map(k=><option key={k} value={k}>{ML[k]||k}</option>)}
            </select>
            <span style={{fontSize:12,color:T.dim,flexShrink:0}}>{filtered.length} evento{filtered.length!==1?"s":""}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
            {filtered.map(c=><ClientCard key={c.id} c={c} onSelect={()=>setSelId(c.id)}/>)}
          </div>
        </div>
      )}

      {/* ═══════════════ MODAL DETALHE ═══════════════ */}
      {selId&&sel&&(()=>{
        const totalG  = sel.gastos.reduce((s,g)=>s+g.val,0);
        const aRec    = sel.vf!=null?Math.max(0,sel.vf-sel.vp):null;
        const result  = sel.vf!=null?sel.vp-totalG:null;
        const isLucro = result!=null&&result>=0;
        const pct     = sel.vf?Math.min(100,(sel.vp/sel.vf)*100):0;
        const badge   = getStatus(sel);
        const waUrl   = sel.tel?`https://wa.me/55${sel.tel}`:null;
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("🎉 "+sel.nome)}&dates=${gcalDate(sel.data)}/${gcalDate(sel.data)}&details=${encodeURIComponent(`Tipo: ${sel.tipo||"—"}\nLocal: ${sel.bairro||"—"}\nContrato: ${fmt(sel.vf)}`)}&location=${encodeURIComponent((sel.bairro||"")+", Rio de Janeiro")}`;
        const mapsUrl = sel.bairro?`https://www.google.com/maps/search/${encodeURIComponent(sel.bairro+", Rio de Janeiro")}`:null;
        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:100,overflowY:"auto",padding:"20px 16px"}}
            onClick={e=>{if(e.target===e.currentTarget)setSelId(null);}}>
            <div style={sc({width:"100%",maxWidth:500,margin:"0 auto 20px",position:"relative"})}>

              {/* Fechar */}
              <button onClick={()=>setSelId(null)}
                style={sb({position:"absolute",top:10,right:10,background:"transparent",color:T.dim,padding:"4px 10px",fontSize:22,lineHeight:1})}>×</button>

              {/* Cabeçalho */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.dim,letterSpacing:1,marginBottom:4}}>{sel.data}</div>
                <div style={{fontWeight:800,fontSize:22,color:T.text,marginBottom:7,paddingRight:36}}>{sel.nome}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  {sel.tipo&&sel.tipo!=="—"&&<span style={{fontSize:12,color:T.blue,background:T.blue+"22",padding:"2px 8px",borderRadius:99}}>{sel.tipo}</span>}
                  {sel.bairro&&<span style={{fontSize:12,color:T.dim}}>📍 {sel.bairro}</span>}
                  <span style={{fontSize:12,color:badge.color,background:badge.color+"22",padding:"2px 8px",borderRadius:99,fontWeight:600}}>{badge.label}</span>
                </div>
                {sel.tel&&<div style={{fontSize:12,color:T.dim,marginTop:7}}>📞 {sel.tel}</div>}
              </div>

              {/* Botões de ação */}
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                {waUrl&&<a href={waUrl} target="_blank" rel="noopener noreferrer"
                  style={sb({background:"#25D366",color:"#fff",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4})}>💬 WhatsApp</a>}
                <a href={gcalUrl} target="_blank" rel="noopener noreferrer"
                  style={sb({background:"#4285F4",color:"#fff",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4})}>📅 Lembrete</a>
                {mapsUrl&&<a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  style={sb({background:T.card2,color:T.text,border:`1px solid ${T.border}`,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4})}>🗺️ Maps</a>}
              </div>

              <hr style={{borderColor:T.border,margin:"0 0 14px"}}/>

              {/* Financeiro */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.dim,textTransform:"uppercase",letterSpacing:1,fontWeight:700,marginBottom:10}}>Financeiro</div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:T.dim}}>Valor do Contrato</span>
                  <span style={{fontSize:14,fontWeight:700,color:T.gold}}>{fmt(sel.vf)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:T.dim}}>Já Recebido</span>
                  <span style={{fontSize:14,fontWeight:700,color:T.green}}>{fmt(sel.vp)}</span>
                </div>
                {sel.vf&&(
                  <div style={{marginBottom:8}}>
                    <div style={{background:T.border,borderRadius:4,height:7,overflow:"hidden"}}>
                      <div style={{width:`${pct}%`,height:"100%",background:pct>=100?T.green:T.blue,transition:"width .4s"}}/>
                    </div>
                    <div style={{fontSize:11,color:T.dim,textAlign:"right",marginTop:3}}>{pct.toFixed(0)}% recebido</div>
                  </div>
                )}
                {aRec!=null&&(
                  <div style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:aRec>0?T.orange+"11":T.green+"11",borderRadius:8,border:`1px solid ${aRec>0?T.orange:T.green}44`}}>
                    <span style={{fontSize:13,color:T.dim}}>A Receber</span>
                    <span style={{fontSize:14,fontWeight:700,color:aRec>0?T.orange:T.green}}>{fmt(aRec)}</span>
                  </div>
                )}
              </div>

              {/* Gastos */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.dim,textTransform:"uppercase",letterSpacing:1,fontWeight:700,marginBottom:10}}>Gastos Extras</div>
                {sel.gastos.length===0&&<div style={{fontSize:13,color:T.dim,marginBottom:8,fontStyle:"italic"}}>Nenhum gasto lançado ainda.</div>}
                {sel.gastos.map(g=>(
                  <div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontSize:13,color:T.text,flex:1}}>{g.desc}</span>
                    <span style={{fontSize:13,fontWeight:700,color:T.red,marginLeft:12}}>{fmt(g.val)}</span>
                    <button onClick={()=>delGasto(g.id)}
                      style={sb({padding:"2px 8px",background:T.red+"22",color:T.red,fontSize:12,marginLeft:8})}>✕</button>
                  </div>
                ))}
                {totalG>0&&(
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:6,borderTop:`1px solid ${T.border}`}}>
                    <span style={{fontSize:13,color:T.dim,fontWeight:600}}>Total Gastos</span>
                    <span style={{fontSize:14,fontWeight:700,color:T.red}}>{fmt(totalG)}</span>
                  </div>
                )}
                {/* Adicionar gasto */}
                <div style={{display:"flex",gap:6,marginTop:12}}>
                  <input placeholder="Descrição do gasto" value={expDesc} onChange={e=>setExpDesc(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addGasto()} style={si({flex:1})}/>
                  <input placeholder="R$" value={expVal} onChange={e=>setExpVal(e.target.value)} type="number" min="0"
                    onKeyDown={e=>e.key==="Enter"&&addGasto()} style={si({width:80})}/>
                  <button onClick={addGasto} style={sb({background:T.gold,color:"#000",flexShrink:0,fontWeight:800,padding:"8px 14px"})}>+</button>
                </div>
              </div>

              {/* Resultado */}
              {result!=null&&(
                <div style={{padding:18,borderRadius:12,background:(isLucro?T.green:T.red)+"1a",border:`2px solid ${isLucro?T.green:T.red}`,marginBottom:14,textAlign:"center"}}>
                  <div style={{fontSize:10,color:T.dim,marginBottom:5,letterSpacing:2,textTransform:"uppercase"}}>Resultado da Festa</div>
                  <div style={{fontSize:26,fontWeight:900,color:isLucro?T.green:T.red,marginBottom:4}}>
                    {isLucro?"▲ LUCRO":"▼ PREJUÍZO"}
                  </div>
                  <div style={{fontSize:22,fontWeight:800,color:isLucro?T.green:T.red}}>{fmt(Math.abs(result))}</div>
                  <div style={{fontSize:11,color:T.dim,marginTop:5,lineHeight:1.6}}>
                    Recebido {fmt(sel.vp)} − Gastos {fmt(totalG)} = {fmt(result)}
                  </div>
                </div>
              )}

              {/* Editar / Excluir */}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditC({...sel})}
                  style={sb({flex:1,background:T.blue+"22",color:T.blue,border:`1px solid ${T.blue}44`})}>✏️ Editar</button>
                <button onClick={()=>setConfirm({msg:`Excluir ${sel.nome}?`,onYes:()=>delClient(sel.id)})}
                  style={sb({background:T.red+"22",color:T.red,border:`1px solid ${T.red}44`})}>🗑️ Excluir</button>
              </div>
            </div>
          </div>
        );
      })()}

      {showDrive&&<DriveModal clients={clients} onImport={setClients} onClose={()=>setShowDrive(false)} lastBackup={lastBackup} setLastBackup={setLastBackup}/>}
      {showAdd&&<ClientFormModal initial={{nome:"",tel:"",bairro:"",data:"",tipo:"",vf:null,vp:0}} onSave={addClient} onClose={()=>setShowAdd(false)} title="✨ Novo Cliente"/>}
      {editC&&<ClientFormModal initial={editC} onSave={saveEdit} onClose={()=>setEditC(null)} title="✏️ Editar Cliente"/>}

      {/* ═════ CONFIRM DIALOG ═════ */}
      {confirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={sc({maxWidth:340,textAlign:"center"})}>
            <div style={{fontSize:32,marginBottom:10}}>⚠️</div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{confirm.msg}</div>
            <div style={{fontSize:13,color:T.dim,marginBottom:16}}>Esta ação não pode ser desfeita.</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={confirm.onYes} style={sb({flex:1,background:T.red,color:"#fff"})}>Excluir</button>
              <button onClick={()=>setConfirm(null)} style={sb({flex:1,background:T.card2,color:T.text,border:`1px solid ${T.border}`})}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
