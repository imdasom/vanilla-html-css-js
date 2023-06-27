const UserDB = {
    _userList: [],
    select: function() {
        return this._userList;
    },
    selectById: function(id) {
        if (!id) {
            throw Error('UserDB.selectById : id required');
        }
        return this._userList.find(user => user.id === id);
    },
    create: function(user) {
        const newUser = {
            id: new Date().getTime(),
            ...user
        }
        this._userList.push(newUser);
    }
};

console.log('info - UserDB init');