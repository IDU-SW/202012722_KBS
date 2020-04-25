const express = require('express');
const router = express.Router();
const Books = require('../model/BookModel');

router.get('/Books', showBookList);
router.get('/Books/search', searchBook);
router.get('/Books/:BookIndex', showBookDetail);
router.post('/Books', addBook);

module.exports = router;

function showBookList(req, res) {
    const bookList = Books.getBookList();
    const result = { data:bookList, count:bookList.length };
    res.send(result);
}

async function searchBook(req,res){
    const title = req.query.title;
    const writer = req.query.writer;
    const year = req.query.year;

    if(!title && !writer && !year){
        res.status(400).send({error:'검색을 위해 title, writer,year 중 하나 이상을 입력해주세요'});
        return;
    }

    console.log('title : ', title);
    console.log('writer : ', writer);
    console.log('year : ', year);

    const info = await Books.getBookSearch(title,writer,year);
    res.send(info);


}

// Async-await를 이용하기
async function showBookDetail(req, res) {
    try {
        // 영화 상세 정보 Id
        const BookIndex = req.params.BookIndex;
        console.log('BookIndex : ', BookIndex);
        const info = await Books.getBookDetail(BookIndex);
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


// 새 영화 추가
// POST 요청 분석 -> 바디 파서
async function addBook(req, res) {
    const title = req.body.title;

    if (!title) {
        res.status(400).send({error:'title 누락'});
        return;
    }

    const writer = req.body.writer;
    const year = parseInt(req.body.year);
    const summary = req.body.summary;

    try {
        const result = await Books.addBook(title, writer, year, summary);
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}