export const groupCandidates = (obj, key) => {
  return obj.reduce((acc, candidate) => {
    (acc[candidate[key]] = acc[candidate[key]] || []).push(candidate);
    return acc;
  }, {});
};

export const insertCandidatesToPositions = (positions, grouped) => {
  return positions.map((pos) => ({
    ...pos,
    candidates: grouped[pos.position],
  }));
};