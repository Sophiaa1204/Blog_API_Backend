module.exports = {
    getPaginationValues: (pageNum, pageSize) => [(pageNum - 1) * pageSize, pageNum * pageSize]
}