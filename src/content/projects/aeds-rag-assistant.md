---
title: "AEDS RAG Assistant"
summary: "A retrieval-augmented chat assistant that answers students' questions about a master's programme strictly from its official documents, with citations, a relevance gate, and staff review."
year: 2026
kind: app
stack: ["Python", "FastAPI", "LangGraph", "Chroma", "BM25", "React", "SQLite"]
repo: "https://github.com/ofurkancoban/AEDS_RAG_Assistant"
live: "https://aeds-rag-assistant.ofurkan.co"
featured: true
order: 3
figure: network
---

Students ask the same questions every semester: deadlines, exam rules, which module counts where. The answers exist, scattered across PDFs. This assistant answers from **those documents only**, never from a model's general knowledge, and refuses when the documents do not cover the question.

## How it works

- **Two answer paths.** An LLM router sends exact-fact questions (deadlines, courses, contacts) to structured SQL lookups, and everything else to hybrid search.
- **Hybrid retrieval.** Vector search in Chroma plus BM25 keyword search, fused and reranked with a cross-encoder.
- **Relevance gate.** The reranker's confidence decides whether the retrieved material actually answers the question. Below threshold, it says so instead of generating from weak matches.
- **Admin-reviewed corpus.** Anyone can suggest a correction from the chat; nothing reaches the live corpus until staff approve it. A local classifier auto-flags messages that assert a new fact.
- **German and English**, a semantic answer cache, and a Telegram bot for reviewing queues from a phone.

The answer pipeline is an explicit LangGraph state graph on a FastAPI backend, with SQLite for everything that must be exact.
