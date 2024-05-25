const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    // slug, URL'nin daha okunabilir olmasını sağlar.
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,    
        required: true,
    },
    brand:{
        type: String,
        // enum:[ "Avonni","Begüsa","ADK","Gürbüz Avize","ÖZMER"]

    },
    //miktar
    quantity:{
        type:Number,
        required:true,
        select: false

    },
    sold: {
        type:Number,
        default:0,
        select: false,
    },
    images:{
        type: Array,
    },
    color: {
        type:String,
        // enum:['Black','Brown', 'Red']
        required:true,
    },
    ratings: [
        {
            star: Number,
            //ObjectId türünde ve User modeline referans verir. (Bu rateleri User yapar)
            postedby:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
        },
],
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);