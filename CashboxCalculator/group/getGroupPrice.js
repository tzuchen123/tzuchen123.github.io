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
                    const [date, singingTime, singingHours, price] = cells.toArray().map(cell => $(cell).text());
                    return { date, singingTime, singingHours, price };
                }
                return null;
            }).get();

            // 構建每個tab的JSON數據
            jsonData.push({
                storeId,
                storeName,
                table,
            });
        });

        // 將JSON數據另存為檔案
        fs.writeFileSync('group_price.json', JSON.stringify(jsonData, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

fetchData();
