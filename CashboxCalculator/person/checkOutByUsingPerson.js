function checkOutByUsingPerson(store, weekday, time, personCount) {
    return fetch('person/person_price.json')
        .then(response => response.json())
        .then(data => {
            const storeData = data.find(item => item.data_extent === store);
            const minimum = storeData.minimum;
            let message = '';
            let price = 0;

            let priceArray = storeData['priceTable'][time][weekday]; 
            let singingHour = storeData['defaultSingingHour'][time];
   

            if (priceArray.length === 0) {
                message = '該時段無法使用優惠時段計費';
                return message;
            }else if(priceArray.length === 1){
                price = parseFloat(priceArray[0]); 
            }else if(priceArray.length === 2){
                price = parseFloat(priceArray[0]); 
                singingHour = parseFloat(priceArray[1]); 
            }else if(priceArray.length === 3){
                price = parseFloat(priceArray[0]); 
                singingHour = parseFloat(priceArray[1]); 
                message = '營業時間' + priceArray[2];
            }

            let pay = (price + minimum) * personCount*1.1;
            pay = Math.round(pay); // 将 pay 四舍五入到整数

            message = message + `
            <p>
            每人須負擔 ${ Math.round(pay / personCount) } 元，包含贈送時數，總歡唱時數為${singingHour}小時。
            <br>
            消費金額計算方式如下：
            <br>
            (優惠時段價格 ${price} 元  + 餐飲低消 ${minimum} 元 ) * 1.1(服務費)
            </p>
            `;

            return message;

        })
        .catch(error => console.error('Error fetching JSON:', error));
}


