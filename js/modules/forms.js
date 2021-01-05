function forms() {
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
}

module.exports = forms;
