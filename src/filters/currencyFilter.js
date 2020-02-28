//新增一個filter
//在src/filters建立currencyFilter，再到注入點main.js進行import導入與啟用
//此filter為數字加上千分位及DollarSign
export default function (num) {
    const n = Number(num);
    return `$${n.toFixed(0).replace(/./g, (c, i, a) => {
        const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c);
        return currency;
    })}`;
}