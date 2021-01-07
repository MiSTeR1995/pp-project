// Вынесем функции поверх модуля
// также сюда же передадим селекторы, с которыми работаем (аргументы от modal)
// Также нужно починить работу modalTimerId, для начала сделаем его аргументом
//
function openModal(modalSelector, modalTimerId) {
    // теперь нужно и тут получить доступ к этому селектору
    const modalWin = document.querySelector(modalSelector);

    modalWin.classList.add('show');
    modalWin.classList.remove('hide');

    // блокируем прокруту страницы
    document.body.style.overflow = 'hidden';


    // запускать эту очищение интервала будем в том случае, если modalTimerId
    // вообще был передан в функцию, потому что это понадобится не в каждом случае

    console.log(modalTimerId);
    if (modalTimerId) {
        // если пользователь сам открыл модальное окно до того, как оно открылось
        // само, то убираем таймер, чтобы не доставать его лишний раз
        clearInterval(modalTimerId);
    }

}

function closeModal(modalSelector) {
    // теперь нужно и тут получить доступ к этому селектору
    const modalWin = document.querySelector(modalSelector);

    modalWin.classList.add('hide');
    modalWin.classList.remove('show');

    // // реализация через toggle
    // modalWin.classList.toggle('show');

    // восстанавливаем прокрутку
    document.body.style.overflow = '';

}

// Каждый модуль должен быть независим друг от друга
// поэтому уберем привязку к конкретным сущностям внутри них.
// Будем передавать в функцию селекторы, с которыми хотим работать
// Сделаем модуль зависимым от аргументов, которые будем передавать в него
// modalTimerId также запихаем сюда как аргумент и передаем во все openModal

function modal(triggerSelector, modalSelector, modalTimerId) {
    // Создание модального окна
    const modalWin = document.querySelector(modalSelector);
    const modalTrigger = document.querySelectorAll(triggerSelector);

    modalTrigger.forEach(btn => {
        // т.к мы в функцию добавили селектор, то его нужно передать и тут
        // но до этого мы передавали функцию. Мы не должны ее вызывать, а должны
        // просто объявить, она сама вызовется по клику. Но чтобы не нарушать
        // этот приницип, нужно добавить вызов функции в стрелочной функции
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });


    // делаем закрытие модального окна, если пользователь нажимает на подложку
    modalWin.addEventListener('click', e => {
        // нажатие на крестик в модалке - перенесено сюда(аттрибут data-close)
        // странно, при клике на крестик(у него есть аттрибут data-close) получаем пустую строку, поэтому задаем условие относительно нее
        // крестик также будет работать в динамически созданных элементах
        if (e.target === modalWin || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    // закрываем по клавише esc только при открытом окне
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWin.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {

        // pageYOffset - прокрученная часть по высоте
        // если долистали до конца, то прокрученная часть плюс клиент, который
        // сейчас видно должны равняться всей высоте сайта
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);

            // как только один раз польз. долистал до конца стр., то удаляем обработчик, чтобы не бесил
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    // вызываем модалку в определенном месте (например в конце страницы)
    // цепляем на глобальное окно
    window.addEventListener('scroll', showModalByScroll);
}

// module.exports = modal;

// экспортируем по стандарту ES6
export default modal;

// создадим именованные экспорты для двух функций
export {closeModal};
export {openModal};
