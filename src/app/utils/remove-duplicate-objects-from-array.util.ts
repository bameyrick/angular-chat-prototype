export function removeDuplicateObjectsFromArray<T>(array: T[], idKey = 'id'): T[] {
  return array.reduce((result, current) => {
    if (!result.find(item => item[idKey] === current[idKey])) {
      result.push(current);
    }

    return result;
  }, []);
}
