const { parse, format } = require('date-fns');

const dateString = '03 May 2024';
const date = parse(dateString, 'dd MMM yyyy', new Date());
const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');

console.log(date, formattedDate);
