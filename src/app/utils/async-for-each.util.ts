export async function asyncForEach(array: any[], callback: Function): Promise<void> {
  const length = array.length;

  for(let index = 0; index < length; index++) {
    await callback(array[index], index, array);
  }
}
