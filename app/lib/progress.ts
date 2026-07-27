export type CompletionMap = Record<string, boolean>;

export function calculateProgress(taskIds: string[], completion: CompletionMap) {
  const completed = taskIds.filter((id) => completion[id]).length;
  return {
    completed,
    total: taskIds.length,
    percentage: taskIds.length ? Math.round((completed / taskIds.length) * 100) : 0,
  };
}
