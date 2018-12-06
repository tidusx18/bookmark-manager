const express = require('express');
const router = express.Router();
const tag = require('../controllers/tag.js');

router.get('/', tag.tag_list);
router.get('/:id', tag.tag_details);
router.post('/create', tag.tag_create);
router.put('/:id/update', tag.tag_update);
router.delete('/:id/delete', tag.tag_delete);

module.exports = router;