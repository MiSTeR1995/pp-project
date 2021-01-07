import {getResource} from '../services/services';

function cards() {

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

    // избавляемся от лишних кусков кода и создаем карточки с помощью функции и базы данных
    getResource('http://localhost:3000/menu')
        // придет обычный объект, не json и можем сразу его использовать
        // а там лежит обычный массив из объектов (см. базу данных)
        .then(data => {
            // также желательно использовать синтаксис деструктуризации объекта
            // когда из объекта вытаскиваются отделньые свойства в качестве отдельной переменной
            data.forEach(({title, descr, price, img, altimg}) => {
                // конструктор наших карточек. Он будет создаваться столько раз
                // сколько будет объектов в этом массиве, который приешл с сервера
                // в конструктор передадим свойства объекта

                new MenuCard(title, descr, price, img, altimg,'.menu .container')
                .render();
            });
        });
}

// module.exports = cards;

// экспортируем по стандарту ES6
export default cards;





 // Вариант с использовнием axios.

    // axios.get('http://localhost:3000/menu')
    //     .then(data => {
    //         // обратиться нужно к свойству data у полученного объекта (в нашем случае тофтология - data у объекта data)
    //         data.data.forEach(({ title, descr, price, img, altimg }) => {
    //             new MenuCard(title, descr, price, img, altimg, '.menu .container')
    //                 .render();
    //         });
    //     });


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
