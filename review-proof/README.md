# Bastion review-agent proof fixture

Deliberately vulnerable code on isolated branches, seeded to prove the Phase 3.5
reviewing agent end to end. Never merged. Safe to delete these branches at any time.

`bastion/review-base` already fails `sast-sql-injection`. `bastion/review-pr` adds a
*second* one — the case rule-level diffing reports as `unchanged`.
