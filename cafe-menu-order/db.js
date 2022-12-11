window.MenuDB = {
  _menu: [
    {
      id: 1,
      name: '카페라떼',
      price: 4000,
      categoryId: 1
    },
    {
      id: 2,
      name: '아메리카노',
      price: 6000,
      categoryId: 1
    },
    {
      id: 3,
      name: '바닐라라떼',
      price: 4500,
      categoryId: 1
    },
    {
      id: 4,
      name: '카페모카',
      price: 4500,
      categoryId: 1
    },
    {
      id: 5,
      name: '아이스티',
      price: 3000,
      categoryId: 2
    },
    {
      id: 6,
      name: '자몽에이드',
      price: 3000,
      categoryId: 2
    },
    {
      id: 7,
      name: '레몬에이드',
      price: 3000,
      categoryId: 2
    },
    {
      id: 8,
      name: '얼그레이티',
      price: 3500,
      categoryId: 2
    },
    {
      id: 9,
      name: '페퍼민트티',
      price: 3500,
      categoryId: 2
    },
    {
      id: 10,
      name: '마카롱',
      price: 3500,
      categoryId: 3
    },
    {
      id: 11,
      name: '치즈케이크',
      price: 5000,
      categoryId: 3
    },
  ],
  select: function () {
    return this._menu;
  },
  selectById: function(id) {
    return this._menu.find(menu => menu.id === Number(id));
  },
  add: function(_menu) {
    const menu = {
      ..._menu,
      id: new Date().getTime(),
    }
    this._menu.push(menu);
    return menu;
  },
  update: function(_menu) {
    const index = this._menu.findIndex(_m => _m.id === _menu.id);
    this._menu[index] = _menu;
  },
  delete: function(id) {
    this._menu = this._menu.filter(_m => _m.id !== id);
  }
};

window.CategoryDB = {
  _category: [
    {
      id: 1,
      name: '에스프레소'
    },
    {
      id: 2,
      name: '티/에이드'
    },
    {
      id: 3,
      name: '디저트'
    }
  ],
  select: function() {
    return this._category;
  },
  selectById: function(id) {
    return this._category.find(category => category.id === id);
  },
  add: function(category) {
    const id = new Date().getTime();
    const newCategory = {
      ...category,
      id
    };
    this._category.push(newCategory);
    return newCategory;
  },
}
