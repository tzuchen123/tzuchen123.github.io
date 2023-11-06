function setPersonTime(store) {
  return fetch('person/person_price.json')
    .then(response => response.json())
    .then(data => {      
      const storeData = data.find(item => item.data_extent === store);
      const time = storeData['time'];
      const weekdays = storeData['weekday'];

      //set default value
      const weekdayOption = document.createElement('option');
      const timeOption = document.createElement('option');
      weekdayOption.text = '請選擇星期';
      weekdayDropdown.appendChild(weekdayOption);
      timeOption.text = '請選擇時段';
      timeDropdown.appendChild(timeOption);

      weekdays.forEach((weekday, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = weekday;
        weekdayDropdown.appendChild(option);
      });

      time.forEach((time, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = time;
        timeDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching JSON:', error));
}


