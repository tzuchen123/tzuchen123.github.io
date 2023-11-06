const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const storesData = require('../stores.json');
const stores = storesData.stores;  // Access the 'stores' array within the 'storesData' object

const baseUrl = 'https://www.cashboxparty.com/price/normal/kp';

const fetchData = async () => {
    const allStores = [];

    for (const store of stores) {
        const url = `${baseUrl}${store.data_extent}.html`;
        //店鋪資料暫存
        const storeTemp = {};
        //包廂資料
        const boxes = [];

        storeTemp['storename'] = store.name;
        storeTemp['data_extent'] = store.data_extent;

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            //最低消費
            storeTemp['minimum'] = 0;
            const minimumText = $('.copyright.container').text();
            const numbers = minimumText.match(/\d+/);
            storeTemp['minimum'] = parseInt(numbers[0], 10);

            $('.columns').each((index, element) => {
                //包廂名稱
                const boxName = $(element).find('h3').text().trim();

                const table = $(element).find('table');

                //星期(欄位名)
                const weekdays = [];
                table.find('thead th').each((i, weekday) => {
                    // skip the first column
                    if (i === 0) return;
                    weekdays.push($(weekday).text().trim());
                });

                //時段(列名)
                const time = [];
                //價格表
                const priceTable = [];
                table.find('tbody tr').each((i, row) => {
                    //該時段所有價格
                    const prices = [];
                    const cells = $(row).find('td');
                    cells.each((j, cell) => {
                        if (j === 0) {
                            time.push($(cell).text().trim());
                        } else {
                            //only last three words
                            prices.push($(cell).text().trim());
                        }
                    });
                    //將該時段所有價格加入價格表，價格表為二維陣列
                    priceTable.push(prices);
                });


                //包廂資料暫存
                const boxTemp = {
                    boxName: boxName,
                    weekdays: weekdays,
                    time: time,
                    priceTable: priceTable,
                };
                //將包廂資料暫存加入包廂資料
                boxes.push(boxTemp);
            });

            //將包廂資料加入店鋪資料暫存
            storeTemp['boxes'] = boxes;

        } catch (error) {
            console.error(`Error : ${error.message}`);
        }
        //將店鋪資料暫存加入店鋪資料
        allStores.push(storeTemp);
    }

    // Save the data as JSON
    const jsonContent = JSON.stringify(allStores, null, 2);



    fs.writeFileSync('box_price.json', jsonContent);
};

fetchData();
