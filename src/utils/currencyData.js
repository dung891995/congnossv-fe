export const convertCurrencyToNumber = (currency) => {
    return Number(currency.replace(/[^0-9.-]+/g,""))
}

export const convertNumberToCurrency = (number) => {
    return number.toLocaleString(
        undefined,
        { minimumFractionDigits: 0 }
      )
}