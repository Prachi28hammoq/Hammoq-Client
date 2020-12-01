const doesInclueds = (obj, string) => {
  let values;
  if (obj) values = Object.values(obj);
  else return false;
  string = string.toLowerCase();
  console.log(values);
  for (const value of values) {
    if (typeof value === "object" && doesInclueds(value, string)) return true;
    if (value) {
      const bool = value.toString().toLowerCase().includes(string);

      if (value && bool) return true;
    }
  }
  return false;
};

const Search = (arr, string) => {
  const newArr = arr.filter((a) => doesInclueds(a, string));
  return newArr;
};
export default Search;
