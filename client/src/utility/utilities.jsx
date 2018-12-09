// wait for categories and bookmarks to be assigned in state
if (this.state.categories.length === 0 || this.state.bookmarks.length === 0) { return null; }

let bookmarksByCategory = this.state.categories.map(category => {
    return {
        category: category,
        bookmarks: this.state.bookmarks.filter(bookmark => {
            return bookmark.category === category._id
        })
    }
});