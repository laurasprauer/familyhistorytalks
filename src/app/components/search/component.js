"use client";

import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";
import CustomLink from "@components/customLink/component.js";

import * as styles from "./styles.module.scss";

// Searches public/search-index.json (written at build time by
// src/app/utils/generateSearchIndex.cjs) entirely in the browser — no server.
// Filters and the query are mirrored to the URL (?q=&type=&from=&to=) so searches
// can be shared and survive a reload.
const SEARCH_OPTIONS = {
  boost: { title: 3, description: 2 },
  prefix: true,
  fuzzy: 0.2,
  combineWith: "AND",
};

const TYPE_LABELS = { asset: "Document", person: "Biography" };

const readUrlState = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") || "",
    type: params.get("type") || "all",
    fromYear: params.get("from") || "",
    toYear: params.get("to") || "",
  };
};

const writeUrlState = ({ query, type, fromYear, toYear }) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type !== "all") params.set("type", type);
  if (fromYear) params.set("from", fromYear);
  if (toYear) params.set("to", toYear);
  const search = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
};

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A short excerpt of `text` around the first matched term, with matches in <mark>.
const Snippet = ({ text, terms }) => {
  if (!text || !terms?.length) return null;
  const lower = text.toLowerCase();
  const positions = terms.map((t) => lower.indexOf(t.toLowerCase())).filter((i) => i >= 0);
  if (!positions.length) return null;
  const at = Math.min(...positions);
  const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, at - 90)) + 1);
  const end = Math.min(text.length, at + 160);
  const excerpt = `${start > 0 ? "… " : ""}${text.slice(start, end).replace(/\s+/g, " ").trim()}${end < text.length ? " …" : ""}`;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return (
    <p className={styles.snippet}>
      {excerpt.split(pattern).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}
    </p>
  );
};

const yearsLabel = (doc) => {
  if (doc.dates) return doc.dates;
  if (!doc.startYear) return null;
  return doc.endYear && doc.endYear !== doc.startYear ? `${doc.startYear} – ${doc.endYear}` : String(doc.startYear);
};

export const Search = () => {
  const [documents, setDocuments] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [filters, setFilters] = useState({ query: "", type: "all", fromYear: "", toYear: "" });

  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((docs) => {
        if (cancelled) return;
        setDocuments(docs);
        setFilters(readUrlState());
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const miniSearch = useMemo(() => {
    if (!documents) return null;
    const index = new MiniSearch({
      fields: ["title", "description", "text"],
      storeFields: ["type", "title", "description", "text", "startYear", "endYear", "dates", "url"],
      searchOptions: SEARCH_OPTIONS,
    });
    index.addAll(documents);
    return index;
  }, [documents]);

  const { query, type, fromYear, toYear } = filters;
  const hasYearFilter = Boolean(fromYear || toYear);

  const results = useMemo(() => {
    if (!miniSearch || !documents) return null;
    const q = query.trim();
    if (!q && !hasYearFilter) return null;

    // No query but a year range: browse everything in that range, oldest first.
    const found = q
      ? miniSearch.search(q)
      : documents
          .map((doc) => ({ ...doc, terms: [] }))
          .sort((a, b) => (a.startYear || 0) - (b.startYear || 0));

    const from = Number(fromYear) || -Infinity;
    const to = Number(toYear) || Infinity;
    return found.filter((doc) => {
      if (type !== "all" && doc.type !== type) return false;
      if (!hasYearFilter) return true;
      if (!doc.startYear) return false;
      // Overlaps the range
      return doc.startYear <= to && (doc.endYear || doc.startYear) >= from;
    });
  }, [miniSearch, documents, query, type, fromYear, toYear, hasYearFilter]);

  const update = (changes) => {
    const next = { ...filters, ...changes };
    setFilters(next);
    writeUrlState(next);
  };

  return (
    <div className={styles.search}>
      <h1>Search</h1>
      <p className={styles.intro}>
        Search biographies and the transcripts of every document in the archive — census records, certificates,
        family bibles and more.
      </p>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          e.currentTarget.querySelector("input[type=search]")?.blur();
        }}
      >
        <div className={styles.queryRow}>
          <label htmlFor="search-query" className="sr-only">
            Search
          </label>
          <input
            id="search-query"
            type="search"
            value={query}
            placeholder="Name, place, year…"
            autoComplete="off"
            onChange={(e) => update({ query: e.target.value })}
          />
          <input type="submit" value="Search" />
        </div>
        <div className={styles.filters}>
          <label>
            Show
            <select value={type} onChange={(e) => update({ type: e.target.value })}>
              <option value="all">Everything</option>
              <option value="asset">Documents</option>
              <option value="person">Biographies</option>
            </select>
          </label>
          <label>
            From year
            <input
              type="number"
              inputMode="numeric"
              min="1000"
              max="2100"
              value={fromYear}
              placeholder="1800"
              onChange={(e) => update({ fromYear: e.target.value })}
            />
          </label>
          <label>
            To year
            <input
              type="number"
              inputMode="numeric"
              min="1000"
              max="2100"
              value={toYear}
              placeholder="1900"
              onChange={(e) => update({ toYear: e.target.value })}
            />
          </label>
        </div>
      </form>

      {loadError ? (
        <p className={styles.error}>Search couldn&apos;t load. Please refresh the page.</p>
      ) : null}

      <div aria-live="polite">
        {results ? (
          <p className={styles.count}>
            {results.length === 0
              ? "No results. Try fewer words or a wider year range."
              : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
        ) : null}
      </div>

      {results?.length ? (
        <ul className={styles.results}>
          {results.map((doc) => {
            const years = yearsLabel(doc);
            const isAsset = doc.type === "asset";
            return (
              <li key={doc.id}>
                <CustomLink to={doc.url} target={isAsset ? "_blank" : undefined} className={styles.resultItem}>
                  <span className={styles.meta}>
                    {TYPE_LABELS[doc.type]}
                    {years ? ` · ${years}` : ""}
                    {isAsset ? " · PDF" : ""}
                  </span>
                  <h3>{doc.title}</h3>
                  {doc.description ? <p>{doc.description}</p> : null}
                  <Snippet text={doc.text} terms={doc.terms} />
                  {isAsset && <span className="sr-only"> (opens in a new tab)</span>}
                </CustomLink>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default Search;
