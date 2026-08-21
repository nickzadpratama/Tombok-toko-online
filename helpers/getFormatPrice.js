function getFormatPrice(value) {
    let rupiah = value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    })

    return rupiah;
}

module.exports = getFormatPrice;