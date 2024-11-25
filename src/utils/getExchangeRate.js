const axios = require("axios");

const getExchangeRate = async () => {
    try {
        console.log("Consultando la tasa de cambio...");
        const response = await axios.get(process.env.FRANKFURTER_URL);
        const rates = response.data.rates;
        return rates.USD;
    } catch (error) {
        throw new Error(`Error al consultar la tasa de cambio: ${error.message}`);
    }
};

module.exports = getExchangeRate;