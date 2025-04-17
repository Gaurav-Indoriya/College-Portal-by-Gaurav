const CourseModel = require('../model/course');
const UserModel = require('../model/user');
const googleauthmodel = require('../model/googleUser')

class CourseController {

    static courseInsert = async (req, res) => { //course insert method
        try {
            const { id } = req.userdata;
            const { name, email, phone, dob, gender, education, course, address } = req.body;
            await CourseModel.create({
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course,
                user_id: id,
            });
            res.redirect('/courseDisplay');
            // console.log(req.body);
        } catch (error) {
            console.log(error);
        }
    }

    static courseDisplay = async (req, res) => { //course display method
        try {
            const { id, name, image } = req.userdata;
            // console.log(req.userdata);
            const course = await CourseModel.find({ user_id: id });
            let user = await UserModel.findById(id);
            if (!user) {
                user = await googleauthmodel.findById(id);
            }
            if (user.role === "admin") {
                res.redirect('/adminDisplay');
            } else {
                // console.log(user);
                res.render("course/display", { c: course, n: name, i: image, u: user, message: req.flash('courseUpdateMsg'), message2: req.flash('delete') });
            }
        } catch (error) {
            console.log(error);
        }
    }

    static courseView = async (req, res) => { //course view method
        try {
            const { name, image, id } = req.userdata;
            const cid = req.params.id;
            let user = await UserModel.findById(id);
            if (!user) {
                user = await googleauthmodel.findById(id);
            }
            //console.log(user);
            const course = await CourseModel.findById(cid);
            //console.log(course);
            res.render("course/view", { c: course, n: name, i: image, u: user });
        } catch (error) {
            console.log(error);
        }
    }

    static courseEdit = async (req, res) => { //course edit method
        try {
            const { name, image, id } = req.userdata;
            const cid = req.params.id;
            let user = await UserModel.findById(id);
            if (!user) {
                user = await googleauthmodel.findById(id);
            }
            const course = await CourseModel.findById(cid);
            //console.log(course);
            res.render("course/edit", { c: course, n: name, i: image, u: user });
        } catch (error) {
            console.log(error);
        }
    }


    static courseUpdate = async (req, res) => { //course update method
        try {
            const { image } = req.userdata;
            const { name, email, phone, dob, address, gender, education, course } = req.body;
            //console.log(req.body);
            const id = req.params.id;
            await CourseModel.findByIdAndUpdate(id, {
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course,
                status: "Pending for approval",
                comment: "Pending"
            });
            req.flash('courseUpdateMsg', 'Course Updated Successfully');
            res.redirect("/courseDisplay");
        } catch (error) {
            console.log(error);
        }
    }


    static courseDelete = async (req, res) => { //course delete method
        try {
            const { id } = req.params;
            await CourseModel.findByIdAndDelete(id);
            req.flash('delete', 'Course Deleted Successfully!');
            res.redirect('/courseDisplay');
        }
        catch (error) {
            console.log(error);
        }

    }



}


module.exports = CourseController;