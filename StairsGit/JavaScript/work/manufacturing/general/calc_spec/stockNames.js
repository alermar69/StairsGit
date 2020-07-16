function getStockNames(){

var stockNames = [
'Кронштейн крепления ног к секциям',
'Кронштейн поручня П-образный для стойки 20х20',
'У5-60х60х100 краш.',
'Уголок балясины 3мм',
'Уголок каркаса У4-60х60х100',
'Уголок каркаса У4-70х70х100',
'Уголок каркаса У5-60х60х100',
'Уголок ступени У2-40х40х160',
'Уголок ступени У2-40х40х200',
'Уголок ступени У2-40х40х230',
'Уголок ступени У2-40х40х90',
'Опора площадки  A=240 (2 ступ.)',
'Опора площадки  A=420 (3 ступ.)',
'Опора площадки  A=600 (4 ступ.)',
'Опора площадки  A=780 (5 ступ.)',
'Опора площадки  A=960 (6 ступ.)',
'Пластина 190х1224',
'Основание кованой балясины',
'Регулируемая опора 120',
'Стойка краш. 1000мм. 40х40 бок. крепление',
'Стойка нерж. 1000 мм  304',
'Стойка нерж. 1050 мм  201',
'Стойка нерж. 40х40 бок. крепление 950 мм AISI304',
'Поручень 40х20 краш. L=3000',
'Ригель 20х20 краш. L=3000',
'Стойка краш. 40х40 с фланцем',
'Стойка краш. 950 мм. 40х40 бок. крепление',
'Стойка нерж 1000мм 201',
'Стойка нерж. 40х40 бок. крепление 950 мм 201',
'Стойка нерж. 40х40 бок. крепление 950 мм 304',
'Стойка нерж. 40х40 с фланцем 830 мм 201',
'Стойка нерж. 40х40 с фланцем 830 мм 304',
'Рамка под ДПК 1000мм',
'Рамка под ДПК 600мм',
'Рамка под ДПК 800мм',
'Ступень рифленая оцинк. 1000х280',
'Ступень рифленая оцинк. 1200х280',
'Ступень рифленая оцинк. 600х200',
'Ступень рифленая оцинк. 750х210',
'Ступень рифленая оцинк. 900х250',
'Пластина 165х300 краш.',
'Пластина 165х600 краш.',
'Пластина 165х900 краш.',
'Пластина 190х1016 краш. задняя',
'Пластина 190х300 краш. (комплект 2шт)',
'Пластина 190х600 краш. (комплект 2шт)',
'Пластина 190х900 краш. (комплект 2шт)',
'Площадка средняя 165х300мм',
'Регулируемая опора краш.',
'Соед. фланец 8 мм.',
'Тетива Т-180-2 бок (комплект 2 шт)',
'Тетива Т-180-2 сред',
'Тетива Т-180-3 бок (комплект 2 шт)',
'Тетива Т-180-3 сред',
'Тетива Т-180-4 бок (комплект 2 шт)',
'Тетива Т-180-4 сред',
'Тетива Т-180-5 бок (комплект 2 шт)',
'Тетива Т-180-5 сред',
'Тетива Т-180-6 бок (комплект 2 шт)',
'Тетива Т-180-6 сред',
'ADA Wall Scanner 80 - детектор металла, проводки и дерева',
'Metabo SXE 3150 эксцентриковая шлифмашина',
'Автомобильный компрессор',
'Аппарат порошковой покраски',
'Баллон аргон 10 л',
'Баллон аргоновый 40 л',
'Баллон кислородный 40 л',
'Баллон пропан 50 л',
'Баллон углекислотный 40 л',
'Видеокамера Panasonic HC-V100.',
'Газовая горелка',
'Гайковерт пневматический КАЛИБР',
'Горелка аргоновая',
'Гравёр Дремель АГ 170',
'Длинная торцевая ударная головка 17мм',
'Домкрат автомобильный',
'Дрель Makita  DF 331',
'Дрель Интерскол ДУ13/780ЭР',
'Дрель (китай)',
'Заклепочник резьбовой',
'Заточной станок для сверл (Китай)',
'Измеритель влажности древесины Hydro Easy',
'Источник плазмотрона CUT-100H',
'Камера (печь) порошковой покраски',
'Клупп электрический REMS',
'Компрессор FUBAG В5200В/100 СТ4',
'Компрессор REMEZA CB-4/C-100LB75',
'Компрессор REMEZA CB-4/Ф-500.LT100-11.0',
'Копировально-токарный станок КТФ-7',
'Коронка с алмазным покрытием 20 мм',
'Краскопульт пневм. Walcom Slim S HVLP',
'Краскопульт пневматический',
'Лазерный дальномер Bosch PLR25',
'Лентопильный станок JET MBS-712',
'Лентопильный станок JET MBS-910-DAS',
'Ленточнопильный станок JET JWBS-16X',
'Ленточношлифовальный станок JET EHVS-80',
'Лестница алюминиевая 2-х секционная',
'Лобзик аккумуляторный MAKITA JV100DWE',
'Лобзик электрический BOSCH GST 150 BCE',
'Магнитный сверл. станок ECO.30',
'Маска сварщика',
'Масло компрессорное 1 л.',
'Машинка для полировки краски Makita',
'Мешок для мусора MAKITA',
'Набор головок Dexell 54 предмета, пластиковый ящик.',
'Набор ключей шестигранных 1,5-10мм  9 шт.',
'Наждак DELMAXX DS-150/200',
'Наждак ДИОЛД ЭТ-250',
'Наждак ЗУБР ЗТШМ-200',
'Наждак синий ДИОЛД ЭТ-175',
'Ножницы для тонкого металла электрические (китай)',
'Ножницы по металлу ручные GROSS',
'Обогреватель инфракрасный BALLU потолочный',
'Осушитель воздуха ARIACOM AR60',
'Паста полировальная (зеленая)',
'Перфоратор Einhell RT-RH20/1',
'Перфоратор Makita HR2470',
'Перфоратор Makita SDS -max',
'Пила дисковая электрическая FESTOOL TS 55',
'Пила дисковая электрическая MAKITA 5008MG',
'Пила усовочная MAKITA LS1040',
'Пирометр',
'Пистолет для хим. анкера',
'Пистолет обдувочный EURO 770-872',
'Пневмомолоток + 4 зубила SUMAKE ST-2310/H',
'Подошва сменная MAKITA Ф125',
'Прожектор на штативе до 2м 2хR7sх500Вт, 220В, желтый',
'Профилегиб (вальцы) синий для обечаек',
'ПШМ Makita GD0800C',
'ПШМ большая (китай) REBIR TSM1-150',
'Пылесос Интерскол ПУ-45/1400',
'Разъемное соединение рапид муфта 1/4"М наруж.резьба 180100',
'Разъемное соединение рапид штуцер 1/4"М наруж.резьба 180140',
'Распылитель порошковых красок Старт 50',
'Регулятор расхода аргона АР-40-2ДМ',
'Резак газовый + шланги 10м',
'Рейсмусовый станок JET JWP-160S',
'Рукав греющий',
'Рулетка 5м х 18 мм',
'Сварочный аппарат',
'Сварочный аппарат аргоновый TIG 203AC/DC Pulse',
'Сварочный полуавтомат INVERMIG 203',
'Сварочный полуавтомат INVERMIG 205',
'Сверлильно-присадочный станок ALTESA MULTIMAT 21',
'Сверлильный станок большой СССР',
'Сверлильный станок малый СССР',
'Сверло 3,2',
'Станок зачистной ленточный JET JBSM-75',
'Станок настольный шлифовальный JET JSG64',
'Станок токарный по металлу 1К62',
'Станок фрезерный с ЧПУ большой с вытяжкой КОРВЕТ 64',
'Станок фрезерный с ЧПУ малый',
'Стекловозка двусторонняя большая',
'Стеллаж для готовых изделий на колесах',
'Стеллаж для сушки готовых изделий',
'Стеллаж цеховой для профиля и готовых лестниц, разборный',
'Стремянка композит. синяя на 6 ступеней',
'Стремянка сталь 4 ступени с рез. ковриками Серая',
'Стремянка сталь синяя на 4 ступени',
'Стремянка Эйфель алюмин. на 6 ступеней',
'Струбцина F-образная 120х500мм',
'Струбцина F-образная кованая 80х450мм',
'Стружкосос JET 1,1кВт DC-1100CK',
'Стружкосос (пылесос) 5,5 кВт на 2 мешка с фильтрами',
'Стружкосос (пылесос) КАМИ 5,5 кВт на 2 мешка',
'Тележка гидравлическая (Рокла)',
'Тепловая завеса BALLU 5кВт',
'Тепловая завеса TIMBERK 9кВт',
'Тиски станочные для сверления',
'Торцовочная пила Metabo KGS305M',
'Трубогиб ручной RIDGID ф12',
'Трубогиб ручной RIDGID ф16',
'Угломер ADA электронный',
'Угольник магнитный большой до 34 кг.',
'Угольник магнитный малый до 11 кг.',
'Угольник магнитный средний до 22 кг.',
'Угольник столярный 250мм нерж. КОБАЛЬТ',
'Универсальная шлифмашина Riobi RMS180-SA30',
'Уровень антиударный магнитный 400мм',
'Уровень лазерный SKIL (в компл. штатив+очки)',
'Уровень лазерный X-LINE HELPER 2D',
'Устройство для подг. сжатого возд. (фильтр воды)',
'УШМ 125 Makita',
'УШМ 125 Makita с регул.оборотов',
'УШМ 230 DeWALT',
'Фен строительный STURM HG2003LCD',
'Фильтр воздушный для компрессора LT 100',
'Фильтр воздушный для компрессора СБ4/С-100.LB75',
'Форматно-раскроечный станок FORMA MJ1132G-01',
'Фотоаппарат SONY DSC-W530',
'Фреза кольцевая ф18(магнитка)',
'Фреза кольцевая ф 52(магнитка)',
'фреза концевая 120 гр для резьбы',
'фреза концевая 60 гр для резьбы',
'фреза концевая галтельная d8',
'фреза пазовая фасонная r12',
'фреза пазовая фасонная фигурная',
'фреза чпу 6 мм',
'Фрезе пазовальный FESTOOL DOMINO 500',
'Фрезер Makita 3709',
'Фрезер MAKITA PJ7000',
'Фрезер кромочный Makita RT 0700 C',
'Фрезерный станок JET JWS-34KX',
'Фрезер присадочный FELISATTI RF12/710',
'Фрезер ручной MAKITA 3709',
'Фрезер ручной MAKITA M3601',
'Фрезер ручной MAKITA RP1800F',
'Фрезер ручной MAKITA RP2300FC',
'Фуганок JET JJ-866HH',
'Фуганок КОРВЕТ-106',
'Циркулярный станок JET JTS-315SP',
'Цифровой уклономер Bosch DNM 60 L',
'Шланг спиральный 6*10мм 10 м',
'Шлифлисты Riobi SMS30A',
'Шлифмашина ленточная MAKITA 9404',
'Шлифмашина орбитальная пневмо. FUBAG SL150CV',
'Шлиф машинка Suhner барабанный',
'Шлиф машинка Suhner Жираф',
'Шлифовально-калибровальный станок MOTIMAC SR-RP700',
'Шлифовальный станок щеточный MSS  MSE-MINI-1',
'Штатив 1м (китай)',
'Штатив большой',
'Шуруповерт BOSCH GSR 12-2',
'Шуруповерт MAKITA 6271D 12v',
'Эксцентриковая шлифмашина MAKITA BO5031',
'электрод вольфрам 2.0',
'DX 986 Растворитель для морилок (25 л)',
'Ацетон 10л.',
'Ведро п/эл 3л',
'Грунт ПУ fpu20.25',
'Каталог покрытий на металле Color Collection',
'Краска аэрозольная RAL7011 400мл.',
'Краска аэрозольная RAL9005 400мл.',
'Краска аэрозольная RAL9016 400 мл.',
'Краска порошк. 410 (серебристо-черный антик)',
'Краска порошк. 7011 (темно-серая)',
'Краска порошк. 7040 (серая шагрень)',
'Краска порошк. 8017 (коричневая шагрень)',
'Краска порошк. 9005 (черная шагрень)',
'Краска порошк. 9016 (белая шагрень)',
'Краска порошк. W002 (белое серебро антик)',
'Краска порошк. W005 (лак )',
'Краска порошк. Бежевая ящерица',
'Краска порошк. Н-424 (медный антик)',
'Краска порошк. ПУ Коричневая ящерица 8017',
'Краска порошк. ПУ черная ящерица 9005',
'Лак безареольный аэразоль',
'Лак ПУ матовый opug91g20.25',
'Мерный стакан 0,75 л.',
'Мерный стакан 2,3 л.',
'Отвердитель ct23nor.12',
'Отвердитель ctn52.12',
'Разбавитель dpu800.25',
'Растворитель 646',
'Ситечко 190 мк',
'ХМ8000/72 Морилка-черный',
'ХМ8000/76 Морилка-венге',
'ХМ8000/84 Морилка-орех бреннерский',
'ХМ8000/87 Морилка-старинный орех 1л',
'ХМ8000/88 Морилка-коричневый орех',
'ХМ8000/92 Морилка-орех',
'ХМ8000/93 Морилка-светлый орех',
'ХМ8000/96 Морилка-розовое дерево',
'DB4461Zn/400 Направляющие шариковые, скрытого монтажа',
'RS410EAB.4/128 Ручка мебельная',
'Заглушка самоклеящаяся d=14мм, цвет Бежевый',
'Заглушка самоклеящаяся d=14мм, цвет - Белый',
'Заглушка самоклеящаяся d=14мм, цвет Бук',
'Заглушка самоклеящаяся d=14мм, цвет Венге',
'Заглушка самоклеящаяся d=14мм, цвет Груша',
'Заглушка самоклеящаяся d=14мм, цвет Дуб',
'Заглушка самоклеящаяся d=14мм, цвет Дуб молочный',
'Заглушка самоклеящаяся d=14мм, цвет Махагон',
'Заглушка самоклеящаяся d=14мм, цвет Металлик',
'Заглушка самоклеящаяся d=14мм, цвет Натур. береза',
'Заглушка самоклеящаяся d=14мм, цвет Орех итальянский',
'Заглушка самоклеящаяся d=14мм, цвет Орех красный',
'Заглушка самоклеящаяся d=14мм, цвет Орех светлый',
'Заглушка самоклеящаяся d=14мм, цвет Серый',
'Заглушка самоклеящаяся d=14мм, цвет Черный',
'Дюбель 6х30 мм',
'Комплект колес для дверных рамок (2шт. + 2  шт.) с крепежом',
'Конфирмат мебельный Ф5х50 бел.',
'Ножка М8 под усовую гайку',
'Саморез для сборки дверей Ф6х35 внутр.шестигр.оцинк.',
'Саморез потай оцинкованный 4х16, хром',
'Саморез потай оцинкованный 4х25, хром',
'Саморез потай оцинкованный 4х30, хром',
'Саморез потай оцинкованный 4х35, хром',
'Саморез потай оцинкованный 4х40, хром',
'Саморез потай оцинкованный 4х50, хром',
'Саморез потай оцинкованный 4х60, хром',
'Скотч двусторонний Unibob 50мм х 10м',
'Стопор для колёс нижний, жестяной',
'Уплотнитель резиновый 4мм, м.п.',
'Усовая гайка М8, без усов',
'Шкант 6х30',
'Шкант Ф8х30',
'Шлегель СЕРЫЙ, м.п.',
'Эксцентрик мебельный ф15х12,5мм + стойка-саморез L=45мм',
'Доводчик для метабокса Boyard DM02',
'Метабокс Boyard MB150/500 (белый)',
'Уголок полкодержатель, цвет никель',
'Уголок полкодержатель, цвет темная бронза',
'Выдвижная штанга хром, 300мм',
'Выдвижная штанга хром, 350мм',
'Выдвижная штанга хром, 400мм',
'Выдвижная штанга хром, 450мм',
'Джокер Ф25, крестом соединитель 3-х труб',
'Джокер Ф25, Т-образно соединитель 2-х труб',
'Джокер Ф25, штангодержатель для круглой штанги',
'Штанга круглая сталь хром ФИРМАКС 25мм, L=3000 мм, толщина 0.7мм (считаем по м.п.)',
'арматура  А3    Ф-20  6м',
'Балясина S-образная N1 кован.',
'Балясина S-образная N2 кован.',
'Балясина "Виток-Виток" кован.',
'Вензель кованый 125х90',
'Вставка в балясину (поковка) 80х30',
'Квадрат 12 ГОСТ 2591-2006',
'Квадрат 12мм обжатый для балясин',
'Корзинка ковка',
'Круг Ф24 Ст45 L=6000',
'Лист 2мм 1250х2500',
'Лист 4мм 1500х6000',
'Лист 8мм 1500х6000',
'Лист рифленый 4мм 1500х6000 чечевица',
'полоса 40х4  6м',
'Проф труба 100х100х3',
'Проф. труба  100х50х3 L=6м.п.',
'Проф. труба 20х20х1,5  L=6м.п.',
'Проф. труба 40х20х1,5  L=6м.п.',
'Проф. труба 40х40х1,5  L=6м.п.',
'Проф. труба  60х30х2 L=6м.п.',
'Труба Ф127х4',
'Уголок 40х4 L=6000',
'Уголок 50х5 L=6000',
'Анкер бабочка мет.',
'Анкер химический Nord (зимний)',
'Анкер химический (эконом)',
'Болт М10х100 потай',
'Болт М10х120 потай внутр. шестигр.',
'Болт М10х20 потай внутр. шестигр.',
'Болт М10х30 потай внутр. шестигр.',
'Болт М10х30 шестигр. гол.',
'Болт М10х40 потай внутр. шестигр.',
'Болт М10х40 шестигр. гол.',
'Болт М10х50 шестигр.гол.',
'Болт М10х60 шестигр. гол.',
'Болт М10х70 шестигр. гол.',
'Болт М12х30 шестигр. гол.',
'Болт М12х40 шестигр. гол.',
'Болт М16х40 шестигр. гол.',
'Болт М20х50 шестигр. гол.',
'Болт М6х20 пол. гол. крест',
'Болт М6х20 шестигр. гол.',
'Болт М6х35 цил. гол. внутр. шестигр.',
'Болт М8х16 потай внутр. шестигр.',
'Болт мебельный М6х16',
'Болт мебельный М6х35',
'Болт мебельный М6х50',
'Болт мебельный М6х65',
'Болт мебельный М8х16',
'Винт М6х10 потай крест',
'Винт М6х12 потай крест',
'Винт М6х14 потай крест',
'Болт М6х20 внутр. шестигр. плоск. гол.',
'Болт М6х30 внутр. шестигр. плоск. гол.',
'Болт М6х35 внутр. шестигр. плоск. гол.',
'Винт М6х30 с п/ш крест.',
'Винт М6х70 потай крест',
'Винт меб. плоск.гол. внутр. шестигр. М6х70',
'Гайка -бочонок М6х10 L=12мм',
'Гайка М10',
'Гайка М10 колп.',
'Гайка М10 КОНУСНАЯ самоконтр. DIN980V',
'Гайка М12',
'Гайка М12 колп.',
'Гайка М14',
'Гайка М14 колп.',
'Гайка М14 проточенная для рутелей',
'Гайка М16',
'Гайка М16 колп.',
'Гайка М20',
'Гайка М20 колп.',
'Гайка М20 удлин.',
'Гайка М6',
'Гайка М6 колп.',
'Гайка М8',
'Гайка М8 колп.',
'Гайка М8 самоконтрящаяся',
'Гайка Эриксона М10х18',
'Гильза под химанкер L=135мм',
'Глухарь 10х100',
'Глухарь 10х50',
'Глухарь 12х200',
'Глухарь 8х100',
'Глухарь 8х120',
'Глухарь 8х150',
'Глухарь 8х80',
'Глухарь 8х60',
'Дюбель бабочка 9-13',
'Дюбель пласт. Ф10х50',
'Дюбель пласт. Ф6х40',
'Дюбель пласт. Ф6х50',
'Дюбель пласт. Ф8х50',
'Дюбель пласт. Ф8х60',
'Дюбель пласт. Ф8х80',
'Заклепка резьбовая М6',
'Зип-болт прямой',
'Зип-болт шарнирный',
'Колпачок на гайку М10 БЕЛЫЙ',
'Колпачок на гайку М10 КОРИЧНЕВЫЙ',
'Колпачок на гайку М10 СЕРЫЙ',
'Колпачок на гайку М10 ЧЕРНЫЙ',
'Колпачок на гайку М6 БЕЛЫЙ',
'Колпачок на гайку М6 КОРИЧНЕВЫЙ',
'Колпачок на гайку М6 СЕРЫЙ',
'Колпачок на гайку М6 ЧЕРНЫЙ',
'Конфирмат мебельный Ф6,3х50 бел.',
'Кровельный саморез 5,5x32',
'Кровельный саморез 5,5х19',
'Кровельный саморез 5,5х38',
'Носик для химического анкера',
'Поксипол холод. сварка(70мл)',
'Пристенный кронштейн поручня лазерн. плоск. поручень',
'Саморез для металлоконструкций HARPOON Ф5,5х105',
'Саморез для металлоконструкций HARPOON Ф5,5х51',
'Саморез для металлоконструкций HARPOON Ф5,5х80',
'Саморез Ф3,5х19 потай черн.',
'Саморез Ф3,5х35 потай бел.',
'Саморез Ф3,5х35 потай черн.',
'Саморез ф3,5х55 потай черн.',
'Саморез Ф4,2х16 п/ш остр',
'Саморез ф4,2х16 п/ш сверло',
'Саморез Ф4,2х19 пол. гол. остр.',
'Саморез Ф4,2х19 пол. гол. сверло',
'Саморез Ф4,2х32 пол. гол. остр.',
'Саморез Ф4,2х32 пол. гол. сверло',
'Саморез Ф4,2х32 п/ш остр.',
'Саморез Ф4,2х32 п/ш сверло',
'Саморез Ф4,2х50 пол. гол. остр.',
'Саморез Ф4,5х45 потай бел.',
'Саморез Ф4,5х50 потай желт.',
'Саморез Ф4х16 потай бел.',
'Саморез Ф4х25 потай бел.',
'Саморез Ф4х35 потай желт.',
'Саморез Ф4х60 потай бел.',
'Саморез Ф5х70 потай бел.',
'Саморез Ф5х70 потай желт.',
'Саморез Ф5х90 потай бел.',
'Саморез Ф6,3х25 пол. гол. остр.',
'Саморез Ф6,3х32 пол. гол. остр.',
'Саморез Ф6,3х60 пол. гол. остр.',
'Саморез Ф6х60 потай желт.',
'Сетка для химанкера под шпильку М12',
'Сетка для химанкера под шпильку М16',
'Силикон прозрачный 260 мл.',
'Скотч 12мм х 5м 2-х сторонний',
'Скотч 3М 2-х сторонний',
'Скотч двусторонний прозрачный для стекла 6мм х 2 мм х 16,5 м',
'Шайба-луна',
'Шайба М10',
'Шайба М10 увеличенная',
'Шайба М12',
'Шайба М14',
'Шайба М16',
'Шайба М16 увел.',
'Шайба М20',
'Шайба М20 гров.',
'Шайба М6',
'Шайба М6 увел.',
'Шайба М8',
'Шайба М8 увел.',
'Шпилька М10 L=1000',
'Шпилька М12 L=1000',
'Шпилька М14 L=1000',
'Шпилька М16 L=1000',
'Шпилька М20 L=1000',
'Шпилька М6 L=1000',
'Шпилька М8 L=1000',
'Шпилька сантехническая М10х100',
'Шпилька сантехническая М10х140',
'Заглушка нерж. Ф38 Заг/09-38',
'к822 труба нерж. с пазом 27х30 под стекло',
'Круг калиброванный Ф12мм нерж. L=3м.п.',
'Круг калиброванный Ф32мм. нерж. L=3м.п.',
'Круг калиброванный Ф36мм нерж. L=3м.п.',
'Труба нерж.AISI 201 25 х 1,5 зеркало',
'Труба нерж. AISI 201 Ф12х1,0 зерк. L=6 м.п.',
'Труба нерж. AISI 201 Ф38х1,5 зерк. L=6 м.п.',
'Труба нерж. AISI 201 Ф50,8х1,5 зерк. L=6 м.п.',
'Труба нерж.AISI 304 25 х 1,5 зеркало L=6м.п.',
'Труба нерж. AISI 304 Ф12х1,0 зерк. L=6 м.п.',
'Труба нерж. AISI 304 Ф16х1,0 зерк. L=6 м.п.',
'Труба нерж. AISI 304 Ф38х1,5 зерк. L=6 м.п.',
'Труба нерж. AISI 304 Ф50,8х1,5 зерк. L=6 м.п.',
'Труба нерж. проф. AISI 201 20х20х1,5 зерк. L=6м.п.',
'Труба нерж. проф. AISI 201 40х20х1,5 зерк. L=6м',
'Труба нерж. проф. AISI 201  40х40х1,5 зерк. L=6м.п.',
'Труба нерж. проф. AISI 304 20х20х1,5 зерк. L=6м.п.',
'Труба нерж. проф. AISI 304 40х20х1,5 зерк. L=6 м.п.',
'Труба нерж. проф. AISI 304 40х40х1,5 зерк. L=6 м.п.',
'Балясина хвоя экстра 50х50 Симметрия',
'Брус клеёный 100х100х3000',
'Брус хвоя 50х50х3000',
'Доска ДПК 22х150х4000',
'Доска дуб обрезная 30 мм 700-1500 мм',
'заготовка для балясин береза 50х50х900',
'Заготовка для комбинир. стойки ДУБ 50х50х900',
'заготовка для поручня дуб 60х40х3000',
'мдф шлифованный 2800х2070х6 мм',
'Подступенок сосна кл.Б 20х200х1200',
'поручень дуб амегообразный',
'Поручень ПВХ ф50 4000 Белый',
'поручень сосна амегообразный',
'Столб дуб срощ. 100х100х3000',
'Столб дуб срощ. 100х100х3600',
'столб дуб.срощ. 80х80',
'Столб дуб ц/л 100х100х1200',
'Столб дуб ц/л 100х100х3000',
'Столб кл. лиственница ср. л. 100х100х3000',
'столб хвоя Б  80х80х3000',
'Столб хвоя , сращенная ламель, без сучков  100х100х3000',
'Шпон пиленый',
'Щит береза сращ. 40мм 800х3000',
'Щит берёза ср. 20х1010х3010',
'Щит берёза ср. 22х900х3000',
'Щит берёза ср. 40х1010х3010',
'Щит берёза ср. 40х600х2000',
'Щит берёза ср. 40х600х2300',
'Щит берёза ср. 40х600х2500',
'Щит берёза ср. 40х600х2800',
'Щит дуб ср. 20*400*3000',
'Щит дуб ср. 20х1000х3000',
'Щит дуб ср. 20х400х2000',
'Щит дуб ср. 20х400х2500',
'Щит дуб ср. 20х600х2000',
'Щит дуб ср. 20х600х2500',
'Щит дуб ср. 20х600х3500',
'Щит дуб ср. 20х800х3000',
'Щит дуб ср. 20х800х3500',
'Щит дуб сращ. 40мм 1000х2500',
'Щит дуб сращ. 40мм 800х2500',
'Щит дуб сращ. 40мм 800х3000',
'Щит дуб сращ 40 мм х1000х3500',
'Щит дуб сращ 40 мм х1000х4000',
'Щит дуб ц/л 40х600х2000',
'Щит лиственница ср.18х600х2000',
'Щит лиственница ср.18х600х2500',
'Щит лиственница ср.18х600х4000',
'Щит лиственница ср.18х600х4500',
'Щит лиственница ср. 18х800х2500',
'Щит лиственница ср. 18х800х3000',
'Щит лиственница ср.40х600х4500',
'Щит лиственница ср.АВ 18х600х3500',
'Щит лиственница ср. АВ 40х600х2500',
'Щит лиственница ср. АВ 40х600х3000',
'Щит лиственница ср. АВ 40х800х2500',
'Щит лиственница ср. АВ 40х800х3000',
'Щит сосна кл. Б 40х800х3000',
'Ступень сосна кл.Б 40х300х1000',
'Ступень сосна кл.Б 40х300х1200',
'Щит береза сращ. 40мм 2915х910',
'Щит береза сращ. 40мм 600х3000',
'Щит берёза ср. 20х600х3000',
'Щит берёза ср. 40х900х3000',
'Щит берёза срощенный 40х940х3000',
'Щит дуб сращ. 20мм 600х3000',
'щит дуб сращ.20мм 600х4000',
'Щит дуб сращ. 40мм 1000х3000',
'Щит дуб сращ. 40мм 600х2500',
'щит дуб сращ.40мм600х3000',
'Щит дуб сращ. 40мм 600х3500',
'щит дуб сращ 40мм600х4000',
'щит дуб ц/л 20мм600x3000',
'Щит дуб ц/л. 40мм 600х3000',
'Щит дуб ц/л 40х600х2500',
'Щит лиственица ср. 40х600х3500',
'Щит лиственица ср. АВ 40х600х4000',
'Щит лиственница ср. 18х600х3000',
'Щит лиственница цл. 18х600х3000',
'Щит листв. сращ. 18х900х2500',
'Щит сосна кл.Б 18мм 600х3000',
'Щит сосна кл.Б 40мм 600х3000',
'Щит сосна кл. Б 40х1000х3000',
'Щит сосна ср. без сучков 18х600х3000',
'Щит сосна ср. без сучков 40х1200х3000',
'Щит сосна ср. без сучков 40х600х3000',
'Щит хвоя 40 мм х 1000 х 3000',
'Ветошь х/б',
'Вилка электрическая',
'Мышь оптическая проводная OKLICK 115S',
'Мышь оптическая проводная SELECLINE',
'Перчатки',
'Подставка под горячее БЕРЕЗА крашеная',
'Подставка под горячее ДУБ крашеный',
'Руковицы',
'Поручень ПВХ ф50 4000 венге №6',
'Поручень ПВХ ф50 4000 красное дерево №5',
'Поручень ПВХ ф50 4000 орех №4',
'Поручень ПВХ ф50 4000 светлый бук (дуб) №3',
'Поручень ПВХ ф50 4000 черный №2',
'Поручень ПВХ ф 50мм  4000 светлый дуб №1',
'Горелка МВ-25 АК 4м',
'Горелка МВ-25 АК 5м',
'Диск зачистной ф125',
'Диск зачистной ф230',
'Диск лепестковый Ф125 КРАСНЫЙ Р60',
'Диск лепестковый Ф125 ЧЕРНЫЙ Р40',
'Диск опорный для фибровых кругов',
'Диск отрезной Ф125',
'Диск отрезной Ф230',
'Диск полировочный ф 125',
'Канал подающий 1,0-1,2 мм красный 5,5м',
'Краги спилковые пятипалые серые',
'Круг наждачный для заточки сверл 250х20х32 зерно 12Н',
'Круг наждачный для заточки сверл  250х25х32 зерно 16Н',
'Круг опорный Ф125 мм для самолип. кругов',
'Лента зачистного станка металлического',
'Наконечник для полуавтомата М6х28х1,0 E-CU',
'Очки защитные STAYER "Standard"',
'Перчатки нитриловые "Крага"',
'Полотно для лентопила',
'Присадка 1.0  304',
'Присадка 1,6',
'Присадка 1,6 AL',
'Присадка 2.0  304',
'р 120 абразив klingsport  ф125',
'р 240 абразив klingsport  ф125',
'р 400 абразив klingsport  ф125',
'р 80 абразив klingsport  ф125',
'Сварочная проволока ф1мм 15-18 кг',
'Сварочная проволока Ф1мм 5кг',
'Сверло 6,7',
'Сверло ф10',
'Сверло ф12',
'Сверло ф18',
'Сверло ф3,0',
'Сверло ф3,8',
'Сверло ф4,0',
'Сверло ф5',
'Сверло ф5,5',
'Скотч брайт 220х150х10',
'Скотч-брайт 3м FIN 150х6х13',
'Спрей против залипания',
'Щетка по металлу (крацовка)',
'электрод вольфрам  ф 1,6',
'Электрод МР3',
'Завихритель 105А 220994',
'Защитный экран 45-85А 220817',
'Защитный экран FINE CUT 220948',
'Кожух форсунки (плазма)',
'Сопло 45А 220941',
'Сопло 45А Fine Cut',
'Сопло 65А 220819',
'Сопло 85А',
'Электрод плазма',
'270337 Шлифов. круг самолип. D125 P60',
'Бесконеч. ленты Р-100 150Х2260',
'Бесконеч. ленты Р-100 730Х1900',
'Бесконеч. ленты Р-120 150Х2260',
'Бесконеч. ленты Р-120 730Х1900',
'Бесконеч. ленты Р-150 150Х2260',
'Бесконеч. ленты Р-180 150х2260',
'Бесконеч. ленты Р-180 730х1900',
'Бесконеч. ленты Р-240 150Х2260',
'Бесконеч. ленты Р-240 730Х1900',
'Бесконеч. ленты Р-60 150х2260',
'Бесконеч. ленты Р-60 730Х1900',
'Бесконеч. ленты Р-80 150Х2260',
'Бесконеч. ленты Р-80 730Х1900',
'Вафельное полотно 45см х 60 м.пог.',
'Гайка ER20-A (М25х1,5) для ЧПУ',
'Губка шлифовальная',
'Клей Клейберит 303.0 для дерева, бутылка=0,5кг.',
'Клей Клейберит 303.0 для дерева, ведро=28кг.',
'Клей Клейберит 501.0 ПУ, 1кг',
'Клей Клейберит ПУ-клей 501.0 , 0,8 кг.',
'Комбинезон защитный КАСПЕР',
'перчатки нитриловые',
'перчатки нитриловые',
'Полировальный брусок 100х70х27 Р100',
'Полировальный брусок 100х70х27 Р120',
'Полировальный брусок 123х96х12,5 Р120 SW501',
'Полировальный брусок 123х96х12,5 Р150',
'Полировальный брусок 98х68х25 Р120',
'Полировальный брусок 98х68х25 Р150',
'Полировальный брусок 98х68х25 Р180',
'Полировальный брусок 98х68х25 Р220',
'Респиратор "Юлия-М" с клапаном',
'Фильтр органический 3М 6055 А2',
'Фреза A1FLx6.22',
'Фреза A2FLx5.22',
'Фреза A2FLx6.22',
'Фреза A2LX6.22',
'Фреза A2LX6.42',
'Фреза A2ZX6.22',
'Фреза A2ZX6.25',
'Фреза K2QXJ30.217',
'Фреза N1LX6.22',
'Фреза N1LX6.3. 15 (6*3)',
'Фреза N1LX6317',
'Фреза N2LX10.65',
'Фреза N2LX12.55',
'Фреза N2LX6.22',
'Фреза N2LX6.42',
'Фреза N2LX8.42',
'Фреза N2LX8.65',
'Фреза N2V61045',
'Фреза N2V62260',
'Фреза N2ZX6.22',
'Фреза N2ZX6.25',
'Фреза NL2QX3.15.0.5',
'Фреза NL2Qx6.30.0,5',
'Фреза NL2QX6.30.1',
'Фреза V-образная конусная DJTOL N2V61690, хвостовик=6мм, угол 2А=90, раб.диам.=16мм, диам.резца=0,2мм',
'Фреза V-образная конусная, хвостовик=6мм, угол 2А=110, раб. диам.=22мм, диам.резца=0,2мм',
'Фреза V-образная конусная, хвостовик=6мм, угол 2А=120',
'Фреза V-образная конусная, хвостовик=6мм, угол 2А=90, раб. диам.=22мм, диам.резца=0,2мм',
'Фреза внутренний радиус (нижний подшипник) Z=2 R=6,35 D=25,4x13,5x55 S=8 PROCUT 211.212513',
'Фреза внутр. радиус (нижний подшипник) 25,4х12,7 хвост.=8мм 301833',
'Фреза внутр. радиус (нижний подшипник)  D=38.1, R=12.7, хвост.=8мм',
'Фреза внутр. радиус ( нижний подшипник) Z=2 R=3 S=6 D=18,7x12,7 ARDEN 301612',
'Фреза внутр.радиус (нижний подшипник) Z=2 R=3 S=8 D=18.7x12.7 ARDEN 301812',
'Фреза конусная сферическая DJTOL N2ZXJQ6301080',
'фреза концевая 90 гр для резьбы',
'фреза кром.калевочная ф25,4х11 R6,3ммх8мм',
'Фреза кромочная STRONG СТФ-1015 38/24',
'Фреза кромочная конусная (45 град; хвостовик 8 мм) BOSCH',
'Фреза обгонная (верх.подш.) Z=2 D=12x32x65 S=8 ARDEN 152803B-1',
'Фреза обгонная с лезвием под углом (нижний + верхний подш.)Z=2,D=19x50,S=12',
'Фреза пазовая S=8x32 D=6x20x56 ARDEN 110811',
'Фреза пазовая S=8x32 D=8x30x65 ARDEN 110825',
'Фреза пазовая круглый нос (R4.76 мм; 9.5x12.7 мм; Z2; S8) ARDEN 204841',
'Фреза пазовая полукруг (чаша) Z=2, S=8, R=4,75, D=9.5x6.4',
'Фреза пазовая полукруг (чаша) Z=2, S=8, R=4, D=8x8',
'Фреза профильная (ручка) Z=2 S=8 D=19x17.5 ARDEN 502811',
'Фреза прямая 10мм',
'Фреза прямая 12мм',
'Фреза прямая 12мм',
'Фреза прямая 3мм',
'Фреза прямая 8мм',
'Фреза фасонная DJTOL NHBDA626',
'Фреза фасонная DJTOL NHBDB626',
'Фреза фасонная NQD1232, хвостовик=12,7мм, раб.диам.=32мм, раб.высота=25мм',
'Фреза фасонная NQD630, хвостовик=6мм, рабочий диам.=30мм, раб. высота=15мм (для выравнивания стола)',
'Фреза фасонная полукруг. радиусная, хвостовик=6мм, раб.диам.=16мм, R=8мм.',
'Фреза фасонная сфер. галтельная, хвостовик=6мм, раб.диам.=10мм, R=5мм, раб.высота=6мм',
'Фреза филеночная Z=2 R=3,2 S=12 D=35 (d=12,5)x9,5 ARDEN 416251',
'фреза чпу конусная для резьбы',
'Цанга ЧПУ ER20 Ф=10 мм',
'Цанга ЧПУ ER20  Ф=12 мм',
'Цанга ЧПУ ER20  Ф=3.175 (1/8)',
'Цанга ЧПУ ER20 Ф=8 мм',
'Цанга ЧПУ ER25-5',
'Шестерня косозубая GH1.5-T30D19',
'Шкант из березы D 10мм, L1000мм',
'Шкант ф12х60',
'Шкурка с липучкой Ф125 8отв. 240',
'Шкурка с липучкой ф125 8 отв Р320',
'Шкурка с липучкой ф125 без отв Р240',
'Шкурка с липучкой ф150 без отв. Р320',
'Шлифлента 100х610 Р100',
'Шлифлента 100х610 Р120',
'Шлифлента 100х610 Р60',
'Шлифлента 100х610 Р80',
'Шлифов. круг самолип. d125 P120',
'Шлифов. круг самолип. d125 P80',
'Шлифов. круг самолип. d125 Р150',
'Шлифов. круг самолип. d150 P150',
'Шлифов. круг самолип. d150 P240',
'Шлифов. круг самолип. d150 P320',
'Шпатлевка д/дерева акрил. сосна 0,25кг.',
'Щетка для шлифовки GR-320 Ф40мм',
'Г\картон 2-х слойный',
'Г/короб (250*150*150)',
'Г\короб (305*220*250 мм)',
'скотч  3М 2-х сторонний 50мм*3м',
'Скотч малярный',
'Скотч  прозрачный (48мм х 66 м)',
'Скотч прозрачный (75мм х 66 м)',
'Стрейч пленка',
'ВТ01-50 Внутренняя соединительная втулка для поручня Ф50,8 нерж.',
'Втулка пластиковая для рутеля L=12 мм',
'Декоративная крышка основания стойки (нерж.)',
'Декоративная крышка основания стойки (черн.)',
'Заглушка внешняя для поручня ПВХ',
'Заглушка дер. грибок для отв.Ф10 БЕРЕЗА',
'Заглушка дер. грибок для отв.Ф10 ДУБ',
'Заглушка дер. грибок для отв.Ф10 ЛИСТВЕННИЦА',
'Заглушка дер. грибок для отв.Ф10 СОСНА',
'Заглушка дер. грибок для отв.Ф12 БЕРЕЗА',
'Заглушка дер. грибок для отв.Ф12 ДУБ',
'Заглушка дер. грибок для отв.Ф12 ЛИСТВЕННИЦА',
'Заглушка дер. грибок для отв.Ф12 СОСНА',
'Заглушка дер. грибок для отв.Ф16 БЕРЕЗА',
'Заглушка дер. грибок для отв.Ф16 ДУБ', 
'Заглушка дер. грибок для отв.Ф16 ЛИСТВЕННИЦА',
'Заглушка дер. грибок для отв.Ф16 СОСНА',
'Заглушка дер. грибок для отв.Ф25 БЕРЕЗА',
'Заглушка дер. грибок для отв.Ф25 ДУБ',
'Заглушка дер. грибок для отв.Ф25 ЛИСТВЕННИЦА',
'Заглушка дер. грибок для отв.Ф25 СОСНА',
'Заглушка дер. грибок для отв.Ф40 БЕРЕЗА',
'Заглушка дер. грибок для отв.Ф40 ДУБ',
'Заглушка дер. грибок для отв.Ф40 ЛИСТВЕННИЦА',
'Заглушка дер. грибок для отв.Ф40 СОСНА',
'Заглушка нерж. 40х40',
'Заглушка нерж. Ф12',
'Заглушка нерж. Ф16',
'Заглушка нерж. Ф50',
'Заглушка пласт. 100х50 ЧЕРНАЯ',
'Заглушка пласт. 20х20 БЕЛАЯ',
'Заглушка пласт. 20х20 ЧЕРНАЯ',
'Заглушка пласт. 40х20 СЕРАЯ',
'Заглушка пласт. 40х20 ЧЕРНАЯ',
'Заглушка пласт. 40х20 БЕЛАЯ',
'Заглушка пласт. 40х40 БЕЛАЯ',
'Заглушка пласт. 40х40 ЧЕРНАЯ',
'Заглушка пласт. 60х30 ЧЕРНАЯ',
'Закладная стойки',
'к235 заглушка для поручня с пазом Ф48,3',
'КВК-02 Декоративная крышка основания стойки (нерж) фасонная',
'Кольцо для поручня ПВХ',
'КП/12-31 Чашечка 31 для стойки Ф38мм под поручень Ф50,8мм',
'КП/12-90 Чашечка 90 для стойки Ф38мм под поручень Ф50,8мм',
'Кронштейн поручня на стекло под кругл. поручень',
'Кронштейн поручня на стекло под плоск. поручень',
'Кронштейн поручня с двумя лодочками с шарниром',
'Кронштейн поручня штырь прямой',
'Кронштейн поручня штырь с шарниром',
'КС 01-38 Крышка нижняя Ф38',
'Лодочка плоская черн.',
'Лодочка под круглый поручень',
'Лодочка под плоский поручень нерж.',
'Лодочка под плоский поручень нерж. под сварку',
'Направляющие шариковые с доводчиком 450 мм (компл.2шт.)',
'Направляющие шариковые с доводчиком 550 мм (компл.2шт.)',
'Основание штыря 40х40 нерж.',
'ОТ 01-50 Отвод под сварку Ф50.8',
'ОТк-01-38 Отвод нерж Ф38мм короткий',
'Петля вкладная с доводчиком BOYARD',
'Петля накладная с доводчиком BOYARD',
'Петля накладная с доводчиком BOYARD',
'Петля накладная с доводчиком и эксцентр. регулиров.',
'Петля полунакладная с доводчиком BOYARD',
'ПР-08 Прокладка для стекла 8мм',
'Пристенный кронштейн поручня нерж. кругл. поручень',
'Пристенный кронштейн поручня нерж. плоск. поручень',
'Прокладка рутеля Ф30мм',
'Профиль алюминиевый зажимной для стекла 12 мм, L=6 м.п.',
'Ригеледержатель Ф12 плоск.',
'Ригеледержатель Ф16 плоск.',
'Рутель угловой под сварку',
'Ручка мебельная матовый хром',
'Ручка мебельная сталь',
'Соед. пластина поручня 40х60',
'Соед.пластина ригеля 20х40',
'Стеклодержатель зажимной 8мм',
'Уплотнитель крышки (узкий) для профиля 106',
'Уплотнитель основной (широкий) для профиля 106',
'Ф 02 Фланец для поручня ∅50,8 мм',
'Ф/03-38 Кронштейн бокового крепления стойки Ф38мм',
'Фк306 уплотнитель в поручень с пазом для стекла 12 мм',
'Ш 07-50',
'Шайба рутеля М10 внешняя под гайку Эриксона',
'Шайба рутеля М10 внутренняя резьбовая L=14мм',
'Шайба рутеля М14 внешняя под винт М8  потай',
'Шайба рутеля М14 внутренняя резьбовая',
'Шарнир внешн. под ПВХ Ф50',
'Шарнир внутр. нерж. Ф50',
'Шарнир ригеля внешн. Ф12',
'Шпилька для рутеля М14х100',
'Шпилька рутеля М14 L=125мм',
'Шпилька рутеля М14 L=150мм',
'Я 01-1 Основание под штырь Ф38',
'Я 03 Штырь под сварку',
'Я 05-1 Штырь с шарниром и лодочкой Ф50,8',
'Нестандарт кронштейн поручня с резинками под сварку КП-15',
'Нестандарт кронштейн с резинками с лодочкой шарнирный КП-01',
'Нестандарт кронштейн штырь с лодочкой под плоскость KRT 271',
'Нестандарт штырь под сварку (KRT 270)',
'Болт М10x20 потай',
'Болт М10x20 потай внутр. шестигр.',
'Болт М10x30 потай',
'Болт М10x30 шестигр.',
'Болт М10x30 шестир. гол.',
'Болт М10x40 шестигр.',
'Болт М10x40 шестигр. гол.',
'Болт М10х20 шестигр. гол.',
'Болт М10х40',
'Болт М12x10 потай',
'Болт М12x10 шестигр.',
'Болт М12x20 потай',
'Болт М12x20 шестигр.',
'Болт М12x30 потай',
'Болт М12x30 шестигр.',
'Болт М16х130 шестигр. гол.',
'Болт М16х30 шестигр. гол.',
'Верхняя секция 800мм L=0.5 м.п.',
'Верхняя секция 800мм L=0.5 м.п. С регулируемыми опорами',
'Винт М6х20 пол. Гол.',
'винт М6х70 потай крест',
'Заглушка 50х100',
'Заглушка дер. грибок для отв. Ф10',
'Заглушка дер. грибок для отв. Ф12',
'Заглушка дер. грибок для отв. Ф25',
'Заглушка дер. грибок для отв. Ф40',
'Заглушка нерж ф12',
'Зажимной профиль Т40 L=2300',
'Зажимной профиль Т40 L=850',
'Каркас площадки 800х1000',
'Колпачок белый',
'Комплект фурнитуры рутеля М10',
'Комплект фурнитуры рутеля М14',
'Кронштейн поручня на стекло плоск.',
'Кронштейн поручня прямой 70',
'Кронштейн поручня с шарниром 17х53',
'Кронштейн пристенный под круглый поручень',
'Кронштейн пристенный под плоский поручень',
'Кронштейн стойки L=75',
'Направляющие шариковые с доводчиком 350 мм (компл.2шт.)',
'Нога пожарки 500 мм.',
'Нога пожарки 650 мм.',
'Ноги 350мм',
'Обечайка пожарки',
'Опора для стекла',
'Покрытие площадки 579х1000',
'Полотно для лентопила малого',
'Поручень площадки 40х20 L=1130мм',
'Пристенный кронштейн поручня плоск.',
'Ригель площадки 40х20 L=1130мм',
'Саморез 4,5х25 потай',
'Саморез гарпун',
'Саморез Ф4,5х50 пол. гол. остр.',
'Саморез Ф4х25 потай',
'Саморез Ф5х60 пол. гол. остр.',
'секция 0,5 метра',
'Секция 2метра',
'Секция 3 метра',
'Секция 4 метра',
'Секция 800мм L=3м.п.',
'Секция 800мм L=4м.п.',
'Сетка под химанкер М16 L=1000',
'Сетка под химанкер М22 L=1000',
'Сетка под шпильку М10',
'Силикон безцветный',
'Скотч двусторонний 12х5',
'Скотч двухсторонний, м.п.',
'Соеденительная пластина 60х30',
'тест',
'Трубка нерж. Ф12х40',
'Фартук брезентовый',
'Фреза кромочная конусная (30.2х13 мм; 45°; хвостовик 8 мм) ЭНКОР',
'Шайба 12',
'Шарнир ригеля 16мм внешний',
'Шарнир Ш 01-38',
'Шкант Ф8х40',
'Шпилька М12',
'Шуруп Ф3,5х45 бел. с потай. гол. с острием',
'Щит сосна кл. Б 40х800х2500',
'Шайба больца сварная 50х50',
'Шайба больца 50x50',
'Термошайба'
];

return stockNames;
};
