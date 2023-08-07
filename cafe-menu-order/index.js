const HtmlManager = {
  getNewMenuHtml: (menu) => {
    return '' +
      '<div class="menu-form-container">' +
      '  <form class="menu-form">' +
      `    <input type="hidden" name="id" value="${menu?.id || ''}"/>` +
      `    <input type="file" name="image-input" class="onChangeImageFile" />` +
      `    <img name="image-preview" class="image-preview" src="${menu?.imageUrl}" />` +
      `    <input type="text" placeholder="name" name="name" value="${menu?.name || ''}"/>` +
      `    <input type="number" placeholder="price" name="price" value="${menu?.price}"/>` +
      `    <input type="text" placeholder="category" name="category" value="${menu?.category || ''}"/>` +
      '  </form>' +
      '  <button class="submit-menu-button primary">submit</button>' +
      '</div>'
  },
  getMenuHtml: (menu) => {
    return '' +
      `<li class="menu-item" data-id="${menu.id}">` +
      `  <img class="image" src="${menu.imageUrl}" />` +
      '  <div class="delete-button">-</div>' +
      '  <div class="menu-item-detail">' +
      `    <div class="category">${menu.category}</div>` +
      `    <div class="price">${menu.price}</div>` +
      `    <div class="name">${menu.name}</div>` +
      '  </div>' +
      '</li>'
  },
  updateMenuHtml: ($menu, menu) => {
    $menu.querySelector('.name').textContent = menu?.name || '';
    $menu.querySelector('.price').textContent = menu?.price || 0;
    $menu.querySelector('.category').textContent = menu?.category || '';
    $menu.querySelector('.image').src = menu?.imageUrl || '';
  }
}

const $addButton = document.querySelector('.add-button');
$addButton.addEventListener('click', () => {
  modal?.open({
    title: 'new menu',
    content: HtmlManager.getNewMenuHtml()
  });
  const $newMenuButton = document.querySelector('.submit-menu-button');
  $newMenuButton.addEventListener('click', () => {
    modal?.close();
  })
});

const $editButton = document.querySelector('.edit-button');
$editButton.addEventListener('click', () => {
  if (confirm('장바구니에 상품이 초기화되어요. 편집모드를 시작할까요?')) {
    document.querySelector('.page-container').classList.add('edit');
    document.querySelector('.cart-list').innerHTML = '';
    document.querySelector('.total-price').innerHTML = '0';
  }
});

const $closeEditButton = document.querySelector('.close-edit-button');
$closeEditButton.addEventListener('click', () => {
  document.querySelectorAll('.menu-list .menu-item.updated').forEach($menu => $menu.classList.remove('updated'));
  document.querySelector('.page-container').classList.remove('edit');
});

document.addEventListener('click', function addCart(event) {
  if (isEditMode()) return;
  const $menuItem = getParentElementByClass(event.target, 'menu-item');
  if ($menuItem === null) return;
  if (!$menuItem.parentElement.classList.contains('menu-list')) return;

  const menu = MenuDB.selectById($menuItem.dataset.id);
  const menuHtml = HtmlManager.getMenuHtml(menu);
  document.querySelector('.cart-list').insertAdjacentHTML('afterbegin', menuHtml);
  const $totalPrice = document.querySelector('.total-price');
  $totalPrice.textContent = Number($totalPrice.textContent) + Number(menu.price);
});

document.addEventListener('click', function onClickEditMenu(event) {
  if (!isEditMode()) return;
  const $target = event.target
  if ($target.classList.contains('delete-button')) return;
  const $menuItem = getParentElementByClass($target, 'menu-item');
  if ($menuItem === null) return;
  if (!$menuItem.parentElement.classList.contains('menu-list')) return;

  const menu = MenuDB.selectById($menuItem.dataset.id);
  modal?.open({
    title: 'edit menu',
    content: HtmlManager.getNewMenuHtml(menu)
  });
  const $newMenuButton = document.querySelector('.submit-menu-button');
  $newMenuButton.addEventListener('click', () => {
    modal?.close();
  });
});

document.addEventListener('change', function onChangeImageFile(event) {
  const $target = event.target;
  if (!$target.classList.contains('onChangeImageFile')) return;
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  event.target.parentElement.querySelector('.image-preview').src = imageUrl;
})

document.addEventListener('click', function deleteCartItem(event) {
  const $target = event.target;
  if (!$target.classList.contains('delete-button')) return;
  const $menuItem = getParentElementByClass(event.target, 'menu-item');
  if (!$menuItem.parentElement.classList.contains('cart-list')) return;

  const price = $menuItem.querySelector('.menu-item-detail .price').textContent;
  const $totalPrice = document.querySelector('.total-price');
  $totalPrice.textContent = Number($totalPrice.textContent) - Number(price);
  $menuItem.remove();
});

document.addEventListener('click', function onAddOrUpdateMenu(event) {
  if (!isEditMode()) return;
  const $target = event.target;
  if (!$target.classList.contains('submit-menu-button')) return;

  const $id = document.querySelector('.menu-form [name="id"]');
  const $name = document.querySelector('.menu-form [name="name"]');
  const $price = document.querySelector('.menu-form [name="price"]');
  const $category = document.querySelector('.menu-form [name="category"]');
  const $imagePreview = document.querySelector('.menu-form [name="image-preview"]');
  const isUpdateMode = !!$id.value;
  if (isUpdateMode) {
    const newMenu = {
      id: Number($id.value),
      name: $name.value,
      price: Number($price.value),
      category: $category.value,
      imageUrl: $imagePreview.src
    };
    MenuDB.update(newMenu);
    const $menuItem = document.querySelector(`.menu-list .menu-item[data-id="${newMenu.id}"]`);
    HtmlManager.updateMenuHtml($menuItem, newMenu);
    document.querySelector(`.menu-list .menu-item[data-id="${newMenu.id}"]`).classList.add('updated');
    return;
  }

  const newMenu = {
    name: $name.value,
    price: $price.value,
    category: $category.value,
    imageUrl: $imagePreview.src,
  };
  const menu = MenuDB.add(newMenu);
  const menuHtml = HtmlManager.getMenuHtml(menu);
  document.querySelector('.menu-list').insertAdjacentHTML('afterbegin', menuHtml);
});

document.addEventListener('click', function onClickDeleteMenuButton(event) {
  const $target = event.target;
  if (!$target.classList.contains('delete-button')) return;
  const $menuItem = getParentElementByClass(event.target, 'menu-item');
  if (!$menuItem.parentElement.classList.contains('menu-list')) return;

  if (confirm('정말 삭제하시겠어요?')) {
    MenuDB.delete($menuItem.dataset.id);
    $menuItem.remove();
  }
});

(function initHtml() {
  const menuListHtml = MenuDB.select().map(HtmlManager.getMenuHtml).join('');
  document.querySelector('.menu-list').insertAdjacentHTML('afterbegin', menuListHtml);
})()

function isEditMode() {
  return document.querySelector('.page-container').classList.contains('edit');
}

function getParentElementByClass(element, className) {
  if (element === null) {
    return null;
  }
  if (element.classList.contains(className)) {
    return element;
  }
  return getParentElementByClass(element.parentElement, className);
}
