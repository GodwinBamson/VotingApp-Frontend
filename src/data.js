// src/data.js
export const elections = [
  {
    id: 1,
    title: "Presidential Election",
    thumbnail: "https://via.placeholder.com/300x200?text=Presidential",
    description: "Election for the next president",
  },
  {
    id: 2,
    title: "Governor Election",
    thumbnail: "https://via.placeholder.com/300x200?text=Governor",
    description: "Election for the state governor",
  },
];

export const candidates = [
  {
    id: "c1",
    election: 1,
    fullName: "John Doe",
    image: "https://via.placeholder.com/150?text=John+Doe",
    motto: "For a better future",
    voteCount: 250,
  },
  {
    id: "c2",
    election: 1,
    fullName: "Jane Smith",
    image: "https://via.placeholder.com/150?text=Jane+Smith",
    motto: "Progress and unity",
    voteCount: 180,
  },
  {
    id: "c3",
    election: 2,
    fullName: "Michael Johnson",
    image: "https://via.placeholder.com/150?text=Michael+Johnson",
    motto: "Transparency first",
    voteCount: 320,
  },
  {
    id: "c4",
    election: 2,
    fullName: "Sarah Williams",
    image: "https://via.placeholder.com/150?text=Sarah+Williams",
    motto: "Power to the people",
    voteCount: 210,
  },
];

// 👇 voters dataset
export const voters = [
  {
    id: "v1",
    fullName: "Alice Brown",
    hasVoted: false,
    votedFor: null, // will be "c1", "c2", etc. after voting
  },
  {
    id: "v2",
    fullName: "David Green",
    hasVoted: false,
    votedFor: null,
  },
  {
    id: "v3",
    fullName: "Emma Johnson",
    hasVoted: true,
    votedFor: "c1", // already voted for John Doe
  },
  {
    id: "v4",
    fullName: "Chris Lee",
    hasVoted: true,
    votedFor: "c3", // already voted for Michael Johnson
  },
];

/**
 * Cast a vote for a candidate by voterId and candidateId.
 */
export function castVote(voterId, candidateId) {
  const voter = voters.find((v) => v.id === voterId);
  const candidate = candidates.find((c) => c.id === candidateId);

  if (voter && !voter.hasVoted && candidate) {
    voter.hasVoted = true;
    voter.votedFor = candidateId;
    candidate.voteCount += 1;
    return { voter, candidate };
  }

  return null; // invalid voter or already voted
}
