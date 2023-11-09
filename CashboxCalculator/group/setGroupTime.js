function setGroupTime(store) {
    return fetch('group/group_price.json')
        .then(response => response.json())
        .then(data => {
            const storeData = data.find(item => item.storeId === store);
            const table = storeData.table;

  
            //set default value
            const groupOption = document.createElement('option');
            groupOption.text = '請選擇歡唱時間 + 進場時段';
            groupDropdown.appendChild(groupOption);

            table.forEach((item, index) => {
                //skip the first row
                if (index === 0) return;
                const option = document.createElement('option');
                option.value = index;
                option.text = item.date + item.singingTime;
                groupDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
}


