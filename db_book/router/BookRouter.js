const express = require('express');
const router = express.Router();
const Books = require('../model/BookModel');

router.get('/Books', showBookList);
router.get('/Books/search', searchBook);
router.get('/Books/:BookIndex', showBookDetail);
router.post('/Books', addBook);
router.delete('/Books/:BookIndex',deleteBook);
router.put('/Books/:BookIndex',updateBook);
router.put('/Books/edit/:BookIndex', editBook);
router.get('/Books/add/a', addBookPage);

module.exports = router;

function showBookList(req, res) {
    let bookList = Books.getBookList();
    //const result = { data:bookList, count:bookList.length };
    //res.send(result);
    res.render('listBook', {title:"책 목록",  list: bookList, count: bookList.length} );
}
async function addBookPage(req, res) { //추가창으로 이동하기
    try {
        res.render('addBook', {list:"책 목록"} );
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

async function editBook(req, res) { //수정창으로 이동하기
    try {
        // 영화 상세 정보 Id
        const BookIndex = req.params.BookIndex;
        console.log('BookIndex : ', BookIndex);
        const info = await Books.getBookDetail(BookIndex);
        res.render('updateBook', {list:"책 목록",  info: info} );
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

//수정
async function updateBook(req,res){
    try {
        const BookIndex = req.params.BookIndex; // id 가져오기       

        const title = req.body.title;
        const writer = req.body.writer;

        if (!title || !writer) {
            res.status(400).send({error:'title 과 writer를 입력해주세요'});
            return;
        }        
        const year = parseInt(req.body.year);
        const summary = req.body.summary;        

        const info = await Books.putUpdateBook(BookIndex, title, writer, year, summary);

        res.render('succesUpdate', {list:"책 목록"} );

    }
    catch ( error ) {
        res.status(400).send({error:'정보 수정에 실패했습니다'});
    }
}

//삭제
async function deleteBook(req,res){
    try {
        // 영화 상세 정보 Id
        const BookIndex = req.params.BookIndex;
        console.log('BookIndex : ', BookIndex);
        const info = await Books.deleteBookData(BookIndex);
        res.render('deleteBook', {title:"책 목록",  info: info,} );
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


//검색
async function searchBook(req,res){
    const title = req.query.title;
    const writer = req.query.writer;
    const year = req.body.year;

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
        res.render('detailBook', {title:"책 목록",  info: info,} );
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


//  추가
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
        res.render('succesUpdate', {list:"책 목록"} );
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}