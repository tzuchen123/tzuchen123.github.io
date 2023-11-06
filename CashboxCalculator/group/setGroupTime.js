function setGroupTime(store) {
    return fetch('group/group_price.json')
        .then(response => response.json())
        .then(data => {
            const storeData = data.find(item => item.storeId === store);
            const table = storeData.table;


            //set default value
            const weekdayOption = document.createElement('option');
            weekdayOption.text = '請選擇歡唱時間 + 進場時段';
            weekdayDropdown.appendChild(weekdayOption);

            table.forEach((item, index) => {
                //skip the first row
                if (index === 0) return;
                const option = document.createElement('option');
                option.value = item.price;
                option.setAttribute('data-hour', item.singingHours);
                option.hour = item.singingHours;
                option.text = item.date + item.singingTime;
                weekdayDropdown.appendChild(option);
            });

            // uniqueWeekdays.forEach((weekday, index) => {
            //   const option = document.createElement('option');
            //   option.value = index;
            //   option.text = weekday;
            //   weekdayDropdown.appendChild(option);
            // });


        })
        .catch(error => console.error('Error fetching JSON:', error));
}


