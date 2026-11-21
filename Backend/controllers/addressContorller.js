import Address from "../models/Address";


// save adddres  

export const saveAddress = async (req, res) => {
    try{
        const Address = await Address.create(req.body);
        res.json({message: 'address saved successfully', Address})
    } catch (error){
        res.status(500).json({message: 'error saving address', error})
    }
};


// get address

export const getAddresses = async(req,res)=>{
    try{
        const addresses = await Address.find({userId: req.params.userId});
        res.json({message: 'addresses fetched successfully', addresses})
    }catch (error){
        res.status(500).json({message: 'error fetching addresses', error})
    }
}