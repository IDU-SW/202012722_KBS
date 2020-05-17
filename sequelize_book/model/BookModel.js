const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('db_201412069', 'user_201412069', 'cometrue', {
    dialect: 'mysql', host :'127.0.0.1'
})

class bookList extends Sequelize.Model {}
bookList.init({
    bookIndex: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    writer: Sequelize.STRING,
    year: Sequelize.STRING,
    summary: Sequelize.STRING
}, {tableName: 'book_list', sequelize})

class bookInfo extends Sequelize.Model {}
bookInfo.init({
    info_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    list_book_id: Sequelize.INTEGER,
    history: Sequelize.STRING
}, {tableName: 'book_info', sequelize})

class Book {

    constructor() {
        try{
            this.prepareTable();
        } catch (err){
            console.error(err);
        }
    }

    async prepareTable() {
        try {
            await bookList.sync({force:true});
            await bookInfo.sync({force:true});

            bookList.hasOne(bookInfo, {
                foreignKey:'list_book_id'
            })
            await this.jsonToDB();
        }catch (err){
            console.log('bookList 준비 실패 :', err);
        }
    }

    async jsonToDB() {
        const data = fs.readFileSync('./model/data.json');
        const books = JSON.parse(data);
        for(var book of books){
            await this.bookdata(book);
        }
    }

    async bookdata(book){
        try{
            const mret = await bookcList.create({
                title: book.title,
                artist: book.artist,
                genre: book.genre,
                date: book.date,
            }, {logging: false});

            const iret = await bookInfo.create({
                history: book.history
            }, {logging: false});

            const newData = mret.dataValues;

            await mret.setbookInfo(iret);

            console.log(newData);
            console.log('Create success');
        } catch (err) {
            console.log('ERROR : ', err);
        }
    }

    async getBookList() {

        let rtn;
        await bookList.findAll({include:[{model:bookInfo}]})
        .then( results => {
            for (var item of results) {
                console.log('id:', item.bookIndex, ', title:', item.title, ', writer:', item.writer, ', year:', item.year, ', summary:', item.summary);
            }
            rtn = results;
        })
        .catch( error => {
            console.error('Error :', error);
        });
        return rtn;
    }


    async putUpdateBook(index, title, writer, year, summary,history) {    
        try {
            let book = await bookList.findByPk(index);
            book.title = title;
            book.writer = writer;
            book.year = year;
            book.summary = summary;
            let ret = await book.save();

            let book_v = await bookInfo.findByPk(index);
            book_v.history = history;
            let ret_v = await book_v.save();

            let changedbook = ret.dataValues;
            let changedbook_v = ret_v.dataValues;
            console.log('ret :',changedbook, "ret_v: ", changedbook_v);

            let results = await bookList.findAll({where: {book_id:index}, include:[{model:bookInfo}]});
            return results[0];
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

  
    async deleteBookData(bookIndex) {
        try {
            let results = await bookList.findAll({where: {book_id:bookIndex}, include:[{model:bookInfo}]});

            let result = await bookList.destroy({ where:{book_id:bookIndex}, include:[{model:bookInfo}]});
            
            for (var item of results) {
                console.log('Remove item id : ', item.book_id, ', title : ', item.title);
            }
            if ( results ) {
                console.log('Remove success :', result);
                return results[0];
            }
            else {
                console.log('no data');
            }
        }
        catch (error) {
            console.log('Remove Error :', error);
        }
    }
    

    async addBook (title, writer, year, summary,history) {        
        let newbook = {title, writer, year, summary, history};
        console.log(newbook);
        try {
            const newData = await this.bookdata(newbook);
            console.log(newData);
            console.log('Create success');
            return newbook;
        }
        catch (error) {
            console.log('Error : ', error);
        }
    }

    async getBookDetail (bookIndex){
        try {
            let results = await bookList.findAll({where: {book_id:bookIndex}, include:[{model:bookInfo}]});
            for (var item of results) {
                console.log('id : ', item.book_id, ' title : ', item.title);
            }
            if ( results ) {
                return results[0];
            }
            else {
                console.log('no data');
            }
        }
        catch (error) {
            console.log('Error : ', error);
        }
    }

    getBookSearch (title, writer, year){

        return new Promise((resolve, reject) => {
            if(title && !writer && !year){
                for (var book of this.books ) {
                    if ( book.title == title ) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(!title && writer && !year){
                for (var book of this.books ) {
                    if ( book.writer == writer ) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(!title && !writer && year){
                for (var book of this.books ) {
                    if ( book.year == year ) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(!title && writer && year){
                for (var book of this.books ) {
                    if ( book.year == year && book.writer == writer) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(title && !writer && year){
                for (var book of this.books ) {
                    if ( book.year == year && book.title == title) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(title && writer && !year){
                for (var book of this.books ) {
                    if ( book.title == title && book.writer == writer) {
                        resolve(book);
                        return;
                    }
                }
            }
            else if(title && writer && year){
                for (var book of this.books ) {
                    if ( book.year == year && book.title == title && book.writer == writer ) {
                        resolve(book);
                        return;
                    }
                }
            }
            reject({msg:'Can not find book', code:404});            
        });
    }
}
module.exports = new Book();