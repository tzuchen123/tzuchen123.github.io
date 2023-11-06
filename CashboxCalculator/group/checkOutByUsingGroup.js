function checkOutByUsingGroup(store, weekday, hour, personCount) {
    console.log(store, weekday, hour, personCount);
    let message = '';

    message = message + `
    <p>
    您的消費金額為 ${weekday} 元，每人須負擔 ${ Math.round(weekday / personCount) } 元。
    <br>
    ${hour} 
    </p>
    `;
    return message;
    
    
    return fetch('box/box_price.json')
        .then(response => response.json())
        .then(data => {
            const storeData = data.find(item => item.data_extent === store);
            const minimum = storeData.minimum;
            const boxData = storeData.boxes.find(item => item.boxName === boxSize);
            let priceString = boxData.priceTable[time][weekday];

            let price = 0; 
            let message = '';

            if (priceString.indexOf('-') !== -1) {
                message = '該時段沒有包廂可用';
                return message;
            }else if (priceString.indexOf('起') !== -1) {
                //重新計算歡唱時間
                const [startHour, pricePart] = priceString.split('起');
                message = `該時段從${startHour}開始，請確認歡唱時間是否超過`;
                price = parseFloat(pricePart); 
            } else {
                price = parseFloat(priceString);
            }
            let pay = (price*singingHour + minimum* personCount) *1.1;
            pay = Math.round(pay); // 将 pay 四舍五入到整数

            message = message + `
            <p>
            您的消費金額為 ${pay} 元，每人須負擔 ${ Math.round(pay / personCount) } 元。
            <br>
            消費金額計算方式如下：
            <br>
            (包廂價格 ${price} 元 * 歡唱時間 ${singingHour} 小時 + 餐飲低消 ${minimum} 元 * 人數 ${personCount} 人) * 1.1(服務費)
            </p>
            `;

            return message;
            
        })
        .catch(error => console.error('Error fetching JSON:', error));
}


