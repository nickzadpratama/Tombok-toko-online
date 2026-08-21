const { Product, Category, User, Cart, EWalet } = require("../models");
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const getFormatPrice = require("../helpers/getFormatPrice");
const nodemailer = require('nodemailer');

function sendWelcomeEmail(targetEmail, username) {
  const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 5432,
      secure: true, // Menggunakan enkripsi aman TLS
      auth: {
          user: 'nickzadpratama7@gmail.com',      // Email pengirim
          pass: 'rahasia-password-aplikasi' // Kata sandi khusus aplikasi
      }
  });

  // TAHAP 2: Menulis isi surat (Mail Options)
  const mailOptions = {
      from: 'nickzadpratama7@gmail.com',
      to: targetEmail,
      subject: 'Halo',
      text: 'Halo! Selamat datang.'
  };

  // TAHAP 3: Kirim suratnya!
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('Waduh, gagal kirim:', error); // Jika error
      }
      console.log('Selamat datang di Tombok (Toko ileh-oleh)', info.messageId); // Jika sukses
  });
}

class Controller {
    static async getRegister(req, res) {
        try {
            const error = req.query
            res.render("register", {error});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postRegister(req, res) {
        try {
            const {username, email, password, role} = req.body;
            await User.create({username, email, password, role});

            let user = await User.findOne({
                where: {
                    username
                }
            })

            await EWalet.create({
                UserId: user.id
            });
            
            sendWelcomeEmail(email, username);
            res.redirect("/login")
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let message = error.errors.map(el => {
                    return el.message;
                });
            res.send(message);
            }
            console.log(error);
            res.send(error);
        }
    }

    static async getLogin(req, res) {
        try {
            const error = req.query
            res.render("login", {error});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postLogin(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({
                where: 
                { 
                  username  
                } 
            });
            if (user) {
                  const isValidPassword = bcrypt.compareSync(password, user.password);
                  if (isValidPassword) {
                    req.session.userId = user.id;
                    req.session.role = user.role;
                    return res.redirect(`/${user.id}`);
                  }
                }
                res.redirect('/login?error=Email atau password salah');
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let message = error.errors.map(el => {
                    return el.message;
                });
            res.send(message);
            }
            console.log(error);
            res.send(error);
        }
    }

    static async getLogout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) res.send(err);
                else res.redirect('/login');
            });;
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async lp(req, res) {
        try {
            res.render("lp");
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async home(req, res) {
        try {
            const {userId} = req.params;
            const {message} = req.query;
            let notifikasi = await Product.notifikasi();
            const products = await Product.findAll({ include: [Category] });
            let categories = await Category.findAll();
            res.render('home', { products, userId, categories, notifikasi, message, getFormatPrice });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async products(req, res) {
        try {
            let products = await Product.findAll();
            res.send(products);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async productById(req, res) {
        try {
            const {userId, productId} = req.params;
            let product = await Product.findByPk(productId);
            res.render("productById", {product, userId, getFormatPrice});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async categories(req, res) {
        try {
            let option = {
                include: {
                    model: Product,
                    where: {},
                    order: [
                        ["name"]
                    ]
                }
            }

            if (req.query.name) {
                option.include.where.name = {
                    [Op.iLike]: `%${req.query.name}%`
                }
            }

            let categories = await Category.findAll(option);
            res.send(categories);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async categoryById(req, res) {
        try {
            const {userId, categoriesId} = req.params;
            let notifikasi = await Product.notifikasi();

            let category = await Category.findOne({
                where: {
                    id: categoriesId
                },
                include: {
                    model: Product,
                    where: {},
                    order: [
                        ["name"]
                    ]
                },
            });

            if (req.query.name) {
                option.include.where.name = {
                    [Op.iLike]: `%${req.query.name}%`
                }
            }

            let categories = await Category.findAll();

            res.render("categoryById", {category, categories, userId, notifikasi, getFormatPrice});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async quantityBuy(req, res) {
        try {
            // let user = 
            await
            res.send(users);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async users(req, res) {
        try {
            let users = await User.findAll({
                include: {
                    model: Product
                }
            });
            res.send(users);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getAdd(req, res) {
        try {
            let categories = await Category.findAll();
            res.render("add", {categories});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postAdd(req, res) {
        try {
            const {name, stock, price, CategoryId, imageURL} = req.body;
            await Product.create({name, stock, price, CategoryId, imageURL});
            res.redirect("/products");
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let message = error.errors.map(el => {
                    return el.message;
                });
            res.send(message);
            }
            console.log(error);
            res.send(error);
        }
    }

    static async getDelete(req, res) {
        try {
            const {productId} = req.params;
            let product = await Product.findByPk(productId);
            await product.destroy(productId);
            res.redirect(`/products?message=${product.name} has been delete`);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getBuy(req, res) {
        try {
            const {quantity} = req.query;
            const {userId, productId} = req.params;
            let product = await Product.findByPk(productId);
            await product.update({
                stock: product.stock - quantity
            });
            let ewalet = await EWalet.findOne({
                where: {
                    UserId: userId
                }
            });
            await ewalet.update({
                saldo: ewalet.saldo - product.price
            });
            await Cart.create({
                UserId: userId, 
                ProductId: productId, 
                quantity});
            res.redirect(`/products`);
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async getEdit(req, res) {
        try {
            const {productId} = req.params;
            let product = await Product.findByPk(productId);
            let categories = await Category.findAll();
            res.render("edit", {product, categories});
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async postEdit(req, res) {
        try {
            const {name, stock, price, CategoryId, imageURL} = req.body;
            await Product.create({name, stock, price, CategoryId, imageURL});
            res.redirect("/products");
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
}

module.exports = Controller;