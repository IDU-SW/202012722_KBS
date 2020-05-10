const fs = require('fs');
const pool = require('./dbConnection');
const {prepareTable} = require('./prepareTable');

let conn;
conn = await pool.getConnection();

class Book {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.books = JSON.parse(data)
    }

    putUpdateBook(index, title, writer, year, summary) {    
        const sql = 'UPDATE books SET title = ?, writer = ?, year = ?, summary = ? WHERE index = ?;';

        try {            
            await conn.query(sql, [title, writer, year, summary]);
            return this.getGameDetail(index);
        } catch (error){
            console.error(error);
        } finally {
            if(conn){
                conn.release();
            }
        }
    }

    getBookList() {
        const sql = 'SELECT * FROM books';
        
        try {
            const [books, metadata] = await conn.query(sql);
            return books;
        } catch(error){
            console.error(error);
        } finally {
            if(conn) {
                conn.release();
            }
        }
    }

    deleteBookData(bookIndex) {
        const sql = 'DELETE FROM books WHERE index = ?;';
        try {
            const result = await conn.query(sql, [bookIndex]);
            return null;
        } catch(error){
            console.error(error);
        } finally {
            if (conn){
                conn.release();
            }
        }
    }
    

    addBook (title, writer, year, summary) {        
        try {
            
            // Insert
            const sqlI = 'INSERT INTO books(title, writer, year, summary) values (?, ?, ?, ?);';
            const data = [title, writer, year, summary];
            const resultI = await conn.query(sqlI, data);
            
            // Select
            const sqlS = 'SELECT * FROM books WHERE id = ?;';
            const resultS = await conn.query(sqlS, resultI[0].insertId);
            return resultS[0];
        } catch(error) {
            console.error(error);
        } finally {
            if(conn) {
                conn.release();
            }
        }
    }

    getBookDetail (bookIndex){
        const sql = 'SELECT * FROM books WHERE id = ?;';

        try {            
            const [detail, metadata] = await conn.query(sql, bookIndex);
            return detail[0];
        } catch(error) {
            console.error(error);
        } finally {
            if(conn){
                conn.release();
            }
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