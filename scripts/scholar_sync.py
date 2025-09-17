#!/usr/bin/env python3
import os
import re
import sys
import json
import time
import hashlib
from pathlib import Path

import yaml
import requests

# Optional fallback
try:
	from scholarly import scholarly
	HAS_SCHOLARLY = True
except Exception:
	HAS_SCHOLARLY = False

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "_data" / "scholar.yml"
OUTPUT_DIR = ROOT / "_publications" / "auto"

SERPAPI_KEY = os.environ.get("SERPAPI_API_KEY")
SERPAPI_ENDPOINT = "https://serpapi.com/search.json"

SAFE_CHARS = re.compile(r"[^a-z0-9\-]+")

def slugify(title: str) -> str:
	t = title.lower().strip()
	t = re.sub(r"[\s_]+", "-", t)
	t = SAFE_CHARS.sub("", t)
	return t[:80].strip("-") or hashlib.sha1(title.encode()).hexdigest()[:10]


def to_title_case(title: str) -> str:
	"""Apply English-style Title Case while preserving acronyms and hyphenated words."""
	if not title:
		return title
	small_words = {"a","an","the","and","or","for","nor","but","on","at","to","from","by","of","in","with","as","via"}
	parts = re.split(r"(\s+)", title.strip())
	result = []
	word_index = 0
	for part in parts:
		if part.isspace():
			result.append(part)
			continue
		def cap_token(token: str) -> str:
			if not token:
				return token
			if token.isupper():
				return token
			lower = token.lower()
			return lower[:1].upper() + lower[1:]
		tokens = part.split("-")
		cased_tokens = []
		for t in tokens:
			lw = t.lower()
			if word_index == 0 or lw not in small_words:
				cased_tokens.append(cap_token(t))
			else:
				cased_tokens.append(lw)
		word_index += 1
		result.append("-".join(cased_tokens))
	return "".join(result)


def read_config():
	if not DATA_FILE.exists():
		raise SystemExit(f"Config not found: {DATA_FILE}")
	return yaml.safe_load(DATA_FILE.read_text(encoding="utf-8"))


def ensure_output():
	OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
	for p in OUTPUT_DIR.glob("*.md"):
		p.unlink()


def fetch_serpapi(author_id: str, hl: str = "en", max_results: int = 100):
	if not SERPAPI_KEY:
		return []
	params = {
		"engine": "google_scholar_author",
		"author_id": author_id,
		"api_key": SERPAPI_KEY,
		"hl": hl,
		"view_op": "list_works",
		"num": 100,
	}
	all_items = []
	next_params = None
	while True:
		resp = requests.get(SERPAPI_ENDPOINT, params=next_params or params, timeout=30)
		resp.raise_for_status()
		data = resp.json()
		works = (data.get("articles") or [])
		for w in works:
			itm = {
				"title": (w.get("title") or "").strip(),
				"authors": [a.strip() for a in (w.get("authors", "").split(",") if isinstance(w.get("authors"), str) else (w.get("authors") or [])) if a.strip()],
				"year": str(w.get("year") or "").strip(),
				"venue": (w.get("publication") or "").strip(),
				"type": "conference",
				"pdf": (w.get("resources") or [{}])[0].get("link"),
				"link": w.get("link"),
			}
			all_items.append(itm)
			if len(all_items) >= max_results:
				break
		if len(all_items) >= max_results:
			break
		next_link = (data.get("serpapi_pagination") or {}).get("next")
		if not next_link:
			break
		next_params = dict([part.split("=") for part in next_link.split("?")[-1].split("&")])
		next_params.setdefault("api_key", SERPAPI_KEY)
		time.sleep(0.8)
	return all_items


def fetch_scholarly(author_id: str, max_results: int = 100):
	if not HAS_SCHOLARLY:
		return []
	try:
		author = scholarly.search_author_id(author_id)
		author = scholarly.fill(author, sections=['publications'])
		items = []
		for pub in author.get('publications', [])[:max_results]:
			try:
				filled = scholarly.fill(pub)
			except Exception:
				filled = pub
			title = (filled.get('bib', {}).get('title') or filled.get('title') or '').strip()
			authors = (filled.get('bib', {}).get('author', '')).split(' and ')
			year = str(filled.get('bib', {}).get('pub_year') or '').strip()
			venue = (filled.get('bib', {}).get('venue') or filled.get('bib', {}).get('journal') or '').strip()
			link = filled.get('eprint_url') or filled.get('pub_url')
			items.append({
				"title": title,
				"authors": [a.strip() for a in authors if a.strip()],
				"year": year,
				"venue": venue,
				"type": "conference",
				"pdf": filled.get('eprint_url'),
				"link": link,
			})
		return items
	except Exception:
		return []


def decide_type(venue: str) -> str:
	v = (venue or '').lower()
	if any(k in v for k in ["transactions", "journal", "j. ", "ieee access", "nature", "science"]):
		return "journal"
	if any(k in v for k in ["arxiv", "preprint"]):
		return "preprint"
	return "conference"


def yaml_escape(s: str) -> str:
	return s.replace('"', '\\"')


def write_publication(pub: dict):
	raw_title = pub.get('title') or 'Untitled'
	title = to_title_case(raw_title)
	year = pub.get('year') or '0000'
	venue = pub.get('venue') or ''
	ptype = decide_type(venue)
	authors = pub.get('authors') or []
	pdf = pub.get('pdf') or ''
	code = pub.get('code') or ''
	link = pub.get('link') or ''
	arxiv = ''
	doi = ''
	slug = f"{year}-{slugify(title)}"
	path = OUTPUT_DIR / f"{slug}.md"
	lines = [
		"---",
		f"title: \"{yaml_escape(title)}\"",
		"authors:",
	]
	for a in authors:
		lines.append(f"- {a}")
	if venue:
		lines.append(f"venue: \"{yaml_escape(venue)}\"")
	lines.append(f"year: {year}")
	lines.append(f"type: {ptype}")
	if pdf:
		lines.append(f"pdf: {pdf}")
	if code:
		lines.append(f"code: {code}")
	if link:
		lines.append(f"link: \"{yaml_escape(link)}\"")
	if arxiv:
		lines.append(f"arxiv: {arxiv}")
	if doi:
		lines.append(f"doi: {doi}")
	lines.append("source: scholar")
	lines.append("---")
	content = "\n".join(lines) + "\n"
	path.write_text(content, encoding="utf-8")
	return path


def main():
	cfg = read_config() or {}
	profiles = cfg.get('profiles') or []
	max_per_author = int((cfg.get('options') or {}).get('max_per_author') or 100)
	ensure_output()
	count = 0
	for p in profiles:
		pid = p.get('id')
		hl = p.get('lang', 'en')
		items = []
		if SERPAPI_KEY:
			try:
				items = fetch_serpapi(pid, hl=hl, max_results=max_per_author)
			except Exception as e:
				print(f"SerpAPI failed for {pid}: {e}")
		if not items:
			fallback = fetch_scholarly(pid, max_results=max_per_author)
			items = fallback
		for pub in items:
			write_publication(pub)
			count += 1
	print(f"Wrote {count} publications to {OUTPUT_DIR}")

if __name__ == "__main__":
	main() 