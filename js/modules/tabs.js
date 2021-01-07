function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {

    // Создание табов на странице
    const tabs = document.querySelectorAll(tabsSelector);
    const tabsContent = document.querySelectorAll(tabsContentSelector);
    const tabsParent = document.querySelector(tabsParentSelector); // родитель для делегирования событий

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
    }
    function showTabContent(i = 0) {

        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);

    }

    hideTabContent();
    showTabContent();

    // с помощью делегирования событий сделаем обработчик
    tabsParent.addEventListener('click', (event) => {

        const target = event.target;

        // tabsSelector.slice(1) - так как мы в аргументе передавали селектор(точка в начале),
        // тут нужно ее вырезать, уберем с помощь slice(1) - первый символ
        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

// используем синтаксис common js
// module.exports = tabs;

// экспортируем по стандарту ES6
export default tabs;
