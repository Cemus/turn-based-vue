let currentId = 1;

export const getNewId = (): number => {
  return currentId++;
};

export const resetIds = (): void => {
  currentId = 1;
};
