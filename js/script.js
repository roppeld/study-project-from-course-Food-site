"use script";

window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'), //список названий меню
        tabsContent = document.querySelectorAll('.tabcontent'), //картинка опредленного меню и его описание
        tabsParent = document.querySelector('.tabheader__items'); //родитель, в котором находится список названий меню

    function hideTabContent() { //функция скрытия картинок меню с их описанием, проходимся по псевдомассиву
        tabsContent.forEach(item => { //циклом forEach и на каждом элементе ставим запрет на демонстрацию
            item.style.display = 'none'; //обращаемся к свойствам атрибута, меняем значение
        });

        tabs.forEach(tab => { //проходим по списку названий меню
            tab.classList.remove('tabheader__item_active'); //убираем класс, если он там есть
        });
    }

    function showTabContent(i = 0) { //функция показа определенного контента, по умолчанию это самый первый
        tabsContent[i].style.display = 'block'; //обращаясь к конкретному элементу в псевдомассиве меняем свойство стиля
        tabs[i].classList.add('tabheader__item_active'); //и присваиваем класс, показывающий, что именно этот элемент сейчас активен
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => { //присваивание события после клика на название меню, путем делегирования этих функций от родителя
        const target = event.target; //переменная для облегчения пользования
        //event.target - элемент события, который совершенно точно был нами кликнут
        if (target && target.classList.contains('tabheader__item')) { //проверка на объект клика и наличия у этого объекта нужного класса
            tabs.forEach((item, i) => { //по циклу, обращаясь ещё разок к списку меню, порождая два аргумента
                if (target == item) { //сравниваем кликнутый объект с тем, что есть в псевдомассиве, при совпадении
                    hideTabContent(); //обнуляем свойства в контенте на демонстрацию и убираем всё лишнее и ненужное 
                    showTabContent(i); //указываем вторым аргументом, исходя из того, какая это итерация в цикле, какой именно контент            
                } //надо показать пользователю
            });
        }
    });

    //Timer

    //создаем дедлайн, до которого должен работать счётчик
    const deadline = '2021-03-29';

    function getTimeRemaining(endTime) { //функция, вычисляющая остаток до дедлайна и расписывающая по переменными значения
        //свычисляем разницу между дедлайном и текущим временем
        const offer = Date.parse(endTime) - Date.parse(new Date()),
            //выводим количество дней, путем нахождения миллисекунд в дне, а потом разделения имеющихся милисекунд на это число     
            days = Math.floor(offer / (1000 * 60 * 60 * 24)), //floor - округляет число вниз, т.е. просто откидывается хвост, без увеличения целого
            hours = Math.floor((offer / (1000 * 60 * 60) % 24)), //берем общее кол-во милисекунд и делим на кол-во милисек в часе и не даем выйти 
            //за пределы 24 часов 
            minutes = Math.floor((offer / 1000 / 60) % 60), //идентично
            seconds = Math.floor((offer / 1000) % 60);

        return { //чтобы вернуть созданные внутри функции переменные, возвращаем из функции объект
            'total': offer, //с созданными внутри него функциями с помещенными туда значениями - нашими переменными
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) { //функция помощник, добавляющая 0 перед каждой единичной цифрой
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) { //функция установки таймера на сайт
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); //сначала апдейтнуть, потом уже устанавливать

        function updateClock() { //когда функция запустится она расчитает нужное нам время и на основании этих сведений
            const t = getTimeRemaining(endTime); //занесенных в объект, она распихает это по нужным местам на странице

            days.innerHTML = getZero(t.days); //обращаемся к тегу HTML с указанным айдишником и ставим туда значение
            hours.innerHTML = getZero(t.hours); //значение заносится туда, взятое из вынесенного объекта, обращаясь к его свойствам
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) { //если общее количество милисекунд подошло к нулю, исходя из сравнений с дедлайном. то остановить таймер
                clearInterval(timeInterval); //а то пойдут минусовые значения
            }
        }
    }

    setClock('.timer', deadline);

    //Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'), //кнопки с разными классами, но одним дата атрибутом
        modal = document.querySelector('.modal');

    function modalOpen() { //выцепленные по дата атрибутам кнопки здесь получают свое событие
        modalTrigger.forEach(item => {
            item.addEventListener('click', openModal);
        });
    }

    function openModal() { //вынесенный в отдельную функцию функционал открытия модального окна
        modal.classList.add('show');
        modal.classList.remove('hide');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; //запрет на скролинг при открытом окне
        clearInterval(modalTimer);//при первом открытии таймер обнуляется, незачем снова показывать окно
    }

    function closeModal() { //вынесеный в отдельную функцию функционал закрытия модального окна
        modal.classList.remove('show');
        modal.classList.add('hide');
        modal.style.display = 'none';
        document.body.style.overflow = ''; //скролинг выставляется по умолчанию, уже на решение браузера
    }

    function modalCancel() {

        modal.addEventListener('click', (event) => { //вешаем событие закрытия модального окна, при клике на
           //любое место подложки, т.е. родителя элемента и если кликнули на крестик, в котором произошла такая глупая проверочка
            if (event.target === modal || event.target.getAttribute('data-close') == '') { //чтобы заставить после этого происходить закрытию
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => { //закрытие модального окна кнопкой Esc
            if (event.code === 'Escape' && modal.classList.contains('show')) { //чтобы событие срабатывало
                closeModal(); //только если модальное окно открытое
            }
        });

    }

    const modalTimer = setTimeout(openModal, 120000);//таймер появлеия модельного окна после 2 минут

    function showModalWindowByScroll() { //pageYOffset отслеживает сколько пикселейй отлистал пользователь
        //по оси Y - горизонтальная ось. от которой идет отсчёт до самого верха
        if (window.pageYOffset + document.documentElement.clientHeight === document.documentElement
            .scrollHeight) { //плюсуем отскроленное вверх с имеющимся сейчас на экране перед пользователем
            openModal(); //после того как сумма равна всей высоте элемента с учетом невидимого - открываем окно
            window.removeEventListener('scroll', showModalWindowByScroll); //убираем скролл как только докрутили
            //первый раз
        }
    }

    window.addEventListener('scroll', showModalWindowByScroll); //вешаем событие показа модального окна 
    //при скроле страницы

    modalOpen();
    modalCancel();

    //Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {//конструктор нашего объекта для 
            this.src = src;//создания карточки на сайте
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;//передаваться будет массив и работаnь надо с этим как с массивом
            this.parent = document.querySelector(parentSelector);//вносим свойство куда будет вноситься нужный нам селектор, куда мы захотим внести созданный объект
            this.transfer = 27;
            this.changeToUAH();//можно прямо в констукторе вызвать метод принадлежащий классу, а занчит и экземпляру класса для манипуляции над значениями свойств объекта
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {//работа по созданию элемента и наполнением его тэгами и добавлению элемента на страницу 
            const element = document.createElement('div'); //создание элемента пока ещё в файле джаваскрипта его последующее наполнение через innerHTML
            //чтобы сразу создавать не тупо div, а нужный класс, надо присваивать menu__item div
            //но чтобы не было ошибок при отсутствии классов, вручную прописываем проверку
            if (this.classes.length === 0) {//чтобы не работать с элементом массива, добавим вручную нужный класс строкой
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {//если всё-таки хоть один класс имется в массиве, то через цикл передать каждый элемент в переменную element
            this.classes.forEach(classNames => element.classList.add(classNames));//тогда сразу будем без лишнего div создавать нужный класс
            }
            element.innerHTML = ` 
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
             `;
            this.parent.append(element);//добавление этого созданного элемента в верстку используя свойство parent как адрес, куда добавлять
        }
    }

    const getResource = async (url) => {//ключевое слово async сообщает, что внутри будет какой-то асинхронный код
        const res = await fetch(url);//парный оператор, он дает понять, что выполнение этого действия нужно дождаться

        if (!res.ok) {
            throw new Error(`Coould not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();//здесь тоже дождаться, пока произойдет декодирование из формата json
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
            // data.forEach(({img, altimg, title, descr, price}) => {
            //     new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu') //используя библиотеку axios делаем тоже самое 
        .then(response => {
            response.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/054 spinner.svg',
        success: 'Спасибо! Мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {//ключевое слово async сообщает, что внутри будет какой-то асинхронный код
        const res = await fetch(url, {//его парный оператор await указывается воле тех операций, окончания которых 
            method: "POST",//надо дождаться 
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();//здесь тоже дождаться, пока произойдет форматирование в json
    };

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form); //объект formdata надо превратить в формат json

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            //все данные из формы мы добавили в массив массивов, где ключ/значение переделывают в массив двух элементов
            //а потом из этого массива создали объект, а его переформатировали в JSON
            //позже в функцию postData() второй аргумент заменили на реультат константы, идеальная универсальность

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    const backToNormal = () => {
        setTimeout(() => {
            backToForm();
            closeModal();
        }, 2000);
    };

 
    const previousModalDialog = document.querySelector('.modal__dialog'),
          thanksModal = document.createElement('div');

    function showThanksModal(message) {

        previousModalDialog.classList.add('hide');
        previousModalDialog.classList.remove('show');
        previousModalDialog.style.display = 'none';
        openModal();

        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class ="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);
        backToNormal();
    }

    function backToForm() {
        thanksModal.remove();
        previousModalDialog.classList.remove('hide');
        previousModalDialog.classList.add('show');
        previousModalDialog.style.display = 'block';
    }

    fetch('http://localhost:3000/menu')
       .then((data) => data.json())//распаковка из json формата с помощью метода json()
       .then((res) => console.log(res));
});