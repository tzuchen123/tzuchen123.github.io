const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.cashboxparty.com/act/ktv/20200903/index.aspx';

const fetchData = async () => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const jsonData = [];

        // 選擇所有帶有"tab-pane"類別的div元素
        $('.tab-pane').each(function () {
            const storeId = $(this).attr('id');
            const storeName = $(this).find('h3').text();

            // 解析表格內容
            const table = $(this).find('table tbody tr').map(function () {
                const cells = $(this).find('td');
                if (cells.length === 4) {
                    const [date, singingTime, singingHours, priceStr] = cells.toArray().map(cell => $(cell).text());
                    const price = parseInt(priceStr);
                    return { date, singingTime, singingHours, price };
                }
                return null;
            }).get();

            let minimum = 0;
            const ul = $(this).find('ul li:contains("基消")');
            if (ul.length !== 0) {
                const li = ul[0];
                const text = $(li).text();

                const regex = /(\d+)/; 
                const match = text.match(regex); 
                minimum = parseInt(match[0]); 
            }

            let fees = {};
            const mediumBox = $(this).find('ul li:contains("中包廂加收")');
            if (mediumBox.length !== 0) {
                const li = mediumBox[0];
                const text = $(li).text();
                const regex = /中包廂加收\$(\d+)/; 
                const match = text.match(regex);
                fees.medium = parseInt(match[1]); // 取得第一個捕獲組的匹配結果
            }

            const largeBox = $(this).find('ul li:contains("大包廂加收")');
            if (largeBox.length !== 0) {
                const li = largeBox[0];
                const text = $(li).text();
                const regex = /大包廂加收\$(\d+)/; 
                const match = text.match(regex); 
                fees.large = parseInt(match[1]); // 取得第一個捕獲組的匹配結果
            }

            // 構建每個tab的JSON數據
            jsonData.push({
                storeId,
                storeName,
                table,
                minimum,
                fees
            });
        });

        // 將JSON數據另存為檔案
        fs.writeFileSync('group_price.json', JSON.stringify(jsonData, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

fetchData();
