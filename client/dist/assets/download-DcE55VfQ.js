function a(e,o,t){const c=URL.createObjectURL(new Blob([t],{type:o})),n=Object.assign(document.createElement("a"),{href:c,download:e});document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(c),1e3)}const d=e=>e.map(o=>o.map(t=>`"${String(t??"").replace(/"/g,'""')}"`).join(",")).join(`\r
`);export{a as d,d as t};
