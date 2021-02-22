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
           tab.classList.remove('tabheader__item_active');//убираем класс, если он там есть
        });
    }

    function showTabContent(i = 0) { //функция показа определенного контента, по умолчанию это самый первый
        tabsContent[i].style.display = 'block'; //обращаясь к конкретному элементу в псевдомассиве меняем свойство стиля
        tabs[i].classList.add('tabheader__item_active');//и присваиваем класс, показывающий, что именно этот элемент сейчас активен
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {//присваивание события после клика на название меню, путем делегирования этих функций от родителя
        const target = event.target;//переменная для облегчения пользования
//event.target - элемент события, который совершенно точно был нами кликнут
        if (target && target.classList.contains('tabheader__item')) {//проверка на объект клика и наличия у этого объекта нужного класса
            tabs.forEach((item, i) => {//по циклу, обращаясь ещё разок к списку меню, порождая два аргумента
               if (target == item) {//сравниваем кликнутый объект с тем, что есть в псевдомассиве, при совпадении
                hideTabContent();//обнуляем свойства в контенте на демонстрацию и убираем всё лишнее и ненужное 
                showTabContent(i);//указываем вторым аргументом, исходя из того, какая это итерация в цикле, какой именно контент            
               }//надо показать пользователю
            });
        }
    });

    //Timer

    //создаем дедлайн, до которого должен работать счётчик
    const deadline = '2021-03-29';

    function getTimeRemaining(endTime) {//функция, вычисляющая остаток до дедлайна и расписывающая по переменными значения
        //свычисляем разницу между дедлайном и текущим временем
        const offer = Date.parse(endTime) - Date.parse(new Date()),
         //выводим количество дней, путем нахождения миллисекунд в дне, а потом разделения имеющихся милисекунд на это число     
              days = Math.floor(offer / (1000 * 60 * 60 * 24)), //floor - округляет число вниз, т.е. просто откидывается хвост, без увеличения целого
              hours = Math.floor((offer / (1000 * 60 * 60) % 24)),//берем общее кол-во милисекунд и делим на кол-во милисек в часе и не даем выйти за пределы 24 часов 
              minutes = Math.floor((offer / 1000 / 60) % 60),//идентично
              seconds = Math.floor((offer/ 1000) % 60);
              
        return { //чтобы вернуть созданные внутри функции переменные, возвращаем из функции объект
            'total': offer, //с созданными внутри него функциями с помещенными туда значениями - нашими переменными
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {//функция помощник, добавляющая 0 перед каждой единичной цифрой
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) {//функция установки таймера на сайт
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

              updateClock();//сначала апдейтнуть, потом уже устанавливать

        function updateClock() {//когда функция запустится она расчитает нужное нам время и на основании этих сведений
            const t = getTimeRemaining(endTime);//занесенных в объект, она распихает это по нужным местам на странице

            days.innerHTML = getZero(t.days); //обращаемся к тегу HTML с указанным айдишником и ставим туда значение
            hours.innerHTML = getZero(t.hours);//значение заносится туда, взятое из вынесенного объекта, обращаясь к его свойствам
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {//если общее количество милисекунд подошло к нулю, исходя из сравнений с дедлайном. то остановить таймер
                clearInterval(timeInterval);//а то пойдут минусовые значения
            }
        }
    }

    setClock('.timer', deadline);

    //Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalClose = document.querySelector('[data-close]');
          
    function modalOpen() {
        modalTrigger.forEach(item => {
           item.addEventListener('click', openModal);
        });
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    }

    function closeModal() {
        modal.classList.remove('show');
            modal.classList.add('hide');
            modal.style.display = 'none';
            document.body.style.overflow = '';
    }

    function modalCancel() {
        modalClose.addEventListener('click', closeModal);

        modal.addEventListener('click', (event) => {//
           if (event.target === modal) {
            closeModal();
           }
        });

        document.addEventListener('keydown', (event) => {//закрытие модального окна кнопкой Esc
            if (event.code === 'Escape' && modal.classList.contains('show')) {//чтобы событие срабатывало
                closeModal();//только если модальное окно открытое
            }
        });
    }

    const modalTimer = setTimeout(openModal, 120000);

    function showModalWindowByScroll() {//pageYOffset отслеживает сколько пикселейй отлистал пользователь
        //по оси Y - горизонтальная ось. от которой идет отсчёт до самого верха
        if (window.pageYOffset + document.documentElement.clientHeight === document.documentElement
            .scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalWindowByScroll);
        }
    }

    window.addEventListener('scroll', showModalWindowByScroll);

    modalOpen();
    modalCancel();
});