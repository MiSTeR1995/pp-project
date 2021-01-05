function modal() {
    // Создание модального окна
    const modalWin = document.querySelector('.modal');
    const modalTrigger = document.querySelectorAll('[data-modal]');

    const modalClose = document.querySelector('[data-close]');

    // разбил на две функции открытия и закрытия
    function openModal() {

        modalWin.classList.add('show');
        modalWin.classList.remove('hide');

        // блокируем прокруту страницы
        document.body.style.overflow = 'hidden';

        // если пользователь сам открыл модальное окно до того, как оно открылось
        // само, то убираем таймер, чтобы не доставать его лишний раз
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modalWin.classList.add('hide');
        modalWin.classList.remove('show');

        // // реализация через toggle
        // modalWin.classList.toggle('show');

        // восстанавливаем прокрутку
        document.body.style.overflow = '';

    }
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // modalClose.addEventListener('click', closeModal);

    // делаем закрытие модального окна, если пользователь нажимает на подложку
    modalWin.addEventListener('click', e => {
        // нажатие на крестик в модалке - перенесено сюда(аттрибут data-close)
        // странно, при клике на крестик(у него есть аттрибут data-close) получаем пустую строку, поэтому задаем условие относительно нее
        // крестик также будет работать в динамически созданных элементах
        if (e.target === modalWin || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    // закрываем по клавише esc только при открытом окне
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWin.classList.contains('show')) {
            closeModal();
        }
    });

    // вызываем модальное окно через определенное время
    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {

        // pageYOffset - прокрученная часть по высоте
        // если долистали до конца, то прокрученная часть плюс клиент, который
        // сейчас видно должны равняться всей высоте сайта
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();

            // как только один раз польз. долистал до конца стр., то удаляем обработчик, чтобы не бесил
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    // вызываем модалку в определенном месте (например в конце страницы)
    // цепляем на глобальное окно
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;
