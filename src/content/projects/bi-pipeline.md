---
title: "End-to-End BI Pipeline"
summary: "A containerised business-intelligence stack for credit-card fraud analysis: Python ETL into a PostgreSQL star schema, and an auto-generated Metabase dashboard with 30+ KPIs."
year: 2026
kind: tool
stack: ["Python", "PostgreSQL", "Metabase", "Docker Compose", "Star schema"]
repo: "https://github.com/ofurkancoban/End2EndBIPipeline"
order: 9
figure: series
---

One `docker compose up` brings up the whole stack:

1. **Data importer**: a Python ETL container that pulls the transactions dataset, transforms it into a star schema (fact plus dimensions) and loads it.
2. **PostgreSQL** as the warehouse.
3. **Metabase**, with a dashboard generated automatically: transaction volume, fraud analysis and customer risk, more than 30 KPIs.
