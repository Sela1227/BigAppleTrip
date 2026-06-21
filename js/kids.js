// ══════════════════════════════════════════════════════════════
// kids.js — 邏輯層（需先載入 kids.data.js）
// ══════════════════════════════════════════════════════════════
// ══ SAFE STORAGE (works even when localStorage is blocked) ════
const mem={};
function storeGet(key,fallback){
  try{ const v=localStorage.getItem(key); return v!==null?v:(mem[key]??fallback); }
  catch(e){ return mem[key]??fallback; }
}
function storeSet(key,val){
  mem[key]=val;
  try{ localStorage.setItem(key,val); }catch(e){}
}

// ══ STATE ═════════════════════════════════════════════════════
let kidNames=JSON.parse(storeGet('nyc-kidnames','["寶貝 1","寶貝 2"]'));
let kidAvatars=JSON.parse(storeGet('nyc-kidavatars','[{"face":0,"skin":1,"hair":0,"hairColor":0,"brow":0,"eyes":0,"nose":2,"mouth":0,"acc":0},{"face":0,"skin":2,"hair":5,"hairColor":1,"brow":1,"eyes":2,"nose":2,"mouth":0,"acc":0}]'));
// migrate old/partial avatars -> ensure config objects with all keys
kidAvatars=kidAvatars.map((a,i)=>{
  const def=(i===0)?{face:0,skin:1,hair:0,hairColor:0,brow:0,eyes:0,nose:2,mouth:0,acc:0}:{face:0,skin:2,hair:5,hairColor:1,brow:1,eyes:2,nose:2,mouth:0,acc:0};
  return (typeof a==='object'&&a!==null) ? Object.assign({},def,a) : def;
});
let currentKid=parseInt(storeGet('nyc-curkid','0'))||0;
const SPEECH_OK=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
let currentSpot=null;
let pendingPhotoData=null;

// per-kid namespaced storage
function kk(base){ return base+'-k'+currentKid; }
let stamped=[], quizDone=[], photos={}, journals={}, quizAns={}, huntPhotos={};
function loadKidState(){
  stamped=JSON.parse(storeGet(kk('nyc-stamped'),'[]'));
  quizDone=JSON.parse(storeGet(kk('nyc-quiz'),'[]'));
  photos=JSON.parse(storeGet(kk('nyc-photos'),'{}'));
  journals=JSON.parse(storeGet(kk('nyc-journals'),'{}'));
  huntPhotos=JSON.parse(storeGet(kk('nyc-huntphoto'),'{}'));
  quizAns=JSON.parse(storeGet(kk('nyc-quizans'),'{}'));
}
loadKidState();

function save(){
  storeSet(kk('nyc-stamped'),JSON.stringify(stamped));
  storeSet(kk('nyc-quiz'),JSON.stringify(quizDone));
  storeSet(kk('nyc-photos'),JSON.stringify(photos));
}
function saveJournals(){ storeSet(kk('nyc-journals'),JSON.stringify(journals)); }

function switchKid(k){
  if(k===currentKid)return;
  currentKid=k;
  storeSet('nyc-curkid',String(k));
  loadKidState();
  renderKidSwitcher();
  renderHome();
}
function renderKidSwitcher(){
  const wrap=document.getElementById('kid-switcher');
  if(!wrap)return;
  wrap.innerHTML=[0,1].map(k=>`
    <button class="kid-chip${k===currentKid?' active':''}" onclick="switchKid(${k})">
      <span class="kid-av">${buildAvatar(kidAvatars[k],30)}</span><span class="kid-nm">${kidNames[k]}</span>
    </button>`).join('')+
    `<button class="kid-edit-btn" onclick="openKidEdit(${currentKid})" title="編輯"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M13.5 6.5l3 3"/></svg></button>`;
}
// ══ AVATAR (custom face builder) ══════════════════════════════
const AV_SKIN=['#FCE3C8','#F7CDA1','#EAB384','#CE9263','#A06E47'];
const AV_SKINSH=['#EBC9A6','#E6B584','#D69A6A','#B97C4E','#8A5A38'];
const AV_HAIRC=['#3A2E27','#6B4423','#A9742E','#E3BE54','#C94A33','#5183C9','#E372A8'];
const AV_NOSEC='rgba(150,95,70,0.45)';
let _avuid=0;
const AV_CATS=[['face','臉型',6,'shape'],['skin','膚色',5,'color',AV_SKIN],['hair','髮型',16,'shape'],['hairColor','髮色',7,'color',AV_HAIRC],['brow','眉毛',8,'shape'],['eyes','眼睛',16,'shape'],['nose','鼻子',5,'shape'],['mouth','嘴巴',8,'shape'],['acc','配件',6,'shape']];
function avLighten(hex){let h=hex.replace('#','');let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);r=Math.min(255,r+(255-r)*0.25|0);g=Math.min(255,g+(255-g)*0.25|0);b=Math.min(255,b+(255-b)*0.25|0);return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');}
function avDarken(hex,f){f=f||0.18;let h=hex.replace('#','');let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);r=r*(1-f)|0;g=g*(1-f)|0;b=b*(1-f)|0;return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');}
function avFace(i,uid){
 const TOP='M14,52 C12,28 28,16 50,16 C72,16 88,28 86,52';
 const B=[' C86,80 70,95 50,95 C30,95 14,80 14,52 Z',' C86,84 69,98 50,98 C31,98 14,84 14,52 Z',' L86,76 Q86,94 70,94 L30,94 Q14,94 14,76 Z',' C86,78 66,96 50,98 C34,96 14,78 14,52 Z',' C88,82 71,96 50,96 C29,96 12,82 14,52 Z',' C85,88 66,99 50,99 C34,99 15,88 14,52 Z'];
 const d=TOP+(B[i]||B[0]);
 return `<path d="${d}" fill="url(#sk${uid})"/><ellipse cx="50" cy="36" rx="26" ry="16" fill="#fff" opacity="0.10"/><ellipse cx="50" cy="88" rx="22" ry="9" fill="url(#sh${uid})" opacity="0.4"/>`;
}
function avBrow(i,c){return [
 `<rect x="32" y="47" width="13" height="3.4" rx="1.7" fill="${c}"/><rect x="55" y="47" width="13" height="3.4" rx="1.7" fill="${c}"/>`,
 `<path d="M32,49 Q38,45 45,48" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M68,49 Q62,45 55,48" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
 `<path d="M32,45 L45,49 L45,46 L32,42 Z" fill="${c}"/><path d="M68,45 L55,49 L55,46 L68,42 Z" fill="${c}"/>`,
 `<rect x="32" y="46" width="13" height="4.8" rx="2.4" fill="${c}"/><rect x="55" y="46" width="13" height="4.8" rx="2.4" fill="${c}"/>`,
 `<rect x="33" y="48" width="12" height="2.2" rx="1.1" fill="${c}"/><rect x="55" y="48" width="12" height="2.2" rx="1.1" fill="${c}"/>`,
 `<path d="M33,47 Q39,49.5 45,48.5" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M67,47 Q61,49.5 55,48.5" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
 `<path d="M32,48.5 L45,45 L45,48 L32,51.5 Z" fill="${c}"/><path d="M68,48.5 L55,45 L55,48 L68,51.5 Z" fill="${c}"/>`,
 ''
][i]||'';}
function avHairBack(i,c){return ['','','','','','',
 `<path d="M7,60 Q0,94 18,97 L28,97 Q19,74 21,54 Z M93,60 Q100,94 82,97 L72,97 Q81,74 79,54 Z" fill="${c}"/>`,
 `<path d="M82,34 Q99,40 96,64 Q93,80 82,76 Q92,58 78,44 Z" fill="${c}"/>`,
 `<path d="M12,52 Q-2,58 3,80 Q8,94 19,86 Q7,68 22,56 Z M88,52 Q102,58 97,80 Q92,94 81,86 Q93,68 78,56 Z" fill="${c}"/>`,
 `<circle cx="50" cy="11" r="10" fill="${c}"/>`,
 `<path d="M7,58 Q1,82 9,96 Q13,84 13,74 Q11,88 21,95 Q19,74 22,56 Z M93,58 Q99,82 91,96 Q87,84 87,74 Q89,88 79,95 Q81,74 78,56 Z" fill="${c}"/>`,
 '','','',
 `<path d="M8,60 Q3,90 17,95 L25,95 Q18,72 21,55 Z M92,60 Q97,90 83,95 L75,95 Q82,72 79,55 Z" fill="${c}"/>`,
 ''
][i]||'';}
function avHair(i,c){return [
 `<path d="M10,66 C7,36 16,12 50,11 C84,12 93,36 90,66 C89,55 84,49 78,50 L74,44 L70,51 L64,43 L59,51 L53,42 L47,51 L41,43 L36,51 L30,44 L26,50 C20,49 12,54 10,66 Z" fill="${c}"/>`,
 `<path d="M10,66 C7,35 16,12 50,11 C84,12 93,35 90,66 C89,54 83,49 76,50 C66,42 40,40 30,49 C26,43 20,42 16,49 C13,52 11,58 10,66 Z" fill="${c}"/>`,
 `<path d="M10,66 C7,35 16,12 50,11 C84,12 93,35 90,66 C89,54 82,49 74,50 C66,44 56,45 52,52 L50,46 L48,52 C44,45 34,44 26,50 C19,49 12,54 10,66 Z" fill="${c}"/>`,
 `<path d="M10,66 C7,34 16,11 50,10 C84,11 93,34 90,66 C89,52 84,47 76,47 C64,46 58,49 50,49 C42,49 36,46 24,47 C16,47 11,52 10,66 Z" fill="${c}"/>`,
 `<path d="M10,64 C9,40 12,18 50,16 C88,18 91,40 90,64 C89,52 84,47 78,48 L80,33 L72,46 L70,30 L61,45 L58,29 L50,44 L42,29 L39,45 L30,30 L28,46 L20,33 L22,48 C16,47 11,52 10,64 Z" fill="${c}"/>`,
 `<path d="M9,72 C6,32 16,10 50,9 C84,10 94,32 91,72 C90,76 86,74 85,68 C83,52 80,48 74,49 C64,42 38,42 28,49 C22,48 18,52 16,68 C15,74 11,76 9,72 Z" fill="${c}"/>`,
 `<path d="M9,68 C6,33 16,10 50,9 C84,10 94,33 91,68 C90,54 84,48 76,49 C66,41 40,41 30,49 C24,43 14,52 9,68 Z" fill="${c}"/>`,
 `<path d="M11,64 C8,34 16,12 50,11 C84,12 92,34 89,64 C88,52 82,47 76,48 C66,41 40,41 30,48 C24,42 14,52 11,64 Z" fill="${c}"/><circle cx="82" cy="37" r="3.5" fill="#E5503A"/>`,
 `<path d="M11,62 C8,33 16,12 50,11 C84,12 92,33 89,62 C88,50 82,46 76,47 C66,40 40,40 30,47 C24,41 14,50 11,62 Z" fill="${c}"/><circle cx="13" cy="54" r="3.4" fill="#E5503A"/><circle cx="87" cy="54" r="3.4" fill="#E5503A"/>`,
 `<path d="M11,64 C8,34 18,15 50,14 C82,15 92,34 89,64 C88,52 82,47 76,48 C66,41 40,41 30,48 C24,42 14,52 11,64 Z" fill="${c}"/>`,
 `<path d="M9,66 C6,32 16,10 50,9 C84,10 94,32 91,66 C90,52 83,47 75,48 C64,40 36,40 25,48 C17,47 12,52 9,66 Z" fill="${c}"/>`,
 `<path d="M11,60 a8,8 0 0,1 0,-12 a9,9 0 0,1 8,-12 a10,10 0 0,1 14,-6 a10,10 0 0,1 17,0 a10,10 0 0,1 17,0 a10,10 0 0,1 14,6 a9,9 0 0,1 8,12 a8,8 0 0,1 0,12 C88,50 82,47 76,48 C66,42 40,42 30,48 C20,47 13,51 11,60 Z" fill="${c}"/>`,
 `<path d="M14,54 C13,32 22,18 50,17 C78,18 87,32 86,54 C84,42 76,36 50,36 C24,36 16,42 14,54 Z" fill="${c}"/>`,
 `<path d="M43,8 L57,8 L55,40 L45,40 Z M14,58 C13,42 20,34 30,33 C22,40 20,50 20,58 Z M86,58 C87,42 80,34 70,33 C78,40 80,50 80,58 Z" fill="${c}"/>`,
 `<path d="M9,66 C6,32 16,10 50,9 C84,10 94,32 91,66 C90,52 82,47 73,48 C62,40 36,40 28,49 C24,43 16,46 13,52 C11,56 10,60 9,66 Z" fill="${c}"/>`,
 `<path d="M11,60 C9,32 18,12 50,11 C82,12 91,30 89,60 C88,48 82,44 74,45 C70,34 56,34 50,40 C44,34 30,36 28,46 C20,45 13,50 11,60 Z" fill="${c}"/>`
][i]||'';}
function avEye1(cx){return `<ellipse cx="${cx}" cy="59" rx="7" ry="8.8" fill="#fff" stroke="#2a2018" stroke-width="1.4"/><circle cx="${cx}" cy="60" r="5.4" fill="#46301f"/><circle cx="${cx}" cy="60" r="3.1" fill="#14100a"/>`;}
function avEyes(i){return [
 avEye1(37)+avEye1(63),
 '<path d="M31,59 Q37,52 43,59" stroke="#3a2b22" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M57,59 Q63,52 69,59" stroke="#3a2b22" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
 '<circle cx="37" cy="58" r="5.4" fill="#fff" stroke="#d8b9a0" stroke-width="0.6"/><circle cx="63" cy="58" r="5.4" fill="#fff" stroke="#d8b9a0" stroke-width="0.6"/><circle cx="37" cy="58.5" r="3.4" fill="#5a3b28"/><circle cx="63" cy="58.5" r="3.4" fill="#5a3b28"/><circle cx="37" cy="58.8" r="1.7" fill="#241a12"/><circle cx="63" cy="58.8" r="1.7" fill="#241a12"/><circle cx="38.4" cy="56.6" r="0.7" fill="#fff" opacity="0.7"/><circle cx="64.4" cy="56.6" r="0.7" fill="#fff" opacity="0.7"/>',
 '<path d="M31,58 Q37,52 43,58" stroke="#3a2b22" stroke-width="3.2" fill="none" stroke-linecap="round"/>'+avEye1(63),
 '<ellipse cx="37" cy="58" rx="6.5" ry="4.3" fill="#fff" stroke="#d8b9a0" stroke-width="0.6"/><ellipse cx="63" cy="58" rx="6.5" ry="4.3" fill="#fff" stroke="#d8b9a0" stroke-width="0.6"/><circle cx="37" cy="58" r="3" fill="#3a2b22"/><circle cx="63" cy="58" r="3" fill="#3a2b22"/><circle cx="38" cy="57.2" r="0.6" fill="#fff" opacity="0.6"/><circle cx="64" cy="57.2" r="0.6" fill="#fff" opacity="0.6"/>',
 '<path d="M31,57 Q37,61 43,57" stroke="#3a2b22" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57,57 Q63,61 69,57" stroke="#3a2b22" stroke-width="3" fill="none" stroke-linecap="round"/>',
 '<path d="M37,51 l1.9,4.2 4.5,.4 -3.5,3 1.1,4.4 -4,-2.4 -4,2.4 1.1,-4.4 -3.5,-3 4.5,-.4 z" fill="#F4B942"/><path d="M63,51 l1.9,4.2 4.5,.4 -3.5,3 1.1,4.4 -4,-2.4 -4,2.4 1.1,-4.4 -3.5,-3 4.5,-.4 z" fill="#F4B942"/>',
 '<ellipse cx="37" cy="58" rx="6.5" ry="8" fill="#fff" stroke="#d8b9a0" stroke-width="0.6"/><ellipse cx="63" cy="58" rx="6.5" ry="8" fill="#fff" stroke="#d8b9a0" stroke-width="0.6"/><circle cx="37" cy="59" r="5" fill="#5a3b28"/><circle cx="63" cy="59" r="5" fill="#5a3b28"/><circle cx="37" cy="59" r="2.5" fill="#241a12"/><circle cx="63" cy="59" r="2.5" fill="#241a12"/><circle cx="39" cy="56.5" r="0.9" fill="#fff" opacity="0.75"/><circle cx="65" cy="56.5" r="0.9" fill="#fff" opacity="0.75"/>',
 '<path d="M32,55 L43,58 L42,60 L32,58 Z" fill="#3a2b22"/><path d="M68,55 L57,58 L58,60 L68,58 Z" fill="#3a2b22"/>',
 '<path d="M32,56 Q37,55 43,58 Q37,62 32,60 Z" fill="#3a2b22"/><path d="M68,56 Q63,55 57,58 Q63,62 68,60 Z" fill="#3a2b22"/>',
 '<rect x="33" y="54" width="8" height="8" rx="1.5" fill="#3a2b22"/><rect x="59" y="54" width="8" height="8" rx="1.5" fill="#3a2b22"/><rect x="34.5" y="55.5" width="2.5" height="2.5" fill="#fff"/><rect x="60.5" y="55.5" width="2.5" height="2.5" fill="#fff"/>',
 avEye1(37).replace('r="5.4" fill="#46301f"','r="5.4" fill="#357a4d"')+avEye1(63).replace('r="5.4" fill="#46301f"','r="5.4" fill="#357a4d"'),
  avEye1(37)+'<path d="M29.5,53 l-3,-2 M29.5,56 l-3.4,-1.2" stroke="#1a120c" stroke-width="1.6" stroke-linecap="round"/>'+avEye1(63)+'<path d="M70.5,53 l3,-2 M70.5,56 l3.4,-1.2" stroke="#1a120c" stroke-width="1.6" stroke-linecap="round"/>',
  '<ellipse cx="37" cy="59" rx="7" ry="8.8" fill="#fff" stroke="#2a2018" stroke-width="1.4"/><circle cx="37" cy="61" r="5" fill="#6b4a32"/><circle cx="37" cy="61.5" r="2.6" fill="#1a120c"/><path d="M30,55 Q37,51 44,55" stroke="#2a2018" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="63" cy="59" rx="7" ry="8.8" fill="#fff" stroke="#2a2018" stroke-width="1.4"/><circle cx="63" cy="61" r="5" fill="#6b4a32"/><circle cx="63" cy="61.5" r="2.6" fill="#1a120c"/><path d="M56,55 Q63,51 70,55" stroke="#2a2018" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  '<ellipse cx="37" cy="59" rx="6.5" ry="8.5" fill="#fff" stroke="#2a2018" stroke-width="1.4"/><circle cx="37" cy="59.5" r="6" fill="#1a120c"/><circle cx="39.2" cy="56.5" r="1.1" fill="#fff" opacity="0.8"/><ellipse cx="63" cy="59" rx="6.5" ry="8.5" fill="#fff" stroke="#2a2018" stroke-width="1.4"/><circle cx="63" cy="59.5" r="6" fill="#1a120c"/><circle cx="65.2" cy="56.5" r="1.1" fill="#fff" opacity="0.8"/>',
  avEye1(37)+'<path d="M35,55 l1,2.2 2.4,.2 -1.8,1.6 .5,2.3 -2.1,-1.2 -2.1,1.2 .5,-2.3 -1.8,-1.6 2.4,-.2 z" fill="#fff"/>'.replace(/35,55/g,'35,55')+avEye1(63),
][i]||'';}
function avNose(i){return ['',
 `<path d="M48,64 Q50,68 52,64" stroke="${AV_NOSEC}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
 `<ellipse cx="50" cy="66" rx="3" ry="2.4" fill="${AV_NOSEC}"/>`,
 `<path d="M50,61 L50,66" stroke="${AV_NOSEC}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
 `<circle cx="50" cy="66" r="2" fill="${AV_NOSEC}"/>`
][i]||'';}
function avMouth(i){return [
 '<path d="M41,75 Q50,82 59,75" stroke="#C0506A" stroke-width="3" fill="none" stroke-linecap="round"/>',
 '<path d="M40,74 Q50,84 60,74 Q50,77 40,74 Z" fill="#B83C5A"/><path d="M45,76 Q50,78 55,76 Q50,81 45,76Z" fill="#fff"/>',
 '<ellipse cx="50" cy="76" rx="3.5" ry="4" fill="#B83C5A"/>',
 '<path d="M44,76 L56,76" stroke="#C0506A" stroke-width="3" stroke-linecap="round"/>',
 '<path d="M41,75 Q50,81 59,75" stroke="#C0506A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M47,78 Q50,84 53,78 Z" fill="#E8849A"/>',
 '<path d="M37,74 Q50,85 63,74 Q58,80 50,80 Q42,80 37,74Z" fill="#B83C5A"/><rect x="43" y="75" width="14" height="3" fill="#fff"/>',
 '<path d="M44,75 Q47,78 50,75 Q53,78 56,75" stroke="#C0506A" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
 '<path d="M45,76 Q50,80 55,76" stroke="#C0506A" stroke-width="3" fill="none" stroke-linecap="round"/>'
][i]||'';}
function avAcc(i,c){return [
 '',
 '<g fill="none" stroke="#444" stroke-width="2.3"><circle cx="37" cy="58" r="8.5"/><circle cx="63" cy="58" r="8.5"/><line x1="45.5" y1="58" x2="54.5" y2="58"/></g>',
 '<g fill="#2b2b2b"><rect x="27" y="52" width="18" height="12" rx="5"/><rect x="55" y="52" width="18" height="12" rx="5"/><rect x="45" y="56" width="10" height="3"/></g>',
 '<g fill="#E5503A"><path d="M50,22 L37,13 Q34,22 37,31 Z"/><path d="M50,22 L63,13 Q66,22 63,31 Z"/></g><circle cx="50" cy="22" r="4.5" fill="#C0392B"/>',
 '<path d="M16,32 Q50,2 84,32 Q85,37 79,38 L21,38 Q15,37 16,32 Z" fill="#3B9AD9"/><path d="M78,35 Q96,34 93,43 L78,42 Z" fill="#2C7AB8"/>',
 '<path d="M15,40 Q50,28 85,40 L85,47 Q50,35 15,47 Z" fill="#E673B0"/>'
][i]||'';}
function buildAvatar(cfg,size){
  cfg=cfg||{}; const s=size||34; const uid=_avuid++;
  const si=cfg.skin||0; const skin=AV_SKIN[si]||AV_SKIN[0]; const sh=AV_SKINSH[si]||AV_SKINSH[0];
  const hc=AV_HAIRC[cfg.hairColor||0]||AV_HAIRC[0];
  return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" class="avatar-svg" style="vertical-align:middle">`
    +`<defs><radialGradient id="sk${uid}" cx="50%" cy="38%" r="72%"><stop offset="0%" stop-color="${avLighten(skin)}"/><stop offset="68%" stop-color="${skin}"/><stop offset="100%" stop-color="${sh}"/></radialGradient><radialGradient id="sh${uid}"><stop offset="0%" stop-color="${sh}"/><stop offset="100%" stop-color="${sh}" stop-opacity="0"/></radialGradient><linearGradient id="hr${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${avLighten(hc)}"/><stop offset="42%" stop-color="${hc}"/><stop offset="100%" stop-color="${avDarken(hc)}"/></linearGradient></defs>`
    +avHairBack(cfg.hair||0,`url(#hr${uid})`)+`<ellipse cx="14" cy="60" rx="6.5" ry="7.5" fill="${skin}"/><ellipse cx="86" cy="60" rx="6.5" ry="7.5" fill="${skin}"/><circle cx="13" cy="60" r="2.3" fill="${sh}" opacity="0.5"/><circle cx="87" cy="60" r="2.3" fill="${sh}" opacity="0.5"/>`
    +avFace(cfg.face||0,uid)
    +`<path d="M22,40 Q50,31 78,40 Q50,43 22,40 Z" fill="#000" opacity="0.05"/>`
    +`<ellipse cx="31" cy="76" rx="6" ry="3.8" fill="#F5A0B0" opacity="0.42"/><ellipse cx="69" cy="76" rx="6" ry="3.8" fill="#F5A0B0" opacity="0.42"/>`
    +avHair(cfg.hair||0,`url(#hr${uid})`)+`<g transform="translate(0,-2.5)">`+avBrow(cfg.brow||0,avDarken(hc,0.12))+avEyes(cfg.eyes||0)+avAcc(cfg.acc||0,hc)+`</g><g transform="translate(0,6.5)">`+avNose(cfg.nose||0)+avMouth(cfg.mouth||0)+`</g>`
    +`</svg>`;
}

// ── Face-builder editor ──
const AV_PRESETS=[
 {face:2,skin:1,hair:0,hairColor:0,brow:0,eyes:0,nose:2,mouth:0,acc:0},
 {face:0,skin:1,hair:7,hairColor:3,brow:1,eyes:2,nose:2,mouth:0,acc:3},
 {face:1,skin:0,hair:8,hairColor:6,brow:5,eyes:1,nose:2,mouth:0,acc:0},
 {face:3,skin:2,hair:13,hairColor:0,brow:3,eyes:0,nose:2,mouth:1,acc:1},
 {face:0,skin:3,hair:9,hairColor:4,brow:1,eyes:6,nose:2,mouth:6,acc:0},
 {face:2,skin:2,hair:11,hairColor:4,brow:2,eyes:8,nose:4,mouth:5,acc:2},
 {face:1,skin:1,hair:14,hairColor:5,brow:6,eyes:3,nose:2,mouth:0,acc:5},
 {face:4,skin:1,hair:5,hairColor:1,brow:0,eyes:11,nose:2,mouth:7,acc:0}
];
function applyPreset(i){ editCfg=Object.assign({},AV_PRESETS[i]); renderAvOptions(); renderAvPreview(); renderAvPresets(); }
function renderAvPresets(){
  const box=document.getElementById('av-presets'); if(!box)return;
  box.innerHTML=AV_PRESETS.map((p,i)=>`<button class="av-preset" onclick="applyPreset(${i})">${buildAvatar(p,42)}</button>`).join('');
}
let editCfg={}, editCat='skin';
function openKidEdit(k){
  currentKidEdit=k;
  editCfg=Object.assign({face:0,skin:0,hair:0,hairColor:0,brow:0,eyes:0,nose:1,mouth:0,acc:0}, kidAvatars[k]||{});
  document.getElementById('kid-name-input').value=kidNames[k];
  renderAvPresets();
  renderAvCats();
  renderAvOptions();
  renderAvPreview();
  document.getElementById('kid-modal').classList.add('open');
}
let currentKidEdit=0;
function renderAvPreview(){
  const p=document.getElementById('avatar-preview'); if(p) p.innerHTML=buildAvatar(editCfg,104);
}
function renderAvCats(){
  const t=document.getElementById('av-cat-tabs'); if(!t)return;
  t.innerHTML=AV_CATS.map(c=>`<button class="av-cat${c[0]===editCat?' active':''}" onclick="setAvCat('${c[0]}')">${c[1]}</button>`).join('');
}
function setAvCat(cat){ editCat=cat; renderAvCats(); renderAvOptions(); }
function renderAvOptions(){
  const box=document.getElementById('av-options'); if(!box)return;
  const cat=AV_CATS.find(c=>c[0]===editCat);
  const [key,label,count,type,colors]=cat;
  let h='';
  for(let i=0;i<count;i++){
    const sel=(editCfg[key]||0)===i;
    if(type==='color'){
      h+=`<button class="av-opt2${sel?' sel':''}" onclick="setAvPart('${key}',${i})"><span class="av-sw" style="background:${colors[i]}"></span></button>`;
    } else {
      const tmp=Object.assign({},editCfg); tmp[key]=i;
      h+=`<button class="av-opt2${sel?' sel':''}" onclick="setAvPart('${key}',${i})">${buildAvatar(tmp,46)}</button>`;
    }
  }
  box.innerHTML=h;
}
function setAvPart(key,i){ editCfg[key]=i; renderAvOptions(); renderAvPreview(); }
function saveKidEdit(){
  const nm=document.getElementById('kid-name-input').value.trim()||('寶貝 '+(currentKidEdit+1));
  kidNames[currentKidEdit]=nm;
  kidAvatars[currentKidEdit]=Object.assign({},editCfg);
  storeSet('nyc-kidnames',JSON.stringify(kidNames));
  storeSet('nyc-kidavatars',JSON.stringify(kidAvatars));
  document.getElementById('kid-modal').classList.remove('open');
  renderKidSwitcher();
  renderHome();
}


// ══ HOME ══════════════════════════════════════════════════════
function renderHome(){
  renderKidSwitcher();
  renderCountdown();
  const owner=document.getElementById('passport-owner');
  if(owner) owner.textContent=`${kidNames[currentKid]} 的旅行護照`;
  const grid=document.getElementById('stamp-grid');
  grid.innerHTML='';
  SPOTS.forEach(s=>{
    const isStamped=stamped.includes(s.id);
    const photo=photos[s.id];
    const div=document.createElement('div');
    div.className='stamp-slot'+(isStamped?' stamped':'');
    div.style.setProperty('--sc',s.color);
    div.innerHTML=`
      ${photo?`<img class="stamp-photo" src="${photo}" alt=""><div class="stamp-overlay"></div><div class="stamp-overlay-text"><span class="ov-art">${spotArt(s.id)}</span> ${s.name}</div>`:''}
      ${!photo?`<span class="slot-icon">${spotArt(s.id)}</span><div class="slot-name">${s.name}</div><div class="slot-date">Day${s.day} · ${s.date}</div>`:''}
    `;
    div.onclick=()=>openDetail(s.id);
    grid.appendChild(div);
  });
  updateProgress();
}

function updateProgress(){
  const n=stamped.length, total=SPOTS.length;
  document.getElementById('stamp-count').textContent=n;
  const tot=document.getElementById('stamp-total'); if(tot) tot.textContent=total;
  const intro=document.getElementById('intro-total'); if(intro) intro.textContent=total;
  document.getElementById('prog-fill').style.width=(n/total*100)+'%';
}

// ══ DETAIL ════════════════════════════════════════════════════
function openDetail(id){
  currentSpot=SPOTS.find(s=>s.id===id);
  pendingPhotoData=null;
  const s=currentSpot;
  const isStamped=stamped.includes(s.id);

  document.documentElement.style.setProperty('--dc',s.color);
  const hdr=document.getElementById('det-hdr');
  hdr.style.background=`linear-gradient(135deg,${s.color} 0%,${lighten(s.color)} 100%)`;
  document.getElementById('det-art').innerHTML=spotArt(s.id);
  document.getElementById('det-day').textContent=`Day ${s.day} · ${s.date}`;
  document.getElementById('det-title').textContent=s.name;
  document.getElementById('det-tagline').textContent=s.short;

  document.getElementById('tab-story').innerHTML=`<div class="story-text">${s.story.replace(/^[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u2049\u203C]+\s*\n?/u,'')}</div>`;
  document.getElementById('tab-facts').innerHTML=s.facts.map(f=>`<div class="fact-card"><span class="fact-e"><svg viewBox="0 0 24 24" style="width:14px;height:14px"><circle cx="12" cy="12" r="6" fill="#F4B942"/><circle cx="12" cy="12" r="9" fill="none" stroke="#F4B942" stroke-width="1.6" opacity="0.45"/></svg></span><div class="fact-t">${f.t}</div></div>`).join('');

  const qz=Array.isArray(s.quiz)?s.quiz:[s.quiz];
  const qans=quizAns[s.id]||{};
  document.getElementById('tab-quiz').innerHTML=qz.map(function(qq,qi){
    const done=qans[qi]!==undefined;
    return '<div class="quiz-card">'
      +'<div class="quiz-q">'+(qz.length>1?('<span class="quiz-num">第 '+(qi+1)+' 題</span> '):'')+qq.q+'</div>'
      +qq.opts.map(function(o,i){
        var cls='quiz-opt';
        if(done){ cls+=' dis'; if(i===qq.ans)cls+=' correct'; else if(i===qans[qi])cls+=' wrong'; }
        return '<div class="'+cls+'" onclick="answerQuiz(this,'+i+','+qq.ans+',\''+s.id+'\','+qi+')"><span class="opt-letter">'+'ABCD'[i]+'</span>'+o+'</div>';
      }).join('')
      +'<div class="quiz-res'+(done?(qans[qi]===qq.ans?' show ok':' show bad'):'')+'" id="quiz-res-'+qi+'">'+(done?(qans[qi]===qq.ans?'答對了！你超厲害！':('正確答案是 '+'ABCD'[qq.ans])):'')+'</div>'
      +'</div>';
  }).join('');

  renderJournal();
  renderStampZone(isStamped);
  switchTab(document.querySelector('.det-tab'),null,'story');
  showScreen('detail',false);
}

function renderJournal(){
  const s=currentSpot;
  const pane=document.getElementById('tab-journal');
  const stamped_=stamped.includes(s.id);
  const photo=photos[s.id];
  if(!stamped_){
    pane.innerHTML=`<div class="journal-locked">
      <span style="font-size:2.4rem">🔒</span>
      <p>先完成「拍照打卡 + 蓋章」<br>就能在這裡寫下你的旅遊心得囉！</p>
    </div>`;
    return;
  }
  let entry=journals[s.id];
  if(typeof entry==='object'&&entry!==null) entry=entry[0]||entry[currentKid]||''; // migrate old 2-slot
  const saved=entry||'';
  const voiceBtn=SPEECH_OK
    ? `<button class="voice-btn" id="voice-btn-0" onclick="toggleVoice(0)"><span id="voice-ico-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></span> <span id="voice-txt-0">語音輸入</span></button>`
    : `<div class="voice-note">（這個瀏覽器不支援語音輸入，可以用打字的喔）</div>`;
  pane.innerHTML=`
    ${photo?`<img class="journal-photo" src="${photo}" alt="">`:''}
    <div class="journal-label">${kidNames[currentKid]} 在 ${s.name} 的旅遊心得</div>
    <textarea class="journal-text" id="journal-text-0" placeholder="今天看到了什麼？最喜歡哪裡？有什麼好玩的事？寫下來或用說的吧！" oninput="saveJournal(0)">${saved}</textarea>
    ${voiceBtn}
    <div class="journal-saved" id="journal-saved-0">${saved?'已自動儲存 ✓':''}</div>`;
}

function saveJournal(k){
  const s=currentSpot;
  const t=document.getElementById('journal-text-0');
  if(!t)return;
  journals[s.id]=t.value;
  saveJournals();
  const sv=document.getElementById('journal-saved-0');
  if(sv) sv.textContent=t.value?'已自動儲存 ✓':'';
}

// ── Voice input (per kid slot) ──
let recognizing=false, recognition=null, activeSlot=0;
var voiceMode='journal';
function toggleVoice(k,mode){ voiceMode=mode||'journal';
  if(!SPEECH_OK)return;
  if(recognizing){ if(recognition) recognition.stop(); return; }
  activeSlot=k;
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  recognition=new SR();
  recognition.lang='zh-TW';
  recognition.interimResults=false;
  recognition.continuous=false;
  recognition.onstart=()=>{ recognizing=true; setVoiceUI(true); };
  recognition.onerror=()=>{ recognizing=false; setVoiceUI(false); };
  recognition.onend=()=>{ recognizing=false; setVoiceUI(false); };
  recognition.onresult=(e)=>{
    let txt='';
    for(let i=0;i<e.results.length;i++){ txt+=e.results[i][0].transcript; }
    if(voiceMode==='postcard'){ const pm=document.getElementById('post-msg'); if(pm){ pm.value=(pm.value?pm.value+' ':'')+txt; if(typeof updatePostMsg==='function') updatePostMsg(); } }
    else { const ta=document.getElementById('journal-text-'+activeSlot); if(ta){ ta.value=(ta.value?ta.value+' ':'')+txt; saveJournal(activeSlot); } }
  };
  try{ recognition.start(); }catch(e){ recognizing=false; setVoiceUI(false); }
}
function setVoiceUI(on){
  const btn=document.getElementById('voice-btn-'+activeSlot);
  const ico=document.getElementById('voice-ico-'+activeSlot);
  const txt=document.getElementById('voice-txt-'+activeSlot);
  if(!btn)return;
  if(on){ btn.classList.add('listening'); if(ico)ico.innerHTML='<svg viewBox="0 0 24 24" fill="#E5503A" style="width:1em;height:1em;vertical-align:-2px"><circle cx="12" cy="12" r="7"/></svg>'; if(txt)txt.textContent='聽你說…（再按停止）'; }
  else { btn.classList.remove('listening'); if(ico)ico.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>'; if(txt)txt.textContent='語音輸入'; }
}

function renderStampZone(isStamped){
  const zone=document.getElementById('stamp-zone');
  const s=currentSpot;
  if(isStamped){
    zone.innerHTML=`<div class="stamp-done-info">
      <span class="done-check">✅</span>
      <p>已蓋章！</p>
      <span>${s.name} 已經在護照裡了</span>
    </div>`;
  } else if(pendingPhotoData){
    zone.innerHTML=`<div class="photo-preview-wrap">
      <img class="photo-thumb" src="${pendingPhotoData}" id="photo-thumb-img">
      <div class="photo-preview-info">
        <p>照片拍好了！</p>
        <span>準備蓋上 ${s.name} 的印章</span><br>
        <button class="photo-retake" onclick="retakePhoto()">重新拍照</button>
      </div>
    </div>
    <button class="stamp-confirm-btn" style="background:${s.color}" onclick="stampIt()">
      🔖 蓋上印章！
    </button>`;
  } else {
    zone.innerHTML=`<div class="photo-prompt">
      <p>先拍一張打卡紀念照，才能蓋章喔！📸</p>
      <button class="photo-btn" onclick="openCamera()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.05em;height:1.05em;vertical-align:-3px"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/></svg> 拍打卡照</button>
    </div>`;
  }
}

function openCamera(){
  const input=document.getElementById('photo-input');
  input.value='';
  input.onchange=handlePhoto;
  input.click();
}

function handlePhoto(e){
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const size=Math.min(img.width,img.height);
      canvas.width=200;canvas.height=200;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(img,(img.width-size)/2,(img.height-size)/2,size,size,0,0,200,200);
      pendingPhotoData=canvas.toDataURL('image/jpeg',0.72);
      renderStampZone(false);
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

function retakePhoto(){
  pendingPhotoData=null;
  renderStampZone(false);
}

function stampIt(){
  const s=currentSpot;
  if(stamped.includes(s.id))return;
  stamped.push(s.id);
  if(pendingPhotoData) photos[s.id]=pendingPhotoData;
  save();
  renderStampZone(true);
  renderJournal();
  launchConfetti(s.color);
  updateProgress();
  showModal('🎉',`${s.name} 蓋章成功！`,`你已經收集了 ${stamped.length}/${SPOTS.length} 個印章！\n\n可以到上面「✍️ 心得」分頁，寫下旅遊心得喔！`);
  if(stamped.length===SPOTS.length) setTimeout(()=>{closeModal();setTimeout(()=>navTo('celebrate'),300);},1800);
}

function answerQuiz(el,chosen,correct,id,qi){
  if(el.classList.contains('dis'))return;
  const card=el.closest('.quiz-card');
  card.querySelectorAll('.quiz-opt').forEach(function(o){o.classList.add('dis');});
  const res=document.getElementById('quiz-res-'+qi);
  if(!quizAns[id])quizAns[id]={};
  quizAns[id][qi]=chosen;
  if(chosen===correct){
    el.classList.add('correct');
    res.className='quiz-res show ok'; res.textContent='答對了！你超厲害！';
    shootStars(el);
  } else {
    el.classList.add('wrong');
    card.querySelectorAll('.quiz-opt')[correct].classList.add('correct');
    res.className='quiz-res show bad';
    res.textContent='正確答案是 '+('ABCD'[correct])+'：'+card.querySelectorAll('.quiz-opt')[correct].textContent.slice(1)+' 加油！';
  }
  const sp=SPOTS.find(function(x){return x.id===id;});
  const qz=Array.isArray(sp.quiz)?sp.quiz:[sp.quiz];
  const allRight=qz.every(function(qq,j){return quizAns[id][j]===qq.ans;});
  if(allRight && quizDone.indexOf(id)<0){ quizDone.push(id); }
  storeSet(kk('nyc-quizans'),JSON.stringify(quizAns));
  save();
}

// ══ MAP DATA (real US states + NYC boroughs, Mercator) ════════
const MAPDATA={"bw":1000.0,"bh":536.8,"states":{"Alabama":"M632.4,338.8 L677.3,339.0 L684.6,383.4 L686.6,389.1 L688.5,392.4 L687.8,394.4 L689.8,395.6 L686.8,398.2 L686.9,400.8 L685.4,404.2 L687.1,410.4 L685.9,415.7 L687.8,421.3 L642.8,421.4 L642.2,424.0 L646.1,427.9 L645.4,431.2 L646.8,432.8 L644.2,435.8 L641.8,436.5 L637.5,433.2 L637.0,428.2 L635.7,427.7 L634.1,431.4 L633.5,435.0 L629.0,434.1 L627.7,403.1 L634.2,341.0 L632.4,338.8 Z","Arizona":"M271.3,295.8 L271.3,414.6 L236.1,414.6 L171.3,390.9 L173.0,386.3 L176.4,385.5 L177.3,383.7 L176.4,379.9 L174.0,379.7 L172.9,372.0 L176.4,369.1 L176.9,366.0 L176.2,361.1 L178.3,357.4 L181.0,356.0 L183.1,353.3 L179.7,350.3 L177.3,344.8 L174.5,341.3 L174.5,338.6 L175.5,335.7 L175.1,331.8 L173.7,327.7 L172.7,315.2 L179.0,314.4 L181.1,317.0 L182.8,316.8 L184.6,313.2 L184.6,295.8 L271.3,295.8 Z","Arkansas":"M521.3,306.6 L598.6,306.7 L600.1,310.9 L597.4,313.4 L594.7,317.4 L605.9,317.4 L605.3,321.4 L602.8,322.6 L602.2,325.9 L599.0,329.4 L599.2,334.5 L597.5,338.2 L595.8,338.8 L596.9,340.6 L594.1,342.2 L592.9,345.8 L591.1,346.7 L591.4,350.9 L588.2,352.0 L588.3,353.4 L584.7,356.8 L585.8,359.1 L582.6,362.5 L579.9,368.8 L582.9,371.6 L581.4,373.3 L582.4,377.6 L581.0,380.4 L531.2,380.1 L531.2,369.1 L528.7,368.2 L525.3,369.2 L523.5,367.2 L524.5,330.3 L521.3,306.6 Z","California":"M8.5,183.5 L81.5,183.6 L81.5,251.9 L124.9,291.1 L153.4,318.0 L174.5,338.6 L174.5,341.3 L177.3,344.8 L179.7,350.3 L183.1,353.3 L181.0,356.0 L178.3,357.4 L176.2,361.1 L176.9,366.0 L176.4,369.1 L172.9,372.0 L174.0,379.7 L176.4,379.9 L177.3,383.7 L176.4,385.5 L173.0,386.3 L131.3,390.0 L129.2,387.3 L129.1,383.0 L127.8,377.9 L125.3,374.3 L119.9,369.3 L113.0,364.6 L111.7,365.9 L109.0,365.1 L109.4,363.0 L106.4,358.8 L102.3,359.7 L95.1,356.6 L94.0,354.1 L89.2,351.0 L83.7,351.1 L79.1,349.7 L73.3,350.3 L70.3,347.5 L71.0,341.7 L69.9,340.7 L70.6,336.6 L66.0,333.4 L65.8,329.1 L64.1,328.9 L61.3,325.2 L59.3,324.3 L58.4,322.0 L51.8,313.2 L48.7,310.6 L48.0,303.7 L49.3,304.2 L50.6,300.1 L48.1,296.3 L45.1,296.8 L41.1,293.3 L39.7,290.6 L39.9,288.0 L38.0,284.5 L38.0,278.8 L41.2,278.8 L39.8,270.7 L38.4,271.5 L38.1,275.5 L34.7,276.4 L30.6,273.3 L30.0,268.2 L27.3,264.0 L23.8,261.5 L16.8,252.9 L17.6,251.1 L15.3,243.7 L16.3,239.5 L14.8,233.2 L10.3,227.0 L6.0,223.5 L5.1,219.4 L9.5,209.4 L10.3,206.0 L9.5,203.4 L11.1,196.5 L9.7,190.1 L7.8,188.6 L8.5,183.5 Z","Colorado":"M271.3,206.7 L392.4,206.5 L392.6,296.0 L271.3,295.8 L271.3,206.7 Z","Connecticut":"M887.3,182.3 L916.5,183.0 L916.5,197.1 L915.5,199.2 L913.9,198.9 L906.4,200.6 L897.3,200.1 L893.5,203.3 L889.3,204.3 L884.3,206.9 L883.1,204.3 L887.4,201.8 L886.1,199.9 L887.3,182.3 Z","Delaware":"M853.9,233.8 L852.3,236.5 L850.5,238.0 L850.9,241.6 L853.4,244.9 L854.1,250.4 L857.8,256.1 L859.5,256.4 L860.2,264.0 L849.1,263.8 L847.4,235.7 L850.4,233.2 L853.9,233.8 Z","District of Columbia":"M825.8,252.0 L828.0,254.2 L825.7,256.5 L824.4,253.3 L825.8,252.0 Z","Florida":"M642.8,421.4 L687.8,421.3 L690.1,427.1 L736.1,430.0 L736.9,434.3 L739.0,434.2 L739.8,430.1 L739.1,426.3 L740.7,424.8 L744.7,426.5 L749.4,427.2 L750.5,435.9 L752.7,445.7 L757.7,458.4 L765.4,472.0 L764.2,472.9 L764.6,479.2 L767.8,486.2 L772.9,500.2 L773.9,504.5 L771.9,524.9 L770.3,525.3 L768.6,530.2 L769.2,531.8 L765.8,535.3 L764.5,534.5 L761.3,536.0 L755.8,536.8 L754.2,534.8 L754.9,531.9 L751.0,523.4 L748.0,521.8 L745.4,522.9 L743.3,518.2 L742.7,514.3 L739.1,509.9 L738.2,507.1 L738.8,502.9 L736.8,502.2 L737.3,504.6 L735.5,505.3 L730.0,494.7 L727.8,492.0 L733.0,484.2 L729.6,484.7 L727.3,487.1 L725.0,483.3 L728.1,472.5 L728.7,463.5 L726.6,461.4 L725.9,458.4 L722.6,457.8 L718.7,453.0 L715.6,451.0 L715.4,448.1 L713.2,447.0 L711.4,443.7 L704.7,439.3 L699.0,440.3 L699.2,443.4 L697.3,442.8 L690.1,446.6 L682.4,447.4 L682.6,445.2 L680.8,442.6 L671.8,436.7 L665.4,434.2 L659.6,433.5 L644.2,435.8 L646.8,432.8 L645.4,431.2 L646.1,427.9 L642.2,424.0 L642.8,421.4 Z","Georgia":"M720.6,338.6 L716.9,343.2 L716.6,345.3 L722.4,349.8 L724.2,349.5 L726.9,354.1 L727.4,356.5 L730.2,360.9 L734.2,363.5 L736.4,367.4 L741.1,370.9 L740.9,373.3 L743.9,377.1 L748.6,380.3 L749.7,383.7 L749.9,388.1 L752.3,389.6 L755.0,395.1 L755.1,398.5 L759.1,400.3 L754.8,407.3 L754.1,410.8 L752.3,413.9 L752.1,417.2 L750.2,418.6 L749.4,427.2 L744.7,426.5 L740.7,424.8 L739.1,426.3 L739.8,430.1 L739.0,434.2 L736.9,434.3 L736.1,430.0 L690.1,427.1 L685.9,415.7 L687.1,410.4 L685.4,404.2 L686.9,400.8 L686.8,398.2 L689.8,395.6 L687.8,394.4 L688.5,392.4 L686.6,389.1 L684.6,383.4 L677.3,339.0 L720.6,338.6 Z","Idaho":"M150.0,10.2 L150.0,36.9 L155.6,44.1 L155.7,51.2 L159.0,54.3 L162.5,55.4 L162.9,57.2 L169.4,64.0 L170.1,66.8 L174.7,69.4 L174.9,71.1 L179.9,70.9 L177.4,80.3 L176.9,86.2 L178.7,90.0 L175.6,92.7 L176.9,95.3 L176.0,98.0 L179.7,100.6 L184.0,97.2 L185.7,94.5 L188.8,96.9 L188.3,99.0 L190.0,103.7 L192.9,108.7 L195.0,110.4 L194.9,115.1 L196.9,117.1 L200.5,117.4 L202.8,125.3 L204.7,126.6 L206.5,124.3 L212.0,124.5 L215.9,122.3 L218.3,123.5 L222.4,122.5 L223.2,123.8 L226.8,122.9 L230.7,117.8 L233.5,122.1 L236.6,124.6 L236.6,183.5 L133.0,183.5 L133.0,140.2 L135.3,132.3 L133.9,130.3 L130.6,129.9 L129.3,126.6 L132.8,117.9 L134.6,117.1 L136.4,113.5 L136.1,111.3 L138.1,108.3 L139.2,104.0 L142.8,96.7 L141.4,93.3 L137.3,91.5 L134.9,87.3 L134.8,82.9 L132.5,78.5 L132.9,10.2 L150.0,10.2 Z","Illinois":"M590.1,171.6 L639.3,172.0 L638.7,176.4 L641.4,181.7 L644.1,190.2 L644.0,244.0 L642.1,248.1 L644.3,252.9 L644.6,256.8 L642.4,259.9 L641.8,262.8 L638.7,267.6 L636.7,267.9 L637.2,270.7 L635.9,271.8 L634.8,277.0 L635.4,278.4 L633.1,281.5 L634.7,285.3 L627.6,287.4 L626.9,289.6 L628.6,292.5 L626.4,294.3 L620.0,291.0 L618.0,291.2 L615.4,295.0 L616.2,296.2 L613.5,296.0 L609.6,289.8 L611.0,288.3 L609.6,284.1 L609.6,280.8 L604.0,276.1 L602.1,276.6 L600.2,273.7 L595.1,269.2 L595.2,265.7 L598.1,260.0 L597.6,258.0 L599.3,255.3 L596.9,253.7 L593.1,252.7 L591.1,254.8 L589.8,253.5 L588.6,246.1 L582.8,241.3 L577.5,235.6 L575.3,228.6 L575.1,224.0 L576.7,220.8 L576.9,216.7 L581.8,214.2 L582.3,210.7 L584.5,208.4 L584.8,204.4 L582.0,201.1 L583.1,197.1 L589.8,195.9 L595.3,193.0 L595.8,189.5 L598.1,188.0 L598.8,183.5 L598.3,180.5 L594.4,178.2 L593.9,175.8 L590.1,171.6 Z","Indiana":"M656.3,189.1 L691.2,189.1 L691.0,249.6 L689.7,250.5 L691.1,256.6 L688.0,256.8 L684.8,258.8 L680.4,257.9 L680.6,262.2 L677.6,264.0 L676.5,266.8 L673.4,267.9 L671.8,273.5 L669.8,274.9 L665.9,272.9 L665.3,270.3 L661.5,273.1 L661.8,275.5 L657.9,276.4 L656.7,274.2 L652.4,276.4 L650.9,278.6 L646.6,275.4 L644.3,276.1 L642.8,274.5 L641.4,276.1 L637.0,276.4 L635.4,278.4 L634.8,277.0 L635.9,271.8 L637.2,270.7 L636.7,267.9 L638.7,267.6 L641.8,262.8 L642.4,259.9 L644.6,256.8 L644.3,252.9 L642.1,248.1 L644.0,244.0 L644.1,190.2 L645.8,191.8 L651.1,191.8 L656.3,189.1 Z","Iowa":"M489.5,148.1 L580.2,148.1 L580.4,151.6 L582.9,154.0 L580.8,156.8 L581.4,162.1 L582.7,165.9 L588.9,168.6 L590.1,171.6 L593.9,175.8 L594.4,178.2 L598.3,180.5 L598.8,183.5 L598.1,188.0 L595.8,189.5 L595.3,193.0 L589.8,195.9 L583.1,197.1 L582.0,201.1 L584.8,204.4 L584.5,208.4 L582.3,210.7 L581.8,214.2 L576.9,216.7 L576.7,220.8 L574.8,220.1 L571.3,215.4 L521.0,216.4 L501.3,216.1 L499.3,213.1 L500.3,207.2 L498.6,202.0 L498.7,196.2 L495.6,194.2 L495.2,191.0 L496.2,188.2 L495.1,184.1 L492.7,182.6 L489.6,172.1 L486.3,166.9 L487.9,163.4 L488.4,158.8 L489.8,157.1 L487.6,154.7 L488.1,150.6 L487.2,148.6 L489.5,148.1 Z","Kansas":"M392.4,229.4 L509.3,229.4 L511.0,231.5 L516.6,233.2 L512.7,239.7 L514.9,242.0 L517.6,247.2 L521.3,248.3 L521.3,295.8 L392.6,296.0 L392.4,229.4 Z","Kentucky":"M706.8,257.0 L710.7,260.0 L713.5,258.5 L720.0,260.2 L721.9,258.0 L724.4,257.2 L725.1,261.0 L727.1,261.6 L729.5,264.6 L729.0,271.3 L731.1,275.5 L733.9,278.8 L734.7,281.3 L738.0,283.8 L740.3,284.1 L733.7,290.0 L727.3,293.2 L727.3,294.9 L724.8,296.3 L724.6,298.2 L721.3,299.0 L720.1,301.4 L710.5,304.8 L660.2,303.3 L638.4,303.8 L634.6,302.8 L634.9,306.7 L611.3,306.7 L612.2,304.0 L614.8,305.0 L616.2,296.2 L615.4,295.0 L618.0,291.2 L620.0,291.0 L626.4,294.3 L628.6,292.5 L626.9,289.6 L627.6,287.4 L634.7,285.3 L633.1,281.5 L637.0,276.4 L641.4,276.1 L642.8,274.5 L644.3,276.1 L646.6,275.4 L650.9,278.6 L652.4,276.4 L656.7,274.2 L657.9,276.4 L661.8,275.5 L661.5,273.1 L665.3,270.3 L665.9,272.9 L669.8,274.9 L671.8,273.5 L673.4,267.9 L676.5,266.8 L677.6,264.0 L680.6,262.2 L680.4,257.9 L684.8,258.8 L688.0,256.8 L691.1,256.6 L689.7,250.5 L691.0,249.6 L697.6,249.6 L701.1,254.2 L701.4,256.1 L706.8,257.0 Z","Louisiana":"M531.2,380.1 L581.0,380.4 L582.6,382.8 L581.4,383.7 L581.2,387.9 L583.8,390.5 L584.2,396.5 L582.1,401.2 L578.0,404.1 L576.9,408.7 L575.2,408.3 L575.0,415.7 L572.9,415.9 L574.1,419.9 L572.9,421.4 L605.6,421.4 L603.9,428.0 L606.7,432.4 L607.4,435.7 L609.5,437.8 L604.4,440.5 L604.0,442.5 L608.2,443.8 L610.0,440.6 L613.6,443.8 L613.3,446.3 L611.2,447.4 L607.3,446.4 L607.8,448.3 L606.5,451.1 L609.8,453.6 L615.1,454.4 L617.0,457.3 L618.5,457.8 L615.7,461.1 L612.7,460.5 L610.2,457.0 L603.8,455.2 L603.8,451.8 L600.7,452.9 L600.9,455.7 L599.4,458.3 L597.2,458.8 L595.4,455.8 L591.5,455.7 L590.0,458.8 L587.4,459.6 L584.5,457.8 L582.3,457.6 L580.1,452.7 L576.2,450.5 L574.7,450.8 L573.1,446.7 L568.6,447.2 L568.5,444.7 L564.0,447.1 L564.6,449.0 L561.2,450.7 L555.9,449.8 L549.7,447.1 L545.4,445.9 L536.0,446.9 L534.7,447.6 L533.2,445.7 L537.3,438.6 L536.0,434.7 L537.2,432.6 L536.6,429.9 L538.3,427.8 L540.1,422.6 L539.8,418.3 L535.1,410.0 L535.0,405.6 L531.2,401.1 L531.2,380.1 Z","Maine":"M935.5,158.6 L933.4,157.0 L933.7,154.6 L930.9,151.9 L928.9,104.4 L936.4,101.0 L935.2,99.3 L938.0,95.5 L941.0,93.7 L940.4,92.2 L943.2,89.9 L942.3,85.5 L944.0,78.9 L946.7,76.7 L947.7,69.7 L961.1,50.2 L964.2,51.0 L964.4,55.8 L966.7,57.5 L972.3,54.7 L975.8,54.7 L978.3,52.9 L983.1,56.9 L986.0,60.3 L985.8,95.2 L991.7,96.9 L990.9,99.8 L992.4,102.5 L991.2,104.9 L993.6,108.7 L996.9,107.9 L1000.0,116.6 L996.4,120.5 L994.3,119.0 L992.6,121.7 L990.1,121.0 L989.8,123.3 L986.6,123.0 L981.5,128.2 L980.3,124.6 L978.5,124.3 L979.3,128.2 L975.3,130.1 L974.4,127.0 L972.5,128.6 L968.0,128.6 L967.9,125.0 L965.3,125.8 L965.7,128.3 L963.3,133.6 L963.8,135.1 L960.5,138.0 L957.3,136.9 L955.4,140.0 L952.8,140.3 L950.6,142.8 L947.9,142.3 L947.2,139.7 L943.3,143.9 L944.3,146.5 L941.5,147.4 L941.3,149.7 L938.0,152.4 L935.5,158.6 Z","Maryland":"M843.8,275.0 L843.5,275.0 L843.0,275.0 L843.8,275.0 Z M783.5,235.7 L847.4,235.7 L849.1,263.8 L860.2,264.0 L856.8,273.3 L845.7,276.0 L845.8,272.4 L844.4,270.9 L846.4,269.4 L843.7,265.7 L842.9,267.3 L839.3,266.9 L838.0,263.0 L839.2,263.0 L839.3,257.7 L840.4,255.7 L838.9,248.6 L840.8,244.4 L843.7,243.7 L844.2,239.4 L842.0,239.9 L841.9,242.1 L837.4,244.9 L836.1,247.5 L835.8,254.0 L834.1,257.0 L834.8,262.1 L837.1,265.6 L836.8,268.3 L838.2,270.9 L837.5,272.7 L833.5,269.2 L827.8,267.6 L826.1,264.2 L822.9,266.1 L821.6,263.4 L824.2,260.0 L825.7,256.5 L828.0,254.2 L825.8,252.0 L824.4,253.3 L822.1,251.3 L818.5,250.2 L818.5,246.9 L816.6,245.0 L813.9,244.7 L812.0,238.4 L809.0,238.4 L806.1,236.3 L804.5,238.0 L801.6,237.9 L800.9,240.4 L795.8,238.8 L792.4,242.1 L790.1,241.3 L786.7,245.2 L783.3,247.2 L783.5,235.7 Z","Massachusetts":"M931.8,162.7 L933.5,163.0 L934.2,167.2 L933.4,170.5 L930.6,173.6 L930.6,177.2 L934.3,177.7 L936.6,181.4 L936.2,184.4 L938.1,185.1 L938.3,187.8 L943.2,190.1 L948.8,188.0 L947.5,191.1 L939.3,193.9 L936.2,194.0 L934.4,191.9 L931.6,192.5 L931.5,194.2 L928.3,195.2 L926.9,191.0 L924.7,188.6 L923.7,183.1 L887.3,182.3 L886.9,181.4 L891.1,166.0 L925.2,167.2 L927.1,165.0 L931.8,162.7 Z","Michigan":"M714.6,189.7 L691.2,190.6 L691.2,189.1 L656.3,189.1 L659.8,186.0 L662.1,180.8 L664.3,177.6 L665.9,173.1 L666.9,166.7 L666.5,159.7 L661.4,145.9 L663.0,140.6 L661.9,134.3 L665.8,127.8 L666.7,122.3 L666.1,119.4 L669.0,118.2 L669.4,114.2 L673.8,113.1 L677.2,108.7 L676.9,117.5 L678.7,117.9 L681.0,113.5 L681.1,106.0 L682.5,104.1 L687.3,102.9 L685.8,97.6 L688.9,93.1 L692.8,92.9 L697.2,95.7 L701.4,96.1 L703.5,99.7 L706.7,99.9 L712.1,103.2 L714.0,103.0 L717.0,108.3 L714.6,111.1 L716.9,114.7 L717.7,118.9 L716.7,127.9 L713.2,130.2 L712.3,134.8 L708.2,136.4 L705.9,141.9 L706.7,144.0 L710.9,146.0 L714.1,143.0 L717.9,136.8 L723.9,134.4 L726.9,136.3 L728.7,139.7 L730.5,149.7 L730.7,154.6 L732.6,160.6 L730.8,169.1 L728.0,170.4 L727.9,167.3 L726.0,168.2 L723.8,175.3 L720.3,178.0 L719.3,183.4 L714.9,187.8 L714.6,189.7 Z M679.0,93.8 L679.3,96.8 L677.0,97.4 L678.0,93.1 L679.0,93.8 Z M643.0,109.5 L640.3,106.9 L641.9,103.4 L637.9,102.9 L639.5,99.5 L639.7,95.2 L636.1,92.2 L634.1,89.1 L626.7,86.6 L624.4,87.4 L617.0,83.7 L599.1,78.7 L597.2,74.4 L594.0,72.9 L600.8,70.2 L603.8,67.2 L611.4,66.0 L616.3,62.2 L618.6,62.1 L620.5,59.4 L625.9,55.7 L628.7,52.4 L632.7,50.3 L636.6,52.2 L628.2,62.6 L628.3,67.3 L631.6,63.7 L637.6,64.3 L642.2,66.8 L646.4,73.7 L648.7,74.9 L653.0,73.8 L654.1,75.4 L658.4,76.2 L667.7,70.4 L679.0,70.1 L683.4,68.2 L686.7,68.0 L687.4,75.1 L690.8,76.0 L694.2,74.9 L695.6,76.6 L697.9,74.5 L702.9,73.8 L703.0,82.6 L705.3,86.3 L708.7,87.3 L709.1,84.8 L712.4,84.8 L714.2,87.4 L712.7,89.3 L703.2,87.7 L698.7,88.8 L693.7,85.8 L692.3,88.5 L693.0,90.8 L690.8,90.3 L687.6,86.9 L682.0,84.8 L679.1,84.7 L676.4,88.0 L671.8,88.8 L666.9,88.1 L664.9,89.5 L664.4,92.2 L659.0,94.5 L659.3,91.2 L656.9,90.6 L656.0,94.0 L652.0,94.1 L650.2,95.6 L647.5,101.4 L642.6,108.8 L643.0,109.5 Z M621.9,36.9 L617.6,40.2 L615.3,40.6 L615.5,37.9 L626.4,31.8 L624.3,36.1 L621.9,36.9 Z","Minnesota":"M566.3,69.4 L565.0,68.3 L561.5,70.4 L561.5,85.2 L560.4,86.7 L555.5,88.8 L551.5,94.1 L551.2,97.6 L553.2,97.9 L555.4,101.0 L553.4,104.8 L553.8,109.0 L552.6,117.9 L557.1,122.3 L560.7,122.7 L562.5,125.4 L567.8,128.1 L568.7,131.2 L573.6,135.3 L576.4,136.3 L579.7,141.5 L579.2,145.3 L580.2,148.1 L489.5,148.1 L489.5,104.5 L485.5,101.7 L482.4,96.9 L487.2,91.6 L487.6,88.8 L486.9,78.8 L484.8,76.2 L483.4,70.7 L483.7,63.9 L483.0,62.8 L482.4,46.4 L477.7,32.7 L477.1,22.1 L478.3,18.5 L476.0,10.2 L512.0,10.2 L512.0,0.0 L515.4,0.3 L517.6,2.3 L519.9,16.1 L521.7,17.7 L527.4,18.1 L528.1,19.4 L534.7,20.0 L535.5,22.8 L541.2,22.1 L541.2,21.0 L545.6,19.5 L549.5,20.1 L554.0,22.3 L555.2,25.0 L557.8,24.7 L560.2,30.5 L561.3,28.1 L565.7,27.0 L566.4,29.4 L571.5,31.1 L571.5,33.4 L574.1,35.2 L579.3,34.2 L582.4,31.7 L586.7,30.1 L588.2,34.0 L591.2,33.1 L594.7,34.0 L598.8,33.4 L603.4,36.6 L607.9,36.1 L607.5,37.5 L601.7,40.8 L593.6,43.3 L588.4,46.0 L580.9,52.6 L572.8,61.2 L565.0,67.3 L566.3,69.4 Z","Mississippi":"M595.8,338.8 L632.4,338.8 L634.2,341.0 L627.7,403.1 L629.0,434.1 L627.1,434.9 L623.0,434.5 L621.3,433.2 L617.1,434.1 L611.3,436.4 L609.5,437.8 L607.4,435.7 L606.7,432.4 L603.9,428.0 L605.6,421.4 L572.9,421.4 L574.1,419.9 L572.9,415.9 L575.0,415.7 L575.2,408.3 L576.9,408.7 L578.0,404.1 L582.1,401.2 L584.2,396.5 L583.8,390.5 L581.2,387.9 L581.4,383.7 L582.6,382.8 L581.0,380.4 L582.4,377.6 L581.4,373.3 L582.9,371.6 L579.9,368.8 L582.6,362.5 L585.8,359.1 L584.7,356.8 L588.3,353.4 L588.2,352.0 L591.4,350.9 L591.1,346.7 L592.9,345.8 L594.1,342.2 L596.9,340.6 L595.8,338.8 Z","Missouri":"M521.0,216.4 L571.3,215.4 L574.8,220.1 L576.7,220.8 L575.1,224.0 L575.3,228.6 L577.5,235.6 L582.8,241.3 L588.6,246.1 L589.8,253.5 L591.1,254.8 L593.1,252.7 L596.9,253.7 L599.3,255.3 L597.6,258.0 L598.1,260.0 L595.2,265.7 L595.1,269.2 L600.2,273.7 L602.1,276.6 L604.0,276.1 L609.6,280.8 L609.6,284.1 L611.0,288.3 L609.6,289.8 L613.5,296.0 L616.2,296.2 L614.8,305.0 L612.2,304.0 L611.3,306.7 L609.2,306.7 L609.3,312.0 L605.9,317.4 L594.7,317.4 L597.4,313.4 L600.1,310.9 L598.6,306.7 L521.3,306.6 L521.3,248.3 L517.6,247.2 L514.9,242.0 L512.7,239.7 L516.6,233.2 L511.0,231.5 L505.0,223.4 L501.3,216.1 L521.0,216.4 Z","Montana":"M357.9,10.2 L358.0,111.9 L236.5,111.8 L236.6,124.6 L233.5,122.1 L230.7,117.8 L226.8,122.9 L223.2,123.8 L222.4,122.5 L218.3,123.5 L215.9,122.3 L212.0,124.5 L206.5,124.3 L204.7,126.6 L202.8,125.3 L200.5,117.4 L196.9,117.1 L194.9,115.1 L195.0,110.4 L192.9,108.7 L190.0,103.7 L188.3,99.0 L188.8,96.9 L185.7,94.5 L184.0,97.2 L179.7,100.6 L176.0,98.0 L176.9,95.3 L175.6,92.7 L178.7,90.0 L176.9,86.2 L177.4,80.3 L179.9,70.9 L174.9,71.1 L174.7,69.4 L170.1,66.8 L169.4,64.0 L162.9,57.2 L162.5,55.4 L159.0,54.3 L155.7,51.2 L155.6,44.1 L150.0,36.9 L150.0,10.2 L357.9,10.2 Z","Nebraska":"M357.8,159.9 L454.0,160.1 L454.6,161.2 L463.5,165.5 L465.6,163.2 L476.2,163.7 L485.3,168.1 L486.4,171.4 L489.6,172.1 L492.7,182.6 L495.1,184.1 L496.2,188.2 L495.2,191.0 L495.6,194.2 L498.7,196.2 L498.6,202.0 L500.3,207.2 L499.3,213.1 L505.0,223.4 L509.3,229.4 L392.4,229.4 L392.4,206.5 L357.8,206.5 L357.8,159.9 Z","Nevada":"M81.5,183.6 L184.7,183.6 L184.6,313.2 L182.8,316.8 L181.1,317.0 L179.0,314.4 L172.7,315.2 L173.7,327.7 L175.1,331.8 L175.5,335.7 L174.5,338.6 L153.4,318.0 L124.9,291.1 L81.5,251.9 L81.5,183.6 Z","New Hampshire":"M928.9,104.4 L930.9,151.9 L933.7,154.6 L933.4,157.0 L935.5,158.6 L933.5,163.0 L931.8,162.7 L927.1,165.0 L925.2,167.2 L905.1,166.4 L903.6,164.6 L903.8,161.1 L905.3,159.8 L905.1,156.4 L906.5,146.4 L909.5,141.7 L911.0,136.3 L912.5,134.3 L912.4,128.3 L918.2,126.1 L921.1,121.9 L919.4,117.9 L921.8,113.9 L921.6,111.5 L924.1,105.2 L928.1,105.9 L928.9,104.4 Z","New Jersey":"M866.3,198.4 L880.1,206.7 L878.0,213.3 L875.1,214.8 L873.6,218.3 L878.4,220.1 L878.7,222.7 L876.7,234.8 L871.3,243.8 L867.7,246.4 L864.6,252.0 L863.0,248.3 L858.0,246.5 L851.8,241.6 L851.3,237.8 L853.9,233.8 L858.5,232.0 L858.8,230.2 L864.1,226.5 L865.0,224.5 L860.1,219.9 L859.9,217.1 L857.7,216.3 L857.5,213.7 L860.2,209.7 L858.7,207.3 L863.1,202.5 L864.0,200.0 L866.3,198.4 Z","New Mexico":"M271.3,295.8 L376.0,295.8 L376.0,306.6 L375.3,306.6 L374.9,401.0 L313.4,401.0 L312.9,403.0 L314.9,405.4 L285.8,405.4 L285.8,414.6 L271.3,414.6 L271.3,295.8 Z","New York":"M889.8,111.5 L889.9,116.6 L889.0,121.1 L890.6,125.5 L890.1,130.2 L888.1,135.1 L889.7,141.7 L888.7,143.6 L891.5,147.6 L891.1,166.0 L886.9,181.4 L887.3,182.3 L886.1,199.9 L887.4,201.8 L883.1,204.3 L884.3,206.9 L891.7,208.8 L893.3,207.4 L899.6,207.4 L902.8,206.7 L908.2,203.0 L908.5,205.7 L911.3,206.8 L904.9,210.2 L891.6,215.2 L886.0,216.2 L882.3,215.9 L879.5,217.1 L878.0,213.3 L880.1,206.7 L866.3,198.4 L865.6,196.7 L862.9,196.6 L859.8,192.7 L860.2,189.2 L858.1,186.5 L856.7,186.7 L854.8,183.5 L778.6,183.5 L778.6,177.2 L789.2,170.5 L790.9,167.3 L794.3,165.1 L793.0,161.1 L791.6,160.3 L790.5,153.8 L800.7,151.1 L813.3,151.9 L817.2,154.5 L819.6,153.4 L827.1,153.6 L831.7,151.9 L836.5,147.6 L839.7,147.4 L839.8,140.9 L841.4,137.1 L837.5,134.4 L838.3,131.4 L845.3,127.3 L847.8,123.7 L856.2,115.5 L864.0,111.4 L875.8,112.1 L889.8,111.5 Z","North Carolina":"M757.5,305.3 L846.0,305.5 L848.0,314.1 L843.2,313.3 L842.5,314.4 L836.6,315.7 L835.8,316.8 L831.9,317.2 L832.1,318.7 L836.8,317.7 L837.5,318.6 L842.7,317.5 L844.4,319.5 L847.5,318.7 L848.7,323.9 L847.6,326.3 L845.5,326.6 L841.2,331.8 L835.4,332.0 L834.4,335.6 L836.9,339.2 L838.9,339.9 L835.2,345.8 L832.1,345.1 L826.6,345.7 L822.8,347.0 L816.8,351.0 L812.0,356.3 L809.6,362.9 L806.0,361.4 L799.7,362.8 L780.1,342.8 L760.6,342.5 L760.9,340.0 L758.3,336.4 L756.5,337.7 L756.4,335.5 L735.0,334.5 L730.3,335.3 L726.6,337.3 L720.6,338.6 L699.6,338.9 L700.1,333.9 L703.5,333.4 L704.8,329.9 L709.1,326.8 L713.9,326.7 L718.1,323.4 L722.6,322.2 L726.4,317.4 L728.7,316.0 L729.2,318.1 L736.1,314.0 L739.2,314.9 L741.4,310.9 L744.6,309.8 L745.4,304.7 L757.5,305.3 Z","North Dakota":"M476.0,10.2 L478.3,18.5 L477.1,22.1 L477.7,32.7 L482.4,46.4 L483.0,62.8 L483.7,63.9 L483.4,70.7 L484.8,76.2 L486.9,78.8 L487.6,88.8 L357.9,88.5 L357.9,10.2 L476.0,10.2 Z","Ohio":"M765.5,184.0 L765.5,214.9 L762.9,216.2 L764.1,218.7 L764.0,222.2 L761.7,227.6 L760.1,235.9 L753.3,243.2 L751.1,244.2 L749.2,242.7 L747.2,245.9 L745.3,245.8 L743.1,250.0 L743.5,252.6 L741.7,254.7 L739.2,251.3 L736.0,256.6 L736.8,260.0 L734.7,261.3 L734.1,264.2 L729.5,264.6 L727.1,261.6 L725.1,261.0 L724.4,257.2 L721.9,258.0 L720.0,260.2 L713.5,258.5 L710.7,260.0 L706.8,257.0 L701.4,256.1 L701.1,254.2 L697.6,249.6 L691.0,249.6 L691.2,190.6 L714.6,189.7 L721.3,192.9 L723.6,194.8 L725.3,193.0 L729.1,196.7 L731.5,197.8 L739.6,194.8 L744.3,195.4 L749.4,191.1 L756.9,186.9 L765.5,184.0 Z","Oklahoma":"M376.0,295.8 L521.3,295.8 L521.3,306.6 L524.5,330.3 L523.5,367.2 L516.9,365.0 L515.2,362.6 L510.7,360.5 L509.6,362.3 L505.1,362.2 L504.2,361.1 L500.1,363.1 L498.4,362.0 L494.7,363.0 L491.3,366.2 L489.9,364.4 L486.3,362.9 L482.5,362.9 L481.3,360.5 L476.9,365.2 L475.5,362.6 L473.5,363.4 L472.0,361.7 L467.9,360.1 L464.9,362.8 L463.6,359.9 L461.1,359.6 L459.7,357.3 L456.4,356.4 L454.2,358.3 L452.8,356.6 L449.3,356.8 L445.5,355.0 L442.0,355.2 L440.8,351.2 L435.3,351.0 L433.2,351.7 L429.3,347.7 L428.0,347.9 L428.0,306.6 L376.0,306.6 L376.0,295.8 Z","Oregon":"M23.1,83.5 L27.5,82.5 L31.2,85.1 L32.8,88.1 L33.7,95.6 L42.6,98.3 L50.2,94.4 L54.9,94.0 L60.4,95.3 L61.0,96.9 L70.5,93.4 L72.8,94.6 L77.9,94.0 L82.2,91.5 L89.8,89.3 L96.7,88.8 L99.1,87.2 L134.9,87.3 L137.3,91.5 L141.4,93.3 L142.8,96.7 L139.2,104.0 L138.1,108.3 L136.1,111.3 L136.4,113.5 L134.6,117.1 L132.8,117.9 L129.3,126.6 L130.6,129.9 L133.9,130.3 L135.3,132.3 L133.0,140.2 L133.0,183.5 L8.5,183.5 L6.1,180.8 L4.7,173.2 L5.0,168.0 L2.7,163.8 L4.4,159.9 L5.6,153.6 L8.2,146.8 L9.3,140.7 L11.2,120.2 L10.9,117.4 L12.6,108.3 L13.3,95.6 L12.3,88.5 L13.2,84.3 L20.1,80.6 L23.1,83.5 Z","Pennsylvania":"M778.6,177.6 L778.6,183.5 L854.8,183.5 L856.7,186.7 L858.1,186.5 L860.2,189.2 L859.8,192.7 L862.9,196.6 L865.6,196.7 L866.3,198.4 L864.0,200.0 L863.1,202.5 L858.7,207.3 L860.2,209.7 L857.5,213.7 L857.7,216.3 L859.9,217.1 L860.1,219.9 L865.0,224.5 L864.1,226.5 L858.8,230.2 L858.5,232.0 L853.9,233.8 L850.4,233.2 L847.4,235.7 L765.5,235.7 L765.5,184.0 L778.6,177.6 Z","Rhode Island":"M926.9,191.0 L928.3,195.2 L924.9,195.7 L926.9,191.0 Z M916.5,183.4 L923.7,183.1 L924.7,188.6 L926.5,190.2 L924.4,189.9 L922.6,193.3 L922.0,198.1 L915.5,199.2 L916.5,197.1 L916.5,183.4 Z","South Carolina":"M726.6,337.3 L730.3,335.3 L735.0,334.5 L756.4,335.5 L756.5,337.7 L758.3,336.4 L760.9,340.0 L760.6,342.5 L780.1,342.8 L799.7,362.8 L796.7,363.8 L792.9,367.2 L789.2,372.6 L788.5,376.9 L785.6,380.3 L781.7,380.3 L780.8,382.8 L776.8,385.5 L774.5,388.4 L770.9,389.7 L767.0,392.8 L766.6,394.3 L763.0,396.0 L759.1,400.3 L755.1,398.5 L755.0,395.1 L752.3,389.6 L749.9,388.1 L749.7,383.7 L748.6,380.3 L743.9,377.1 L740.9,373.3 L741.1,370.9 L736.4,367.4 L734.2,363.5 L730.2,360.9 L727.4,356.5 L726.9,354.1 L724.2,349.5 L722.4,349.8 L716.6,345.3 L716.9,343.2 L720.6,338.6 L726.6,337.3 Z","South Dakota":"M357.9,88.5 L487.6,88.8 L487.2,91.6 L482.4,96.9 L485.5,101.7 L489.5,104.5 L489.5,148.1 L487.2,148.6 L488.1,150.6 L487.6,154.7 L489.8,157.1 L488.4,158.8 L487.9,163.4 L486.3,166.9 L489.6,172.1 L486.4,171.4 L485.3,168.1 L476.2,163.7 L465.6,163.2 L463.5,165.5 L454.6,161.2 L454.0,160.1 L357.8,159.9 L357.9,88.5 Z","Tennessee":"M634.9,306.7 L634.6,302.8 L638.4,303.8 L660.2,303.3 L695.7,304.6 L745.4,304.7 L744.6,309.8 L741.4,310.9 L739.2,314.9 L736.1,314.0 L729.2,318.1 L728.7,316.0 L726.4,317.4 L722.6,322.2 L718.1,323.4 L713.9,326.7 L709.1,326.8 L704.8,329.9 L703.5,333.4 L700.1,333.9 L699.6,338.9 L595.8,338.8 L597.5,338.2 L599.2,334.5 L599.0,329.4 L602.2,325.9 L602.8,322.6 L605.3,321.4 L605.9,317.4 L609.3,312.0 L609.2,306.7 L634.9,306.7 Z","Texas":"M375.3,306.6 L428.0,306.6 L428.0,347.9 L429.3,347.7 L433.2,351.7 L435.3,351.0 L440.8,351.2 L442.0,355.2 L445.5,355.0 L449.3,356.8 L452.8,356.6 L454.2,358.3 L456.4,356.4 L459.7,357.3 L461.1,359.6 L463.6,359.9 L464.9,362.8 L467.9,360.1 L472.0,361.7 L473.5,363.4 L475.5,362.6 L476.9,365.2 L481.3,360.5 L482.5,362.9 L486.3,362.9 L489.9,364.4 L491.3,366.2 L494.7,363.0 L498.4,362.0 L500.1,363.1 L504.2,361.1 L505.1,362.2 L509.6,362.3 L510.7,360.5 L515.2,362.6 L516.9,365.0 L523.5,367.2 L525.3,369.2 L528.7,368.2 L531.2,369.1 L531.2,401.1 L535.0,405.6 L535.1,410.0 L539.8,418.3 L540.1,422.6 L538.3,427.8 L536.6,429.9 L537.2,432.6 L536.0,434.7 L537.3,438.6 L533.2,445.7 L534.7,447.6 L531.9,447.8 L522.9,450.5 L519.6,449.0 L519.1,445.7 L516.8,448.0 L515.2,447.4 L514.3,450.3 L516.1,451.5 L516.4,455.2 L513.2,459.1 L508.0,464.0 L497.5,469.2 L496.5,468.3 L493.4,469.6 L493.3,468.4 L489.0,469.3 L487.0,466.8 L485.8,467.3 L490.3,472.4 L487.0,474.0 L483.9,473.0 L483.4,476.6 L479.5,480.3 L475.5,487.0 L473.0,494.1 L471.1,493.5 L470.6,496.1 L472.6,495.5 L471.6,500.6 L470.3,500.8 L470.2,503.7 L471.8,505.3 L472.3,511.1 L474.2,513.1 L474.7,516.8 L476.2,520.1 L470.9,522.1 L468.7,519.6 L464.6,518.6 L459.2,518.8 L454.6,515.7 L451.0,515.3 L448.4,512.8 L444.8,511.9 L442.3,509.5 L440.7,503.7 L437.6,500.2 L438.0,497.2 L436.5,494.0 L437.0,491.2 L434.8,488.1 L433.0,487.8 L430.1,485.0 L429.1,481.4 L426.6,478.2 L422.9,475.5 L421.1,469.6 L419.4,468.0 L417.1,463.2 L416.3,459.3 L414.1,456.5 L410.4,454.0 L409.6,452.2 L406.2,450.7 L403.5,446.3 L395.9,445.4 L391.4,445.6 L387.5,444.0 L386.6,446.1 L382.4,446.8 L379.3,450.9 L377.4,457.6 L376.4,457.7 L374.0,461.6 L371.2,461.7 L366.9,458.6 L356.2,453.8 L354.1,451.1 L349.9,448.6 L347.0,442.9 L346.8,437.8 L343.8,433.6 L343.2,430.0 L341.3,427.7 L334.5,424.2 L330.9,419.6 L328.0,417.9 L324.9,413.9 L320.5,411.8 L317.5,406.5 L314.9,405.4 L312.9,403.0 L313.4,401.0 L374.9,401.0 L375.3,306.6 Z","Utah":"M184.7,183.6 L236.6,183.5 L236.6,206.7 L271.3,206.7 L271.3,295.8 L184.6,295.8 L184.7,183.6 Z","Vermont":"M921.6,111.5 L921.8,113.9 L919.4,117.9 L921.1,121.9 L918.2,126.1 L912.4,128.3 L912.5,134.3 L911.0,136.3 L909.5,141.7 L906.5,146.4 L905.1,156.4 L905.3,159.8 L903.8,161.1 L903.6,164.6 L905.1,166.4 L891.1,166.0 L891.5,147.6 L888.7,143.6 L889.7,141.7 L888.1,135.1 L890.1,130.2 L890.6,125.5 L889.0,121.1 L889.9,116.6 L889.8,111.5 L921.6,111.5 Z","Virginia":"M849.4,275.0 L856.8,273.3 L854.6,277.1 L852.2,278.4 L850.8,283.4 L847.2,291.6 L844.2,293.2 L843.3,290.2 L844.8,283.6 L849.4,275.0 Z M843.5,275.0 L843.8,275.0 L843.0,275.0 L843.5,275.0 Z M803.0,241.5 L812.0,248.9 L813.9,244.7 L816.6,245.0 L818.5,246.9 L818.5,250.2 L822.1,251.3 L824.4,253.3 L825.7,256.5 L824.2,260.0 L822.1,261.0 L820.8,264.2 L821.5,266.5 L826.2,265.7 L827.0,269.2 L833.1,270.7 L834.8,273.5 L839.7,276.5 L837.5,282.6 L839.5,287.4 L837.1,289.6 L836.8,292.4 L839.0,294.1 L836.6,296.7 L833.0,293.2 L832.2,294.4 L835.3,296.9 L843.8,297.5 L846.0,305.5 L782.9,305.8 L710.8,304.5 L720.1,301.4 L721.3,299.0 L724.6,298.2 L724.8,296.3 L727.3,294.9 L727.3,293.2 L733.7,290.0 L740.3,284.1 L740.0,285.9 L742.4,289.6 L745.4,291.4 L747.5,291.3 L750.9,288.5 L753.2,290.7 L757.7,289.5 L765.6,285.3 L766.2,286.7 L769.3,284.7 L769.4,280.8 L771.3,277.3 L774.5,274.1 L775.8,270.1 L779.2,266.0 L780.6,260.9 L783.5,263.9 L786.3,264.9 L788.1,263.1 L791.8,255.2 L794.0,257.1 L802.1,248.1 L803.0,241.5 Z","Washington":"M132.9,10.2 L132.5,78.5 L134.8,82.9 L134.9,87.3 L99.1,87.2 L96.7,88.8 L89.8,89.3 L82.2,91.5 L77.9,94.0 L72.8,94.6 L70.5,93.4 L61.0,96.9 L60.4,95.3 L54.9,94.0 L50.2,94.4 L42.6,98.3 L33.7,95.6 L32.8,88.1 L31.2,85.1 L27.5,82.5 L23.1,83.5 L20.1,80.6 L17.0,79.6 L14.4,81.1 L11.1,78.9 L11.8,75.5 L14.0,73.7 L10.5,68.4 L8.2,54.7 L6.7,52.9 L4.8,43.0 L1.4,39.2 L0.0,31.5 L1.9,26.4 L12.5,32.1 L17.4,32.0 L22.2,33.2 L26.8,32.0 L28.9,34.2 L33.0,34.1 L35.9,39.8 L38.0,39.3 L38.3,47.0 L39.6,53.8 L41.3,53.1 L39.6,47.2 L40.0,41.5 L42.9,35.5 L40.6,33.1 L40.4,28.8 L38.7,24.1 L39.6,20.7 L38.4,16.7 L35.7,16.1 L33.1,13.1 L33.8,10.2 L132.9,10.2 Z M34.4,28.3 L36.7,27.1 L36.3,32.4 L33.6,30.4 L34.4,28.3 Z M29.1,21.1 L31.0,17.7 L33.6,21.8 L32.8,25.4 L28.8,24.4 L29.1,21.1 Z","West Virginia":"M765.5,214.9 L765.5,235.7 L783.5,235.7 L783.3,247.2 L786.7,245.2 L790.1,241.3 L792.4,242.1 L795.8,238.8 L800.9,240.4 L801.6,237.9 L804.5,238.0 L806.1,236.3 L809.0,238.4 L812.0,238.4 L813.9,244.7 L812.0,248.9 L803.0,241.5 L802.1,248.1 L794.0,257.1 L791.8,255.2 L788.1,263.1 L786.3,264.9 L783.5,263.9 L780.6,260.9 L779.2,266.0 L775.8,270.1 L774.5,274.1 L771.3,277.3 L769.4,280.8 L769.3,284.7 L766.2,286.7 L765.6,285.3 L757.7,289.5 L753.2,290.7 L750.9,288.5 L747.5,291.3 L745.4,291.4 L742.4,289.6 L740.0,285.9 L740.3,284.1 L738.0,283.8 L734.7,281.3 L733.9,278.8 L731.1,275.5 L729.0,271.3 L729.5,264.6 L734.1,264.2 L734.7,261.3 L736.8,260.0 L736.0,256.6 L739.2,251.3 L741.7,254.7 L743.5,252.6 L743.1,250.0 L745.3,245.8 L747.2,245.9 L749.2,242.7 L751.1,244.2 L753.3,243.2 L760.1,235.9 L761.7,227.6 L764.0,222.2 L764.1,218.7 L762.9,216.2 L765.5,214.9 Z","Wisconsin":"M591.6,72.5 L597.2,74.4 L599.1,78.7 L617.0,83.7 L624.4,87.4 L626.7,86.6 L634.1,89.1 L636.1,92.2 L639.7,95.2 L639.5,99.5 L637.9,102.9 L641.9,103.4 L640.3,106.9 L643.0,109.5 L642.3,112.5 L639.0,113.0 L636.1,118.6 L635.1,122.5 L637.1,123.1 L639.8,120.6 L642.6,115.8 L646.2,113.9 L649.1,107.8 L652.7,106.4 L652.4,109.6 L649.9,112.6 L645.1,122.7 L643.7,128.3 L643.8,132.3 L642.0,133.6 L640.4,139.0 L641.0,143.6 L639.5,146.6 L637.4,154.1 L637.9,159.9 L639.9,165.1 L639.3,172.0 L590.1,171.6 L588.9,168.6 L582.7,165.9 L581.4,162.1 L580.8,156.8 L582.9,154.0 L580.4,151.6 L580.2,148.1 L579.2,145.3 L579.7,141.5 L576.4,136.3 L573.6,135.3 L568.7,131.2 L567.8,128.1 L562.5,125.4 L560.7,122.7 L557.1,122.3 L552.6,117.9 L553.8,109.0 L553.4,104.8 L555.4,101.0 L553.2,97.9 L551.2,97.6 L551.5,94.1 L555.5,88.8 L560.4,86.7 L561.5,85.2 L561.5,70.4 L565.0,68.3 L566.3,69.4 L570.2,69.7 L582.3,65.4 L586.7,63.0 L588.2,64.8 L585.9,68.2 L591.6,72.5 Z","Wyoming":"M236.5,111.8 L357.7,111.9 L357.8,206.5 L236.6,206.7 L236.5,111.8 Z"},"boros":{"Staten Island":"M877.5,216.3 L877.4,216.3 L877.4,216.3 L877.4,216.2 L877.5,216.2 L877.5,216.2 L877.5,216.3 Z M875.6,214.8 L875.6,214.8 L875.6,214.8 L875.7,214.8 L875.6,214.8 Z M876.9,214.7 L877.0,214.7 L877.1,214.8 L877.1,214.7 L877.1,214.8 L877.1,214.8 L877.1,214.8 L877.2,214.8 L877.1,214.8 L877.2,214.8 L877.1,214.8 L877.2,214.8 L877.1,214.8 L877.1,214.9 L877.2,214.9 L877.1,214.9 L877.1,214.9 L877.1,214.9 L877.2,214.9 L877.1,214.9 L877.1,215.0 L877.1,215.0 L877.1,215.1 L877.2,215.1 L877.1,215.1 L877.1,215.2 L877.2,215.3 L877.2,215.4 L877.2,215.3 L877.2,215.4 L877.3,215.4 L877.2,215.4 L877.3,215.4 L877.3,215.4 L877.3,215.4 L877.3,215.5 L877.3,215.5 L877.3,215.5 L877.4,215.6 L877.5,215.7 L877.5,215.8 L877.5,215.8 L877.3,216.0 L877.3,216.0 L877.3,216.1 L877.2,216.2 L877.1,216.2 L877.2,216.2 L877.1,216.2 L877.1,216.3 L877.1,216.3 L877.1,216.3 L877.1,216.3 L877.1,216.3 L877.0,216.3 L877.0,216.4 L877.0,216.4 L876.9,216.5 L876.9,216.5 L876.9,216.5 L876.9,216.5 L876.8,216.5 L876.8,216.5 L876.8,216.6 L876.7,216.6 L876.7,216.7 L876.7,216.7 L876.7,216.7 L876.6,216.7 L876.6,216.8 L876.6,216.8 L876.6,216.8 L876.6,216.9 L876.5,216.8 L876.4,217.0 L876.4,217.0 L876.3,217.0 L876.3,217.0 L876.1,217.3 L876.0,217.4 L876.0,217.4 L876.0,217.3 L876.1,217.3 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.1,217.2 L876.2,217.1 L876.2,217.1 L876.1,217.0 L876.0,217.0 L876.0,217.0 L876.0,217.0 L876.0,217.0 L876.0,217.0 L876.0,217.0 L876.0,217.0 L876.0,217.1 L876.0,217.0 L876.0,217.0 L876.0,217.1 L876.0,217.0 L876.0,217.1 L876.0,217.0 L876.0,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L875.9,217.1 L875.9,217.1 L876.0,217.1 L876.0,217.1 L876.0,217.1 L875.9,217.1 L876.0,217.1 L875.9,217.1 L875.9,217.1 L875.9,217.1 L875.9,217.1 L875.9,217.1 L875.9,217.2 L875.9,217.2 L875.9,217.2 L875.9,217.2 L875.9,217.2 L875.9,217.2 L875.9,217.2 L875.9,217.2 L875.9,217.3 L875.8,217.3 L875.7,217.4 L875.6,217.4 L875.4,217.5 L875.4,217.5 L875.3,217.6 L875.2,217.6 L875.2,217.6 L875.0,217.8 L874.9,217.8 L874.9,217.8 L874.8,217.8 L874.6,218.0 L874.5,218.0 L874.4,218.0 L874.3,218.1 L874.2,218.1 L874.2,218.1 L874.1,218.2 L874.1,218.1 L874.0,218.1 L874.0,218.0 L874.0,217.9 L874.0,217.9 L874.0,217.8 L874.0,217.8 L874.0,217.8 L874.0,217.8 L874.1,217.7 L874.0,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.1,217.7 L874.2,217.7 L874.2,217.6 L874.2,217.6 L874.2,217.5 L874.2,217.5 L874.2,217.4 L874.2,217.3 L874.2,217.2 L874.1,217.2 L874.2,217.2 L874.1,217.1 L874.1,217.1 L874.2,217.0 L874.2,217.0 L874.2,217.0 L874.3,216.9 L874.3,216.9 L874.3,216.9 L874.4,216.8 L874.4,216.8 L874.5,216.8 L874.6,216.8 L874.6,216.8 L874.6,216.8 L874.6,216.8 L874.6,216.8 L874.6,216.8 L874.6,216.8 L874.7,216.8 L874.7,216.8 L874.7,216.7 L874.7,216.6 L874.8,216.5 L874.8,216.2 L874.8,216.2 L874.8,216.0 L874.9,216.0 L874.9,216.0 L874.9,216.0 L874.9,216.0 L875.0,215.9 L874.9,215.7 L874.9,215.7 L874.9,215.6 L874.9,215.5 L874.9,215.4 L874.9,215.3 L874.9,215.3 L874.9,215.3 L874.9,215.1 L875.0,215.0 L875.0,214.9 L875.2,214.8 L875.2,214.8 L875.2,214.8 L875.2,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.3,214.8 L875.4,214.8 L875.4,214.8 L875.4,214.8 L875.4,214.9 L875.4,214.9 L875.4,214.9 L875.4,214.9 L875.4,214.9 L875.4,214.8 L875.4,214.8 L875.4,214.8 L875.5,214.8 L875.5,214.8 L875.5,214.8 L875.5,214.8 L875.5,214.9 L875.5,214.8 L875.5,214.9 L875.5,214.9 L875.5,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.6,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.7,214.9 L875.8,214.9 L875.8,214.9 L875.8,214.9 L875.8,214.9 L875.8,214.9 L875.8,214.9 L875.9,214.9 L875.9,214.9 L876.1,214.8 L876.1,214.9 L876.1,214.8 L876.1,214.9 L876.2,214.8 L876.2,214.9 L876.2,214.9 L876.2,214.9 L876.2,214.9 L876.2,214.8 L876.2,214.8 L876.2,214.9 L876.2,214.9 L876.3,214.9 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.3,214.8 L876.4,214.8 L876.4,214.8 L876.4,214.8 L876.4,214.8 L876.4,214.8 L876.4,214.8 L876.4,214.8 L876.4,214.8 L876.5,214.8 L876.7,214.8 L876.8,214.7 L876.9,214.7 Z","Queens":"M881.2,215.9 L881.3,216.0 L881.3,216.0 L881.3,216.0 L881.3,216.0 L881.2,216.0 L881.3,216.0 L881.2,216.0 L881.2,216.0 L881.2,216.0 L881.2,216.0 L881.1,216.0 L881.1,215.9 L881.2,215.9 Z M881.6,215.7 L881.7,215.7 L881.7,215.8 L881.7,215.8 L881.6,215.7 L881.6,215.7 Z M881.3,215.6 L881.2,215.7 L881.3,215.6 L881.3,215.6 L881.3,215.6 L881.3,215.6 L881.3,215.6 Z M882.0,215.6 L882.0,215.6 L881.9,215.6 L882.0,215.7 L881.9,215.7 L881.8,215.7 L881.8,215.6 L881.8,215.6 L881.8,215.6 L881.9,215.6 L882.0,215.6 Z M882.3,215.5 L882.5,215.5 L882.5,215.5 L882.5,215.5 L882.5,215.5 L882.5,215.6 L882.5,215.6 L882.5,215.5 L882.5,215.6 L882.6,215.6 L882.8,215.5 L882.8,215.5 L882.8,215.6 L882.9,215.7 L882.9,215.8 L882.9,215.9 L882.9,215.9 L882.9,215.9 L882.9,215.9 L882.9,215.9 L882.9,215.8 L882.9,215.9 L882.8,215.9 L882.7,216.0 L882.5,216.0 L882.3,216.0 L881.6,216.2 L881.3,216.3 L880.8,216.6 L880.7,216.5 L880.7,216.6 L880.7,216.6 L880.7,216.6 L880.6,216.6 L880.6,216.6 L880.6,216.6 L880.6,216.6 L880.6,216.6 L880.2,216.8 L880.1,216.8 L880.0,216.8 L879.4,217.1 L879.4,217.1 L879.4,216.9 L879.4,216.8 L879.5,216.8 L879.6,216.8 L879.7,216.7 L879.8,216.6 L879.9,216.6 L879.9,216.6 L879.9,216.6 L879.9,216.6 L880.0,216.6 L879.9,216.6 L880.0,216.6 L880.0,216.6 L880.1,216.6 L880.2,216.6 L880.2,216.5 L880.2,216.5 L880.3,216.5 L880.4,216.5 L880.4,216.5 L880.4,216.5 L880.4,216.5 L880.5,216.5 L881.0,216.2 L881.2,216.2 L881.2,216.2 L881.4,216.1 L881.4,216.1 L881.4,216.1 L881.5,216.1 L881.6,216.0 L881.6,216.0 L881.6,216.0 L881.6,216.0 L881.7,216.0 L881.7,216.0 L881.7,216.0 L881.7,216.0 L881.7,216.0 L881.7,215.9 L881.7,216.0 L881.7,216.0 L881.7,215.9 L881.7,216.0 L881.8,216.0 L881.7,216.0 L881.8,216.0 L881.7,215.9 L881.7,215.9 L881.7,215.9 L881.8,215.9 L881.8,216.0 L881.8,216.0 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.9 L881.8,215.8 L882.0,215.8 L882.1,215.7 L882.1,215.7 L882.0,215.8 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.9 L882.0,215.8 L882.1,215.7 L882.1,215.7 L882.2,215.6 L882.3,215.6 L882.3,215.6 L882.3,215.6 L882.3,215.6 L882.3,215.6 L882.3,215.6 L882.3,215.6 L882.3,215.7 L882.2,215.8 L882.2,215.8 L882.2,215.8 L882.2,215.8 L882.2,215.9 L882.3,215.7 L882.3,215.8 L882.4,215.8 L882.4,215.8 L882.4,215.6 L882.3,215.5 L882.3,215.5 L882.3,215.6 L882.3,215.5 L882.3,215.5 Z M882.4,215.4 L882.4,215.4 L882.3,215.4 L882.4,215.3 L882.4,215.3 L882.4,215.4 Z M881.9,215.2 L881.9,215.2 L881.9,215.2 L882.0,215.2 L881.9,215.3 L881.9,215.3 L881.9,215.4 L881.8,215.3 L881.8,215.4 L881.8,215.5 L881.8,215.5 L881.8,215.4 L881.7,215.3 L881.7,215.2 L881.8,215.2 L881.8,215.2 L881.9,215.2 Z M881.6,215.1 L881.6,215.2 L881.6,215.1 L881.7,215.2 L881.6,215.3 L881.7,215.4 L881.7,215.4 L881.6,215.3 L881.6,215.2 L881.6,215.2 L881.6,215.2 L881.6,215.2 L881.6,215.1 L881.6,215.1 L881.6,215.1 Z M881.4,214.9 L881.5,215.1 L881.6,215.2 L881.5,215.2 L881.5,215.3 L881.6,215.3 L881.6,215.3 L881.6,215.3 L881.5,215.4 L881.6,215.5 L881.6,215.5 L881.6,215.5 L881.6,215.5 L881.6,215.5 L881.6,215.6 L881.6,215.5 L881.6,215.6 L881.6,215.6 L881.5,215.7 L881.5,215.8 L881.5,215.9 L881.3,215.9 L881.2,215.9 L881.3,215.8 L881.4,215.8 L881.4,215.8 L881.4,215.8 L881.4,215.8 L881.5,215.8 L881.4,215.8 L881.5,215.7 L881.5,215.7 L881.5,215.6 L881.5,215.5 L881.5,215.5 L881.5,215.5 L881.5,215.6 L881.5,215.6 L881.4,215.5 L881.4,215.5 L881.4,215.5 L881.3,215.4 L881.3,215.5 L881.3,215.2 L881.3,215.0 L881.3,214.9 L881.3,214.9 L881.4,215.0 L881.4,215.0 L881.4,215.0 L881.4,214.9 Z M881.5,211.2 L881.6,211.3 L881.6,211.3 L881.8,211.3 L881.8,211.3 L881.9,211.3 L881.9,211.3 L881.9,211.3 L881.9,211.4 L882.0,211.5 L882.0,211.5 L882.0,211.4 L882.2,211.4 L882.1,211.4 L882.2,211.4 L882.2,211.4 L882.2,211.4 L882.2,211.4 L882.2,211.4 L882.1,211.3 L882.2,211.3 L882.3,211.3 L882.3,211.3 L882.4,211.5 L882.3,211.5 L882.3,211.5 L882.4,211.7 L882.4,211.7 L882.4,211.7 L882.4,211.7 L882.5,211.8 L882.6,212.0 L882.6,212.0 L882.7,212.1 L882.8,212.1 L882.8,212.2 L882.8,212.2 L882.8,212.2 L882.8,212.2 L882.7,212.1 L882.7,212.1 L882.6,212.0 L882.6,211.9 L882.6,211.9 L882.7,211.8 L882.6,211.7 L882.6,211.7 L882.7,211.6 L882.7,211.6 L883.5,212.3 L883.6,212.3 L883.6,212.6 L883.5,212.9 L883.3,212.9 L883.1,213.0 L883.1,213.3 L883.1,214.0 L883.1,214.1 L883.1,214.3 L883.1,214.5 L883.1,214.6 L883.0,214.7 L882.9,214.7 L882.9,214.8 L882.9,214.9 L882.9,214.9 L882.9,215.0 L882.9,215.0 L882.8,215.0 L882.9,214.9 L882.9,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.9 L882.8,214.8 L882.7,214.8 L882.6,214.7 L882.7,214.8 L882.8,214.8 L882.7,215.0 L882.5,215.1 L882.4,215.2 L882.4,215.2 L882.4,215.3 L882.4,215.3 L882.3,215.3 L882.4,215.3 L882.3,215.3 L882.3,215.3 L882.3,215.3 L882.3,215.3 L882.3,215.3 L882.3,215.3 L882.3,215.2 L882.2,215.2 L882.1,215.3 L882.1,215.4 L882.2,215.5 L882.2,215.5 L882.0,215.6 L882.0,215.6 L882.0,215.6 L882.0,215.6 L881.9,215.6 L881.8,215.5 L881.9,215.5 L881.9,215.4 L881.9,215.4 L881.9,215.3 L882.0,215.3 L882.1,215.1 L882.2,215.1 L882.0,215.0 L881.9,215.1 L882.0,215.0 L882.0,215.0 L881.5,214.7 L881.5,214.7 L881.4,214.5 L881.5,214.4 L881.5,214.4 L881.7,214.4 L881.5,214.4 L881.4,214.4 L881.4,214.5 L881.5,214.7 L881.4,214.6 L881.4,214.7 L881.4,214.7 L881.3,214.6 L881.3,214.6 L881.3,214.5 L881.3,214.5 L881.3,214.6 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.4 L881.3,214.4 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.5 L881.3,214.7 L881.3,214.7 L881.2,214.7 L881.2,214.4 L881.2,214.4 L881.2,214.4 L881.2,214.8 L881.0,214.8 L880.9,214.7 L881.0,214.6 L880.9,214.6 L880.9,214.6 L880.8,214.5 L880.8,214.5 L880.8,214.5 L880.8,214.5 L880.8,214.4 L880.8,214.4 L880.8,214.5 L880.8,214.5 L880.8,214.5 L880.8,214.5 L880.8,214.4 L880.9,214.4 L880.8,214.3 L880.9,214.3 L880.9,214.2 L880.8,214.2 L880.8,214.0 L880.8,214.0 L880.7,213.9 L880.7,213.9 L880.7,213.6 L880.6,213.6 L880.5,213.7 L880.4,213.8 L880.3,213.9 L880.3,213.8 L880.2,213.9 L880.2,213.8 L880.2,213.9 L880.1,213.8 L880.1,213.8 L880.1,213.7 L880.1,213.7 L880.0,213.6 L880.0,213.6 L879.9,213.5 L879.9,213.5 L879.9,213.5 L879.9,213.4 L879.7,213.3 L879.8,213.3 L879.7,213.2 L879.7,213.2 L879.8,213.1 L879.7,213.1 L879.7,213.0 L879.7,213.0 L879.8,213.0 L879.7,212.9 L879.6,212.9 L879.5,212.8 L879.4,212.7 L879.3,212.6 L879.4,212.6 L879.4,212.5 L879.4,212.5 L879.4,212.6 L879.4,212.6 L879.3,212.6 L879.2,212.6 L879.1,212.6 L879.1,212.6 L879.0,212.6 L879.1,212.6 L879.0,212.6 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.5 L879.1,212.4 L879.2,212.4 L879.1,212.4 L879.1,212.4 L879.2,212.4 L879.4,212.0 L879.4,212.0 L879.5,211.9 L879.5,211.9 L879.5,211.8 L879.5,211.8 L879.5,211.7 L879.5,211.7 L879.6,211.7 L879.6,211.8 L879.6,211.8 L879.8,211.6 L879.9,211.5 L879.9,211.4 L880.1,211.5 L880.2,211.5 L880.1,211.6 L880.1,211.6 L880.1,211.7 L880.1,211.6 L880.1,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.2,211.6 L880.3,211.6 L880.2,211.6 L880.3,211.7 L880.2,211.7 L880.3,211.7 L880.2,211.7 L880.3,211.8 L880.3,211.8 L880.3,211.7 L880.3,211.8 L880.3,211.8 L880.3,211.8 L880.4,211.8 L880.4,211.8 L880.4,211.7 L880.5,211.7 L880.5,211.6 L880.5,211.6 L880.5,211.6 L880.5,211.6 L880.6,211.5 L880.6,211.6 L880.7,211.5 L880.7,211.5 L880.6,211.6 L880.6,211.6 L880.7,211.6 L880.7,211.6 L880.6,211.7 L880.9,211.9 L880.9,211.9 L880.8,211.9 L880.9,211.9 L880.9,211.9 L880.8,212.0 L880.8,212.0 L880.8,212.1 L880.9,212.1 L880.8,212.1 L880.8,212.1 L880.9,212.1 L880.9,212.0 L880.9,212.1 L880.9,212.1 L880.8,212.1 L880.9,212.1 L880.8,212.1 L881.0,212.1 L881.0,212.1 L881.0,212.1 L880.9,212.1 L881.0,212.1 L881.0,212.1 L881.1,212.1 L881.1,212.0 L881.2,212.0 L881.2,212.0 L881.1,212.0 L881.0,212.0 L881.0,211.9 L881.0,211.9 L881.0,211.9 L881.0,211.9 L881.0,211.9 L881.0,211.9 L881.0,211.9 L881.0,211.8 L881.0,211.7 L881.0,211.7 L881.0,211.7 L881.0,211.7 L881.0,211.7 L880.9,211.7 L881.0,211.7 L881.0,211.7 L881.0,211.7 L881.0,211.7 L881.0,211.6 L880.9,211.6 L880.9,211.6 L880.8,211.6 L880.8,211.6 L880.8,211.5 L880.8,211.5 L880.9,211.5 L880.9,211.5 L880.9,211.5 L880.9,211.5 L880.9,211.4 L880.9,211.4 L880.9,211.4 L880.9,211.4 L880.9,211.3 L881.0,211.4 L881.0,211.3 L881.0,211.3 L881.1,211.3 L881.1,211.3 L881.1,211.3 L881.1,211.3 L881.1,211.3 L881.1,211.3 L881.2,211.3 L881.2,211.3 L881.2,211.3 L881.2,211.3 L881.2,211.3 L881.2,211.4 L881.2,211.4 L881.2,211.4 L881.2,211.4 L881.2,211.4 L881.2,211.5 L881.2,211.5 L881.3,211.5 L881.3,211.5 L881.3,211.4 L881.3,211.4 L881.4,211.4 L881.3,211.4 L881.4,211.4 L881.4,211.3 L881.3,211.3 L881.4,211.3 L881.4,211.3 L881.4,211.3 L881.5,211.2 Z","Brooklyn":"M880.8,216.2 L880.7,216.2 L880.6,216.2 L880.6,216.1 L880.6,216.0 L880.7,216.0 L880.8,216.0 L880.8,216.1 L880.8,216.2 Z M879.8,215.8 L879.8,215.8 L879.9,215.9 L879.9,216.0 L879.9,216.0 L879.8,215.9 L879.7,215.8 L879.7,215.8 L879.8,215.8 Z M880.9,215.8 L880.9,215.9 L880.8,215.9 L880.8,215.8 L880.8,215.7 L880.9,215.7 L881.0,215.8 L880.9,215.8 Z M880.6,215.6 L880.6,215.7 L880.6,215.5 L880.6,215.6 L880.6,215.6 Z M880.9,215.4 L880.9,215.5 L880.9,215.5 L880.9,215.5 L880.9,215.4 L881.0,215.4 L881.0,215.6 L880.9,215.6 L880.9,215.6 L880.9,215.6 L880.8,215.6 L880.8,215.5 L880.9,215.5 L880.8,215.4 L880.9,215.4 Z M881.1,215.4 L881.1,215.4 L881.1,215.4 L881.1,215.4 L881.1,215.5 L881.2,215.5 L881.1,215.7 L881.0,215.7 L881.0,215.6 L881.0,215.6 L881.0,215.5 L881.1,215.4 L881.1,215.4 Z M881.3,215.2 L881.3,215.5 L881.3,215.5 L881.2,215.4 L881.2,215.4 L881.2,215.3 L881.2,215.3 L881.2,215.2 L881.3,215.2 Z M880.7,215.4 L880.5,215.4 L880.6,215.3 L880.7,215.2 L880.7,215.2 L880.7,215.4 Z M881.0,215.1 L881.0,215.2 L881.0,215.2 L881.1,215.2 L881.1,215.3 L880.9,215.3 L880.8,215.4 L880.7,215.4 L880.7,215.4 L880.8,215.4 L880.8,215.2 L880.8,215.3 L880.8,215.2 L880.8,215.2 L880.8,215.2 L880.9,215.1 L880.9,215.2 L880.9,215.1 L881.0,215.1 L881.0,215.1 L881.0,215.1 Z M881.2,215.1 L881.1,215.2 L881.1,215.1 L881.1,215.1 L881.2,215.0 L881.2,215.1 Z M881.1,215.0 L881.0,215.1 L880.8,215.1 L880.9,215.0 L881.0,214.9 L881.1,215.0 L881.1,215.0 Z M879.2,212.6 L879.3,212.7 L879.3,212.7 L879.3,212.7 L879.3,212.7 L879.3,212.7 L879.3,212.7 L879.4,212.7 L879.5,212.8 L879.6,212.9 L879.7,213.1 L879.7,213.1 L879.6,213.1 L879.6,213.1 L879.6,213.1 L879.6,213.2 L879.6,213.2 L879.6,213.2 L879.6,213.2 L879.5,213.3 L879.6,213.2 L879.6,213.3 L879.6,213.2 L879.6,213.2 L879.6,213.2 L879.6,213.2 L879.6,213.2 L879.6,213.2 L879.6,213.1 L879.6,213.1 L879.7,213.1 L879.7,213.1 L879.7,213.1 L879.7,213.2 L879.8,213.3 L879.7,213.3 L879.9,213.4 L879.9,213.5 L879.9,213.5 L879.9,213.5 L880.0,213.6 L880.0,213.6 L880.1,213.7 L880.1,213.7 L880.1,213.8 L880.1,213.8 L880.2,213.9 L880.2,213.8 L880.2,213.9 L880.4,213.8 L880.5,213.7 L880.6,213.6 L880.7,213.6 L880.7,213.9 L880.7,213.9 L880.8,214.0 L880.8,214.0 L880.8,214.2 L880.9,214.2 L880.9,214.3 L880.8,214.3 L880.9,214.4 L880.8,214.5 L880.8,214.5 L880.9,214.6 L880.8,214.7 L880.9,214.8 L880.8,214.8 L880.7,214.9 L880.7,214.9 L880.7,214.9 L880.6,214.8 L880.6,214.7 L880.5,214.5 L880.6,214.9 L880.7,214.9 L880.6,214.9 L880.6,214.9 L880.6,215.0 L880.6,215.0 L880.5,214.9 L880.4,214.8 L880.4,214.8 L880.4,214.8 L880.3,214.7 L880.3,214.7 L880.3,214.7 L880.3,214.7 L880.3,214.7 L880.3,214.7 L880.3,214.7 L880.3,214.8 L880.3,214.8 L880.5,214.9 L880.5,215.0 L880.4,215.1 L880.4,215.1 L880.4,215.1 L880.4,215.2 L880.4,215.1 L880.3,215.1 L880.3,215.2 L880.2,215.3 L880.1,215.3 L880.1,215.2 L879.8,215.1 L879.8,215.1 L880.1,215.2 L880.1,215.2 L880.1,215.3 L880.2,215.3 L880.2,215.3 L880.2,215.4 L880.2,215.5 L880.3,215.5 L880.2,215.5 L880.3,215.5 L880.3,215.5 L880.3,215.6 L880.2,215.6 L880.1,215.7 L880.1,215.6 L880.1,215.6 L880.1,215.5 L880.1,215.5 L880.1,215.5 L880.1,215.5 L880.0,215.4 L880.0,215.4 L880.0,215.4 L880.0,215.4 L880.0,215.4 L880.0,215.4 L880.0,215.4 L880.0,215.4 L880.1,215.6 L880.1,215.7 L880.0,215.7 L880.0,215.6 L880.0,215.6 L880.0,215.7 L880.0,215.6 L879.9,215.7 L880.0,215.7 L879.9,215.7 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.5 L879.9,215.5 L879.9,215.4 L879.8,215.5 L879.8,215.5 L879.8,215.5 L879.8,215.5 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.8,215.6 L879.9,215.7 L879.9,215.7 L879.9,215.7 L880.0,215.7 L879.9,215.7 L880.0,215.8 L880.1,215.7 L880.3,215.7 L880.3,215.7 L880.4,215.7 L880.4,215.7 L880.4,215.7 L880.5,216.0 L880.5,216.1 L880.5,216.1 L880.5,216.2 L880.2,216.3 L880.2,216.2 L880.2,216.2 L880.1,216.1 L880.1,216.1 L880.1,216.1 L880.1,216.1 L880.1,216.1 L880.1,216.1 L880.0,216.1 L880.0,216.1 L880.0,216.1 L880.0,216.1 L879.9,216.1 L879.9,215.9 L879.9,215.8 L879.7,215.7 L879.7,215.8 L879.6,215.7 L879.6,215.7 L879.6,215.7 L879.6,215.7 L879.8,215.9 L879.9,216.0 L879.8,216.1 L879.7,216.1 L879.6,216.1 L879.6,216.1 L879.6,216.1 L879.6,216.1 L879.7,216.0 L879.6,216.0 L879.6,216.0 L879.6,216.0 L879.6,216.0 L879.6,216.0 L879.6,216.0 L879.6,216.0 L879.6,215.9 L879.6,215.9 L879.6,216.0 L879.6,216.0 L879.6,216.0 L879.6,216.1 L879.6,216.1 L879.6,216.1 L879.6,216.1 L879.6,216.1 L879.6,216.1 L879.7,216.1 L879.8,216.1 L879.9,216.1 L879.9,216.1 L879.9,216.2 L879.8,216.2 L879.9,216.2 L879.9,216.2 L879.9,216.2 L879.9,216.2 L879.7,216.2 L879.6,216.2 L879.4,216.2 L879.2,216.2 L879.2,216.2 L879.3,216.2 L879.4,216.2 L879.6,216.2 L879.6,216.3 L879.5,216.4 L879.3,216.3 L879.1,216.4 L879.0,216.4 L878.9,216.4 L878.9,216.4 L878.9,216.4 L878.9,216.4 L878.8,216.4 L878.8,216.4 L878.8,216.4 L878.8,216.4 L878.8,216.4 L878.8,216.4 L878.7,216.4 L878.7,216.4 L878.7,216.5 L878.7,216.4 L878.5,216.5 L878.4,216.5 L878.3,216.5 L878.3,216.4 L878.2,216.4 L878.2,216.3 L878.2,216.3 L878.3,216.2 L878.4,216.2 L878.4,216.2 L878.6,216.3 L878.6,216.2 L878.6,216.2 L878.6,216.3 L878.5,216.2 L878.6,216.1 L878.5,216.2 L878.4,216.2 L878.4,216.1 L878.4,216.1 L878.4,216.1 L878.5,216.0 L878.4,216.1 L878.5,216.0 L878.5,216.0 L878.4,216.1 L878.4,216.1 L878.4,216.0 L878.4,216.0 L878.4,216.0 L878.4,215.9 L878.4,216.0 L878.3,215.9 L878.2,215.8 L878.0,215.7 L877.9,215.7 L877.8,215.6 L877.7,215.4 L877.7,215.3 L877.7,215.1 L877.7,214.9 L877.7,214.9 L877.7,214.9 L877.8,214.9 L877.7,214.8 L877.8,214.8 L877.8,214.8 L877.9,214.8 L877.9,214.8 L877.9,214.7 L877.9,214.7 L877.9,214.7 L878.0,214.7 L877.9,214.7 L878.0,214.7 L877.9,214.7 L878.0,214.6 L877.9,214.6 L878.0,214.6 L877.9,214.6 L878.0,214.6 L877.9,214.6 L878.0,214.6 L878.0,214.6 L878.0,214.6 L878.0,214.6 L878.0,214.6 L878.0,214.6 L878.0,214.5 L878.1,214.6 L878.0,214.5 L878.1,214.6 L878.1,214.5 L878.0,214.5 L878.1,214.5 L878.1,214.5 L878.1,214.5 L878.1,214.5 L878.1,214.5 L878.1,214.5 L878.1,214.5 L878.1,214.4 L878.1,214.4 L878.2,214.4 L878.2,214.4 L878.1,214.4 L878.2,214.4 L878.2,214.4 L878.3,214.4 L878.2,214.4 L878.2,214.3 L878.3,214.4 L878.3,214.4 L878.3,214.4 L878.3,214.3 L878.3,214.3 L878.3,214.3 L878.3,214.4 L878.3,214.3 L878.4,214.4 L878.4,214.3 L878.3,214.3 L878.4,214.2 L878.4,214.2 L878.4,214.2 L878.4,214.2 L878.3,214.2 L878.3,214.3 L878.3,214.2 L878.3,214.3 L878.3,214.3 L878.3,214.2 L878.3,214.2 L878.3,214.3 L878.3,214.2 L878.2,214.2 L878.2,214.3 L878.1,214.3 L878.1,214.3 L878.1,214.2 L878.1,214.2 L878.1,214.3 L878.2,214.3 L878.2,214.2 L878.2,214.2 L878.1,214.2 L878.2,214.2 L878.1,214.2 L878.1,214.2 L878.1,214.1 L878.1,214.2 L878.2,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.1 L878.1,214.0 L878.0,214.0 L878.1,214.0 L878.0,214.0 L878.1,214.0 L878.0,214.0 L878.1,214.0 L878.2,213.9 L878.2,213.9 L878.1,213.9 L878.2,214.0 L878.2,213.9 L878.2,213.9 L878.2,213.9 L878.2,213.8 L878.3,213.8 L878.3,213.7 L878.4,213.7 L878.4,213.7 L878.5,213.4 L878.5,213.4 L878.6,213.4 L878.8,213.4 L878.8,213.4 L878.8,213.4 L878.8,213.4 L878.8,213.5 L878.8,213.4 L878.8,213.5 L878.8,213.5 L878.8,213.5 L878.8,213.5 L878.9,213.5 L878.9,213.5 L878.9,213.5 L878.9,213.4 L878.9,213.5 L878.9,213.4 L878.9,213.5 L878.8,213.4 L878.9,213.4 L878.8,213.3 L878.9,213.4 L878.9,213.3 L878.9,213.3 L878.9,213.4 L878.9,213.4 L878.9,213.4 L878.9,213.3 L879.0,213.1 L879.0,213.0 L879.0,212.9 L879.1,212.9 L879.1,212.9 L879.1,212.8 L879.0,212.7 L879.1,212.6 L879.2,212.6 Z","Manhattan":"M877.6,213.7 L877.6,213.7 L877.6,213.7 L877.6,213.7 L877.6,213.8 L877.6,213.7 L877.6,213.7 Z M878.1,213.7 L878.2,213.7 L878.2,213.7 L878.2,213.7 L878.2,213.7 L878.2,213.8 L878.1,213.8 L878.1,213.8 L878.1,213.8 L878.1,213.8 L878.0,213.8 L878.1,213.8 L878.0,213.9 L878.0,213.9 L878.0,213.9 L878.0,213.9 L877.9,213.9 L877.9,213.8 L878.0,213.7 L878.1,213.7 Z M877.7,213.5 L877.7,213.5 L877.7,213.5 L877.7,213.5 L877.7,213.5 L877.7,213.6 L877.7,213.6 L877.6,213.6 L877.7,213.5 Z M879.4,211.9 L879.2,212.2 L879.1,212.4 L879.1,212.3 L879.3,211.9 L879.4,211.8 L879.4,211.9 Z M879.7,211.2 L879.9,211.3 L879.9,211.4 L879.9,211.4 L879.8,211.5 L879.7,211.6 L879.6,211.7 L879.5,211.6 L879.5,211.6 L879.5,211.5 L879.6,211.5 L879.6,211.4 L879.6,211.4 L879.7,211.4 L879.7,211.4 L879.7,211.4 L879.7,211.4 L879.7,211.4 L879.7,211.4 L879.6,211.4 L879.6,211.4 L879.6,211.4 L879.7,211.3 L879.6,211.3 L879.6,211.2 L879.7,211.2 L879.7,211.2 Z M879.7,209.4 L879.7,209.5 L879.7,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.8,209.5 L879.9,209.5 L879.9,209.6 L879.9,209.7 L879.9,209.7 L879.9,209.7 L879.8,209.7 L879.9,209.8 L879.8,209.9 L879.7,209.8 L879.7,209.9 L879.8,209.9 L879.7,209.9 L879.7,209.9 L879.7,209.9 L879.7,209.9 L879.6,210.2 L879.5,210.4 L879.5,210.8 L879.5,211.0 L879.6,211.2 L879.6,211.3 L879.5,211.4 L879.5,211.5 L879.5,211.5 L879.5,211.5 L879.4,211.6 L879.4,211.6 L879.4,211.6 L879.4,211.8 L879.4,211.8 L878.9,212.5 L878.9,212.6 L878.9,212.7 L878.8,212.7 L878.9,212.7 L878.8,212.7 L878.8,212.8 L878.9,212.8 L878.9,212.9 L878.8,213.1 L878.8,213.2 L878.7,213.3 L878.6,213.3 L878.6,213.3 L878.4,213.3 L878.4,213.3 L878.4,213.4 L878.4,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.3,213.4 L878.2,213.5 L878.2,213.5 L878.3,213.5 L878.2,213.5 L878.2,213.5 L878.2,213.5 L878.2,213.5 L878.2,213.5 L878.2,213.5 L878.2,213.5 L878.2,213.5 L878.1,213.5 L878.1,213.5 L878.1,213.5 L878.1,213.5 L878.1,213.4 L878.1,213.4 L878.1,213.4 L878.1,213.4 L878.1,213.4 L878.1,213.4 L878.1,213.3 L878.1,213.3 L878.1,213.2 L878.1,213.2 L878.1,213.2 L878.1,213.2 L878.1,213.1 L878.2,213.1 L878.2,213.1 L878.1,213.0 L878.2,213.0 L878.2,212.9 L878.1,212.9 L878.2,212.9 L878.2,212.9 L878.1,212.9 L878.1,212.8 L878.2,212.8 L878.2,212.8 L878.1,212.7 L878.2,212.7 L878.2,212.7 L878.2,212.7 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.6 L878.2,212.5 L878.2,212.5 L878.2,212.5 L878.2,212.5 L878.2,212.5 L878.2,212.5 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.4 L878.2,212.3 L878.2,212.3 L878.2,212.3 L878.2,212.3 L878.2,212.3 L878.2,212.3 L878.3,212.2 L878.3,212.2 L878.3,212.1 L878.3,212.1 L878.3,212.1 L878.3,212.1 L878.3,212.1 L878.3,212.1 L878.4,212.1 L878.3,212.0 L878.4,212.1 L878.4,212.1 L878.3,212.0 L878.4,212.1 L878.4,212.0 L878.3,212.0 L878.4,212.0 L878.4,212.0 L878.4,212.0 L878.4,212.0 L878.4,212.0 L878.4,211.9 L878.4,212.0 L878.4,211.9 L878.4,211.9 L878.4,211.9 L878.4,211.9 L878.4,211.9 L878.4,211.9 L878.5,211.9 L878.5,211.9 L878.4,211.8 L878.5,211.9 L878.4,211.8 L878.5,211.8 L878.5,211.8 L878.5,211.8 L878.5,211.8 L878.6,211.7 L878.5,211.7 L878.6,211.7 L878.6,211.6 L878.6,211.5 L878.6,211.6 L878.6,211.5 L878.6,211.6 L878.6,211.5 L878.7,211.5 L878.6,211.5 L878.7,211.5 L879.0,210.9 L879.1,210.7 L879.1,210.7 L879.1,210.7 L879.1,210.7 L879.1,210.6 L879.2,210.6 L879.2,210.5 L879.3,210.2 L879.3,210.1 L879.4,210.0 L879.6,209.7 L879.6,209.6 L879.6,209.5 L879.7,209.4 Z M880.0,209.5 L880.0,209.6 L880.0,209.6 L879.9,209.5 L879.8,209.5 L879.9,209.4 L880.0,209.5 Z","Bronx":"M880.3,211.2 L880.3,211.3 L880.4,211.3 L880.5,211.3 L880.6,211.4 L880.6,211.4 L880.6,211.5 L880.6,211.5 L880.5,211.6 L880.3,211.5 L880.3,211.5 L880.3,211.4 L880.2,211.4 L880.3,211.3 L880.3,211.3 L880.3,211.3 L880.3,211.2 Z M880.1,211.2 L880.2,211.2 L880.1,211.2 L880.1,211.2 L880.1,211.2 L880.1,211.2 Z M881.8,210.3 L881.8,210.3 L881.7,210.3 L881.7,210.2 L881.8,210.2 L881.8,210.3 Z M882.0,209.9 L882.1,209.9 L882.0,209.9 L882.1,210.0 L882.1,210.0 L882.1,210.0 L882.1,210.0 L882.1,210.0 L882.1,210.0 L882.1,210.1 L882.1,210.1 L882.2,210.1 L882.2,210.1 L882.2,210.1 L882.2,210.1 L882.2,210.1 L882.2,210.2 L882.2,210.1 L882.2,210.2 L882.2,210.2 L882.1,210.2 L882.1,210.2 L882.1,210.2 L882.2,210.2 L882.2,210.2 L882.1,210.2 L882.2,210.2 L882.1,210.2 L882.1,210.2 L882.1,210.2 L882.2,210.2 L882.2,210.2 L882.2,210.2 L882.2,210.2 L882.1,210.2 L882.2,210.2 L882.1,210.2 L882.1,210.2 L882.1,210.2 L882.1,210.2 L882.2,210.2 L882.2,210.2 L882.2,210.2 L882.2,210.2 L882.2,210.2 L882.1,210.2 L882.2,210.2 L882.2,210.2 L882.2,210.3 L882.2,210.3 L882.2,210.2 L882.2,210.3 L882.2,210.3 L882.2,210.3 L882.2,210.3 L882.2,210.3 L882.1,210.4 L882.1,210.4 L882.1,210.4 L882.1,210.4 L882.1,210.4 L882.1,210.4 L882.1,210.3 L882.1,210.3 L882.1,210.3 L882.1,210.3 L882.1,210.3 L882.0,210.2 L882.0,210.2 L882.0,210.2 L882.0,210.1 L882.0,210.1 L882.0,210.1 L882.0,210.1 L882.0,210.1 L882.0,210.1 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,210.0 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 L882.0,209.9 Z M882.4,210.0 L882.4,210.0 L882.4,210.1 L882.4,210.1 L882.4,210.2 L882.4,210.2 L882.3,210.1 L882.4,210.1 L882.3,210.0 L882.3,210.0 L882.3,210.0 L882.3,210.0 L882.3,209.8 L882.4,209.9 L882.5,210.0 L882.4,210.0 Z M879.9,208.6 L880.8,208.9 L880.8,208.9 L880.8,208.9 L880.8,208.9 L880.9,208.8 L880.9,208.8 L880.9,208.8 L880.9,208.8 L880.9,208.7 L880.9,208.7 L880.9,208.7 L881.0,208.7 L880.9,208.8 L881.0,208.8 L881.0,208.8 L881.1,208.8 L881.1,208.8 L881.1,208.8 L881.2,208.9 L881.2,209.0 L881.2,209.1 L881.5,209.2 L881.5,209.1 L882.0,209.3 L881.9,209.4 L881.9,209.4 L881.9,209.5 L881.9,209.5 L881.8,209.6 L881.8,209.6 L881.8,209.6 L881.8,209.6 L881.8,209.6 L881.8,209.6 L881.7,209.6 L881.7,209.6 L881.7,209.6 L881.8,209.7 L881.8,209.7 L881.8,209.7 L881.8,209.7 L881.8,209.7 L881.9,209.6 L881.9,209.5 L882.0,209.5 L881.9,209.4 L882.0,209.4 L882.0,209.4 L882.0,209.4 L882.1,209.4 L882.1,209.5 L882.1,209.6 L882.1,209.6 L882.1,209.5 L882.1,209.6 L882.1,209.5 L882.1,209.6 L882.1,209.7 L882.1,209.6 L882.1,209.6 L882.0,209.7 L882.0,209.8 L882.0,209.8 L882.0,209.8 L882.0,209.8 L881.9,209.9 L881.9,209.9 L881.9,209.9 L881.9,210.0 L881.9,210.0 L881.8,210.1 L881.8,210.0 L881.8,210.0 L881.8,209.9 L881.8,209.8 L881.7,209.8 L881.7,209.8 L881.7,209.8 L881.7,209.9 L881.7,209.8 L881.6,209.8 L881.6,209.8 L881.6,209.8 L881.6,209.8 L881.6,209.9 L881.6,210.0 L881.6,210.0 L881.6,210.0 L881.6,210.1 L881.6,210.1 L881.6,210.1 L881.6,210.2 L881.6,210.1 L881.6,210.2 L881.6,210.1 L881.6,210.1 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.1 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.6,210.2 L881.5,210.2 L881.6,210.2 L881.6,210.3 L881.6,210.3 L881.6,210.4 L881.6,210.5 L881.6,210.5 L881.6,210.5 L881.6,210.6 L881.7,210.6 L881.6,210.6 L881.6,210.6 L881.6,210.6 L881.6,210.6 L881.6,210.6 L881.6,210.7 L881.7,210.6 L881.7,210.6 L881.7,210.7 L881.8,210.8 L881.8,210.8 L881.9,210.9 L881.9,210.9 L881.8,210.9 L881.8,210.9 L881.8,210.9 L881.8,210.9 L881.7,210.8 L881.8,210.9 L881.8,210.9 L881.8,210.9 L881.7,210.8 L881.8,210.9 L881.8,210.9 L881.8,211.0 L881.8,211.0 L881.8,211.0 L882.0,211.1 L882.0,211.1 L882.0,211.1 L882.0,211.1 L881.8,211.0 L881.8,211.0 L881.7,210.9 L881.6,210.9 L881.6,210.9 L881.6,210.9 L881.4,210.9 L881.4,211.0 L881.4,211.0 L881.3,211.0 L881.3,211.0 L881.3,211.1 L881.2,211.1 L881.2,210.9 L881.2,210.9 L881.2,210.8 L881.2,210.8 L881.2,210.7 L881.1,210.6 L881.1,210.5 L881.2,210.4 L881.2,210.3 L881.2,210.4 L881.1,210.5 L881.2,210.7 L881.2,210.8 L881.1,210.8 L881.1,211.0 L881.0,211.0 L881.0,210.9 L881.0,210.9 L880.9,210.9 L880.9,210.9 L880.9,210.9 L880.9,210.9 L881.0,210.9 L881.0,210.9 L881.0,211.0 L881.0,211.0 L881.0,211.0 L881.0,211.1 L881.0,211.1 L880.9,211.1 L880.9,211.1 L880.9,211.1 L880.8,211.1 L880.8,211.1 L880.8,211.1 L880.8,211.0 L880.8,211.1 L880.8,211.0 L880.8,211.0 L880.8,211.0 L880.8,211.0 L880.8,211.0 L880.8,211.0 L880.7,211.0 L880.6,210.9 L880.5,210.8 L880.5,210.9 L880.6,210.9 L880.6,210.9 L880.7,211.1 L880.6,211.2 L880.6,211.2 L880.6,211.2 L880.5,211.2 L880.5,211.2 L880.4,211.2 L880.3,211.1 L880.3,211.1 L880.3,211.1 L880.3,211.1 L880.2,211.1 L880.3,211.1 L880.2,211.1 L880.2,211.1 L880.2,211.1 L880.2,211.1 L880.2,211.1 L880.2,211.1 L880.2,211.1 L880.1,211.1 L879.9,211.3 L879.8,211.2 L879.7,211.2 L879.6,211.2 L879.6,211.1 L879.6,211.1 L879.5,211.0 L879.6,210.8 L879.5,210.4 L879.6,210.2 L879.7,210.0 L879.9,209.8 L879.9,209.8 L880.0,209.5 L879.9,209.4 L879.8,209.5 L879.8,209.5 L879.7,209.4 L879.7,209.4 L879.8,209.2 L879.9,208.7 L879.9,208.6 L879.9,208.6 Z"},"pins":{"yankee":{"x":879.66,"y":210.54},"amnh":{"x":878.84,"y":211.65},"met":{"x":879.02,"y":211.69},"liberty":{"x":877.62,"y":213.75},"911":{"x":878.16,"y":213.24},"rock":{"x":878.76,"y":212.16},"dream":{"x":877.2,"y":211.01},"broadway":{"x":878.65,"y":212.18},"village":{"x":878.34,"y":212.74},"brooklyn":{"x":878.46,"y":213.46},"highline":{"x":878.3,"y":212.41},"edge":{"x":878.37,"y":212.28}},"nyc":{"x":878.8,"y":213.4},"labels":{"New York":{"x":842.3,"y":165.6},"New Jersey":{"x":871.4,"y":225.5},"Pennsylvania":{"x":813.2,"y":204.9},"Connecticut":{"x":901.6,"y":190.0},"Massachusetts":{"x":911.4,"y":179.6},"California":{"x":81.3,"y":289.3},"Texas":{"x":432.5,"y":415.9},"Florida":{"x":745.6,"y":481.2},"Ohio":{"x":727.0,"y":224.9},"Illinois":{"x":610.2,"y":232.1},"Michigan":{"x":654.6,"y":80.6},"Georgia":{"x":717.7,"y":385.9},"Virginia":{"x":804.9,"y":273.8},"Maine":{"x":960.6,"y":106.4}}};

// ══ KNOWLEDGE BASE (different aspects of NYC) ═════════════════
const KNOWLEDGE=[
 {emoji:'🏙️',title:'城市印象',sub:'紐約是個什麼樣的城市？',
  body:`紐約市是美國最大的城市，住了大約 800 萬人！它最有名的外號叫「大蘋果」，還有「不夜城」——因為這裡到了半夜還是燈火通明、熱鬧滾滾。\n\n紐約由 5 個區組成：曼哈頓、布魯克林、皇后區、布朗克斯、史泰登島。其中曼哈頓是最熱鬧的中心，到處都是高聳入雲的摩天大樓。\n\n這裡的步調很快，街道上總是擠滿了來自世界各地的人，黃色計程車穿梭其中，是電影裡最常出現的紐約畫面。`},
 {emoji:'🏛️',title:'歷史故事',sub:'紐約是怎麼來的？',
  body:`很久以前，這裡住著美洲原住民「勒納佩人」。1626 年，荷蘭人來到這裡建立了「新阿姆斯特丹」。後來英國人接管，把它改名為「紐約」。\n\n你知道嗎？紐約曾經當過美國的首都（1785–1790 年）！美國第一任總統華盛頓就是在紐約宣誓就職的。\n\n19 世紀，數百萬移民搭船來到紐約，第一眼看到的就是自由女神像。對他們來說，那是「希望」與「新生活」的象徵。`},
 {emoji:'🍕',title:'美食天堂',sub:'紐約有什麼好吃的？',
  body:`紐約被稱為美食天堂，因為這裡有來自全世界的料理！最有代表性的有三樣：紐約式披薩（薄薄一大片，要對折著吃）、貝果（中間有洞的麵包）、還有路邊攤的熱狗。\n\n1905 年，美國第一家披薩店就開在紐約，到現在還在營業呢！\n\n因為紐約住著各國移民，你可以吃到中國菜、義大利菜、墨西哥菜、日本拉麵、韓國烤肉……走幾條街，就像環遊世界一圈！`},
 {emoji:'🚇',title:'城市交通',sub:'紐約人怎麼移動？',
  body:`紐約地鐵是這座城市的血管！它有 472 個車站，是全世界站數最多的地鐵系統之一，而且 24 小時不停運行，連半夜都有車。\n\n黃色計程車是紐約的招牌。為什麼是黃色？因為研究發現黃色在遠處最容易被看見，方便乘客招車。\n\n除了地鐵和計程車，紐約人也會搭渡輪。史泰登島渡輪是免費的，而且在船上可以近距離看到自由女神像，是最划算的觀光行程！`},
 {emoji:'🎭',title:'文化藝術',sub:'紐約玩什麼？',
  body:`紐約是世界的藝術中心！「百老匯」是最有名的劇院區，這裡有全世界最精彩的音樂劇，像《獅子王》、《魔法壞女巫》，演員又唱又跳，舞台華麗到讓人目不轉睛。\n\n這裡也有超棒的博物館：大都會博物館收藏了 5,000 年的藝術品，自然史博物館有恐龍化石和藍鯨模型。\n\n紐約還是很多音樂類型的誕生地，像嘻哈（Hip-Hop）就是在布朗克斯誕生的！`},
 {emoji:'🏗️',title:'摩天大樓',sub:'為什麼紐約有這麼多高樓？',
  body:`紐約是「摩天大樓」的故鄉！「Skyscraper」這個字原本是指帆船上最高的桅杆，後來用來形容高得好像要刮到天空的大樓。\n\n曼哈頓是一座島，土地有限，沒辦法往兩邊蓋，所以大家就往上蓋，越蓋越高！\n\n最有名的帝國大廈只花了 410 天就建好，晚上頂端的燈還會根據節日變換顏色。新的觀景台像 Edge，地板是透明玻璃做的，站上去可以看到 300 公尺下的街道，超刺激！`},
 {emoji:'🌳',title:'綠地與自然',sub:'城市裡也有大自然？',
  body:`在水泥森林的正中央，藏著一片大綠洲——中央公園！它其實是人工打造的，工人們搬走了好幾百萬車的泥土和石頭，種上樹木，花了 20 多年才完成。\n\n公園裡有湖泊、草地、36 座造型各異的橋，還住著浣熊、烏龜和超過 200 種鳥。\n\n紐約四季分明：春天櫻花盛開、夏天炎熱、秋天楓葉變紅、冬天則會下雪，整座城市變成白色，小朋友會出來堆雪人、打雪仗。`},
 {emoji:'🌍',title:'多元文化',sub:'全世界都在紐約',
  body:`紐約是全世界最多元的城市！這裡的人來自地球上幾乎每一個國家，街道上總共有超過 800 種語言被使用，是全世界語言最多的城市。\n\n所以紐約有很多「小社區」：中國城、小義大利、韓國城……每個區域都保留了自己國家的文化、食物和節慶。\n\n人們常說紐約是個「大熔爐」，因為不同膚色、不同語言、不同文化的人，在這裡一起生活、一起工作，融合成獨一無二的紐約。`},
 {emoji:'⚾',title:'運動之城',sub:'紐約人愛運動！',
  body:`紐約人超級熱愛運動！最有名的是棒球隊「紐約洋基隊」，他們贏得過 27 次世界大賽冠軍，是全美國奪冠最多的球隊，主場就在布朗克斯的洋基球場。\n\n籃球方面有「紐約尼克隊」，主場麥迪遜廣場花園被稱為「世界最有名的競技場」。\n\n每年 11 月，還有「紐約馬拉松」——超過 5 萬人一起跑步，路線會經過紐約 5 大區，是全世界最大的馬拉松之一！`}
];

// ══ SCAVENGER HUNT ════════════════════════════════════════════
const HUNT=[
 {id:'cap',day:1,name:'棒球帽',hint:'球場附近很多人戴'},
 {id:'hotdog',day:1,name:'熱狗攤',hint:'路邊賣熱狗的小推車'},
 {id:'taxi',day:1,name:'黃色計程車',hint:'紐約的招牌！街上到處都是'},
 {id:'dinobone',day:2,name:'恐龍化石',hint:'博物館裡好大的骨頭'},
 {id:'pigeon',day:2,name:'一隻鴿子',hint:'公園和廣場最多了'},
 {id:'pretzel',day:2,name:'椒鹽捲餅',hint:'路邊攤的鹹點心'},
 {id:'ferry',day:3,name:'渡輪',hint:'載你去看自由女神'},
 {id:'flag',day:3,name:'美國國旗',hint:'建築物上常常掛著'},
 {id:'bagel',day:3,name:'貝果',hint:'中間有洞的麵包'},
 {id:'statue',day:4,name:'金色雕像',hint:'洛克菲勒中心前面金金的'},
 {id:'skyscraper',day:4,name:'超高摩天大樓',hint:'抬頭看，高到看不到頂'},
 {id:'streetlamp',day:4,name:'紅綠燈',hint:'過馬路前看一下'},
 {id:'carousel',day:5,name:'旋轉木馬',hint:'遊樂園裡轉呀轉'},
 {id:'icecream',day:5,name:'冰淇淋',hint:'天氣熱來一支'},
 {id:'broadway',day:6,name:'百老匯招牌',hint:'亮晶晶的劇院招牌'},
 {id:'subway',day:6,name:'地鐵標誌',hint:'圓圓的、有數字或字母'},
 {id:'bridge',day:7,name:'大橋鋼索',hint:'布魯克林大橋上'},
 {id:'streetart',day:7,name:'街頭塗鴉',hint:'牆上的彩色塗鴉'},
 {id:'flower',day:8,name:'花草',hint:'高線公園的植物'},
 {id:'squirrel',day:8,name:'松鼠',hint:'公園裡跑來跑去'},
];

// ══ TRAVEL ENGLISH FLASHCARDS ════════════════════════════════
const FLASHCARDS=[
 {emoji:'🍕',en:'Pizza',phon:'/ˈpiːtsə/',zh:'披薩'},
 {emoji:'🚕',en:'Taxi',phon:'/ˈtæksi/',zh:'計程車'},
 {emoji:'🚇',en:'Subway',phon:'/ˈsʌbweɪ/',zh:'地鐵'},
 {emoji:'🙏',en:'Thank you',phon:'/θæŋk juː/',zh:'謝謝'},
 {emoji:'👋',en:'Hello',phon:'/həˈloʊ/',zh:'你好'},
 {emoji:'🚻',en:'Bathroom',phon:'/ˈbæθruːm/',zh:'廁所'},
 {emoji:'💧',en:'Water',phon:'/ˈwɔːtər/',zh:'水'},
 {emoji:'🎟️',en:'Ticket',phon:'/ˈtɪkɪt/',zh:'票'},
 {emoji:'🗺️',en:'Map',phon:'/mæp/',zh:'地圖'},
 {emoji:'❓',en:'Excuse me',phon:'/ɪkˈskjuːz miː/',zh:'不好意思／請問'},
 {emoji:'🍔',en:'Hamburger',phon:'/ˈhæmbɜːrɡər/',zh:'漢堡'},
 {emoji:'🍦',en:'Ice cream',phon:'/aɪs kriːm/',zh:'冰淇淋'},
 {emoji:'💵',en:'How much?',phon:'/haʊ mʌtʃ/',zh:'多少錢？'},
 {emoji:'🏨',en:'Hotel',phon:'/hoʊˈtel/',zh:'飯店'},
 {emoji:'🆘',en:'Help',phon:'/help/',zh:'幫忙／救命'},
 {emoji:'😋',en:'Delicious',phon:'/dɪˈlɪʃəs/',zh:'好吃'}
];
const BORO_COL={'Manhattan':'#4E8FC4','Brooklyn':'#E5853C','Queens':'#69AD4E','Bronx':'#D55B58','Staten Island':'#9B6FB5'};
const BORO_ID2={'Manhattan':'manhattan','Brooklyn':'brooklyn','Queens':'queens','Bronx':'bronx','Staten Island':'staten'};
const PIN_EMOJI={yankee:'⚾',liberty:'🗽',brooklyn:'🌉',dream:'🎢',amnh:'🦕',met:'🎨',rock:'🏙️',broadway:'🎭',edge:'🔭',highline:'🌿',village:'🌆','911':'🕯️'};
const PIN_NAME={yankee:'洋基球場',liberty:'自由女神',brooklyn:'布魯克林大橋',dream:'美國夢',amnh:'自然史博物館',met:'大都會',rock:'洛克菲勒',broadway:'獅子王',edge:'Edge',highline:'高線公園',village:'格林威治村','911':'911紀念館'};
const PIN_COL={yankee:'#1A4480',liberty:'#2E6B30',brooklyn:'#5C3D2E',dream:'#C0186A',amnh:'#6A3B8F',met:'#9B2335',rock:'#B8820A',broadway:'#7B3A0F',edge:'#2C4B7C',highline:'#1B6637',village:'#1C5E8A','911':'#37474F'};

const VW=360, VH=380;
let mapScale=1, mapTx=0, mapTy=0, mapBuilt=false;
const FIT_US=Math.min(VW/MAPDATA.bw, VH/MAPDATA.bh);  // whole US
const MIN_S=FIT_US*0.92, MAX_S=140;

function buildMapStatic(){
  if(mapBuilt) return;
  const mv=document.getElementById('mapview');
  let h='';
  // states
  for(const [n,p] of Object.entries(MAPDATA.states)){
    let fill='#E0DAC8';
    if(n==='New Jersey') fill='#D6C49E';
    else if(n==='New York') fill='#E7E1CF';
    h+=`<path class="us-state" data-state="${n}" d="${p}" fill="${fill}" stroke="#B5AE98" stroke-width="0.6" vector-effect="non-scaling-stroke"/>`;
  }
  // boroughs (colored, tappable)
  for(const [n,p] of Object.entries(MAPDATA.boros)){
    h+=`<path class="boro-shape" data-boro="${BORO_ID2[n]}" d="${p}" fill="${BORO_COL[n]}" stroke="#fff" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
  }
  mv.innerHTML=h;
  mapBuilt=true;
  // state click -> NJ/NY info
  mv.querySelectorAll('.us-state').forEach(el=>el.addEventListener('click',()=>{
    const s=el.getAttribute('data-state');
    if(s==='New Jersey') showBoro('nj');
  }));
  mv.querySelectorAll('.boro-shape').forEach(el=>el.addEventListener('click',(e)=>{
    e.stopPropagation(); showBoro(el.getAttribute('data-boro'));
  }));
}

function applyMap(){
  const mv=document.getElementById('mapview');
  mv.setAttribute('transform',`translate(${mapTx.toFixed(2)},${mapTy.toFixed(2)}) scale(${mapScale.toFixed(4)})`);
  // reposition pins (constant screen size)
  const pl=document.getElementById('pinlayer');
  const showPins=mapScale>=6;
  const showLabels=mapScale>=18;
  let h='';
  if(showPins){
    for(const [k,v] of Object.entries(MAPDATA.pins)){
      const sx=mapTx+mapScale*v.x, sy=mapTy+mapScale*v.y;
      if(sx<-30||sx>VW+30||sy<-30||sy>VH+30) continue;
      h+=`<g class="pin-tap" data-spot="${k}"><circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="15" fill="transparent"/><circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="10" fill="${PIN_COL[k]}" stroke="#fff" stroke-width="2"/><text x="${sx.toFixed(1)}" y="${(sy+4).toFixed(1)}" font-size="11" text-anchor="middle">${PIN_EMOJI[k]}</text>`;
      if(showLabels){
        const w=PIN_NAME[k].length*9+8;
        h+=`<rect x="${(sx+12).toFixed(1)}" y="${(sy-8).toFixed(1)}" width="${w}" height="16" rx="4" fill="#fff" opacity="0.92"/><text x="${(sx+16).toFixed(1)}" y="${(sy+3.5).toFixed(1)}" font-size="9" font-weight="800" fill="#222">${PIN_NAME[k]}</text>`;
      }
      h+=`</g>`;
    }
  } else {
    // single NYC marker when zoomed out
    const sx=mapTx+mapScale*MAPDATA.nyc.x, sy=mapTy+mapScale*MAPDATA.nyc.y;
    h+=`<g class="pin-tap" data-spot="__nyc__"><circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="7" fill="#D6322C" stroke="#fff" stroke-width="2"/><rect x="${(sx+9).toFixed(1)}" y="${(sy-9).toFixed(1)}" width="46" height="18" rx="5" fill="#D6322C"/><text x="${(sx+12).toFixed(1)}" y="${(sy+3.5).toFixed(1)}" font-size="10" font-weight="800" fill="#fff">紐約 NYC</text></g>`;
  }
  pl.innerHTML=h;
  pl.querySelectorAll('.pin-tap').forEach(el=>el.addEventListener('click',()=>{
    const s=el.getAttribute('data-spot');
    if(s==='__nyc__'){ zoomPreset('nyc'); } else { openDetail(s); }
  }));
  // zoom level label
  const zl=document.getElementById('zoom-level');
  if(zl){
    if(mapScale<2) zl.textContent='🇺🇸 全美國';
    else if(mapScale<12) zl.textContent='🏙️ 東北部';
    else zl.textContent='🗽 紐約市';
  }
}

function clampMap(){
  mapScale=Math.max(MIN_S,Math.min(MAX_S,mapScale));
}

function centerOn(cx,cy,scale){
  mapScale=scale; clampMap();
  mapTx=VW/2-mapScale*cx;
  mapTy=VH/2-mapScale*cy;
  applyMap();
}

function zoomPreset(which){
  if(which==='nyc') centerOn(MAPDATA.nyc.x,MAPDATA.nyc.y,30);
  else if(which==='region') centerOn(MAPDATA.nyc.x-14,MAPDATA.nyc.y+6,7);
  else centerOn(MAPDATA.bw/2,MAPDATA.bh/2,FIT_US);
}

function zoomBtn(factor){
  const cx=(VW/2-mapTx)/mapScale, cy=(VH/2-mapTy)/mapScale;
  mapScale*=factor; clampMap();
  mapTx=VW/2-mapScale*cx; mapTy=VH/2-mapScale*cy;
  applyMap();
}

function renderMap(){
  buildMapStatic();
  if(!mapTx && !mapTy){ centerOn(MAPDATA.nyc.x,MAPDATA.nyc.y,30); }
  else applyMap();
  // borough chips
  const legend=document.getElementById('boro-legend');
  legend.innerHTML='';
  BOROUGHS.forEach(b=>{
    const chip=document.createElement('div');
    chip.className='boro-chip';
    chip.innerHTML=`<div class="boro-color" style="background:${b.color}"></div><div><div class="boro-chip-name">${b.emoji} ${b.name}</div><div class="boro-chip-en">${b.en}</div></div>`;
    chip.onclick=()=>showBoro(b.id);
    legend.appendChild(chip);
  });
}

function showBoro(id){
  const b=BOROUGHS.find(x=>x.id===id);
  if(!b)return;
  const spotsHtml=b.spots.map(s=>`<span class="boro-spot-tag">${s}</span>`).join('');
  document.getElementById('modal-e').textContent=b.emoji;
  document.getElementById('modal-title').textContent=`${b.name} ${b.en}`;
  document.getElementById('modal-text').innerHTML=b.fact+`<div class="boro-modal-spots">${spotsHtml}</div>`;
  document.getElementById('modal').classList.add('open');
}

// pan + pinch
function initMapGestures(){
  const svg=document.getElementById('usmap');
  if(!svg||svg.dataset.bound)return; svg.dataset.bound='1';
  let pts=new Map(), startDist=0, startScale=1, startMid=null, panStart=null, moved=false;
  function svgPt(e){
    const r=svg.getBoundingClientRect();
    return {x:(e.clientX-r.left)/r.width*VW, y:(e.clientY-r.top)/r.height*VH};
  }
  svg.addEventListener('pointerdown',e=>{
    svg.setPointerCapture(e.pointerId);
    pts.set(e.pointerId,svgPt(e)); moved=false;
    if(pts.size===1){ panStart={...[...pts.values()][0], tx:mapTx, ty:mapTy}; }
    else if(pts.size===2){
      const p=[...pts.values()]; startDist=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
      startScale=mapScale; startMid={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};
      startMid.bx=(startMid.x-mapTx)/mapScale; startMid.by=(startMid.y-mapTy)/mapScale;
    }
  });
  svg.addEventListener('pointermove',e=>{
    if(!pts.has(e.pointerId))return;
    pts.set(e.pointerId,svgPt(e)); moved=true;
    if(pts.size===1 && panStart){
      const p=[...pts.values()][0];
      mapTx=panStart.tx+(p.x-panStart.x); mapTy=panStart.ty+(p.y-panStart.y);
      applyMap();
    } else if(pts.size===2 && startMid){
      const p=[...pts.values()]; const dist=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
      mapScale=startScale*(dist/startDist); clampMap();
      const mid={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};
      mapTx=mid.x-mapScale*startMid.bx; mapTy=mid.y-mapScale*startMid.by;
      applyMap();
    }
  });
  function up(e){ pts.delete(e.pointerId); if(pts.size<2)startMid=null; if(pts.size===0)panStart=null; }
  svg.addEventListener('pointerup',up);
  svg.addEventListener('pointercancel',up);
  svg.addEventListener('wheel',e=>{
    e.preventDefault();
    const r=svg.getBoundingClientRect();
    const mx=(e.clientX-r.left)/r.width*VW, my=(e.clientY-r.top)/r.height*VH;
    const bx=(mx-mapTx)/mapScale, by=(my-mapTy)/mapScale;
    mapScale*=(e.deltaY<0?1.15:0.87); clampMap();
    mapTx=mx-mapScale*bx; mapTy=my-mapScale*by; applyMap();
  },{passive:false});
}

// ══ KNOWLEDGE RENDER ═════════════════════════════════════════
function renderKnowledge(){
  const list=document.getElementById('know-list');
  if(list.dataset.done)return; list.dataset.done='1';
  list.innerHTML=KNOWLEDGE.map((k,i)=>`
    <div class="know-card" id="kc-${i}">
      <div class="know-head" onclick="toggleKnow(${i})">
        <span class="know-art">${knowArt(i)}</span>
        <div class="know-head-text"><div class="know-title">${k.title}</div><div class="know-sub">${k.sub}</div></div>
        <span class="know-arrow">▶</span>
      </div>
      <div class="know-body">${k.body}</div>
    </div>`).join('');
}
function toggleKnow(i){
  var card=document.getElementById('kc-'+i);
  var wasOpen=card.classList.contains('open');
  document.querySelectorAll('.know-card.open').forEach(function(x){x.classList.remove('open');});
  if(!wasOpen){ card.classList.add('open'); }
}

// ══ QUIZ (multiple choice + scoring) ══════════════════════════
let quizSet=[];        // array of 10 question indices
let quizPos=0;         // current position 0..9
let quizPicks={};      // pos -> chosen option index
const QUIZ_N=10;

let quizMode='solo';        // 'solo' | 'battle'
let battleScore=[0,0];

function setQuizMode(mode){
  quizMode=mode;
  document.getElementById('qmode-solo').classList.toggle('active',mode==='solo');
  document.getElementById('qmode-battle').classList.toggle('active',mode==='battle');
  document.getElementById('quiz-scorebar').style.display=(mode==='solo')?'flex':'none';
  document.getElementById('battle-scorebar').style.display=(mode==='battle')?'flex':'none';
  resetQuiz();
}

function battlePlayer(){ return quizPos%2; } // even=player0, odd=player1

function buildQuizSet(){
  const idx=[...Array(TRIVIA.length).keys()];
  for(let i=idx.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [idx[i],idx[j]]=[idx[j],idx[i]]; }
  quizSet=idx.slice(0, Math.min(QUIZ_N, TRIVIA.length));
  quizPos=0; quizPicks={}; battleScore=[0,0];
}

function renderTrivia(){
  if(quizSet.length===0) buildQuizSet();
  const list=document.getElementById('trivia-list');
  const qi=quizSet[quizPos];
  const t=TRIVIA[qi];
  const answered=quizPos in quizPicks;
  const chosen=quizPicks[quizPos];
  let tagHtml=`<div class="trivia-tag">${t.tag}</div>`;
  if(quizMode==='battle'){
    const p=battlePlayer();
    tagHtml=`<div class="trivia-tag" style="background:${p===0?'#3B9AD9':'#E5503A'};color:#fff">輪到 ${buildAvatar(kidAvatars[p],18)} ${kidNames[p]} 回答！</div>`;
  }
  let optsHtml=t.opts.map((o,i)=>{
    let cls='quiz-opt';
    if(answered){
      if(i===t.ans) cls+=' correct';
      else if(i===chosen) cls+=' wrong';
      cls+=' dis';
    }
    return `<div class="${cls}" onclick="answerTrivia(${i})"><span class="opt-letter">${'ABCD'[i]}</span>${o}</div>`;
  }).join('');
  let resHtml='';
  if(answered){
    const ok=chosen===t.ans;
    const last=quizPos===quizSet.length-1;
    const finalLabel=(quizMode==='battle')?'看誰贏了 🏆':'看我的成績 🏆';
    resHtml=`<div class="quiz-res show ${ok?'ok':'bad'}">${ok?'✅ 答對了！':'❌ 答錯了，正解是 '+'ABCD'[t.ans]}<br><span style="font-weight:600;font-size:.85rem">💡 ${t.a}</span></div>
      <button class="quiz-next-btn" onclick="${last?'showQuizFinal()':'gotoNextQuestion()'}">${last?finalLabel:'下一題 →'}</button>`;
  }
  list.innerHTML=`
    <div class="quiz-card">
      ${tagHtml}
      <div class="quiz-q">${t.q}</div>
      ${optsHtml}
      ${resHtml}
    </div>`;
  updateQuizScore();
}

function answerTrivia(i){
  if(quizPos in quizPicks) return;
  quizPicks[quizPos]=i;
  const ok=i===TRIVIA[quizSet[quizPos]].ans;
  if(quizMode==='battle' && ok){ battleScore[battlePlayer()]++; }
  renderTrivia();
  if(ok){ launchConfetti(quizMode==='battle'?(battlePlayer()===0?'#3B9AD9':'#E5503A'):'#C0852A'); }
}

function gotoNextQuestion(){
  if(quizPos<quizSet.length-1){ quizPos++; renderTrivia(); }
  else showQuizFinal();
}

function quizCorrectCount(){
  let c=0;
  for(const [p,v] of Object.entries(quizPicks)){ if(v===TRIVIA[quizSet[p]].ans) c++; }
  return c;
}

function updateQuizScore(){
  if(quizMode==='battle'){
    const bar=document.getElementById('battle-scorebar');
    if(!bar)return;
    const turn=battlePlayer();
    bar.innerHTML=[0,1].map(k=>`<div class="battle-side${(k===turn)?' turn':''}"><div class="battle-name">${buildAvatar(kidAvatars[k],20)} ${kidNames[k]}</div><div class="battle-pts">${battleScore[k]}</div></div>`).join('');
    return;
  }
  const el=document.getElementById('quiz-score');
  if(!el)return;
  el.textContent=`第 ${quizPos+1} / ${quizSet.length} 題 · 答對 ${quizCorrectCount()}`;
}

function showQuizFinal(){
  if(quizMode==='battle'){
    const a=battleScore[0], b=battleScore[1];
    if(a===b){ showModal('🤝',`平手！${a} : ${b}`,'兩個人一樣厲害，再來一場決勝負吧！'); }
    else { const w=a>b?0:1; showModal('🏆',`${kidNames[w]} 獲勝！`,`${kidNames[0]} ${a} 分　vs　${kidNames[1]} ${b} 分\n\n太精彩了！按「換一批」再戰一場！`); }
    return;
  }
  const correct=quizCorrectCount();
  const total=quizSet.length;
  const pct=Math.round(correct/total*100);
  let msg,emoji;
  if(pct>=90){emoji='🏆';msg='太厲害了！你是紐約小博士！';}
  else if(pct>=70){emoji='🌟';msg='很棒喔！你很懂紐約！';}
  else if(pct>=50){emoji='👍';msg='不錯！再多看看知識區會更厲害！';}
  else{emoji='💪';msg='沒關係，多看看知識區，下次一定進步！';}
  showModal(emoji,`答對 ${correct} / ${total} 題`,msg+`\n\n（答對率 ${pct}%）\n按「換一批」可以再玩新的 10 題！`);
}

function resetQuiz(){ buildQuizSet(); renderTrivia(); }

// ══ COUNTDOWN ════════════════════════════════════════════════
function renderCountdown(){
  const el=document.getElementById('countdown-banner');
  if(!el)return;
  const trip=new Date(2026,6,4); // 7/4/2026 出發日（台北飛紐約）
  const today=new Date();
  const d0=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const days=Math.round((trip-d0)/86400000);
  el.style.display='flex';
  if(days>0){
    el.innerHTML=`<span class="cd-emoji"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:42px;height:42px"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></span><div class="cd-text"><div class="cd-big">還有 <span class="cd-num">${days}</span> 天就要出發去紐約！</div><div class="cd-sub">7 月 4 日出發 · 好好期待吧！</div></div>`;
  } else if(days===0){
    el.innerHTML=`<span class="cd-emoji"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:42px;height:42px"><path d="M3 21l5-14 9 9zM14 6l1-2M18 8l2-1M17 3l.5-1M21 11l1-.5M19 5l1.5-1.5"/></svg></span><div class="cd-text"><div class="cd-big">就是今天！出發去紐約囉！</div><div class="cd-sub">展開大冒險 🗽</div></div>`;
  } else if(days>=-9){
    el.innerHTML=`<span class="cd-emoji"><svg viewBox="0 0 24 24" fill="#fff" style="width:42px;height:42px"><path d="M12 2c-1 2-3 3-3 5a3 3 0 0 0 6 0c0-2-2-3-3-5z"/><rect x="11" y="10" width="2" height="9"/><path d="M8 20h8l-1 2H9z"/></svg></span><div class="cd-text"><div class="cd-big">正在紐約探險中！</div><div class="cd-sub">把看到的、玩到的都記錄下來吧！</div></div>`;
  } else {
    el.innerHTML=`<span class="cd-emoji"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:42px;height:42px;vertical-align:-3px"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/></svg></span><div class="cd-text"><div class="cd-big">紐約之旅的美好回憶</div><div class="cd-sub">隨時回來看看你的旅遊護照！</div></div>`;
  }
}

// ══ FUN HUB ══════════════════════════════════════════════════
function setFunTab(which){
  ['hunt','cards','post'].forEach(t=>{
    document.getElementById('funtab-'+t).classList.toggle('active',t===which);
    document.getElementById('fun-'+t).style.display=(t===which)?'block':'none';
  });
  if(which==='hunt') renderHunt();
  if(which==='cards') renderCards();
  if(which==='post') renderPostcard();
}
function renderFun(){
  const active=document.querySelector('.funtab.active');
  const which=active?active.id.replace('funtab-',''):'hunt';
  setFunTab(which);
}

// ── Scavenger hunt (per kid) ──
function huntKey(){ return kk('nyc-hunt'); }
function getHunt(){ try{return JSON.parse(storeGet(huntKey(),'[]'));}catch(e){return [];} }
let pendingHuntId=null;
function huntPhotoKey(){ return kk('nyc-huntphoto'); }
function renderHunt(){
  const pane=document.getElementById('fun-hunt');
  const found=getHunt();
  const byDay={};
  HUNT.forEach(function(h){ (byDay[h.day]=byDay[h.day]||[]).push(h); });
  let html='<div class="hunt-progress">'+kidNames[currentKid]+' 找到了 '+found.length+' / '+HUNT.length+' 個！</div>';
  html+='<div class="hunt-tip">每天有不同的尋寶目標，找到就拍張照完成任務！</div>';
  Object.keys(byDay).sort(function(a,b){return a-b;}).forEach(function(day){
    html+='<div class="hunt-day">Day '+day+'</div>';
    byDay[day].forEach(function(h){
      const isF=found.indexOf(h.id)>=0; const ph=huntPhotos[h.id];
      html+='<div class="hunt-item'+(isF?' found':'')+'">'
        +'<span class="hunt-emoji">'+(ph?'<img class="hunt-photo" src="'+ph+'">':huntArt(h.id))+'</span>'
        +'<div class="hunt-body"><div class="hunt-name">'+h.name+'</div><div class="hunt-hint">'+h.hint+'</div></div>'
        +(isF
          ?'<button class="hunt-redo" onclick="unHunt(\''+h.id+'\')">✓ 完成</button>'
          :'<button class="hunt-cam" onclick="huntCapture(\''+h.id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;vertical-align:-3px"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/></svg> 拍照</button>');
      html+='</div>';
    });
  });
  pane.innerHTML=html;
}
function huntCapture(id){
  pendingHuntId=id;
  const input=document.getElementById('photo-input');
  input.value=''; input.onchange=handleHuntPhoto; input.click();
}
function handleHuntPhoto(e){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=function(ev){ const img=new Image(); img.onload=function(){
    const cv=document.createElement('canvas'); const sz=Math.min(img.width,img.height);
    cv.width=120; cv.height=120; cv.getContext('2d').drawImage(img,(img.width-sz)/2,(img.height-sz)/2,sz,sz,0,0,120,120);
    huntPhotos[pendingHuntId]=cv.toDataURL('image/jpeg',0.6);
    let found=getHunt(); if(found.indexOf(pendingHuntId)<0){ found.push(pendingHuntId); storeSet(huntKey(),JSON.stringify(found)); launchConfetti('#9B59B6'); }
    storeSet(huntPhotoKey(),JSON.stringify(huntPhotos));
    renderHunt();
    if(getHunt().length===HUNT.length){ setTimeout(function(){ showModal('🎖️','尋寶大師！',kidNames[currentKid]+' 找到了全部 '+HUNT.length+' 個寶物，太厲害了！'); },350); }
  }; img.src=ev.target.result; };
  reader.readAsDataURL(file);
}
function unHunt(id){
  let found=getHunt().filter(function(x){return x!==id;});
  storeSet(huntKey(),JSON.stringify(found));
  delete huntPhotos[id]; storeSet(huntPhotoKey(),JSON.stringify(huntPhotos));
  renderHunt();
}

// ── Flashcards ──
let fcIdx=0;
function renderCards(){
  const pane=document.getElementById('fun-cards');
  const c=FLASHCARDS[fcIdx];
  pane.innerHTML=`
    <div class="flashcard" onclick="speakCard()">
      <div class="fc-emoji">${c.emoji}</div>
      <div class="fc-en">${c.en}</div>
      <div class="fc-phon">${c.phon}</div>
      <div class="fc-zh">${c.zh}</div>
      <button class="fc-speak" onclick="event.stopPropagation();speakCard()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a4 4 0 0 1 0 7"/></svg> 聽發音</button>
    </div>
    <div class="fc-nav">
      <button class="fc-navbtn" onclick="fcPrev()">← 上一張</button>
      <span class="fc-counter">${fcIdx+1} / ${FLASHCARDS.length}</span>
      <button class="fc-navbtn" onclick="fcNext()">下一張 →</button>
    </div>`;
}
function speakCard(){
  const c=FLASHCARDS[fcIdx];
  try{
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(c.en);
    u.lang='en-US'; u.rate=0.85;
    speechSynthesis.speak(u);
  }catch(e){}
}
function fcNext(){ fcIdx=(fcIdx+1)%FLASHCARDS.length; renderCards(); }
function fcPrev(){ fcIdx=(fcIdx-1+FLASHCARDS.length)%FLASHCARDS.length; renderCards(); }

// ── Postcard maker ──
let pcPhoto=null, pcMsg='';
function escapeHtml(s){ return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function renderPostcard(){
  const pane=document.getElementById('fun-post');
  const photoIds=Object.keys(photos);
  let picker='';
  if(photoIds.length===0){
    picker=`<div class="post-pick-label">還沒有打卡照片！先去景點拍照打卡，就能做明信片囉</div>`;
    pcPhoto=null;
  } else {
    if(!pcPhoto || !photos[pcPhoto]) pcPhoto=photoIds[0];
    picker=`<div class="post-pick-label">① 選一張打卡照片：</div>
      <div class="post-photo-row">${photoIds.map(id=>`<img class="post-photo-opt${id===pcPhoto?' sel':''}" src="${photos[id]}" onclick="pickPostPhoto('${id}')">`).join('')}</div>`;
  }
  const img= (pcPhoto && photos[pcPhoto])
    ? `<img class="pc-img" src="${photos[pcPhoto]}">`
    : `<div class="pc-img-empty">紐約明信片</div>`;
  pane.innerHTML=`
    ${picker}
    <div class="post-pick-label">② 寫一句話給家人朋友：</div>
    <textarea class="post-input" id="post-msg" placeholder="例如：阿公阿嬤，我在紐約看到好高的大樓！想念你們～" oninput="updatePostMsg()">${pcMsg}</textarea>
    ${SPEECH_OK?`<button class="voice-btn" id="voice-btn-pc" onclick="toggleVoice('pc','postcard')"><span id="voice-ico-pc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></span> <span id="voice-txt-pc">語音輸入</span></button>`:''}
    <div class="post-pick-label">③ 你的明信片：</div>
    <div class="postcard" id="postcard-preview">
      ${img}
      <div class="pc-body">
        <div class="pc-stamp">🗽</div>
        <div class="pc-msg">${pcMsg?escapeHtml(pcMsg):'（在上面寫下你想說的話）'}</div>
        <div class="pc-from">— 來自 ${kidNames[currentKid]}，紐約 2026 🇺🇸</div>
      </div>
    </div>
    <div class="journal-saved">📸 想分享的話，截圖就能傳給家人囉！</div>`;
}
function pickPostPhoto(id){ pcPhoto=id; renderPostcard(); }
function updatePostMsg(){
  const t=document.getElementById('post-msg');
  if(!t)return;
  pcMsg=t.value;
  const prev=document.querySelector('#postcard-preview .pc-msg');
  if(prev) prev.textContent=pcMsg||'（在上面寫下你想說的話）';
}


// ══ ACHIEVEMENTS ══════════════════════════════════════════════
function renderAchieve(){
  const n=stamped.length;const q=quizDone.length;
  document.getElementById('ach-count').textContent=n+'/'+SPOTS.length;
  const msgs=['快去蓋第一個章吧！','太棒了，繼續努力！','超過一半了！','快到終點了！','恭喜！你是紐約探險家大師！'];
  const idx=n===0?0:n<4?1:n<8?2:n<12?3:4;
  document.getElementById('ach-msg').textContent=msgs[idx];

  const grid=document.getElementById('badge-grid');
  grid.innerHTML='';
  BADGES.forEach((b,bi)=>{
    const earned=b.req(n,q);
    const div=document.createElement('div');
    div.className='badge-card'+(earned?'':' locked');
    div.innerHTML=`<span class="badge-icon">${badgeArt(bi)}</span><div class="badge-name">${b.name}</div><div class="badge-cond">${b.cond}</div>`;
    grid.appendChild(div);
  });

  const gallery=document.getElementById('photo-gallery');
  gallery.innerHTML='';
  SPOTS.forEach(s=>{
    const photo=photos[s.id];
    const div=document.createElement('div');
    div.className='gallery-item';
    if(photo){
      div.innerHTML=`<img src="${photo}" alt="${s.name}"><div class="gallery-label">${s.name}</div>`;
    } else {
      div.innerHTML=spotArt(s.id);
      div.style.opacity='.35';
    }
    gallery.appendChild(div);
  });
}

// ══ NAV ═══════════════════════════════════════════════════════
function navTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const navMap={home:'nav-home',map:'nav-map',fun:'nav-fun',explore:'nav-explore',quiz:'nav-quiz',achieve:'nav-achieve'};
  if(navMap[id]) document.getElementById(navMap[id]).classList.add('active');
  document.querySelectorAll('.screen').forEach(s=>s.scrollTop=0);
  if(id==='home') renderHome();
  if(id==='map'){ renderMap(); initMapGestures(); }
  if(id==='fun') renderFun();
  if(id==='explore') renderKnowledge();
  if(id==='quiz') renderTrivia();
  if(id==='achieve') renderAchieve();
}

function showScreen(id,resetNav=true){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome(){
  renderHome();
  navTo('home');
}

function switchTab(el,_unused,tab){
  document.querySelectorAll('.det-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  const t=tab||el.getAttribute('onclick').match(/'(\w+)'/)?.[1];
  if(el)el.classList.add('active');
  document.getElementById('tab-'+t).classList.add('active');
}

function restartAll(){stamped=[];quizDone=[];photos={};journals={};quizAns={};storeSet(kk('nyc-quizans'),'{}');quizSet=[];quizPos=0;quizPicks={};storeSet(kk('nyc-journals'),'{}');storeSet(kk('nyc-hunt'),'[]');save();navTo('home');}

// ══ MODAL ════════════════════════════════════════════════════
function showModal(e,title,text){
  document.getElementById('modal-e').textContent=e;
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-text').textContent=text;
  document.getElementById('modal').classList.add('open');
}
function closeModal(){document.getElementById('modal').classList.remove('open');}

// ══ FX ═══════════════════════════════════════════════════════
function launchConfetti(color){
  const cols=[color,'#F4B942','#E5503A','#3B9AD9','#4CAF50','#9B59B6'];
  for(let i=0;i<22;i++){
    const el=document.createElement('div');
    el.className='confetti-p';
    el.style.cssText=`left:${20+Math.random()*60}%;background:${cols[Math.floor(Math.random()*cols.length)]};
      animation-delay:${Math.random()*.4}s;animation-duration:${.8+Math.random()*.5}s;
      transform:rotate(${Math.random()*360}deg);
      width:${6+Math.random()*7}px;height:${8+Math.random()*10}px;`;
    document.body.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
  }
}

function shootStars(el){
  const rect=el.getBoundingClientRect();
  for(let i=0;i<5;i++){
    const star=document.createElement('div');
    star.style.cssText=`position:fixed;pointer-events:none;z-index:999;font-size:1.3rem;
      left:${rect.left+Math.random()*rect.width}px;top:${rect.top}px;
      animation:confetti .75s ease-out ${i*.07}s forwards;`;
    star.textContent='⭐';
    document.body.appendChild(star);
    star.addEventListener('animationend',()=>star.remove());
  }
}

function lighten(hex){
  const n=parseInt(hex.slice(1),16);
  const r=Math.min(255,((n>>16)&0xff)+55);
  const g=Math.min(255,((n>>8)&0xff)+55);
  const b=Math.min(255,(n&0xff)+55);
  return `#${((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}`;
}

// ══ TAB FIX ══════════════════════════════════════════════════
document.querySelectorAll('.det-tab').forEach(el=>{
  el.addEventListener('click',function(){
    const tabName=this.getAttribute('onclick').match(/'(\w+)'/)[1];
    document.querySelectorAll('.det-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('tab-'+tabName).classList.add('active');
  });
});

// ══ INIT ══════════════════════════════════════════════════════
renderHome();


// ══ PWA (GitHub Pages ready) ═══════════════════════════════════
const APP_ICON="data:image/png;base64,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";
try {
  // iOS home-screen icon
  const ai=document.createElement('link'); ai.rel='apple-touch-icon'; ai.href=APP_ICON; document.head.appendChild(ai);
  // Web app manifest (data URI, self-contained)
  const manifest={name:'紐約探險家',short_name:'紐約探險家',start_url:'./',scope:'./',display:'standalone',
    background_color:'#F7F4EE',theme_color:'#1B3A6B',orientation:'portrait',
    icons:[{src:APP_ICON,sizes:'512x512',type:'image/png',purpose:'any maskable'}]};
  const mlink=document.createElement('link'); mlink.rel='manifest';
  mlink.href='data:application/manifest+json,'+encodeURIComponent(JSON.stringify(manifest));
  document.head.appendChild(mlink);
} catch(e){}
try {
  // Register sw.js if present (enables offline + Android install). Silently ignored if absent.
  if('serviceWorker' in navigator && location.protocol==='https:'){
    navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
  }
} catch(e){}

// ══ 成就分享卡 (V1.8.0) ════════════════════════════════════════
function _stripSvg(s){ return s.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,''); }
function _embed(svg,x,y,size){ return '<g transform="translate('+x+','+y+') scale('+(size/100)+')">'+_stripSvg(svg)+'</g>'; }
function buildCardSVG(){
  const W=1080,H=1350, cx=W/2;
  const name=(kidNames[currentKid]||'寶貝'), n=stamped.length, total=SPOTS.length, q=quizDone.length;
  const earned=[]; BADGES.forEach((b,i)=>{ if(b.req(n,q)) earned.push(i); });
  const got=stamped.slice().sort((a,b)=>a-b);
  let s='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" font-family="Nunito,PingFang TC,Microsoft JhengHei,sans-serif">';
  s+='<defs><linearGradient id="cardbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#24528F"/><stop offset="100%" stop-color="#10254A"/></linearGradient></defs>';
  s+='<rect width="'+W+'" height="'+H+'" fill="url(#cardbg)"/>';
  s+='<rect x="22" y="22" width="'+(W-44)+'" height="'+(H-44)+'" rx="40" fill="none" stroke="#F4B942" stroke-width="5" opacity="0.6"/>';
  // header star + title
  s+='<g transform="translate('+(cx-36)+',70)"><path d="M36 4l10 22 24 2-18 16 5 24-21-13-21 13 5-24L8 28l24-2z" fill="#F4B942"/></g>';
  s+='<text x="'+cx+'" y="210" fill="#fff" font-size="62" font-weight="900" text-anchor="middle">紐約家庭之旅</text>';
  s+='<text x="'+cx+'" y="262" fill="#F4B942" font-size="32" font-weight="800" text-anchor="middle" letter-spacing="3">旅行護照 · 成就卡</text>';
  // avatar circle
  const aR=140, aCY=440;
  s+='<circle cx="'+cx+'" cy="'+aCY+'" r="'+(aR+10)+'" fill="#1B3A6B"/>';
  s+='<circle cx="'+cx+'" cy="'+aCY+'" r="'+(aR+10)+'" fill="none" stroke="#F4B942" stroke-width="7"/>';
  s+='<clipPath id="avclip"><circle cx="'+cx+'" cy="'+aCY+'" r="'+aR+'"/></clipPath>';
  s+='<g clip-path="url(#avclip)"><rect x="'+(cx-aR)+'" y="'+(aCY-aR)+'" width="'+(2*aR)+'" height="'+(2*aR)+'" fill="#EAF0FA"/>'+_embed(buildAvatar(kidAvatars[currentKid],100), cx-aR, aCY-aR, 2*aR)+'</g>';
  // name
  s+='<text x="'+cx+'" y="660" fill="#fff" font-size="56" font-weight="900" text-anchor="middle">'+name+'</text>';
  // progress
  s+='<text x="'+cx+'" y="738" fill="#FCEFD2" font-size="40" font-weight="800" text-anchor="middle">已收集 '+n+' / '+total+' 個景點印章</text>';
  const bx=150,bw=W-300,by=768;
  s+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="34" rx="17" fill="rgba(255,255,255,0.16)"/>';
  if(n>0) s+='<rect x="'+bx+'" y="'+by+'" width="'+Math.max(34,bw*n/total)+'" height="34" rx="17" fill="#F4B942"/>';
  // badges earned
  s+='<text x="'+cx+'" y="888" fill="#F4B942" font-size="34" font-weight="800" text-anchor="middle">'+earned.length+' 個成就徽章</text>';
  if(earned.length){ const bs=96, gap=18, tot=earned.length*bs+(earned.length-1)*gap, sx=cx-tot/2;
    earned.forEach((bi,k)=>{ s+=_embed(badgeArt(bi), sx+k*(bs+gap), 910, bs); }); }
  // collected stickers grid
  s+='<text x="'+cx+'" y="1108" fill="#FCEFD2" font-size="32" font-weight="800" text-anchor="middle">'+(n?'蓋章的地標':'快去蓋第一個章吧！')+'</text>';
  if(n){ const cols=6, cs=112, gp=14, show=got.slice(0,12), rows=Math.ceil(show.length/cols);
    const gw=cols*cs+(cols-1)*gp, gx=cx-gw/2;
    show.forEach((si,k)=>{ const r=Math.floor(k/cols), c=k%cols; s+=_embed(spotArt(SPOTS[si].id), gx+c*(cs+gp), 1135+r*(cs+gp), cs); });
  }
  // footer
  s+='<text x="'+cx+'" y="1310" fill="rgba(255,255,255,0.7)" font-size="28" font-weight="700" text-anchor="middle">2026 · 7/4 – 7/12 · 一起去紐約！</text>';
  s+='</svg>';
  return s;
}
function svgToPng(svg,w,h,cb){
  var img=new Image();
  var blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
  var url=URL.createObjectURL(blob);
  img.onload=function(){ var cv=document.createElement('canvas');cv.width=w;cv.height=h; cv.getContext('2d').drawImage(img,0,0,w,h); URL.revokeObjectURL(url); cv.toBlob(function(b){cb(b);},'image/png',0.95); };
  img.onerror=function(){ URL.revokeObjectURL(url); cb(null); };
  img.src=url;
}
function shareCard(){
  var btn=document.getElementById('share-btn');
  if(btn){btn.disabled=true;btn.textContent='產生中…';}
  function reset(){ if(btn){btn.disabled=false;btn.textContent='分享成就卡給家人';} }
  try{
    var svg=buildCardSVG();
    svgToPng(svg,1080,1350,function(blob){
      reset();
      if(!blob){alert('產生失敗，請再試一次');return;}
      var fname=(kidNames[currentKid]||'寶貝')+'的紐約護照.png';
      var file=new File([blob],fname,{type:'image/png'});
      var txt=(kidNames[currentKid]||'寶貝')+' 的紐約探險成就！';
      if(navigator.canShare && navigator.canShare({files:[file]})){
        navigator.share({files:[file],title:'我的紐約旅行護照',text:txt}).catch(function(){});
      }else{
        var a=document.createElement('a');var u=URL.createObjectURL(blob);a.href=u;a.download=fname;document.body.appendChild(a);a.click();a.remove();
        setTimeout(function(){URL.revokeObjectURL(u);},2000);
        alert('成就卡已存成圖片，可以分享給家人囉！');
      }
    });
  }catch(e){ reset(); alert('產生失敗，請再試一次'); }
}
