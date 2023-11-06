const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const iconv = require('iconv-lite');

const storesData = require('../stores.json');
const stores = storesData.stores;  // Access the 'stores' array within the 'storesData' object

const baseUrl = 'https://www.cashboxparty.com/price/special/ks';
const fetchData = async () => {
    const allStores = [];

    for (const store of stores) {
        const url = `${baseUrl}${store.data_extent}.html`;
        //店鋪資料暫存
        const storeTemp = {};

        storeTemp['storename'] = store.name;
        storeTemp['data_extent'] = store.data_extent;

        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            // <meta http-equiv="Content-Type" content="text/html; charset=big5">
            // 指定big5編碼
            const html = iconv.decode(response.data, 'big5');
            const $ = cheerio.load(html);

            //最低消費
            storeTemp['minimum'] = 0;
            const minimumText = $('h3').text();
            const numbers = minimumText.match(/\d+/);
            storeTemp['minimum'] = parseInt(numbers[0], 10);

            const weekday = [];
            const time = [];
            const defaultSingingHour = [];
            const priceTable = [];
            $('#table5').find('tbody tr').each((i, row) => {
                const cells = $(row).find('td');
                if (i === 0) {
                    cells.each((j, cell) => {
                        if (j != 0 && j != 1) {
                            weekday.push($(cell).text().trim());
                        }
                    });
                } else {
                    const price = [];

                    cells.each((j, cell) => {
                        if (j === 0) {
                            time.push($(cell).text().trim());
                        } else if (j === 1) {
                            defaultSingingHour.push($(cell).text().trim().substring(0, 1));
                        } else if (j != 1) {
                            const temp = [];

                            const text = $(cell).text().trim();
                            const linesArray = text.split('\n').map(line => line.trim());
                            const filteredLines = linesArray.filter(line => line !== "" && line !== "-");
                            filteredLines.forEach(element => {
                                if (/^\d+$/.test(element)) {
                                    //index 0 is the price
                                    temp[0] = element;
                                } else if (/^買\d+[A-Z]送\d+[A-Z]$/.test(element)) {
                                    //index 1 is the singing hour
                                    const regex = /^買(\d+)[A-Z]送(\d+)[A-Z]$/;
                                    const match = element.match(regex);
                                    const x = parseInt(match[1]);
                                    const y = parseInt(match[2]);
                                    temp[1] = x + y;

                                } else if (/^\(\d+\)$/.test(element)) {
                                    // skip 續唱價格
                                } else {
                                    //沒考慮到的條件，多為特殊進場時間
                                    temp[2] = element;
                                }
                            });
                            price.push(temp);
                        }
                    });
                    priceTable.push(price);
                }

            });

            storeTemp['weekday'] = weekday;
            storeTemp['time'] = time;
            storeTemp['defaultSingingHour'] = defaultSingingHour;
            storeTemp['priceTable'] = priceTable;

        } catch (error) {
            console.error(`Error : ${error.message}`);
        }

        allStores.push(storeTemp);
    }

    // Save the data as JSON
    const jsonContent = JSON.stringify(allStores, null, 2);
    fs.writeFileSync('person_price.json', jsonContent);
};

fetchData();
