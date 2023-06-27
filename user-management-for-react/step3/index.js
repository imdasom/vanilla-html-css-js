const $submitButton = document.querySelector('.submit-button');
$submitButton.addEventListener('click', function onClickSubmitButton() {
    const newUser = UserFormService.getForm();
    UserDB.create(newUser);

    UserFormService.resetForm();

    const userList = UserDB.select();
    HtmlService.renderUserList(userList);
});

document.addEventListener('click', function onClickUser(event) {
    const $maybeUserItem = event.target.parentElement;
    if (!$maybeUserItem.classList.contains('user-item')) {
        return;
    }
    const userId = $maybeUserItem.dataset.id;
    const user = UserDB.selectById(Number(userId));
    Modal.open({
        title: '회원정보',
        content: HtmlService.getUserInfoHtml(user)
    });
});

const UserFormService = {
    getForm: function () {
        const $name = document.getElementById('name');
        const $birth = document.getElementById('birth');
        const $gender = document.querySelector('[name="gender"]:checked');
        const $profileImage = document.getElementById('profileImage');

        const name = $name.value;
        const birth = $birth.value;
        const gender = $gender.value;
        const profileImageUrl = URL.createObjectURL($profileImage.files[0]);

        return { name, birth, gender, profileImageUrl };
    },
    resetForm: function () {
        const $name = document.getElementById('name');
        $name.value = '';

        const $birth = document.getElementById('birth');
        $birth.value = '';

        const $genderF = document.querySelector('[name="gender"][value="F"]');
        $genderF.checked = true;

        const $genderM = document.querySelector('[name="gender"][value="M"]');
        $genderM.checked = false;

        const $profileImage = document.getElementById('profileImage');
        $profileImage.value = '';
    }
}

const HtmlService = {
    renderUserList: function (userList) {
        const $userList = document.querySelector('.user-list');
        const userListHtml = userList.map(user => {
            return '' +
                `<li class="user-item" data-id="${user.id}">` +
                `   <img class="profile-image" src="${user.profileImageUrl}"/>` +
                '</li>'
        });
        $userList.innerHTML = userListHtml.join('');
    },
    getUserInfoHtml: function(user) {
        return '' +
            '<div class="user-info">' +
            `    <img src="${user.profileImageUrl}" class="profile-image"/>` +
            '    <div>' +
            `       <div>아이디: ${user.id}</div>` +
            `       <div>이름: ${user.name}</div>` +
            `       <div>생년월일: ${user.birth}</div>` +
            `       <div>성별: ${user.gender === 'F' ? '남' : '여'}</div>` +
            '    </div>' +
            '</div>';
    }
}
