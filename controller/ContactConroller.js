const ContactModel = require('../model/contact');
const UserModel = require('../model/user');


class ContactController {
    static contactInsert = async (req, res) => { //contact insert method
        try {
            const { name, email, phone, message } = req.body;
            await ContactModel.create({
                name,
                email,
                phone,
                message
            });
            req.flash('success', 'Message sent successfully');
            res.redirect('/contact',);
        } catch (error) {
            console.log(error);
        }
    }

    static contactMessage = async (req, res) => {
        try {
            const {id,name,image} = req.userdata;
            const user = await UserModel.findById(id);
            const contactmsg = await ContactModel.find();
            res.render('contact/display',{c:contactmsg,n:name,i:image,u:user,message:req.flash('deletemsg')});
        } catch (error) {
            console.log(error);
        }
    }

    static messageDelete = async (req, res) => {
        try {
            const id = req.params.id;
            //console.log(id);
            await ContactModel.findByIdAndDelete(id);
            req.flash('deletemsg', 'Message deleted successfully');
            res.redirect('/contactMessage');
        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = ContactController;