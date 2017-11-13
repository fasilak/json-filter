const concatAddress = (address) =>
{
    let output = ``
    output += address.buildingNumber ? `${address.buildingNumber} ` : ``
    output += address.street ? `${address.street} ` : ``
    output += address.suburb ? `${address.suburb} ` : ``
    output += address.state ? `${address.state} ` : ``
    output += address.postcode ? `${address.postcode} ` : ``
    return output.trim()

}

const sendJsonParseError = (res) => {
    res.status(400).send({
        "error": "Could not decode request: JSON parsing failed"
    })
}


module.exports = class FilterController{

    static processData(request, response){
        let parsedData = {}
        if(request.body.payload instanceof  Array) {
            let filteredPayload = request.body.payload.reduce(function (filteredItems, item) {
                if (item.workflow === 'completed' && item.type === 'htv') {
                    filteredItems.push({
                        concataddress: concatAddress(item.address),
                        type: item.type,
                        workflow: item.workflow
                    })
                }
                return filteredItems
            }, [])

            parsedData.response = filteredPayload
        } else {
            return sendJsonParseError(response)
        }

        response.send(parsedData)
    }
}