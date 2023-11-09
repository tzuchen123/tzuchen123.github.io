function checkOutByUsingGroup(store, hourIndex, personCount) {
    return fetch('group/group_price.json')
        .then(response => response.json())
        .then(data => {
            const storeData = data.find(item => item.storeId === store);
            const minimum = storeData.minimum;
            const table = storeData.table[hourIndex];

            const price = table.price;
            const singingHours = table.singingHours;
            const singingTime = table.date + ' ' + table.singingTime;
            const fees = table.fees;

            let pay = (price + minimum * personCount);
            let message = '';

            if (personCount <= 6) {} 
            else if (personCount >= 7 && personCount <= 9 && fees.length !== 0) {
                pay = pay + fees.medium;
            } else if(personCount >= 10 && personCount <= 15  && fees.length !== 0){
                pay = pay + fees.large;
            } else {
                message = '升級包廂費用，請洽詢店家。';
            }

            pay = pay*1.1;
            message = message + `
            <p>
            您的消費金額為 ${ Math.round(pay) } 元，每人須負擔 ${ Math.round(pay / personCount) } 元。
            <br>
            消費金額計算方式如下：
            <br>
            (團唱優惠價 ${price} 元 + 餐飲低消 ${minimum} 元 * 人數 ${personCount} 人) * 1.1(服務費)
            <br>
            歡唱時間${singingTime}，歡唱時數${singingHours}
            </p>
            `;

            return message;
            
        })
        .catch(error => console.error('Error fetching JSON:', error));
}


