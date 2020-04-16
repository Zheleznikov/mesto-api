# 15 задание в Яндекс.Практикуме
#### (Деплой сервера на Яндекс.Облако)

Сервер располагается по адресу: 
- https://api.mestoapp.ga/ 
- http://api.mestoapp.ga/
- 84.201.167.3

### Основные моменты:
- деплой серверной части проекта `Mesto` на Яндекс.Облако;
- установка всего необходимого.

### Чеклист задания:
- все ошибки обрабатываются централизованно;
- тела запросов и, где необходимо, заголовки и параметры, валидируются по определённым схемам. Если запрос не соответствует схеме, обработка не передаётся контроллеру и клиент получает ошибку валидации;
- все запросы и ответы записываются в файл request.log;
- все ошибки записываются в файл error.log;
- файлы логов не добавляются в репозиторий;
- к серверу можно обратиться по публичному IP-адресу 84.201.167.3
- к серверу можно обратиться по https://api.mestoapp.ga/ и по http://api.mestoapp.ga/
- секретный ключ для создания и верификации JWT хранится на сервере в .env файле. Этот файл не добавляется в git;
- в режиме разработки (когда process.env.NODE_ENV !== 'production') код запускается и работает без наличия .env файла;
- сервер самостоятельно восстанавливается после GET-запроса на URL /crash-test;

### Дополнительно:
- По ссылке https://mestoapp.ga/ располагается фронтенд проекта;

## Что с этим делать?
На сервер можно посылать запросы, например, через программу postman.
Во избежание недоразумений лучше делать все запросы с заголовками:
	
    Accept: application/json
    Content-Type: application/json
    

#### Обязательные запросы
Чтобы отправка запросов имела смысл и приносила удовольствие нужно сделать два обязательных запроса.
- Первый - на создание пользователя:

`/signup` метод POST
В теле запроса нужно отправить объект вида:
	
    {
      "name": "My name",
      "about": "My info",
      "avatar": "https://web-site.com/myavatar.jpg",
      "email": "mymail@domain.ru",
      "password": "1234!@#$"
    }
       
- Второй запрос для того чтобы залогиниться:

`/signin` метод POST
В теле запроса нужно отправить объект вида:

    {
      "email": "mymail@domain.ru",
      "password": "1234!@#$"
    }

Дальше можно отправлять запросы в любом порядке.

#### другие запросы
##### GET
- `/users` - получить список всех пользователей;
- `/users/userId` - получить пользователя по id;
- `/cards` - получить список всех карточек;

##### POST
- `/cards` - добавить карточку;

В теле запроса нужно отправить объект вида:

    {
      "name": "Beatiful place",
      "link": "https://nice-pictures.com/beatifulplace.jpg"
    }

##### PUT
- `/cards/:cardId/likes` - поставить лайк;

##### DELETE
- `/cards/:cardId` - удалить карточку (можно удалить только карточку, которую добавил текущий пользователь);
- `/cards/:cardId/likes` - убрать лайк;

##### PATCH 
- `/users/me` - обновить данные о себе;

В теле запроса нужно отправить объект вида:

    {
      "name": "New name",
      "about": "I change my mind, now I'm..."
    }

- `/users/me/avatar` - обновить свой аватар;

В теле запроса нужно отправить объект вида:

    {
      "avatar": "https://web-site.com/reallycoolavatar.jpg"
    }







