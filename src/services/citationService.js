import { Cite } from "@citation-js/core";
import "@citation-js/plugin-csl";

export function generateCitation(
  { title, authors, journal, year, volume, issue, pages, doi },
  style = "APA"
) {
  if (!title || !Array.isArray(authors) || authors.length === 0 || !journal || !year) {
    return "";
  }

  const parsedYear = parseInt(year);
  if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > new Date().getFullYear() + 10) {
    return "";
  }

  const formattedAuthors = authors.map((author) => {
    const trimmed = author.trim();
    if (!trimmed) return { family: "Unknown", given: "" };
    
    const parts = trimmed.split(" ");
    if (parts.length === 1) {
      return { family: parts[0], given: "" };
    }
    
    const lastName = parts.pop();
    const firstName = parts.join(" ");
    return { family: lastName, given: firstName };
  });

  const cleanTitle = title.replace(/<[^>]*>/g, "");

  const citationData = {
    type: "article-journal",
    title: cleanTitle,
    author: formattedAuthors,
    "container-title": journal,
    DOI: doi,
    issued: { "date-parts": [[parsedYear]] },
  };

  if (volume && volume.trim()) citationData.volume = volume.trim();
  if (issue && issue.trim()) citationData.issue = issue.trim();
  if (pages && pages.trim()) citationData.page = pages.trim().replace(/-/g, "–");

  try {
    const cite = new Cite(citationData);
    return cite.format("bibliography", {
      format: "text",
      template: style.toUpperCase() === "MLA" ? "modern-language-association" : "apa-7",
      lang: "en-US",
    }).trim();
  } catch {
    return "";
  }
}

export const CITATION_STYLES = ["APA", "MLA"];

export const isValidCitationStyle = (style) =>
  CITATION_STYLES.includes(style.toUpperCase());

export const formatCitationStyle = (style) => style.toUpperCase();
