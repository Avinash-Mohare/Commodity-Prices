const { parse, format } = require('date-fns');

const dateStr = '15/04/2024';
const dateObj = parse(dateStr, 'dd/MM/yyyy', new Date());
const formattedDate = format(dateObj, 'dd MMM yyyy');

console.log(formattedDate); 


