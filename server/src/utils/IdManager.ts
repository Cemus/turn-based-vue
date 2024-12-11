let currentId = 1

const getNewId = (): number => {
  return currentId++
}

const resetIds = (): void => {
  currentId = 1
}

export { getNewId, resetIds }
