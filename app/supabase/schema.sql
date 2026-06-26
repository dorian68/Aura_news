-- AlphaLens Daily — articles store (the "stock").
-- IMPORTANT: this Supabase project hosts TWO products, so every AlphaLens table
-- is namespaced with the `alphalens_` prefix.
-- Run once in the Supabase SQL editor (project jqrlegdulnnrpiixiecf).

create table if not exists alphalens_articles (
  id            text primary key,           -- stable id (source url/id/title)
  dedup_key     text unique not null,        -- normalized title → dedup over time
  title         text not null,
  summary       text,
  source        text,
  section       text,                         -- Equities / Macro / World / Tech / Crypto / Deals / Markets
  category      text,
  published_at  timestamptz,
  tickers       text[],
  created_at    timestamptz not null default now()
);

create index if not exists alphalens_articles_published_idx on alphalens_articles (published_at desc);
create index if not exists alphalens_articles_section_idx   on alphalens_articles (section, published_at desc);

-- Ingester uses the service_role key (bypasses RLS); block anon access.
alter table alphalens_articles enable row level security;
