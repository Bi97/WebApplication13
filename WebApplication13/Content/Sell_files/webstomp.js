!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.webstomp=t():e.webstomp=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,n){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e){var t=encodeURIComponent(e),n=t.replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}),r=Array.prototype.map.call(n,function(e){return e.charCodeAt(0)});return new Uint8Array(r)}function a(e){var t=String.fromCharCode.apply(String,r(e)),n=t.replace(/(.)/g,function(e,t){var n=t.charCodeAt(0).toString(16).toUpperCase();return n.length<2&&(n="0"+n),"%"+n});return decodeURIComponent(n)}function o(e){return e?encodeURIComponent(e).match(/%..|./g).length:0}function s(){return(new Date).getTime()+"-"+Math.floor(1e3*Math.random())}Object.defineProperty(t,"__esModule",{value:!0}),t.unicodeStringToTypedArray=i,t.typedArrayToUnicodeString=a,t.sizeOfUTF8=o,t.createId=s;t.VERSIONS={V1_0:"1.0",V1_1:"1.1",V1_2:"1.2",supportedVersions:function(){return"1.2,1.1,1.0"},supportedProtocols:function(){return["v10.stomp","v11.stomp","v12.stomp"]}},t.BYTES={LF:"\n",NULL:"\0"},t.trim=function(e){return e.replace(/^\s+|\s+$/g,"")}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw a}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(2),s=function(e){return e&&e.__esModule?e:{default:e}}(o),u=n(0),c=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r(this,e);var i=n.binary,a=void 0!==i&&i,o=n.heartbeat,s=void 0===o?{outgoing:1e4,incoming:1e4}:o,u=n.debug,c=void 0===u||u;this.ws=t,this.ws.binaryType="arraybuffer",this.isBinary=!!a,this.hasDebug=!!c,this.connected=!1,this.heartbeat=s||{outgoing:0,incoming:0},this.maxWebSocketFrameSize=16384,this.subscriptions={},this.partialData=""}return a(e,[{key:"debug",value:function(){var e;this.hasDebug&&(e=console).log.apply(e,arguments)}},{key:"connect",value:function(){var e=this,t=this._parseConnect.apply(this,arguments),n=i(t,3),r=n[0],a=n[1],o=n[2];this.connectCallback=a,this.debug("Opening Web Socket..."),this.ws.onmessage=function(t){var n=t.data;if(t.data instanceof ArrayBuffer&&(n=(0,u.typedArrayToUnicodeString)(new Uint8Array(t.data))),e.serverActivity=Date.now(),n===u.BYTES.LF)return void e.debug("<<< PONG");e.debug("<<< "+n);var r=s.default.unmarshall(e.partialData+n);e.partialData=r.partial,r.frames.forEach(function(t){switch(t.command){case"CONNECTED":e.debug("connected to server "+t.headers.server),e.connected=!0,e.version=t.headers.version,e._setupHeartbeat(t.headers),a&&a(t);break;case"MESSAGE":var n=t.headers.subscription,r=e.subscriptions[n]||e.onreceive;if(r){var i=e.version===u.VERSIONS.V1_2&&t.headers.ack||t.headers["message-id"];t.ack=e.ack.bind(e,i,n),t.nack=e.nack.bind(e,i,n),r(t)}else e.debug("Unhandled received MESSAGE: "+t);break;case"RECEIPT":e.onreceipt&&e.onreceipt(t);break;case"ERROR":o&&o(t);break;default:e.debug("Unhandled frame: "+t)}})},this.ws.onclose=function(t){e.debug("Whoops! Lost connection to "+e.ws.url+":",{event:t}),e._cleanUp(),o&&o(t)},this.ws.onopen=function(){e.debug("Web Socket Opened..."),r["accept-version"]=u.VERSIONS.supportedVersions(),r["heart-beat"]||(r["heart-beat"]=[e.heartbeat.outgoing,e.heartbeat.incoming].join(",")),e._transmit("CONNECT",r)}}},{key:"disconnect",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this._transmit("DISCONNECT",t),this.ws.onclose=null,this.ws.close(),this._cleanUp(),e&&e()}},{key:"send",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=Object.assign({},n);r.destination=e,this._transmit("SEND",r,t)}},{key:"begin",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"tx-"+(0,u.createId)();return this._transmit("BEGIN",{transaction:e}),{id:e,commit:this.commit.bind(this,e),abort:this.abort.bind(this,e)}}},{key:"commit",value:function(e){this._transmit("COMMIT",{transaction:e})}},{key:"abort",value:function(e){this._transmit("ABORT",{transaction:e})}},{key:"ack",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=Object.assign({},n);r[this.version===u.VERSIONS.V1_2?"id":"message-id"]=e,r.subscription=t,this._transmit("ACK",r)}},{key:"nack",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=Object.assign({},n);r[this.version===u.VERSIONS.V1_2?"id":"message-id"]=e,r.subscription=t,this._transmit("NACK",r)}},{key:"subscribe",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=Object.assign({},n);return r.id||(r.id="sub-"+(0,u.createId)()),r.destination=e,this.subscriptions[r.id]=t,this._transmit("SUBSCRIBE",r),{id:r.id,unsubscribe:this.unsubscribe.bind(this,r.id)}}},{key:"unsubscribe",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=Object.assign({},t);delete this.subscriptions[e],n.id=e,this._transmit("UNSUBSCRIBE",n)}},{key:"_cleanUp",value:function(){this.connected=!1,clearInterval(this.pinger),clearInterval(this.ponger)}},{key:"_transmit",value:function(e,t,n){var r=s.default.marshall(e,t,n);this.debug(">>> "+r,{frame:{command:e,headers:t,body:n}}),this._wsSend(r)}},{key:"_wsSend",value:function(e){for(this.isBinary&&(e=(0,u.unicodeStringToTypedArray)(e)),this.debug(">>> length "+e.length);;){if(!(e.length>this.maxWebSocketFrameSize))return this.ws.send(e);this.ws.send(e.slice(0,this.maxWebSocketFrameSize)),e=e.slice(this.maxWebSocketFrameSize),this.debug("remaining = "+e.length)}}},{key:"_setupHeartbeat",value:function(e){var t=this;if(this.version===u.VERSIONS.V1_1||this.version===u.VERSIONS.V1_2){var n=(e["heart-beat"]||"0,0").split(",").map(function(e){return parseInt(e,10)}),r=i(n,2),a=r[0],o=r[1];if(0!==this.heartbeat.outgoing&&0!==o){var s=Math.max(this.heartbeat.outgoing,o);this.debug("send PING every "+s+"ms"),this.pinger=setInterval(function(){t._wsSend(u.BYTES.LF),t.debug(">>> PING")},s)}if(0!==this.heartbeat.incoming&&0!==a){var c=Math.max(this.heartbeat.incoming,a);this.debug("check PONG every "+c+"ms"),this.ponger=setInterval(function(){var e=Date.now()-t.serverActivity;e>2*c&&(t.debug("did not receive server activity for the last "+e+"ms"),t.ws.close())},c)}}}},{key:"_parseConnect",value:function(){for(var e={},t=void 0,n=void 0,r=arguments.length,i=Array(r),a=0;a<r;a++)i[a]=arguments[a];switch(i.length){case 2:e=i[0],t=i[1];break;case 3:i[1]instanceof Function?(e=i[0],t=i[1],n=i[2]):(e.login=i[0],e.passcode=i[1],t=i[2]);break;case 4:e.login=i[0],e.passcode=i[1],t=i[2],n=i[3];break;default:e.login=i[0],e.passcode=i[1],t=i[2],n=i[3],e.host=i[4]}return[e,t,n]}}]),e}();t.default=c,e.exports=t.default},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(0),o=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";r(this,e),this.command=t,this.headers=n,this.body=i}return i(e,[{key:"toString",value:function(){var e=this,t=[this.command],n=!1===this.headers["content-length"];return n&&delete this.headers["content-length"],Object.keys(this.headers).forEach(function(n){var r=e.headers[n];t.push(n+":"+r)}),this.body&&!n&&t.push("content-length:"+(0,a.sizeOfUTF8)(this.body)),t.push(a.BYTES.LF+this.body),t.join(a.BYTES.LF)}}],[{key:"unmarshallSingle",value:function(t){var n=t.search(new RegExp(a.BYTES.LF+a.BYTES.LF)),r=t.substring(0,n).split(a.BYTES.LF),i=r.shift(),o={},s="",u=n+2,c=!0,l=!1,h=void 0;try{for(var d,f=r.reverse()[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){var v=d.value,p=v.indexOf(":");o[(0,a.trim)(v.substring(0,p))]=(0,a.trim)(v.substring(p+1))}}catch(e){l=!0,h=e}finally{try{!c&&f.return&&f.return()}finally{if(l)throw h}}if(o["content-length"]){s=(""+t).substring(u,u+parseInt(o["content-length"],10))}else for(var b=null,g=u;g<t.length&&(b=t.charAt(g))!==a.BYTES.NULL;g++)s+=b;return new e(i,o,s)}},{key:"unmarshall",value:function(t){var n=t.split(new RegExp(a.BYTES.NULL+a.BYTES.LF+"*")),r=n.slice(0,-1),i=n.slice(-1)[0],o={frames:r.map(function(t){return e.unmarshallSingle(t)}),partial:""};return i===a.BYTES.LF||-1!==i.search(RegExp(a.BYTES.NULL+a.BYTES.LF+"*$"))?o.frames.push(e.unmarshallSingle(i)):o.partial=i,o}},{key:"marshall",value:function(t,n,r){return new e(t,n,r).toString()+a.BYTES.NULL}}]),e}();t.default=o,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(0),o={VERSIONS:a.VERSIONS,client:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=new WebSocket(e,t.protocols||a.VERSIONS.supportedProtocols());return new i.default(n,t)},over:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return new(Function.prototype.bind.apply(i.default,[null].concat(t)))}};t.default=o,e.exports=t.default}])});