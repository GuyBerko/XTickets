export const replacer = (template: string, obj: object) => {
  var keys = Object.keys(obj);
  var func = Function(...keys, 'return `' + template + '`;');

  //@ts-ignore
  return func(...keys.map((k) => obj[k]));
};
