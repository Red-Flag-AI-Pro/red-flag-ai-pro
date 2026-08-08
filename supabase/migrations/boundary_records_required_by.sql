-- Brad Wolfe, LinkedIn, 8 Aug 2026: a boundary written by the party proposing
-- the work reads as hedging, because including it was their own choice. A
-- boundary written by the party who bears the loss reads as terms, nobody
-- negotiates the tone of terms. His test: ask who else could have written
-- this boundary, a lender, an insurer, a board, anyone with something to
-- lose. If the answer is nobody, it was volunteered, not required.
--
-- Every boundary record today is self authored by definition, the account
-- holder creates their own record. This does not make that external party an
-- actual co-signer (that is a bigger, separate build), it makes the
-- distinction a real, sealed fact instead of an unspoken assumption: who, if
-- anyone, actually required this boundary to exist. Null means self imposed,
-- named means volunteered no longer applies.
alter table boundary_authorization_records
  add column if not exists required_by_name text,
  add column if not exists required_by_organisation text;
