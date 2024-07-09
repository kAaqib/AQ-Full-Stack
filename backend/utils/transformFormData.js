function transformFormData(formData) {
    const result = {};
    for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
            const value = formData[key];
            const keys = key.match(/[^\[\]]+/g); // Extract keys from "questions[0][question]"
            keys.reduce((acc, key, index) => {
                if (index === keys.length - 1) {
                    acc[key] = value;
                } else {
                    acc[key] = acc[key] || {};
                }
                return acc[key];
            }, result);
        }
    }
    return result;
}

module.exports = transformFormData;