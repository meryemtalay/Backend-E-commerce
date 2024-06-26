const {default: mongoose} = require ("mongoose")
// MongoDB'ye bağlanılır.
const dbConnect = () => {
    try{
        const conn=mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected succesfully");
    } catch (error){
        console.log("Database error");
    }
};
module.exports=dbConnect;