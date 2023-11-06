const storeDropdown = document.getElementById('storeDropdown');

function setStore(charge) {
  let res;
  switch (charge) {
    case 'box':
      res = setGeneralStore();
      break;
    case 'person':
      res = setGeneralStore();
      break;
    case 'group':
      res = setGroupStore();
      break;

    default:
      break;
  }
  return res;
}

function setGeneralStore() {
  return fetch('stores.json')
    .then(response => response.json())
    .then(data => {
      const stores = data.stores;
      
      //set default value
      const option = document.createElement('option');
      option.text = '請選擇店家';
      storeDropdown.appendChild(option);

      stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.data_extent;
        option.text = store.name;
        storeDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

function setGroupStore() {
  //clear
  storeDropdown.innerHTML = '';
  return fetch('group/group_price.json')
    .then(response => response.json())
    .then(data => {
      const stores = data;

      //set default value
      const option = document.createElement('option');
      option.text = '請選擇店家';
      storeDropdown.appendChild(option);

      stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.storeId;
        option.text = store.storeName;
        storeDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching JSON:', error));
}