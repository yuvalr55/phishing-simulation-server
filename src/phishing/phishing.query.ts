export const UpdateAttackStatusQueries = (attackId: string) => ({
  /** Generates a MongoDB query and update object to set attack status as clicked. */
  query: { _id: attackId },
  update: { $set: { status: 'clicked' } },
});
