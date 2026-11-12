import { readFile, writeFile } from "node:fs/promises";
const d = JSON.parse(await readFile("landing.data.json", "utf8"));
const base = d.project.siteUrl.replace(/\/$/, "");
const ready = Boolean(d.approval.readyToPublish && d.professional.oab);
const robots = ready ? "index, follow, max-image-preview:large" : "noindex, follow, max-image-preview:large";
const esc = str => str.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const graph = {
 "@context":"https://schema.org", "@graph":[
 {"@type":"WebSite","@id":base+"/#website","url":base+"/","name":d.project.displayName,"inLanguage":"pt-BR"},
 {"@type":"LegalService","@id":base+"/#escritorio","name":d.project.displayName,"url":base+"/","telephone":"+"+d.contact.whatsapp,"image":base+"/assets/social.jpg","areaServed":{"@type":"City","name":"Belém"},"sameAs":[d.contact.instagram],"founder":{"@id":base+"/#igor-marques"}},
 {"@type":"Person","@id":base+"/#igor-marques","name":d.professional.name,"jobTitle":"Advogado tributarista","knowsAbout":["Direito Tributário","IPTU"],"worksFor":{"@id":base+"/#escritorio"},...(d.professional.oab ? {"hasCredential":{"@type":"EducationalOccupationalCredential","name":d.professional.oab}} : {})},
 {"@type":"FAQPage","@id":base+"/#faq","mainEntity":d.faqs.map(f=>({"@type":"Question","name":f.question,"acceptedAnswer":{"@type":"Answer","text":f.answer}}))}
 ]};
const html = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.seo.title)}</title>
<meta name="description" content="${esc(d.seo.description)}"/>
<meta name="author" content="${esc(d.professional.name)}"/>
<meta name="theme-color" content="${d.theme.secondary}"/>
<meta name="robots" content="${robots}"/><meta name="googlebot" content="${robots}"/>
<link rel="canonical" href="${base}/"/>
<link rel="icon" type="image/svg+xml" href="./assets/favicon.svg"/>
<link rel="manifest" href="./site.webmanifest"/>
<meta property="og:type" content="website"/><meta property="og:locale" content="pt_BR"/>
<meta property="og:site_name" content="${esc(d.project.displayName)}"/>
<meta property="og:title" content="${esc(d.seo.title)}"/><meta property="og:description" content="${esc(d.seo.description)}"/>
<meta property="og:url" content="${base}/"/><meta property="og:image" content="${base}/assets/social.jpg"/>
<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
<meta property="og:image:type" content="image/jpeg"/><meta property="og:image:alt" content="Mãos protegendo uma miniatura de casa"/>
<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(d.seo.title)}"/>
<meta name="twitter:description" content="${esc(d.seo.description)}"/><meta name="twitter:image" content="${base}/assets/social.jpg"/>
<meta name="twitter:image:alt" content="Mãos protegendo uma miniatura de casa"/>
<script type="application/ld+json">${JSON.stringify(graph).replaceAll("<", "\u003c")}</script>
</head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`;
await writeFile("index.html", html);
await writeFile("public/robots.txt", ready ? `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n` : `# Prévia: noindex no HTML até informar a OAB e aprovar a publicação.\nUser-agent: *\nAllow: /\n`);
await writeFile("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${ready ? `<url><loc>${base}/</loc></url>` : ""}</urlset>\n`);
await writeFile("public/site.webmanifest",JSON.stringify({name:d.project.displayName,short_name:"Macedo Marques",lang:"pt-BR",start_url:"./",display:"browser",background_color:d.theme.secondary,theme_color:d.theme.secondary,icons:[{src:"./assets/favicon.svg",sizes:"any",type:"image/svg+xml"}]}));
console.log(ready ? "SEO preparado para publicação." : "Prévia com noindex: OAB e aprovação pendentes.");
