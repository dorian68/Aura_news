<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Debugging backend-first (OBLIGATOIRE)

Toute feature dépendant d'une API externe / OAuth / DB / webhook / paiement doit
être déboguée backend-first (CLI + logs structurés, jamais l'UI en premier).
Voir `../docs/backend_first_debugging_paradigm.md`. Ne jamais logger de secret en clair.
