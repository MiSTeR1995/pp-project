function calc() {
    // Калькулятор рассчета каллорий

    const ccalResult = document.querySelector('.calculating__result span');
    // также зададим некоторые дефолтные параметры

    let sex, height, weight, age, ratio; // ratio будем получать из data аттрибутов

    // UPD: Используем локальное хранилище
    // 1) нужно проверить вообще есть ли что-то в локальном хранилище
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    // тоже самое делаем для ratio
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }


    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            // id от блока с активностью сюда не попадут, так как их тупо
            // не будет в локальном хранилище и это условие будет всегда
            // срабатывать на блок с выбором пола
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        })
    }

    // проинициализируем данные с локального хранилища
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    // функция по подсчету, причем запускать будем каждый раз, когда пользователь
    // что-то изменил в калькульяторе, чтобы их пересчитать нормально
    function calcTotal() {

        // для начала нужно проверить заполненность полей
        if (!sex || !height || !weight || !age || !ratio) {
            ccalResult.textContent = '____';
            return;
        }

        // если все в порядке, то считаем дальше
        // но ориентируясь на пол
        if (sex === 'female') {
            // формулы взяты из специальной статьи
            // чтобы не поехала верстка сделаем округление
            ccalResult.textContent = Math.round(
                (447.2 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio
            );
        } else {
            ccalResult.textContent = Math.round(
                (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio
            );
        }
    }

    // сразу же ее вызовем, чтобы показать пользователю, что он еще не ввел данные
    // впоследствии вызывается в конце каждой функции по вводу новых данных
    calcTotal();

    // Для начала получим данные со статического контента
    // это дивы без value с дата-атрибутами или айди

    function getStaticInfo(selector, activeClass) {
        // получаем все дивы внутри родителя
        // const elements = document.querySelectorAll(`${parentSelector} div`);

        // UPD: т.к делигированием не пользуемся, то смысла в родителе нет
        const elements = document.querySelectorAll(selector);
        // также мы будем отслеживать клики по родителю, это делегирование событий (удалено)
        // UPD: делегирование событие неприменимо здесь, оно ломает верстку.
        // поэтому нужно на каждый назначать отдельно, чтобы не ломалась верстка

        elements.forEach(elem => {
            elem.addEventListener('click', e => {
                // проверяем элемент. есть ли у него аттрибут
                if (e.target.getAttribute('data-ratio')) {
                    // вытаскием этот же атрибут ( в верстке мы указали это значение)
                    ratio = +e.target.getAttribute('data-ratio');
                    // запоминаем выбор пользователя через локальное хранилище
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                }
                // а это уже относится по клику на пол
                else {
                    // вытащим айдишник
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));

                }

                // поработаем с классами активности
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            })
        });
    }
    // теперь ее нужно два раза запустить с различными элементами
    // UPD: т.к обращаемся напрямую к селекторам, то тут нужно добавить div
    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    // функция по обработке инпутов (динамического контента)

    function getDynamicInfo(selector) {
        // получим тот инпут с которым будем работать
        const input = document.querySelector(selector);

        // обработчик события на инпут
        input.addEventListener('input', () => {

            // если в инпуте что-то кроме чисел, то укажем на это
            // делаем с помощью регулярок
            if (input.value.match(/\D/g)) {
                // подсветим инпут красным цветом
                input.style.border = '1px solid red';
            } else {
                // если все ок, то уберем подсветку
                input.style.border = 'none';
            }

            // проверяем куда пишет пользователь
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            // поместит именно сюда, чтобы после исправления пересчитывалось вновь
            // иначе не будет работать
            calcTotal();
        });


    }

    // вызовем эту функцию с тремя разными селекторами, тем самым навесив на них
    // обработчики событий
    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}

// commonJS синтаксис
// module.exports = calc;

// экспортируем по стандарту ES6
export default calc;
