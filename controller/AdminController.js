const CourseModel = require('../model/course');
const UserModel = require('../model/user');
const nodemailer = require('nodemailer');
const adminAuth = require('../middleware/adminAuth');


class AdminController {

    //admin display method
    static adminDisplay = async (req, res) => {
        try {
            const {id,name,image} = req.userdata;
            const user = await UserModel.findById(id);
            const course = await CourseModel.find();
            res.render('admin/display',{c:course,n:name,i:image,u:user,message:req.flash('fieldError'),message1:req.flash('courseUpdateMsg'),message2:req.flash('delete')});
        } catch (error) {
            console.log(error);
        }
    }


    static updateStatus = async (req, res) => {
        try {
            const id = req.params.id;
            const {status,comment,name,email,course} = req.body;
            if (!status || !comment) {
                req.flash('fieldError', "Please fill all fields!");
                return ('/adminDisplay');
            }
            await CourseModel.findByIdAndUpdate(id, {
                status,
                comment
            });
            if (status === "Rejected") {
                this.RejectEmail(name, email, course, status, comment);
            } else {
                this.ApprovedEmail(name, email, course, status, comment);
            }
            res.redirect('/adminDisplay');
        } catch (error) {
            console.log(error);
            
        }
    }

    //approve email
    static ApprovedEmail = async (name, email,course,status,comment) => {
        //console.log(name,email,course)
        // connenct with the smtp server
      
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
      
          auth: {
            user: "gaurav.indoriya82@gmail.com",
            pass: "gzxz fvzb aroy yakm",
          },
        });
        let info = await transporter.sendMail({
            from: "gaurav@gmail.com", // sender address
            to:email, // list of receivers
            subject: ` Course ${course} Approved`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                   <p>We are pleased to inform you that your course has been approved! Congratulations on your hard work and dedication.<br>
                   ${comment}<p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    Gaurav Indoriya <br>
                    (IT Team Lead)
                </div>
            </div>
        </body>
             `, // html body
        });
      };

      //reject email
      static RejectEmail = async (name, email,course,status,comment) => {
        //console.log(name,email,course,status)
        // connenct with the smtp server
      
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
      
          auth: {
            user: "gaurav.indoriya82@gmail.com",
            pass: "gzxz fvzb aroy yakm",
          },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course} Reject`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                     
                    <p>Unfortunately, your course has been rejected. Please review the feedback below for further details:<br>
                   ${comment}</p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    Gaurav Indoriya <br>
                    (IT Team Lead)
                </div>
            </div>
        </body>
             `, // html body
        });
      };


}

module.exports = AdminController;