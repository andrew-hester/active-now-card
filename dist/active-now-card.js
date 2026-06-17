const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,f=g?g.emptyScript:"",b=u.reactiveElementPolyfillSupport,v=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},_=(t,e)=>!a(t,e),$={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??_)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[v("elementProperties")]=new Map,y[v("finalized")]=new Map,b?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,A=x.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+C,M=`<${S}>`,H=document,O=()=>H.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,P="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,T=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,B=/"/g,j=/^(?:script|style|textarea|title)$/i,D=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),F=D(1),I=D(2),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),Z=new WeakMap,K=H.createTreeWalker(H,129);function G(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=L;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===L?"!--"===l[1]?r=R:void 0!==l[1]?r=N:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=o??L,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?T:'"'===l[3]?B:V):r===B||r===V?r=T:r===R||r===N?r=L:(r=T,o=void 0);const h=r===T&&t[e+1].startsWith("/>")?" ":"";n+=r===L?s+M:c>=0?(i.push(a),s.slice(0,c)+E+s.slice(c)+C+h):s+C+(-2===c?e:h)}return[G(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=X(t,e);if(this.el=Y.createElement(l,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=c[n++],s=i.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?st:"?"===r[1]?it:"@"===r[1]?ot:et}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),K.nextNode(),a.push({type:2,index:++o});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===S)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===W)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=z(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=J(t,o._$AS(t,e.values),o,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??H).importNode(e,!0);K.currentNode=i;let o=K.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),z(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Y(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new tt(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=J(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=J(this,i[s+r],e,r),a===W&&(a=this._$AH[r]),n||=!z(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends et{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??q)===W)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(Y,tt),(x.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new tt(e.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const dt=["blind","curtain","shade","window","awning","shutter"],ht=["garage","door"],pt="Other";function ut(t){return t?Array.isArray(t)?t.slice():[t]:[]}function gt(t,e){const s=t.states[e],i=s?.attributes?.friendly_name;return i||e.split(".").pop().replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function ft(t,e){const s=t.entities?.[e];let i=s?.area_id??null;return!i&&s?.device_id&&(i=t.devices?.[s.device_id]?.area_id??null),i?t.areas?.[i]?.name??null:null}function bt(t){const e=t.attributes?.brightness;return"number"==typeof e?Math.round(e/255*100):100}function vt(t){if(!t)return!1;if("open"===t.state)return!0;const e=t.attributes?.current_position;return"number"==typeof e&&e>0}function mt(t,e,s){return{entity_id:e,name:gt(t,e),kind:"light",brightnessPct:bt(s)}}function _t(t,e){return{entity_id:e,name:gt(t,e),kind:"fan"}}function $t(t,e){const s=t.states||{},i="manual"===e.group_by&&Array.isArray(e.rooms),o=ut(e.fans),n=ut(e.blinds),r=ut(e.garage),a=[],l=new Set,c=r.length?r:Object.keys(s).filter(t=>t.startsWith("cover.")&&ht.includes(String(s[t]?.attributes?.device_class)));for(const e of c){const i=s[e];i&&vt(i)&&(a.push({entity_id:e,name:gt(t,e),kind:"door",isGarage:r.includes(e)||"garage"===i.attributes?.device_class}),l.add(e))}const d=[],h=n.length?n:Object.keys(s).filter(t=>t.startsWith("cover.")&&dt.includes(String(s[t]?.attributes?.device_class))&&!l.has(t));for(const e of h){const i=s[e];i&&!l.has(e)&&vt(i)&&d.push({entity_id:e,name:gt(t,e),kind:"blind"})}const p=(o.length?o:Object.keys(s).filter(t=>t.startsWith("fan."))).filter(t=>"on"===s[t]?.state),u=[];if(i){const i=new Set;for(const o of e.rooms){const e={name:o.name,lights:[],fans:[]};for(const n of o.entities||[]){const o=s[n];o&&(n.startsWith("light.")&&"on"===o.state?e.lights.push(mt(t,n,o)):n.startsWith("fan.")&&"on"===o.state&&(e.fans.push(_t(t,n)),i.add(n)))}(e.lights.length||e.fans.length)&&u.push(e)}const o=p.filter(t=>!i.has(t));o.length&&u.push({name:pt,lights:[],fans:o.map(e=>_t(t,e))})}else{const e=new Map,i=t=>{let s=e.get(t);return s||(s={name:t,lights:[],fans:[]},e.set(t,s)),s};for(const e of Object.keys(s)){if(!e.startsWith("light."))continue;const o=s[e];"on"===o.state&&i(ft(t,e)||pt).lights.push(mt(t,e,o))}for(const e of p)i(ft(t,e)||pt).fans.push(_t(t,e));const o=[...e.keys()].sort((t,e)=>t===pt?1:e===pt?-1:t.localeCompare(e));for(const t of o)u.push(e.get(t))}const g={lights:u.reduce((t,e)=>t+e.lights.length,0),fans:u.reduce((t,e)=>t+e.fans.length,0),blinds:d.length,doors:a.length,total:0};return g.total=g.lights+g.fans+g.blinds+g.doors,{doors:a,rooms:u,blinds:d,counts:g}}const yt={home:"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",bulb:"M9 21h6v-1H9v1zm0-2h6v-1.5H9V19zm3-17a7 7 0 0 0-4.9 12 1 1 0 0 0 .9.6h8a1 1 0 0 0 .9-.6A7 7 0 0 0 12 2z",fan:"M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.88,18.03 15.09,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.87 2,15.08 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.69 9.22,10.88C9.41,10.41 9.72,9.99 10.11,9.67C8.11,5.97 8.9,2 12.5,2Z",garage:"M22,9V20H19V11H5V20H2V9L12,5L22,9M18,12H6V13H18V12M18,14H6V15H18V14M18,16H6V17H18V16M18,18H6V19H18V18Z",blinds:"M19,19V3H5V19H3V21H21V19H19M7,5H17V7H7V5M7,9H17V11H7V9M7,13H17V15H7V13M7,17H17V18H7V17Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"};function xt(t){return I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${yt[t]}"></path></svg>`}class wt extends lt{constructor(){super(...arguments),this._config={}}setConfig(t){this._config={...t},this.requestUpdate()}_emit(t){const e={...this._config,...t};Object.keys(e).forEach(t=>{""!==e[t]&&void 0!==e[t]&&null!==e[t]||delete e[t]}),this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){const t=this._config;return F`
      <div class="form">
        <label class="field">
          <span>Title</span>
          <input
            type="text"
            .value=${t.title??"Active Now"}
            @input=${t=>this._emit({title:t.target.value})}
          />
        </label>

        <label class="field">
          <span>Group by</span>
          <select
            .value=${t.group_by??"area"}
            @change=${t=>this._emit({group_by:t.target.value})}
          >
            <option value="area">Area (auto-discover)</option>
            <option value="manual">Manual rooms</option>
          </select>
        </label>

        <label class="field">
          <span>Accent color</span>
          <input
            type="text"
            placeholder="#FFB23E"
            .value=${t.accent_color??"#FFB23E"}
            @input=${t=>this._emit({accent_color:t.target.value})}
          />
        </label>

        <label class="checkbox">
          <input
            type="checkbox"
            .checked=${!1!==t.show_brightness}
            @change=${t=>this._emit({show_brightness:t.target.checked})}
          />
          <span>Show brightness bars</span>
        </label>

        ${"manual"===t.group_by?F`<div class="hint">
              <code>group_by: manual</code> — add a <code>rooms:</code> list in YAML.
              Each room needs a <code>name</code> and an <code>entities</code> array.
            </div>`:F`<div class="hint">
              Auto-discovery groups lights and fans by their Home Assistant area.
              Use the YAML editor to override <code>fans</code>, <code>blinds</code>,
              or <code>garage</code>.
            </div>`}
      </div>
    `}}wt.styles=n`
    .form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 2px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .field > span {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #ddd);
    }
    input[type='text'],
    select {
      padding: 9px 11px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #222);
      font: inherit;
      font-size: 14px;
    }
    .checkbox {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 14px;
      color: var(--primary-text-color, #ddd);
      cursor: pointer;
    }
    .checkbox input {
      width: 18px;
      height: 18px;
    }
    .hint {
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--secondary-text-color, #888);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      padding: 10px 12px;
      border-radius: 8px;
    }
    code {
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
      font-size: 12px;
      background: rgba(127, 127, 127, 0.18);
      padding: 1px 5px;
      border-radius: 4px;
    }
  `,customElements.get("active-now-card-editor")||customElements.define("active-now-card-editor",wt);const At="#FFB23E",kt={light:["light","turn_off"],fan:["fan","turn_off"],blind:["cover","close_cover"],door:["cover","close_cover"]};function Et(t,e){let s=(t||"").replace("#","").trim();/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(s)||(s=At.replace("#","")),3===s.length&&(s=s.split("").map(t=>t+t).join(""));const i=parseInt(s,16);return`rgba(${i>>16&255}, ${i>>8&255}, ${255&i}, ${e})`}class Ct extends lt{constructor(){super(...arguments),this._filter="all",this._removing=new Set,this._prevOverflow="",this._onKeyDown=t=>{"Escape"===t.key&&this._close()}}set hass(t){if(this._hass=t,this._removing.size)for(const e of[...this._removing])this._isOff(t.states[e])&&this._removing.delete(e);this.requestUpdate()}get hass(){return this._hass}_isOff(t){if(!t)return!0;if("on"===t.state||"open"===t.state)return!1;const e=t.attributes?.current_position;return!("number"==typeof e&&e>0)}connectedCallback(){super.connectedCallback(),this._prevOverflow=document.body.style.overflow,document.body.style.overflow="hidden",window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),document.body.style.overflow=this._prevOverflow,window.removeEventListener("keydown",this._onKeyDown)}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_live(t){return t.filter(t=>!this._removing.has(t.entity_id))}_offMany(t){const e=t.filter(t=>!this._removing.has(t.entity_id));if(!e.length)return;e.forEach(t=>this._removing.add(t.entity_id)),this.requestUpdate();const s=new Map;for(const t of e){const[e,i]=kt[t.kind],o=`${e}.${i}`,n=s.get(o)??[];n.push(t.entity_id),s.set(o,n)}for(const[t,e]of s){const[s,i]=t.split(".");this._hass.callService(s,i,{entity_id:e})}const i=e.map(t=>t.entity_id);window.setTimeout(()=>{let t=!1;for(const e of i)this._removing.delete(e)&&(t=!0);t&&this.requestUpdate()},2200)}_off(t){this._offMany([t])}render(){if(!this._hass||!this.config)return q;const t=function(t){return t&&/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(t)?t.startsWith("#")?t:`#${t}`:At}(this.config.accent_color),e=$t(this._hass,this.config),s=`--accent:${t};--accent-soft:${Et(t,.14)};--accent-strong:${Et(t,.85)};`,i=this._counts(e),o=e.rooms.filter(t=>this._live(t.lights).length+this._live(t.fans).length>0).length,n=this._filter,r=i.lights>=1&&("all"===n||"lights"===n);return F`
      <div class="root" style=${s}>
        <div class="backdrop" @click=${this._close}></div>
        <div
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-label=${this.config.title||"Active Now"}
        >
          <div class="header">
            <div class="headtop">
              <div class="titlewrap">
                <div class="title">${this.config.title||"Active Now"}</div>
                <div class="subtitle">
                  ${i.total} thing${1!==i.total?"s":""} on · ${o}
                  room${1!==o?"s":""}
                </div>
              </div>
              <div class="headactions">
                ${r?F`<button class="ghost amber" @click=${()=>this._turnOffAllLights(e)}>
                      ${xt("bulb")} Turn off all lights
                    </button>`:q}
                <button class="closeX" aria-label="Close" @click=${this._close}>
                  ${xt("close")}
                </button>
              </div>
            </div>
            ${this._renderFilters(i)}
          </div>
          <div class="body">${this._renderBody(e)}</div>
        </div>
      </div>
    `}_counts(t){const e=t.rooms.reduce((t,e)=>t+this._live(e.lights).length,0),s=t.rooms.reduce((t,e)=>t+this._live(e.fans).length,0),i=this._live(t.blinds).length,o=this._live(t.doors).length;return{lights:e,fans:s,blinds:i,doors:o,total:e+s+i+o}}_renderFilters(t){const e=(t,e,s,i)=>F`
      <button
        class="fchip ${this._filter===t?"active":""}"
        @click=${()=>{this._filter=t,this.requestUpdate()}}
      >
        <span class="fdot" style="background:${i}"></span>
        <span>${e}</span>
        <span class="fcount">${s}</span>
      </button>
    `;return F`
      <div class="filters">
        ${e("all","All",t.total,"#9aa3b4")}
        ${e("lights","Lights",t.lights,"var(--accent)")}
        ${e("blinds","Blinds",t.blinds,"#5BA8F2")}
        ${e("fans","Fans",t.fans,"#35D6C6")}
        ${e("doors","Doors",t.doors,"#F4595B")}
      </div>
    `}_renderBody(t){const e=this._filter;if(0===this._counts(t).total)return this._renderEmpty("All clear","Nothing is on. Your home is buttoned up.");const s=("all"===e||"doors"===e)&&this._live(t.doors).length>0,i="all"===e||"lights"===e||"fans"===e,o="all"===e||"blinds"===e,n=s?this._renderBanner(t):q,r=i?this._renderRooms(t):q,a=o?this._renderBlinds(t):q;return s||i&&r!==q||o&&a!==q?F`${n}${r}${a}`:this._renderEmpty("Nothing here","Everything in this category is already off.")}_renderEmpty(t,e){return F`
      <div class="empty">
        <div class="ico">${xt("check")}</div>
        <h3>${t}</h3>
        <p>${e}</p>
      </div>
    `}_renderBanner(t){const e=this._live(t.doors),s=1===e.length;let i,o;if(s){const t=e[0];i=t.isGarage?"Garage door is open":`${t.name} is open`;const s=function(t){if(!t)return"";const e=new Date(t).getTime();if(isNaN(e))return"";const s=Math.max(0,(Date.now()-e)/1e3);if(s<90)return"just now";const i=Math.round(s/60);if(i<45)return`${i} minute${1!==i?"s":""} ago`;const o=Math.round(s/3600);if(o<2)return"an hour ago";if(o<24)return`${o} hours ago`;const n=Math.round(s/86400);return`${n} day${1!==n?"s":""} ago`}(this._hass.states[t.entity_id]?.last_changed);o=s?`${t.name} · opened ${s}`:"Tap close to secure it."}else i=`${e.length} doors are open`,o="Close them before you head out.";return F`
      <div class="banner">
        <div class="chip door">${xt("garage")}</div>
        <div class="bannertext">
          <div class="bannertitle">${i}</div>
          <div class="bannersub">${o}</div>
        </div>
        <button class="closebtn" @click=${()=>this._offMany(e)}>
          ${s?"Close door":"Close all"}
        </button>
      </div>
    `}_renderRooms(t){const e=this._filter,s="all"===e||"lights"===e,i="all"===e||"fans"===e,o=[];for(const e of t.rooms){const t=s?e.lights:[],n=i?e.fans:[];if(!t.length&&!n.length)continue;const r=this._live(t).length+this._live(n).length;o.push(this._renderRoomCard(e,t,n,r))}return o.length?F`<div class="rooms">${o}</div>`:q}_renderRoomCard(t,e,s,i){const o=[...t.lights,...t.fans];return F`
      <div class="room">
        <div class="roomhead">
          <div class="roomname">${t.name}</div>
          <div class="pill">${i} on</div>
          <button class="linkbtn" @click=${()=>this._offMany(o)}>Turn off</button>
        </div>
        ${e.map(t=>this._renderLightRow(t))}
        ${s.map(t=>this._renderFanRow(t))}
      </div>
    `}_renderLightRow(t){const e=this._removing.has(t.entity_id),s=t.brightnessPct??100,i=!1!==this.config.show_brightness;return F`
      <div
        class="row ${e?"removing":""}"
        @click=${()=>this._off(t)}
      >
        <div class="chip light">${xt("bulb")}</div>
        <div class="rowtext">
          <div class="name">${t.name}</div>
          <div class="sub">On · ${s}%</div>
          ${i?F`<div class="bar"><div class="fill" style="width:${s}%"></div></div>`:q}
        </div>
        <div class="toggle light"><span class="knob"></span></div>
      </div>
    `}_renderFanRow(t){const e=this._removing.has(t.entity_id);return F`
      <div class="row ${e?"removing":""}" @click=${()=>this._off(t)}>
        <div class="chip fan">${xt("fan")}</div>
        <div class="rowtext">
          <div class="name">${t.name}</div>
          <div class="sub">Running</div>
        </div>
        <div class="toggle fan"><span class="knob"></span></div>
      </div>
    `}_renderBlinds(t){if(!t.blinds.length)return q;const e=this._live(t.blinds).length;return F`
      <div class="zone">
        <div class="zonehead">
          <div class="chip blind">${xt("blinds")}</div>
          <div class="zonetitle">
            Blinds &amp; Curtains <span class="zonecount">${e} open</span>
          </div>
          <button class="ghost blue" @click=${()=>this._offMany(t.blinds)}>
            Close all
          </button>
        </div>
        <div class="blindgrid">
          ${t.blinds.map(t=>this._renderBlindRow(t))}
        </div>
      </div>
    `}_renderBlindRow(t){const e=this._removing.has(t.entity_id);return F`
      <div class="row ${e?"removing":""}" @click=${()=>this._off(t)}>
        <div class="chip blind">${xt("blinds")}</div>
        <div class="rowtext">
          <div class="name">${t.name}</div>
          <div class="sub">Open</div>
        </div>
        <div class="toggle blind"><span class="knob"></span></div>
      </div>
    `}_turnOffAllLights(t){const e=t.rooms.flatMap(t=>t.lights);this._offMany(e)}}Ct.styles=n`
    :host {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      font-family: -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
    }
    .root {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(6, 8, 14, 0.62);
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
      animation: fade 0.18s ease;
    }
    .panel {
      position: relative;
      width: min(1080px, 95vw);
      height: min(880px, 93vh);
      display: flex;
      flex-direction: column;
      border-radius: 26px;
      background: linear-gradient(150deg, #191e2c, #1b1830 60%, #241a36);
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow: 0 40px 120px -30px rgba(0, 0, 0, 0.75);
      overflow: hidden;
      animation: pop 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.1);
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.985);
      }
    }

    /* header */
    .header {
      flex: 0 0 auto;
      padding: 20px 26px 14px;
      background: linear-gradient(180deg, #1b2030, #1a1c2e);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .headtop {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .title {
      font-size: 25px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #f2f5fb;
    }
    .subtitle {
      font-size: 13.5px;
      color: #8a93a6;
      margin-top: 3px;
    }
    .headactions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .closeX {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cfd6e6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex: 0 0 auto;
    }
    .closeX:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    .closeX svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    /* buttons */
    .ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cfd6e6;
      border-radius: 10px;
      padding: 6px 12px;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s;
    }
    .ghost svg {
      width: 15px;
      height: 15px;
      fill: currentColor;
    }
    .ghost:hover {
      background: rgba(255, 255, 255, 0.06);
    }
    .ghost.amber {
      color: var(--accent);
      border-color: rgba(255, 178, 62, 0.4);
      background: rgba(255, 178, 62, 0.08);
    }
    .ghost.amber:hover {
      background: rgba(255, 178, 62, 0.14);
    }
    .ghost.blue {
      color: #5ba8f2;
      border-color: rgba(91, 168, 242, 0.4);
    }
    /* borderless text action (per-room "Turn off") */
    .linkbtn {
      background: transparent;
      border: none;
      color: #8a93a6;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 2px;
      white-space: nowrap;
      transition: color 0.15s;
    }
    .linkbtn:hover {
      color: #eef1f7;
    }

    /* filter chips */
    .filters {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .fchip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 13px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #8a93a6;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .fchip.active {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.18);
      color: #eef1f7;
    }
    .fdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .fcount {
      opacity: 0.85;
      font-variant-numeric: tabular-nums;
    }

    /* body */
    .body {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 20px 26px 30px;
    }

    /* shared icon chip */
    .chip {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }
    .chip svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    .chip.light {
      background: var(--accent-soft);
      color: var(--accent);
    }
    .chip.fan {
      background: rgba(53, 214, 198, 0.14);
      color: #35d6c6;
    }
    .chip.blind {
      background: rgba(91, 168, 242, 0.13);
      color: #5ba8f2;
    }
    .chip.door {
      background: rgba(244, 89, 91, 0.18);
      color: #f4595b;
    }

    /* urgent banner */
    .banner {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border-radius: 16px;
      margin-bottom: 18px;
      background: linear-gradient(
        120deg,
        rgba(244, 89, 91, 0.17),
        rgba(244, 89, 91, 0.06)
      );
      border: 1px solid rgba(244, 89, 91, 0.34);
      animation: pulse 2.4s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 rgba(244, 89, 91, 0);
      }
      50% {
        box-shadow: 0 0 0 6px rgba(244, 89, 91, 0.1);
      }
    }
    .bannertext {
      flex: 1;
      min-width: 0;
    }
    .bannertitle {
      font-size: 15px;
      font-weight: 700;
      color: #ffdadb;
    }
    .bannersub {
      font-size: 12.5px;
      color: #e79c9d;
      margin-top: 2px;
    }
    .closebtn {
      background: #f4595b;
      color: #fff;
      border: none;
      border-radius: 11px;
      padding: 10px 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .closebtn:hover {
      filter: brightness(1.07);
    }

    /* rooms masonry */
    .rooms {
      column-count: 3;
      column-gap: 16px;
    }
    @media (max-width: 1080px) {
      .rooms {
        column-count: 2;
      }
    }
    @media (max-width: 720px) {
      .rooms {
        column-count: 1;
      }
    }
    .room {
      break-inside: avoid;
      margin-bottom: 16px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 14px;
    }
    .roomhead {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .roomname {
      font-size: 15px;
      font-weight: 700;
      color: #eef1f7;
    }
    .pill {
      font-size: 11.5px;
      font-weight: 600;
      color: #aab3c5;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .roomhead .linkbtn {
      margin-left: auto;
    }

    /* device row */
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 13px;
      padding: 10px 12px;
      margin-top: 8px;
      cursor: pointer;
      min-height: 44px;
      transition: opacity 0.26s ease, transform 0.26s ease, background 0.15s ease;
    }
    .row:hover {
      background: rgba(255, 255, 255, 0.075);
    }
    .row.removing {
      opacity: 0;
      transform: scale(0.95);
      pointer-events: none;
    }
    .rowtext {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 14.5px;
      font-weight: 600;
      color: #eef1f7;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .sub {
      font-size: 12px;
      color: #8a93a6;
      margin-top: 1px;
    }
    .bar {
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.09);
      margin-top: 7px;
      overflow: hidden;
    }
    .bar .fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent-strong), var(--accent));
      transition: width 0.2s ease;
    }

    /* toggle */
    .toggle {
      width: 48px;
      height: 28px;
      border-radius: 999px;
      position: relative;
      flex: 0 0 auto;
    }
    .toggle .knob {
      position: absolute;
      top: 3px;
      left: 23px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .toggle.light {
      background: var(--accent);
    }
    .toggle.fan {
      background: #35d6c6;
    }
    .toggle.blind {
      background: #5ba8f2;
    }

    /* blinds zone */
    .zone {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 16px;
      margin-top: 2px;
    }
    .zonehead {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 4px;
    }
    .zonetitle {
      font-size: 15px;
      font-weight: 700;
      color: #eef1f7;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .zonecount {
      font-size: 11.5px;
      font-weight: 600;
      color: #aab3c5;
      background: rgba(91, 168, 242, 0.14);
      padding: 2px 8px;
      border-radius: 999px;
    }
    .zonehead .ghost {
      margin-left: auto;
    }
    .blindgrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
      gap: 10px;
      margin-top: 6px;
    }
    .blindgrid .row {
      margin-top: 0;
    }

    /* empty state */
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 70px 20px;
    }
    .empty .ico {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(53, 214, 198, 0.14);
      color: #35d6c6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .empty .ico svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
    }
    .empty h3 {
      font-size: 19px;
      font-weight: 700;
      color: #eef1f7;
      margin: 0;
    }
    .empty p {
      font-size: 13.5px;
      color: #8a93a6;
      margin: 6px 0 0;
    }
  `;class St extends lt{constructor(){super(...arguments),this._openOverlay=()=>{if(this._overlay)return;const t=document.createElement("active-now-overlay");t.config=this._config,t.hass=this._hass,t.addEventListener("close",this._closeOverlay),document.body.appendChild(t),this._overlay=t},this._closeOverlay=()=>{this._overlay&&(this._overlay.removeEventListener("close",this._closeOverlay),this._overlay.remove(),this._overlay=void 0)},this._onKey=t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._openOverlay())}}static getConfigElement(){return document.createElement("active-now-card-editor")}static getStubConfig(){return{type:"custom:active-now-card",title:"Active Now",group_by:"area",show_brightness:!0}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(t.group_by&&!["area","manual"].includes(t.group_by))throw new Error(`group_by must be "area" or "manual" (got "${t.group_by}")`);if("manual"===t.group_by&&!Array.isArray(t.rooms))throw new Error('group_by: manual requires a "rooms" list');this._config={group_by:"area",title:"Active Now",show_brightness:!0,accent_color:At,...t},this._overlay&&(this._overlay.config=this._config),this.requestUpdate()}set hass(t){this._hass=t,this._overlay&&(this._overlay.hass=t),this.requestUpdate()}get hass(){return this._hass}getCardSize(){return 1}disconnectedCallback(){super.disconnectedCallback(),this._closeOverlay()}render(){if(!this._hass||!this._config)return q;const t=$t(this._hass,this._config),e=function(t){const e=t.counts,s=[];if(e.doors){const i=t.doors.every(t=>t.isGarage)?"garage door":"door";s.push(`${e.doors} ${i}${1!==e.doors?"s":""} open`)}return e.lights&&s.push(`${e.lights} light${1!==e.lights?"s":""}`),e.blinds&&s.push(`${e.blinds} blind${1!==e.blinds?"s":""} open`),e.fans&&s.push(`${e.fans} fan${1!==e.fans?"s":""} running`),s.length?s.join(" · ")+" — tap to manage":"Nothing is on — your home is buttoned up"}(t);return F`
      <div
        class="chip"
        role="button"
        tabindex="0"
        @click=${this._openOverlay}
        @keydown=${this._onKey}
      >
        <div class="homechip">${xt("home")}</div>
        <div class="chiptext">
          <div class="line1">${t.counts.total} active now</div>
          <div class="line2">${e}</div>
        </div>
      </div>
    `}}St.styles=n`
    :host {
      display: block;
      font-family: -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      padding: 16px 20px;
      border-radius: 18px;
      background: linear-gradient(
        135deg,
        rgba(74, 103, 176, 0.42),
        rgba(54, 72, 128, 0.3)
      );
      border: 1px solid rgba(120, 150, 220, 0.28);
      transition: transform 0.12s ease, border-color 0.15s ease;
    }
    .chip:hover {
      border-color: rgba(150, 180, 240, 0.45);
    }
    .chip:active {
      transform: scale(0.99);
    }
    .homechip {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(244, 89, 91, 0.18);
      color: #f4595b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }
    .homechip svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
    .chiptext {
      min-width: 0;
    }
    .line1 {
      font-size: 16px;
      font-weight: 700;
      color: #eef1f7;
    }
    .line2 {
      font-size: 13px;
      color: #c4d0ec;
      margin-top: 2px;
      overflow-wrap: anywhere;
    }
  `,customElements.get("active-now-overlay")||customElements.define("active-now-overlay",Ct),customElements.get("active-now-card")||customElements.define("active-now-card",St);const Mt=window;Mt.customCards=Mt.customCards||[],Mt.customCards.some(t=>"active-now-card"===t.type)||Mt.customCards.push({type:"active-now-card",name:"Active Now Card",description:"A summary chip + full-screen overlay to review and turn off everything that's on, grouped by room.",preview:!1,documentationURL:"https://github.com/your-username/active-now-card"}),console.info("%c ACTIVE-NOW-CARD %c v1.0.0 ","color:#10141e;background:#FFB23E;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px","color:#FFB23E;background:#10141e;border-radius:0 4px 4px 0;padding:2px 6px");export{St as ActiveNowCard,Ct as ActiveNowOverlay};
