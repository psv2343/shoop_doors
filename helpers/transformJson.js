export function transformJson(json) {
  let idCounter = 1;
  const parentCategories = [];
  const categories = [];
  const collections = [];

  // Функция для присвоения уникальных id категориям и коллекциям
  function assignIds(categories, parentId) {
      for (const category of categories) {
          category.id = idCounter++;
          category.parentId = parentId;
          if (category.subCategory && category.subCategory.length > 0) {
              assignIds(category.subCategory, category.id);
          }
          if (category.collections && category.collections.length > 0) {
              assignIds(category.collections, category.id);
          }
      }
  }

  // Присваиваем id и parentId
  for (const parentCategory of json.catalog) {
      parentCategory.id = idCounter++;
      parentCategory.parentId = null;
      parentCategories.push({ name: parentCategory.parentCategory, id: parentCategory.id });

      if (parentCategory.subCategory && parentCategory.subCategory.length > 0) {
          assignIds(parentCategory.subCategory, parentCategory.id);
      }
      if (parentCategory.collections && parentCategory.collections.length > 0) {
          assignIds(parentCategory.collections, parentCategory.id);
      }
  }

  // Формируем новую структуру JSON
  for (const parentCategory of json.catalog) {
      if (parentCategory.subCategory && parentCategory.subCategory.length > 0) {
          for (const category of parentCategory.subCategory) {
              categories.push({ name: category.name, parentId: category.parentId });
          }
      }
      if (parentCategory.collections && parentCategory.collections.length > 0) {
          for (const collection of parentCategory.collections) {
              collections.push({ name: collection.name, parentId: collection.parentId });
          }
      }
  }

  return {
    catalog: {
      ParentCategories: parentCategories,
      categories: categories,
      collections: collections
    },
    info: json.info
  }
}
