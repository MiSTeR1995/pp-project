'use strict';
// создание табов ( переключающиеся элементы)
window.addEventListener('DOMContentLoaded', () => {

    // Создание табов на странице
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items'); // родитель для делегирования событий

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }
    function showTabContent(i = 0) {

        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');

    }

    hideTabContent();
    showTabContent();

    // с помощью делегирования событий сделаем обработчик
    tabsParent.addEventListener('click', (event) => {

        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });



    // Создание таймера акций и тд

    const deadline = '2020-12-12';

    // функция определения разницы между дедлайном и текущим временем
    function getTimeRemaining(endTime) {

        // в переменной хранится разница между датами в милисекундах
        const t = Date.parse(endTime) - Date.parse(new Date());

        // сколько осталось дней с округлением до ближайшего целого
        const days = Math.floor(t / (1000 * 60 * 60 * 24));

        // Общее число часов не нужно, т.к нужны только хвостики в сутках
        const hours = Math.floor((t / (1000 * 60 * 60) % 24));

        // Аналогично и для минут. хвостик не более 60 минут
        const minutes = Math.floor((t / (1000 * 60) % 60));

        // С секундами тоже самое
        const seconds = Math.floor((t / 1000) % 60);

        // вернем объект оставшегося времени. Такой прием часто используется
        return {
            'total': t, // ост. время, нужно, чтобы знать закончился ли таймер
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    // функция для получения 0: 05 часов 09 минут 03 секунд...
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    // функция, которая устанавливает таймеры на страницу
    function setClock(selector, endTime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        const timeRemaining = getTimeRemaining(endTime);

        // таймер на запуск функции обновления времени каждую секунду
        let timeInterval; // let, т.к. проверям не вышел ли таймер вообще


        // запустим один разок для инициализации даты и уберем мигание верстки
        // после этого уже будет работать интервал в 1с
        if (timeRemaining.total && timeRemaining.total <= 0) {

            days.innerHTML = `00`;
            hours.innerHTML = `00`;
            minutes.innerHTML = `00`;
            seconds.innerHTML = `00`;

        } else {

            // таймер на запуск функции обновления времени каждую секунду
            timeInterval = setInterval(updateClock, 1000);
            updateClock();
        }

        // функция обновления таймера
        function updateClock() {
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            // если дедлайн вышел, то останавливаем обновление таймера
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);



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

    // Использование классов для карточек меню
    // UPD: Добавлен rest оператор для улучшенной кастомизации карточек.
    // вдруг мы захотим еще добавить какое-то количество HTMLклассов элементу
    // rest не поддерживает дефолтные параметры

    class MenuCard {
        constructor(title, descr, price, imgSrc, imgAlt, parentSelector, ...classes) {
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.imgSrc = imgSrc;
            this.imgAlt = imgAlt;

            this.classes = classes; // не стоит забывать что это массив

            // такой вариант не сработает, потому что у нас
            // 1) лежит пустой массив, а он не является логическим false
            // 2) мы этот массив превращаем в строку и дальше перебрать его не сможем
            // this.classes = classes || 'какой-то класс'

            this.parent = document.querySelector(parentSelector); // DOM элемент
            this.transfer = 75; // курс валют
            this.convertToRUB(); // методы можно вызывать прямо в конструкторе
        }

        convertToRUB() {
            this.price = this.price * this.transfer; // переводим из $ в Rub
        }

        // формируем верстку
        render() {
            // создаем элемент и помещаем в него верстку
            const element = document.createElement('div');

            // назначим сами в rest параметр по умолчанию
            // на случай, если пользователь забыл передать главный класс в элемент
            // если в rest ничего не передали, то будет все равно сформирован пустой массив
            // если проверить передано ли туда что-то (в rest), то выдаст true
            // в связи с этим нужно проверять на количество элементов в массиве
            // точно также ведут себя методы querySelectorAll, getElements...итд
            // если ничего не передано, то сделаем дефолтный класс
            if (this.classes.length === 0) {
                // вдруг нам этот класс в будущем понадобится
                // запишем его в пустое свойство
                // я так понял имя может быть рандомное
                // здесь elemen это не константа выше, а новое свойство глоб. объекта
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                // UPD: Обновлено с использованием rest
                // обработаем массив классов, переданный с помощью rest-оператора
                // Добавляем новосозданному элементу еще классов, переданных с rest
                this.classes.forEach(className => element.classList.add(className));
            }

            // Теперь нужно чуток изменить верстку
            // убрана обертка <div class="menu__item">. Теперь подставляем напрямую
            // и будет его передавать при формировании верстки через метод
            element.innerHTML = `
                <img src=${this.imgSrc} alt=${this.imgAlt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;

            this.parent.append(element);
        }


        // моя реализация верстки
        formMenu(cardNum = 1) {
            const menuArr = [];
            const menuItem = document.querySelectorAll('.menu__item');
            menuItem.forEach((item, i) => {
                menuArr[i] = item;
            });


            let h3 = menuArr[cardNum].querySelector('.menu__item-subtitle');
            h3.innerHTML = `${this.title}`;
            let text = menuArr[cardNum].querySelector('.menu__item-descr');
            text.innerHTML = `${this.descr}`;
            let price = menuArr[cardNum].querySelector('span');
            price.innerHTML = `${this.price}`;
            let img = menuArr[cardNum].querySelector('img');
            img.src = this.imgSrc;

        }
    }
    const getResource = async (url) => {

        const result = await fetch(url);

        // т.к. фетч не реагирует на ошибки 404 500 и тд, то такое поведение
        // нужно сделать самим

        // два свойства у промимса, которые есть у промиса, вернувшегося с фетч
        // .ok - что-то получили, все окей
        // .status  - попадаем на тот статус, который вернулся от сервера

        // если пошло что-то не так, то выкидываем ошибку
        // есл выкидывается ошибка в ручном режиме, то срабатывает catch
        if (!result.ok) {
            // объект ошибки. throw - выкидывает ошибку в консоль
            throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }
        return await result.json();
    };

    // избавляемся от лишних кусков кода и создаем карточки с помощью функции и базы данных
    // getResource('http://localhost:3000/menu')
    //     // придет обычный объект, не json и можем сразу его использовать
    //     // а там лежит обычный массив из объектов (см. базу данных)
    //     .then(data => {
    //         // также желательно использовать синтаксис деструктуризации объекта
    //         // когда из объекта вытаскиваются отделньые свойства в качестве отдельной переменной
    //         data.forEach(({title, descr, price, img, altimg}) => {
    //             // конструктор наших карточек. Он будет создаваться столько раз
    //             // сколько будет объектов в этом массиве, который приешл с сервера
    //             // в конструктор передадим свойства объекта

    //             new MenuCard(title, descr, price, img, altimg,'.menu .container')
    //             .render();
    //         });
    //     });


    // Вариант с использовнием axios.

    axios.get('http://localhost:3000/menu')
        .then(data => {
            // обратиться нужно к свойству data у полученного объекта (в нашем случае тофтология - data у объекта data)
            data.data.forEach(({ title, descr, price, img, altimg }) => {
                new MenuCard(title, descr, price, img, altimg,'.menu .container')
                .render();
            });
        });




    // 2 вариант. Без использования классов. Формирование верстки налету
    // в некоторых случаях шаблон классов не нужен (созд. один раз на странице)
    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     // будем получать массив из базы данных и также перебираем его с деструктуризацией
    //     data.forEach(({ title, descr, price, img, altimg }) => {
    //         const element = document.createElement('div');

    //         element.classList.add('menu__item');

    //         // форммируем верстку налету со свойствми от сервера
    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> руб/день</div>
    //             </div>
    //         `;
    //         document.querySelector('.menu .container').append(element);
    //     });
    // }




    // Объект без переменной создается и удаляется, нужен чтобы использовать объект на месте
    // UPD: старый варинт (удалил еще 2 карты), выше делаем это все через функцию и получение данных от сервера
    // new MenuCard(
    //     'Меню "Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     9,
    //     'img/tabs/vegy.jpg',
    //     'vegy',
    //     '.menu .container'
    // ).render();

        // Отправка форм
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с Вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    // подвяжем функцию к формам
    forms.forEach(item => {
        bindPostData(item);
    });

    // сделаем взаимодействие с сервером отдельной функцией
    // функция занимается тем, что настраивает запрос.
    // она фетчит(посылает запрос на сервер), получает какой-то ответ от сервера
    // после этого трансформирует этот ответ в json
    // внутри этой функции асинхронный код и это нужно учесть
    // т.к. код пойдет выполняться дальше, не ожидая ответа от сервера (где фетч)
    // из-за этого функция может вернуть ошибку, а не нужный нам результат
    // для этого нужно указать, что функция имеет асинхронный код.
    // async поможет это сделать (ES8)
    // после этого уже можно использовать его парный оператор await (всегда вместе)
    // он ставится перед теми операцими, которые нам необходимо дождаться
    const postData = async (url, data) => {
        // внутри переменной лежит промис, который возвращает фетч
        // нам нужно дождаться выполнение фетча, поэтому ставим await
        // неважно какой результат, но выполнения мы должны дождаться
        // код не совсем синхронный, он не блокирует выполение кода дальше
        // но именно для этого будет ждать до 30 сек(по стандарту) ответа
        const result = await fetch(url, {
            method: 'POST',
            // для json нужно использовать заголовки
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        // вернем результат в формате json
        // здесь тоже понадобится await, т.к. возващается промис
        // эта операция возникает и проводится не сразу, мы не знаем
        // какой там большой объект json и сколько нужно времени на обработку
        return await result.json();
    };

    function bindPostData(form) {

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // создадим элемент для спиннера загрузки
            const loadingStatus = document.createElement('img');
            loadingStatus.src = message.loading;
            loadingStatus.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', loadingStatus);

            // сбор данных с формы
            const formData = new FormData(form);
            // трансформируем formData в объект
            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });

            // Object.fromEntries преобразует из массива с массивами объект.
            // formData  сначала превращается в массив массвов
            // потом превращаем ее в классический объект, а потом в json
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // теперь этот объект можно конвертнуть в json
            // подставится далее напрямую в body
            // const json = JSON.stringify(object);

            // создание запроса с помощью fetch (POST)
            // fetch('server.php', {
            //     method: 'POST',
            //     // для json нужно использовать заголовки
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object)
            // })
            postData('http://localhost:3000/requests', json)
            // получение внятного ответа от сервера. Превратим ответ в  текст
            // .then( data => data.text()) // уже не нужна, т.к происходит в postData
            // раньше мы  смотрели когда сработает событие load, когда событие полностью завершится, отслеживали статусы и выполняли определенные действия
            // сейчас будемд елать тоже самое, только при помощи промисов
            .then(data => {
                // нужно выполнить операци которые были в положительном исходе запроса
                console.log(data);
                showThanksModal(message.success);
                loadingStatus.remove(); // удаляем спиннер
            })
            .catch(() => {
                // операции для отрицательного исхода запроса
                // промис не перейдет в состояние reject из-за ответа HTTP который считается ошибкой (404, 500,501...)
                // он все равно выполнится нормально. Единственное что у него поменяется
                // это свойство status, оно  перейдет в состояние false.
                // Именно поэтому при неверном урл мы получаем нормальный результат
                // Данные не отправились, но при этом и промис нормально отработал
                // Мы увидели модальное окно и вроде бы все прошло нормально
                // Самое главное для fetch это то что он вообще смог сделать
                // этот запрос. Reject будет возникать только при сбое сети и
                // если что-то там помешало запросу выполнится.
                // У этого механизма есть свои плюсы.
                showThanksModal(message.failure);
            })
            .finally(() => {
                // выполняем это всегда, вне зависимости от исхода
                form.reset(); // очистка формы
            });
        });
    }

    function postDataByXMLHTTPRequest(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // создадим элемент для спиннера загрузки
            const loadingStatus = document.createElement('img');
            loadingStatus.src = message.loading;
            loadingStatus.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            // form.append(loadingStatus);
            // вставляем спиннер непосредственно после формы, а не в нее
            // чтобы горизонтальные формы не съезжали
            form.insertAdjacentElement('afterend', loadingStatus);

            const req = new XMLHttpRequest();
            req.open('POST', 'server.php');

            // Заголовок для formData
            // req.setRequestHeader('Content-type', 'multipart/form-data');
            // для формата JSON
            req.setRequestHeader('Content-type', 'application/json');

            // нам не всегда нужно передавать данные в формате json
            // formData - объект, с определенной формы быстро форм. все данные, которые заполнил пользователь
            // очень важный момент:
            // в инпутоподобных элементах всегда нужно указывать аттрибут name в верстке
            // иначе formData просто не сможет найти value из этих инпутов
            const formData = new FormData(form);

            // formData надо превратить в json, который просто так в другой формат не перегнать
            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });

            // теперь этот объект можно конвертнуть в json
            const json = JSON.stringify(object);
            // но сервер php не умеет нативно работать с форматом json
            // чаще всего такие данные отправляются на сервера nodejs
            // для этого надо в файле php декодировать из json
            // $_POST = json_decode(file_get_contents("php://input"), true)
            // req.send(formData); // т.к метод POST, то уже есть body (заполненная форма), который отправляется
            req.send(json); // т.к метод POST, то уже есть body (заполненная форма), который отправляется

            req.addEventListener('load', () => {
                if (req.status === 200) {

                    console.log(req.response);

                    // оповестим пользователя о загрузке, созданным блоком
                    showThanksModal(message.success);

                    form.reset();
                    // удаление блока через 2 секунды
                    // setTimeout(() => {
                    //     statusMessage.remove();
                    // }, 2000);

                    // убираем таймаут, потому что statusMes будет использоваться
                    // только для загрузки ( спинер на странице)
                    loadingStatus.remove();

                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }

    // создание красивого оповещение пользователя
    // Пометка: обработчики событий на динамически созданные элементы просто так
    // не вешаются, для этого нужно использовать делегирование событий
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        // теперь нужно добавить этот элемент в модальное окно
        document.querySelector('.modal').append(thanksModal);

        // через определенное время форма должна вернуться обратно
        // вдруг пользователь захочет опять открыть ее, а мы ее скрыли
        // возвращаем через асинхронную операцию с сет таймаутом
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }






    // Создание слайдера

    const slides = document.querySelectorAll('.offer__slide');
    const prevSlide = document.querySelector('.offer__slider-prev');
    const nextSlide = document.querySelector('.offer__slider-next');
    const totalSlide = document.querySelector('#total');
    const currentSlide = document.querySelector('#current');

    // переменные для карусели
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const slideW = window.getComputedStyle(slidesWrapper).width; // ширина отрендеренного блока

    // навигация по слайдам
    const slider = document.querySelector('.offer__slider');
    const dots = []; // истинный массив для точек, чтобы работать потом с ними

    let offset = 0; // отступ для слайдеров
    let slideIndex = 1;

    // функции
    const setCurrentSlide = ind => {

        // После инициализации слайдера, нужно показать общее количество и текущий
        // работает для обоих вариантов, оставляем его
        if (slides.length < 10) {
            totalSlide.textContent = `0${slides.length}`;
            currentSlide.textContent = `0${ind}`;

        } else {
            totalSlide.textContent = slides.length;
            currentSlide.textContent = ind;

        }
    };
    const dotsProc = dotsArray => {

        // также будем обрабатывать точки слайдеров
        dotsArray.forEach(dot => dot.style.opacity = '.5');
        dotsArray[slideIndex - 1].style.opacity = 1; // -1 потому что слайд индекс начинался с 1
    };

    // точки для слайдера
    slider.style.position = 'relative';

    // сначала создаем обертку для точек
    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');
    // можно добавить стили через cssText, но лучше напрямую в css
    // indicators.style.cssText
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {

        const dot = document.createElement('li');

        dot.setAttribute('data-slide-to', i + 1); // аттрибуты для каждой точки, начиная с 1
        dot.classList.add('dot');


        // сделаем первую точку активной изначально
        if (i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    }


    // Slider V.1 Простой вариант

    // showSlides(slideIndex);

    setCurrentSlide(slideIndex);

    // function showSlides(n) {

    //     // проверка граничных значений
    //     // если больше последнего, то перелистываем в начало
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }
    //     // если меньше первого то в конец
    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     // скроем все слайды
    //     slides.forEach(item => {
    //         item.classList.add('hide');
    //         item.classList.remove('show');
    //     });

    //     // нужно показать текущий
    //     slides[slideIndex - 1].classList.remove('hide');
    //     slides[slideIndex - 1].classList.add('show');

    //     // теперь нужно поработать с номером текущего слайда
    //     if (slides.length < 10) {
    //         currentSlide.textContent = `0${slideIndex}`;
    //     } else {
    //         currentSlide.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n) {
    //     // прибавляем слайд и сразу же показываем нужный слайд
    //     showSlides(slideIndex += n);
    // }

    // prevSlide.addEventListener('click', () => {
    //     plusSlides(-1);
    // });
    // nextSlide.addEventListener('click', () => {
    //     plusSlides(1);
    // });





    // Slider v2. Карусель

    // для иннера, которое занимает большое количество пространства в одну строчку
    // внтутри себя оно выстраивает слайды
    // нужно установить ширину этому блоку (ширина= все слайды * 100%)
    // делается для того, чтобы поместить все слайды во внутрь этого блока
    slidesField.style.width = 100 * slides.length + `%`;

    // выстроим слайды не вертикально ,  а горизонтально в полоску
    // конечно это все можно прописать и в css, так даже будет лучше
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    // нужно лишние элементы скрыть
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        // всем слайдам нужно установить одну ширину
        slide.style.width = slideW;
    });

    // вырываем число из строки с помощью регулярки
    const deletNotDigits = str => {
        return +str.replace(/\D/ig, '');
    };

    nextSlide.addEventListener('click', () => {
        // двигаемся вправо, нужно предусмотреть границы
        // но слайды мы перемещаем в начало
        // если это последний слайд
        // if (offset == +slideW.slice(0, slideW.length - 2) * (slides.length - 1)) { // но нужно для начала данные из sladeW вытащить число

        // UPD избавляемся от слайс с помощью регулярки
        // if (offset == +slideW.replace(/\D/ig, '') * (slides.length - 1)) {

        // используем функцию
        if (offset == deletNotDigits(slideW) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deletNotDigits(slideW);
        }

        // будем сдвигать изображения с помощью трансформа
        // двигаем влево, поэтому нужно использовать отрицательное значение
        slidesField.style.transform = `translateX(-${offset}px)`;

        // контролируем текущую нумерацию
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        setCurrentSlide(slideIndex);

        dotsProc(dots);

    });

    prevSlide.addEventListener('click', () => {
        // двигаемся назд, нужно предусмотреть границы
        // но слайды мы перемещаем уже в конец
        // если это первый слайд

        if (offset == 0) {
            // вырезаем значение пикселей с помощью регулярок
            // offset = +slideW.replace(/\D/ig, '') * (slides.length - 1); // удаляем буквы из строки
            offset = deletNotDigits(slideW) * (slides.length - 1); // удаляем буквы из строки
        } else {
            offset -= deletNotDigits(slideW);
        }

        // будем сдвигать изображения с помощью трансформа
        // двигаем влево, поэтому нужно использовать отрицательное значение
        slidesField.style.transform = `translateX(-${offset}px)`;

        // контролируем текущую нумерацию
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        setCurrentSlide(slideIndex);

        dotsProc(dots);
    });

    // функционал для клика по точке

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {

            const slideTo = e.target.getAttribute('data-slide-to');

            // индекс на кликнутую точку
            slideIndex = slideTo;

            // также нужно менять оффсет у слайдов
            // offset = +slideW.slice(0, slideW.length - 2) * (slideTo - 1);
            offset = deletNotDigits(slideW) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            setCurrentSlide(slideIndex);

            dotsProc(dots);
        });
    })


    // const sliderWripper = document.querySelector('.offer__slider-wrapper');
    // const sliderCounter = document.querySelector('.offer__slider-counter');


    // получим слайды из базы данных
    // const getSlide = async url => {

    //     const result = await axios.get(url);

    //     return await result;
    // };

    // getSlide('http://localhost:3000/slider')
    //     .then(slides => slides.data.forEach(({ img, alt }, i) => {
    //         const element = document.createElement('div');
    //         element.classList.add('offer__slide', 'hide');

    //         if (i === currentSlide) {
    //             element.classList.remove('hide');
    //             element.classList.add('show');
    //         }

    //         element.innerHTML = `
    //                 <img src=${img} alt=${alt}>
    //             `;

    //         sliderWripper.append(element);
    //         totalSlide++;
    //         console.log(totalSlide);
    //     }));
    // console.log(totalSlide);

});
