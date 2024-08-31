export function moneyFormat(transactionValue: number) {
  return `R$ ${transactionValue.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
}