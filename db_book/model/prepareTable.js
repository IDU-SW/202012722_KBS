const conn = require('./dbConnection');

exports.prepareTable = () => {
    const sql = 'drop table if exists example.books ; CREATE TABLE example.books ( id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(20), writer VARCHAR(50), year INT, summary VARCHAR(150)););';
    conn.query(sql).then(ret => {
        console.log('books 테이블 준비 완료');
        conn.end();
        
    }).catch(err => {
        console.log('books 테이블 준비 실패 :', err);
        conn.end();
    });
} 