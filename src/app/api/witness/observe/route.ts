// Alias for /api/witness/anchor. The published Open Witness Standard names
// this endpoint "anchor", but some peers (AILeash/sebbi.pro's current build)
// call it "observe" instead. Same handler, reachable at both paths, so
// nobody hits a 404 or a spec-vs-implementation mismatch just for using a
// different name for the same job.
export { POST } from "../anchor/route";
