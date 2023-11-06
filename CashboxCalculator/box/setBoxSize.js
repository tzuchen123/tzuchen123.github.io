const boxSize = document.getElementById('box-size');
const boxSizeDropdown = document.getElementById('box-size-dropdown');

// Fetch and parse the JSON file
function setBoxSize(store) {
  console.log(store);
  return fetch('box/box_price.json')
    .then(response => response.json())
    .then(data => {
      //set default value
      const option = document.createElement('option');
      option.text = '請選擇包廂大小';
      boxSizeDropdown.appendChild(option);

      const storeData = data.find(item => item.data_extent === store);
      const boxes = storeData.boxes;

      boxes.forEach((box) => {
        const option = document.createElement('option');
        option.value = box.boxName;
        option.text = box.boxName;
        boxSizeDropdown.appendChild(option);
      });

    })
    .catch(error => console.error('Error fetching JSON:', error));
}
