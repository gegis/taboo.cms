class ArrayHelper extends Array {
  sortByProperty(array, property, direction = 'asc') {
    return array.sort((obj1, obj2) => {
      if (obj1[property] === obj2[property]) {
        return 0;
      }
      if (direction === 'asc') {
        return obj1[property] < obj2[property] ? -1 : 1;
      } else {
        return obj1[property] > obj2[property] ? -1 : 1;
      }
    });
  }
}

export default new ArrayHelper();
