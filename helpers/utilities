exports.validate = async (data,schema)=>{
    try {
        const validatedData = await schema.validateAsync(data,{abortEarly:false })
        return validatedData;

    } catch (error) {
        throw new Error (error.details[0].message.replace(/"/g, ''))
    }
}