function slider() {
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
    });
}

module.exports = slider;
