console.log('modal.js')

const Modal = {
  open: ({ title, content }) => {
    console.log('open!!!', title, content);
  }
};

window.modal = Modal;
