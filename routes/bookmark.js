const express = require('express');
const router = express.Router();
const bookmark = require('../controllers/bookmark.js');

router.get('/', bookmark.bookmark_list);
router.get('/find', bookmark.bookmark_details);
router.post('/create', bookmark.bookmark_create);
router.put('/:id/update', bookmark.bookmark_update);
router.delete('/:id/delete', bookmark.bookmark_delete);

module.exports = router;