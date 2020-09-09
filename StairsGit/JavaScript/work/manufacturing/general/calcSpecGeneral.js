function addGeneralItems(list){


/***  ГАЙКИ  ***/


	function nuts(){}; //пустая функция для навигации
	
    list.nut_M6 = {
        name:  "Гайка М6",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
    list.nut_M8 = {
        name:  "Гайка М8",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.nut_M10 = {
        name:  "Гайка М10",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.nut_M12 = {
        name:  "Гайка М12",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.nut_M14 = {
        name:  "Гайка М14",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.nut_M16 = {
        name:  "Гайка М16",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.nut_M20 = {
        name:  "Гайка М20",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.capNut_M6 = {
        name:  "Гайка М6 колп.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.capNut_M8 = {
        name:  "Гайка М8 колп.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.capNut_M10 = {
        name:  "Гайка М10 колп.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.capNut_M12 = {
        name:  "Гайка М12 колп.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.capNut_M14 = {
        name:  "Гайка М14 колп.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.capNut_M16 = {
        name:  "Гайка М16 колп.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.plasticCap_M10 = {
        name:  "Колпачок на гайку М10",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
	};
	
	//цвет пластиковых колпачков
	var capColor = "ЧЕРНЫЙ";
	if(params.metalPaint == "порошок"){
		if(params.carcasColor == "светло-серый") capColor = "СЕРЫЙ";
		if(params.carcasColor == "темно-серый") capColor = "СЕРЫЙ";
		if(params.carcasColor == "коричневый") capColor = "КОРИЧНЕВЫЙ";
		if(params.carcasColor == "черный") capColor = "ЧЕРНЫЙ";
		if(params.carcasColor == "белый") capColor = "БЕЛЫЙ";
		if(params.carcasColor == "бежевый") capColor = "СЕРЫЙ";
		if(params.carcasColor == "медный антик") capColor = "КОРИЧНЕВЫЙ";
		if(params.carcasColor == "белое серебро") capColor = "БЕЛЫЙ";
		if(params.carcasColor == "черное серебро") capColor = "СЕРЫЙ";
		if(params.carcasColor == "черная ящерица") capColor = "ЧЕРНЫЙ";
		if(params.carcasColor == "бежевая ящерица") capColor = "СЕРЫЙ";
		if(params.carcasColor == "коричневая ящерица") capColor = "КОРИЧНЕВЫЙ";
	}
	list.plasticCap_M10.name += " " + capColor.toUpperCase();
		
/***  ШАЙБЫ  ***/


	function shims(){}; //пустая функция для навигации
	
    list.shim_M6 = {
        name:  "Шайба М6",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
    list.shim_M8 = {
        name:  "Шайба М8",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M10 = {
        name:  "Шайба М10",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M12 = {
        name:  "Шайба М12",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M14 = {
        name:  "Шайба М14",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M16 = {
        name:  "Шайба М16",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M20 = {
        name:  "Шайба М20",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
	
/***  ШАЙБЫ УВЕЛИЧЕННЫЕ  ***/


	function shims_L(){}; //пустая функция для навигации
	
	list.shim_M6_L = {
        name:  "Шайба М6 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
    list.shim_M8_L = {
        name:  "Шайба М8 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M10_L = {
        name:  "Шайба М10 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M12_L = {
        name:  "Шайба М12 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M14_L = {
        name:  "Шайба М14 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M16_L = {
        name:  "Шайба М16 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

    list.shim_M20_L = {
        name:  "Шайба М20 увел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		

/*** САМОРЕЗЫ ***/


	function screws(){}; //пустая функция для навигации
		
	//Саморез крепления деревянного поручня
	list.timberHandrailScrew = {
		name: "Саморез Ф4,2х32 пол. гол. остр.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Саморез крепления металлического поручня
	list.metalHandrailScrew = {
		name: "Саморез Ф4,2х19 пол. гол. сверло",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.rigelScrew = {
		name: "Саморез Ф4,2х32 пол. гол. сверло",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Саморезы крепления к ступеням
    list.treadScrew = {
        name:  "Саморез Ф6,3х32 пол. гол. остр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	
		
	list.glassHolderMetalScrew = {
		name: "Саморез Ф4,2х32 п/ш сверло",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	list.glassHolderTimberScrew = {
		name: "Саморез Ф4,2х32 п/ш остр.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	//Нижнее крепление подступенков
	list.riserScrewBot = {
		name: "Саморез Ф3,5х55 потай остр. бел.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};
//Верхнее крепление подступенков
	list.riserScrewTop = {
		name: "Саморез Ф3,5х35 потай отср. бел.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};
	
	//Верхнее крепление подступенков забежных ступеней КО
	list.riserScrewTopWinderKo = {
		name: "Саморез Ф3,5х16 потай остр. бел.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
		
	//Саморезы крепления к ступеням
    list.screw_6x60 = {
        name:  "Саморез Ф6х60 потай остр. желт.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.screw_6x32 = {
        name:  "Саморез Ф6,3х32 пол. гол. остр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	//Крепление ригеледержателей
	list.rigelHolderScrew = {
		name: "Саморез Ф4,2х32 пол. гол. сверло",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	//Саморезы крепления к ступеням
    list.treadScrew_ko = {
        name:  "Саморез Ф3,5х35 потай остр. бел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
	//Саморезы крепления к ступеням
   
   list.screw_3x55 = {
        name:  "Саморез Ф3,5х55 потай остр. бел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.screw_3x35 = {
        name:  "Саморез Ф3,5х35 потай остр. бел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	 list.screw_4x45 = {
        name:  "Саморез Ф4,5х45 потай остр. бел.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.screw_4x32 = {
		name: "Саморез Ф4,2х32 пол. гол. остр.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.screw_4x19 = {
		name: "Саморез Ф4,2х19 пол. гол. остр.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.screw_4x16 = {
		name: "Саморез Ф4х16 потай остр.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	 list.roofingScrew_5x19 = {
        name:  "Кровельный саморез 5,5x19",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	 list.roofingScrew_5x32 = {
        name:  "Кровельный саморез 5,5x32",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
	list.screw_8x80 = {
		name: "Глухарь 8х80",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.screw_8x120 = {
		name: "Глухарь 8х120",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.screw_10x100 = {
        name:  "Глухарь 10х100",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.dowel_10x50 = {
        name:  "Дюбель пласт. Ф10х50",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
	list.dowel_6x40 = {
        name:  "Дюбель пласт. Ф6х40",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
		
	//Крепление поручней ограждения
	list.roundRutel = {
		name: "Рутель угловой под круглый поручень",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Крепление поручней ограждения
	list.planeRutel = {
		name: "Рутель угловой под плоский поручень",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};


		
/***  БОЛТЫ, ВИНТЫ, ШПИЛЬКИ  ***/


	function bolts(){}; //пустая функция для навигации
	
	list.bolt_M6x20 = {
        name:  "Болт М6х20 пол. гол. крест",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.boltHex_M6x30 = {
        name:  "Винт М6х30 внутр. шестигр. плоск. гол.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.boltHex_M6x35 = {
        name:  "Болт М6х35 с внутр. шестигр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

	list.bolt_M10x30 = {
        name:  "Болт М10х30 шестигр. гол.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
	list.bolt_M10x40 = {
        name:  "Болт М10х40 шестигр. гол.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.bolt_M10x60 = {
        name:  "Болт М10х60 шестигр. гол.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.bolt_M10x70 = {
        name:  "Болт М10х70 шестигр. гол.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	
	list.hexVint_M10x20 = {
        name:  "Болт М10х20 потай внутр. шестигр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.hexVint_M10x30 = {
        name:  "Болт М10х30 потай внутр. шестигр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.hexVint_M10x40 = {
        name:  "Болт М10х40 потай внутр. шестигр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.hexVint_M10x140 = {
        name:  "Болт М10х140 потай внутр. шестигр.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.vint_M6x10 = {
        name:  "Винт М6х12 потай крест",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.vint_M6x70 = {
        name:  "Винт М6х70 потай крест",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
/*		
	list.rivet_M6 = {
        name:  "Заклепка резьбовая M6",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		*/
	list.boltMeb_M6x35 = {
        name:  "Болт мебельный М6х35",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		}; 
		
	list.boltMeb_M8x19 = {
        name:  "Болт мебельный М8х16",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		}; 
	
	list.stud_M10x140 = {
        name:  "Шпилька М10 L=140",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "metal",
        items: []
		};
		
	list.stud_M10 = {
        name:  "Шпилька М10 L=1000",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.stud_M12 = {
        name:  "Шпилька М12 L=1000",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
	
	list.stud_M16 = {
        name:  "Шпилька М16 L=1000",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.chemAnc = {
        name:  "Анкер химический (эконом)",
        amtName: "баллон",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.chemAncNose = {
        name:  "Носик для химического анкера",
        amtName: "шт",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};

		
		
/***  ФУРНИТУРА  ***/

	
	function furniture(){}; //пустая функция для навигации
	
	//кольца на стыки
	list.handrailRing = {
			name:  "Кольцо для поручня ПВХ",
			amtName: "шт.",
			metalPaint: false,
			timberPaint: false,
			division: "stock_1",
			items: []
	};

	//Шарниры ригелей
	list.inoxRigelJoint = {
		name: "Шарнир ригеля 12мм внешний", 
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		

	list.inoxRigelJoint16 = {
		name: "Шарнир ригеля 16мм внешний", 
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Шарнир поручня нерж.
	list.inoxHandrailJoint = {
		name: "Шарнир внутр. нерж. Ф50", 
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Шарнир поручня ПВХ
	list.pvcHandrailJoint = {
		name: "Шарнир внешний под ПВХ", 
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//кронштейны поручня
    list.bracket = {
        name:  "Кронштейн поручня П-образный для стойки 20х20",
        amtName: "шт.",
        metalPaint: true,
        timberPaint: false,
        division: "stock_2",
		group: "Ограждения",
        items: []
		};
		
		
	//Крышка фланца черн.
	list.steelCover = {
		name: "Декоративная крышка основания стойки (черн.)", 
		amtName: "шт.",
		metalPaint: true,
        timberPaint: false,
		division: "stock_1",
		group: "Ограждения",
		items: [],
		};
		
	//Крышка фланца нерж.
	list.stainlessCover = {
		name: "Декоративная крышка основания стойки (нерж.)",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	//Крепление поручня к стойкам
	list.handrailHolderBase = {
		name: "Основание штыря 40х40 нерж.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		comment: "Выдать в цех"
		};
	
	//Кронштейн штырь с шарниром 
	list.handrailHolderTurn = {
		name: "Кронштейн поручня штырь с шарниром",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};
	
	//Кронштейн штырь прямой
	list.handrailHolderStraight = {
		name: "Кронштейн поручня штырь прямой",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};

	//Кронштейн штырь прямой
	list.handrailHolder = {
		name: "Кронштейн поручня штырь прямой с резьбой",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};
		
	//Кронштейн штырь с двумя лодочками
	list.handrailHolderAng = {
		name: "Кронштейн с двумя лодочками",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	//Лодочка под круглый поручень
	list.handrailHolderFlanArc = {
		name: "Лодочка под круглый поручень",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Лодочка под плоский поручень
	list.handrailHolderFlanPlane = {
		name: "Лодочка под плоский поручень нерж.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};
	
	//Лодочка под плоский поручень черная
	list.holderFlan = {
		name: "Лодочка плоская черн.",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_1",
		group: "Ограждения",
		items: [],
	};
	
		
	list.rigelHolder12 = {
		name: "Ригеледержатель Ф12 плоск.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.rigelHolder16 = {
		name: "Ригеледержатель Ф16 плоск.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	//стеклодержатели

	list.glassHolder = {
		name: "Стеклодержатель 8мм",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};	
	
	list.rutel_m14 = {
		name: "Шпилька рутеля М14 L=125мм",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.rutelShims_m14 = {
		name: "Комплект фурнитуры рутеля М14",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.rutel_m10 = {
		name: "Шпилька сантехническая М10х100",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.rutelShims_m10 = {
		name: "Комплект фурнитуры рутеля М10",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//Закладная стойки ограждения
	list.banisterInnerFlange = {
		name: "Закладная стойки",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
		
	//Шарнир поручня
	list.stainlessJoint_50 = {
		name: "Шарнир нерж. Ф50",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	//боковой кронштейн стойки КО
	
	list.sideRackHolder = {
		name: "Кронштейн бокового крепления стойки (черн)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};

		
		
/***  УГОЛКИ  ***/

	
	function angles(){}; //пустая функция для навигации
	//Уголок крепления к перекрытию
	list.angle100 = {
		name: "Уголок каркаса У4-70х70х100",//"У4-70х70х100",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
		
	//Крепление к нижнему перекрытию
	list.regSupport = {
		name: "Регулируемая опора 120",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
		
	//Крепление к нижнему перекрытию
	list.angle_u5_100 = {
		name: "Уголок каркаса У5-60х60х100",//"У5-60х60х100",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
		
	list.angle90 = {
		name: "У2-40х40х90",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
		
	 list.angle20 = {
        name:  "Уголок крепления балясины",
        amtName: "шт.",
        metalPaint: true,
        timberPaint: false,
        division: "stock_2",
		group: "Ограждения",
        items: []
		};
		
	//Уголок крепления ступени
	list.angle160 = {
		name: "У2-40х40х160",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
	//Уголок крепления ступени
	list.angle200 = {
		name: "У2-40х40х200",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
	//Уголок крепления ступени
	list.angle230 = {
		name: "У2-40х40х230",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
	//Уголок крепления деталей каркаса
	list.carcasAngle = {
		name: "У4-60х60х100",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		};
	
	
	
/***  ЗАГЛУШКИ ПЛАСТИКОВЫЕ	***/

	
	function plasticPlugs(){}; //пустая функция для навигации
	
	//цвет пластиковых заглушек
	var plugColor = "ЧЕРНАЯ";
	if(params.metalPaint == "порошок"){
		if(params.carcasColor == "белый") plugColor = "БЕЛАЯ";
	}
	
	list.plasticPlug_20_20 = {
		name: "Заглушка пласт. 20х20 " + plugColor,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	list.plasticPlug_40_20 = {
		name: "Заглушка пласт. 40х20 " + plugColor,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	list.plasticPlug_40_40 = {
		name: "Заглушка пласт. 40х40 " + plugColor,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	
	list.plasticPlug_60_30 = {
		name: "Заглушка пласт. 60х30 " + plugColor,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.plasticPlug_100_50 = { 
		name: "Заглушка пласт. 100х50 ЧЕРНАЯ",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};

		
	
/***  ЗАГЛУШКИ НЕРЖАВЕЮЩИЕ  ***/


	function inoxPlugs(){}; //пустая функция для навигации
	
	list.stainlessPlug_12 = {
		name: "Заглушка нерж. Ф12",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
	list.stainlessPlug_16 = {
		name: "Заглушка нерж. Ф16",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		group: "Ограждения",
		};
	
	list.stainlessPlug_50 = {
		name: "Заглушка нерж. Ф50",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
    list.stainlessPlug_pvc = {
        name:  "Заглушка внешняя для поручня ПВХ",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
	list.tube_12x45 = {
        name:  "Трубка нерж. Ф12х40",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
		};
		
/** ЗАГЛУШКИ ДЕРЕВЯННЫЕ **/	

	//крепление подступенка к ступени сверху
	list.nagel = {
		name: "Шкант Ф8х40",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
	
	list.timberPlug_10 = {
		name: "Заглушка дер. грибок для отв.Ф10",
		amtName: "шт.",
		metalPaint: false,
		timberPaint_carcas: true,
		division: "stock_1",
		items: [],
		};
		
	list.timberPlug_20 = {
		name: "Заглушка дер. грибок для отв.Ф25",
		amtName: "шт.",
		metalPaint: false,
		timberPaint_carcas: true,
		division: "stock_1",
		items: [],
	};

	var timberPlugType = getTimberPlugType(params.stringersMaterial);
	
	list.timberPlug_10.name += " " + timberPlugType;	
	list.timberPlug_20.name += " " + timberPlugType;
		
	if(params.timberPaint != "нет") {
		list.timberPlug_10.comment = "Выдать в цех для покраски";
		list.timberPlug_20.comment = "Выдать в цех для покраски";
		}
	
	

/***  ПРОЧЕЕ  ***/

	function other(){}; //пустая функция для навигации
	
	//Кованые секции ограждения
	list.forgedSection = {
		name: "Секция ограждения ков.",
		amtName: "шт.",
		metalPaintRailing: true,
		division: "metal",
		items: [],
		};
		
	//Сварные секции ограждения
	list.latticeSection = {
		name: "Секция ограждения сварная",
		amtName: "шт.",
		metalPaintRailing: true,
		division: "metal",
		items: [],
		};
		
	//Вилка подкоса
	list.braceFork = {
		name: "Вилка подкоса с фланцем",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
	
	//Вилка подкоса
	list.scotch = {
		name: "Скотч двухсторонний, м.п.",
		amtName: "м.п.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
		};
		
		
		list.fixSpacer1 = {
		name: "Проставка " + params.fixSpacer1 + " L=" + params.fixSpacerLength1 + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer2 = {
		name: "Проставка " + params.fixSpacer2 + " L=" + params.fixSpacerLength2 + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
	
 	list.fixSpacer3 = {
		name: "Проставка " + params.fixSpacer3 + " L=" + (params.fixSpacerLength3 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer4 = {
		name: "Проставка " + params.fixSpacer4 + " L=" + (params.fixSpacerLength4 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer5 = {
		name: "Проставка " + params.fixSpacer5 + " L=" + (params.fixSpacerLength5 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer6 = {
		name: "Проставка " + params.fixSpacer6 + " L=" + (params.fixSpacerLength6 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
	
	var studLength = params.fixSpacerLength3;
	if(params.fixSpacerLength4 > studLength) studLength = params.fixSpacerLength4;
	if(params.fixSpacerLength5 > studLength) studLength = params.fixSpacerLength5;
	if(params.fixSpacerLength6 > studLength) studLength = params.fixSpacerLength6;
	
	list.stud_screw_M12 = {
		name: "Шпилька-шуруп М12 L=" + studLength + "мм", 
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
	
	
	//Кованые секции ограждения
	list.silicone = {
		name: "Силикон прозрачный 260 мл.",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};
	
}
	
	
//функция возвращает тип покраски для таблицы спецификации
function isPainting(item){
    var paintType;


	//покраска металла
    if('metalPaint' in item && item.metalPaint){
		
		//детали каркаса
		paintType = params.metalPaint;		
		var paintColor = false;
		if(params.metalPaint !== 'нет') paintColor  = params.carcasColor || 'не указано';
		if(params.calcType == "carport") {
			paintType = params.carportMetalPaint;
			paintColor  = params.carportMetalColor || 'не указано';
		}
		
		//детали ограждений		
		if(params.calcType != 'vint' && (item.group == "Ограждения" || item.group == "handrails" || item.group == "Балюстрада")){
			paintType = params.metalPaint_railing || "нет";
			paintColor = false;
			if(params.metalPaint_railing !== 'нет')	paintColor  = params.metalBalColor || 'не указано';
		}
		
		//добавляем цвет
		if(paintColor) paintType += ", цвет " + paintColor;
		
	}

		
    if('timberPaint' in item && item.timberPaint && params.timberPaint !== 'нет'){
		paintType = params.timberPaint;
		if(params.timberPaint == "морилка+лак" || params.timberPaint == "цветное масло") paintType += ", цвет " + params.timberColorNumber;
		}
	
	
    if('timberPaintRailing' in item && item.timberPaintRailing && params.timberPaint_perila !== 'нет'){
		paintType = params.timberPaint_perila;
		if(params.timberPaint_perila == "морилка+лак" || params.timberPaint == "цветное масло") paintType += ", цвет " + params.railingTimberColorNumber;
		if(params.timberPaint_perila == "как на лестнице") {
			paintType = params.timberPaint;
			if(params.timberPaint == "морилка+лак" || params.timberPaint == "цветное масло") paintType += ", цвет " + params.carcasColorNumber;
			}
		}
	if('timberPaint_bal' in item && item.timberPaint_bal && params.timberPaint_perila_bal !== 'нет'){
		paintType = params.timberPaint_perila_bal + ", цвет " + $("#timberColorNumber_bal").val();
		if(params.timberPaint_perila_bal == "как на лестнице") {
			paintType = params.timberPaint + ", цвет " + $("#metalColorNumber").val();
			}
		}
			
	 if('timberPaint_treads' in item && item.timberPaint_treads && params.timberPaint_treads !== 'нет'){
		paintType = params.timberPaint;
		if(params.timberPaint == "морилка+лак" || params.timberPaint == "цветное масло") paintType += ", морилка " + params.treadColorNumber;
		}
		
	if('timberPaint_carcas' in item && item.timberPaint_carcas && params.timberPaint_carcas !== 'нет'){
		paintType = params.timberPaint;
		if(params.timberPaint == "морилка+лак" || params.timberPaint == "цветное масло") paintType += ", морилка " + params.stringersColor;//params.carcasColorNumber;
		}
	
	//покраска дерева на деревянных лестницах
	if(!('metalPaint' in item && item.metalPaint && params.metalPaint !== 'нет')){
		if('timberPaint' in item && item.timberPaint && params.timberPaint !== 'нет'){
			paintType = params.timberPaint;
		//	if (params.timberPaint == "морилка+лак" || params.timberPaint == "цветное масло") paintType += ", цвет " + params.timberColorNumber;
			// if(params.calcType == "vint") paintType += ", цвет " + params.timberColorNumber;
			if(item.group) {
				var groupColor = params[item.group + "Color"];
				if(isFinite(groupColor) && groupColor < 10) groupColor = "0" + groupColor;
			}
			if(groupColor && groupColor != "без морилки") paintType += ", цвет " + groupColor;
			if(groupColor == "без морилки") paintType += ", " + groupColor;
		}
	
	}
    if(!paintType)
		paintType = "нет";
		
	
		
    return paintType;
}

/** функция возвращает породу дерева для позиции спецификации
*/
function getMaterialName(item){

	var matName = "";
	if(item.group) matName = params[item.group + "Material"];
	if (typeof(matName) == "undefined") matName = "";
	
	if(params.calcType == "vint"){
		matName = params.treadsMaterial;
		if(item.group == "handrails"){
			matName = params.handrail_bal;
			if(params.handrail_bal == "массив") matName = params.treadsMaterial;
		}
		if(item.group == "spiral_handrails"){
			matName = "дуб";
		}
	}
	
	//поручни пвх
	if(item.group == "handrails" && params.handrail == "ПВХ"){
		matName = "ПВХ " + params.handrails_pvcColor;
	}
	
	
	return matName;
}

function addFixParts(par){
	var partsList = par.partsList;
	
//химия

	if(par.fixPart == "химия"){
		item = {
			id: "chemAnc",
			amt: par.amt/20,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		partsList["chemAnc"].comment = "монтаж: " + params.isHeating;
		
		var studLength = (150 + params.fixSpacerLength1) * 4 / 1000;

		item = {
			id: "stud_M" + par.studDiam,
			amt: studLength,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		
		 item = {
			id: "nut_М" + par.studDiam,
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		
		 item = {
			id: "shim_М" + par.studDiam,
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		} //end of химия
	
//глухари
	
	if(par.fixPart == "глухари"){
		item = {
			id: "screw_10x100",
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);

		 item = {
			id: "shim_М10",
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		} //end of глухари
		
//шпилька насквозь
	if(par.fixPart == "шпилька насквозь"){
		var studLength = 300 * par.amt / 1000;
		item = {
			id: "stud_M" + par.studDiam,
			amt: studLength,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		
		 item = {
			id: "nut_M" + par.studDiam,
			amt: par.amt * 2,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		
		 item = {
			id: "shim_M" + par.studDiam,
			amt: par.amt * 2,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		}
		
//саморезы
	if(par.fixPart == "саморезы"){
		item = {
			id: "screw_6x60",
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);				
		
		
	if(par.fixSurfaceType != "дерево"){
		item = {
			id: "dowel_10x50",
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);				
		}
	}
		
//шпилька-шуруп
	if(par.fixPart == "шпилька-шуруп"){
		item = {
			id: "stud_screw_M" + par.studDiam,
			amt: par.amt,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		
		 item = {
			id: "nut_M" + par.studDiam,
			amt: par.amt * 2,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		
		 item = {
			id: "shim_M" + par.studDiam,
			amt: par.amt * 2,
			discription: par.discription,
			unit: par.unit,
			itemGroup: par.itemGroup,
			};
		if(item.amt > 0) partsList.addItem(item);
		}
	
}//end of addFixParts

function calcRailingJointAmt(){
	var jointAmt = 0;
	if(params.stairModel != "Прямая"){
		if(params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") jointAmt += 1;
		if(params.railingSide_3 == "внешнее" || params.railingSide_3 == "две") jointAmt += 1;
		}
	if(params.stairModel == "П-образная трехмаршевая"){
		if(params.railingSide_2 == "внешнее" || params.railingSide_2 == "две") jointAmt += 1;
		}
	return jointAmt;

}//end of calcRailingJointAmt


// функция вывода спецификации шаблон "Комплектовка"
function printSpecificationCollation(partsList, customTable) {
	
    // заполнение спецификации металлического цеха
    var $metal = $('#metal_list'), metal_specification = '',
		$timber = $('#timber_list'), timber_specification = '',
		$stock1 = $('#stock1_list'), stock1_specification = '',
		$stock2 = $('#stock2_list'), stock2_specification = '';

		if (customTable) {
			$metal = $('.' + customTable + ' #metal_list'), metal_specification = '',
			$timber = $('.' + customTable + ' #timber_list'), timber_specification = '',
			$stock1 = $('.' + customTable + ' #stock1_list'), stock1_specification = '',
			$stock2 = $('.' + customTable + ' #stock2_list'), stock2_specification = '';
		}

    $.each(partsList, function(articul, list){
		if($.type(list) != 'object')
		    return;
		//комментарии
		var comment = "";
		if(list.comment) comment = list.comment;
		
		//выбираем спецификацию для цеха
		var countItem = 0;
		$.each(list.items, function(i, item){
		    countItem += item.amt;
		});
		
		var isModelData = "";

		if(list.isModelData) isModelData = "да"
		var row = "<tr class='specRow' data-articul='" + articul + "'>" + 
			"<td data-propId='name'>" + list.name + "</td>" + 
			"<td data-propId='amt'>" + Math.round(countItem * 10) / 10 + "</td>" + 
			"<td data-propId='painting'>" + isPainting(list) + "</td>" + 
			"<td data-propId='comment'>" + comment + "</td>" + 
			"<td data-propId='isModelData'>" + isModelData + "</td>" + 				
			"</tr>";
			
		if(list.division == "timber"){
			var row = "<tr class='specRow' data-articul='" + articul + "'>" + 
				"<td data-propId='name'>" + list.name + "</td>" + 
				"<td data-propId='material'>" + getMaterialName(list) + "</td>" + 
				"<td data-propId='amt'>" + countItem + "</td>" + 
				"<td data-propId='painting'>" + isPainting(list) + "</td>" + 
				"<td data-propId='comment'>" + comment + "</td>" + 
				"<td data-propId='isModelData'>" + isModelData + "</td>" + 				
				"</tr>";
		}

		if(countItem > 0)
		switch(list.division){
		    case 'stock_1': // Склад фурнитуры
			stock1_specification += row;
			break;
		    case 'stock_2': // Склад заготовок
			stock2_specification += row;
			break;
		    case 'metal': //металлический цех
			metal_specification += row;
			break;
		    case 'timber': // столярный цех
			timber_specification += row;
			break;
		}
    });
	
    $metal.html("<h3>Детали, изготавливаемые в металлическом цеху:</h3>" +
		"<table class = 'tab_4'>" +
		"<thead><tr><th>Наименование</th><th>Кол-во</th><th>Покраска</th><th>Комментарии</th><th>С модели</th></tr></thead><tbody>" +
		metal_specification +
		"</tbody></table>");
    $timber.html("<h3>Детали, изготавливаемые в столярном цеху:</h3>" +
		"<table class = 'tab_4' id='timberSpec'>" +
		"<thead><tr><th>Наименование</th><th>Материал</th><th>Кол-во</th><th>Покраска</th><th>Комментарии</th><th>С модели</th></tr></thead><tbody>" +
		timber_specification +
		"</tbody></table>");

    $stock1.html("<h3>Детали со склада фурнитуры:</h3>" +
		"<table class = 'tab_4'>" +
		"<thead><tr><th>Наименование</th><th>Кол-во</th><th>Покраска</th><th>Комментарии</th><th>С модели</th></tr></thead><tbody>" +
		stock1_specification +
		"</tbody></table>");
	$stock2.html("<h3>Детали со склада заготовок:</h3>" +
		"<table class = 'tab_4'>" +
		"<thead><tr><th>Наименование</th><th>Кол-во</th><th>Покраска</th><th>Комментарии</th><th>С модели</th></tr></thead><tbody>" +
		stock2_specification +
		"</tbody></table>");
} // end of printSpecificationCollation()

// функция вывода спецификации шаблон "Сборка"
function printSpecificationAssembly(partsList, customClass) {

		var noModelItems = checkSpecErrors(partsList);
    // заполнение спецификации металлического цеха
		var $specification = $('#specificationAssembly'), newList = {};
		if (customClass) {
			$specification = $('.' + customClass + '#specificationAssembly'), newList = {};
		}
    //перебираем все элементы справочника
    $.each(partsList, function(articul, list){
		//if()
		if($.type(list) != 'object')
		    return;
		//перебираем добавленные в справочник элементы
		$.each(list.items, function(i, item){
		    //если данная группа еще не созданна
		    if(!(item.group in newList)){
			//добавляем новую группу
			newList[item.group] = '';
		    }
				//добавляем элементы в группу
				var customClass = "";
				if (noModelItems.articuls.includes(articul)) customClass = 'error';
		    newList[item.group] += "<tr class=" + customClass + "><td>" + list.name + "</td><td>" + item.amt + "</td><td>" + item.discription + "</td><td>" + isPainting(list) + "</td><td>" + item.unit + "</td><td>" + articul + "</td><td><input type='checkbox' class='specCheckbox'></td></tr>";
		});

    });
    var tables = '';
    $.each(newList, function(group, trs){
		tables += "<h3>Группа: " + group + "</h3>" +
		    "<table class = 'tab_4'>" +
		    "<thead><tr><th>Наименование</th><th>Кол-во</th><th>Назначение</th><th>Покраска</th><th>Узел</th><th>Артикул</th><th>Проверено</th></tr></thead><tbody>" +
		    trs +
		    "</tbody></table>";
    });
    $specification.html(tables);
} // end of printSpecificationAssembly()

/** функция выводит на страницу параметры деталей, снятые с модели
*/

function printPartsAmt(){

	var modelInfo = ""
	var ignorList = ["forgedRack"]
	modelInfo += "<h3>Детали лестницы</h3>" + 
		"<table class='tab_2'><tbody><tr><th>Наименование</th><th>кол-во</th><th>артикул</th></tr>"
	for(var partName in partsAmt){
		if(partsAmt[partName] && ignorList.indexOf(partName) == -1){
			for(var type in partsAmt[partName]["types"]){
				modelInfo += "<tr><td>" + partsAmt[partName].name + (type != 0 ? (" " + type) : "") + "</td><td>" + partsAmt[partName]["types"][type] + "</td><td class='partId'>" + partName + (type != 0 ? type : "") + "</td></tr>";
				}
			}
		}
	modelInfo += "</tbody></table>";
	modelInfo += "<h3>Детали балюстрады</h3>" + 
		"<table class='tab_2'><tbody><tr><th>Наименование</th><th>кол-во</th><th>артикул</th></tr>"
	for(var partName in partsAmt_bal){
		if(partsAmt_bal[partName] && ignorList.indexOf(partName) == -1){
			for(var type in partsAmt_bal[partName]["types"]){
				modelInfo += "<tr><td>" + partsAmt_bal[partName].name + (type != 0 ? (" " + type) : "") + "</td><td>" + partsAmt_bal[partName]["types"][type] + "</td><td class='partId'>" + partName + (type != 0 ? type : "") + "</td></tr>";
				}
			}
		}
	modelInfo += "</tbody></table>";

modelInfo = ""; //не выводим на страницу эту информацию - она не нужна
	
	var totalGlassArea = getPartPropVal("glasses", "sumArea", partsAmt) + getPartPropVal("glasses", "sumArea", partsAmt_bal);
	if(totalGlassArea){
		modelInfo += "<h3>Информация по стеклам / экранам</h3>" +
			"Ко-во на лестнице: " + getPartPropVal("glasses", "amt", partsAmt) + " шт; <br/>" + 
			"Ко-во на балюстраде: " + getPartPropVal("glasses", "amt", partsAmt_bal) + " шт; <br/>" + 
			"<b>Общее кол-во: " + (getPartPropVal("glasses", "amt", partsAmt) + getPartPropVal("glasses", "amt", partsAmt_bal)) + " шт; </b><br/>" + 
			"Площадь на лестнице: " + Math.round(getPartPropVal("glasses", "sumArea", partsAmt) * 100) / 100 + " м2; <br/>" + 
			"Площадь на балюстраде: " + Math.round(getPartPropVal("glasses", "sumArea", partsAmt_bal) * 100) / 100 + " м2; <br/>" + 
			"<b>Общая площадь: " + Math.round(totalGlassArea * 100) / 100 + " м2; </b><br/>";
		}
		
	$("#modelInfo").html(modelInfo);
	
	//комментарии к спецификации
	var comment = "<h2>Примечания к спецификации</h2>";
	var isUnit = staircaseHasUnit();
	
	//покраска металла в несколько цветов
	var singleMetalColor = true;
	var color = "";
	$("#colorsFormTable tr[data-mat='metal']:visible").each(function(){
		if(!color) color = $(this).find(".Color").val();
		else{
			if(color != $(this).find(".Color").val()) singleMetalColor = false;
		}
	})
	if(!singleMetalColor) comment += "<p class='specAlert'>Покраска металла в несколько цветов</p>";
	
	//покраска дерева в несколько цветов
	var singleTimberColor = true;
	var singleTimberType = true;
	var color = "";
	var timberType = "";
	$("#colorsFormTable tr[data-mat='timber']:visible").each(function(){
		//цвет
		if(!color) color = $(this).find(".Color").val();
		else if(color != $(this).find(".Color").val()) singleTimberColor = false;
		
		//порода дерева
		if(!timberType) timberType = $(this).find(".Material").val();
		else if(timberType != $(this).find(".Material").val()) singleTimberType = false;

	})
	if(!singleTimberType) comment += "<p class='specAlert'>Используется несколько пород дерева</p>";
	if(!singleTimberColor) comment += "<p class='specAlert'>Покраска дерева в несколько цветов</p>";
	
	
	if(!singleMetalColor || !singleTimberColor || !singleTimberType){
		$("#specComment").html(comment);
	}
	

}//end of printPartsAmt

var poleTypes = {};
function printPoleList(){

	//копируем детали в новый массив с одновременной групировкой одинаковых деталей
	for (var mat in poleList){
		poleTypes[mat] = [];
	}
	

	var materialGroupedPoles = [];

	//перебираем все палки
	for (var mat in poleTypes){
		if (!poleList[mat]) continue;
		for(var i=0; i<poleList[mat].length; i++){
			var newPole = poleList[mat][i];
			if (!newPole.dup_ids) newPole.dup_ids = [newPole.partIndex]

			var isNewType = true;
			
			//перебираем уже внесенные палки, ищем дубли
			for(var j=0; j<poleTypes[mat].length; j++){
				var oldPole = poleTypes[mat][j];
				//сравниваем размеры и кромку нового эл-та с уже добавленными
				if( newPole.len1 == oldPole.len1 &&
					newPole.angStart == oldPole.angStart &&
					newPole.angEnd == oldPole.angEnd &&
					newPole.poleProfileY == oldPole.poleProfileY &&
					newPole.poleProfileZ == oldPole.poleProfileZ)
				{
					if(newPole.partIndex) oldPole.dup_ids.push(newPole.partIndex)
					isNewType = false;
					oldPole.amt += 1;
					//добавляем название, если оно не было добавлено раньше
					if(oldPole.description.indexOf(newPole.text) == -1){
						oldPole.description.push(newPole.text)
					}
				}
			}//конец поиска дублей
				
			if(isNewType) poleTypes[mat].push(newPole);
			// console.log(newPole.material)
			var partsMat = getPartsMaterialType(newPole.material);
			if (!materialGroupedPoles[partsMat]) materialGroupedPoles[partsMat] = {};
			if (materialGroupedPoles[partsMat] && !materialGroupedPoles[partsMat][mat]) materialGroupedPoles[partsMat][mat] = [];
			if (materialGroupedPoles[partsMat] && materialGroupedPoles[partsMat][mat] && isNewType) materialGroupedPoles[partsMat][mat].push(newPole);
		}//конец перебора панелей
	}//конец перебора материалов
	
	//перебираем все палки и назначаем ид
	var iterator = 1;
	for (var mat in poleTypes){
		for(var index=0; index < poleTypes[mat].length; index++){
			poleTypes[mat][index].part_id = iterator;
			iterator++;
		}
	}

	var text = "<h3>Ведомость деталей</h3>";
	
	var text = "<table class='tab_2' id='partsTable'><tbody>" + 
		"<tr>" + 
		"<th style='border: 1px solid black'>ИД детали</th>" + 
		"<th style='border: 1px solid black'>Профиль</th>" + 
		"<th style='border: 1px solid black'>Тип</th>" + 
		"<th style='border: 1px solid black'>L</th>" + 
		"<th style='border: 1px solid black'>C</th>" + 
		"<th style='border: 1px solid black'>a1</th>" + 
		"<th style='border: 1px solid black'>b1</th>" + 
		"<th style='border: 1px solid black'>a2</th>" + 
		"<th style='border: 1px solid black'>b2</th>" + 			
		"<th style='border: 1px solid black'>кол-во</th>" + 
		"<th style='border: 1px solid black'>Фаска в начале</th>" + 
		"<th style='border: 1px solid black'>Фаска в конце</th>" + 
		"<th style='border: 1px solid black'>Описание</th>" + 
		"</tr>";

	for (var material in materialGroupedPoles) {
		text += '<tr><td style="border: 1px solid black; font-weight: 600; text-align: center;" colspan="10">Материал: ' + getPartsMaterialName(material) + '</td></tr>'
		var poleListMaterial = materialGroupedPoles[material];
		text += printPartsTable(poleListMaterial);
	}
	
	text += "</tbody></table>";

	//кнопка выгрузки в xls
	text += '<button id="downLoadPoleList">Скачать xls</button><br/>' + 
		"<a href='/drawings/carcas/cut.pdf' target='_blank'>Чертеж с обозначением размеров</a>"
	
	$("#poleList").html(text);
}

function getPartIndex(){
	var index = 0;
	for (var type in poleList){
		index += poleList[type].length;
	}
	return index + 1;
}

function getIdByPoleIndex(index){
	for (var mat in poleTypes){
		for(var i=0; i<poleTypes[mat].length; i++){
			item = poleTypes[mat][i];
			if (item.dup_ids && item.dup_ids.includes(index)) {
				return item.part_id
			}
		}
	}
	return -1;
}

function getPartInfo(index){
	for (var mat in poleTypes){
		for(var i=0; i<poleTypes[mat].length; i++){
			item = poleTypes[mat][i];
			if (item.dup_ids && item.dup_ids.includes(index)) {
				return item
			}
		}
	}
	return -1;
}

function getPartsMaterialType(material){
	if (material == "metal" || material == "metal_railing") {
		return 'metal';
	}
	if (material == "timber" || material == "tread") {
		return 'timber';
	}
	
	return "none";
}

function getPartsMaterialName(material){
	if (material == "metal") return "Металл";
	if (material == "timber") return "Дерево";
	return "Не назначен";
}

/**
 * Выводит таблицу ведомости заготовок
 */
function printPartsTable(poleTypes){
	var text = "";
	
	for (var mat in poleTypes){
		for(var i=0; i<poleTypes[mat].length; i++){
			var item = poleTypes[mat][i];
			var type = 1;
			if(item.angStart || item.angEnd) type = 2;
			if(item.angEnd && item.angEnd) type = 3;
			if(item.angEnd * item.angEnd < 0) type = 4;
			
			text += "<tr>" + 
			"<td style='border: 1px solid black'>" + item.part_id + "</td>" +
			"<td style='border: 1px solid black'>" + mat + "</td>" +
			"<td style='border: 1px solid black'>" + type + "</td>" +
			"<td style='border: 1px solid black'>" + item.len3 + "</td>" + 
			"<td style='border: 1px solid black'>" + printVal(item.poleProfileY) + "</td>" + 
			"<td style='border: 1px solid black'>" + printVal(item.angStart) + "</td>" + 
			"<td style='border: 1px solid black'>" + printVal(item.cutOffsetStart) + "</td>" +
			"<td style='border: 1px solid black'>" + printVal(item.angEnd) + "</td>" + 
			"<td style='border: 1px solid black'>" + printVal(item.cutOffsetEnd) + "</td>" +
			"<td style='border: 1px solid black'>" + item.amt + "</td>" +
			"<td style='border: 1px solid black'>" + (item.startChamfer || "нет") + "</td>" +
			"<td style='border: 1px solid black'>" + (item.endChamfer || "нет") + "</td>";
			
			text += "<td style='border: 1px solid black'>"
			for(var j=0; j<item.description.length; j++){
				text += item.description[j];
				if(j < item.description.length - 1) text += "; <br/>";
			}
			text += "</td>";
			
			text += "</tr>"
		}
	}
	return text;
}

function getPartAmt(partName, dataObj){
	if(!dataObj) dataObj = partsAmt;
	
	var itemAmt = 0;
	if(dataObj[partName]) itemAmt = dataObj[partName].amt;
	
	return itemAmt;
} //end of getPartAmt

function getPartArea(partName, dataObj){
	if(!dataObj) dataObj = partsAmt;
	
	var itemArea = 0;
	if(dataObj[partName]) itemArea = dataObj[partName].area;
	
	return itemArea;
} //end of getPartAmt

function getPartPropVal(partName, prop, dataObj){
	if(!dataObj) dataObj = partsAmt;
	var propVal = 0;
	if(dataObj[partName]) propVal = dataObj[partName][prop];
	
	return propVal;
} //end of getPartPropVal

/**
 * Назначает объекту и всем его дочернем объектам specId
 * @param {Object3D} obj Сам объект(так-же может быть Mesh)
 * @param {string} specId Ид спецификаци
 * @param {boolean} force заменять ли уже существующие specId
 * (например для фланца могут быть болты где этот параметр уже есть, 
 * в стандартном случае мы его не заменяем)
 */
function addSpecIdToChilds(obj, specId, force){
	function eachAndAddSpec(oobj){
		if(!oobj.specId || force) oobj.specId = specId;
		if (oobj.children) {
			$.each(oobj.children, function(){
				eachAndAddSpec(this);
			});
		}
	}
	eachAndAddSpec(obj);
}

function getTreadParams(){
	var par = {};
	
	par.fixPart = "screw";
	par.fixPartId = "screw_6x32";
	
	par.material = "timber";
	par.timberPaint = true;
	par.metalPaint = false;
	par.division = "timber";
	
	
	
if(params.stairType == "рифленая сталь" || 
	params.stairType == "рифленый алюминий" || 
	params.stairType == "лотки"){
		par.material = "metal";
		par.timberPaint = false;
		par.metalPaint = true;
		par.fixPart = "bolt";
		par.fixPartId = "";
	//	if(params.boltHead == "hexagon") par.fixPartId = "bolt_M10x30";
		par.division = "metal";
		}
		
	
if(params.stairType == "дпк"){
	par.timberPaint = false;
	par.fixPart = "boltMeb";
	par.fixPartId = "boltMeb_M6x35";
	}
if(params.stairType == "лиственница тер."){
	par.fixPart = "boltMeb";
	par.fixPartId = "boltMeb_M6x35";
	}
if(params.stairType == "пресснастил"){
	par.material = "metal";
	par.timberPaint = false;
	par.fixPart = "bolt";
	par.fixPartId = "hexVint_M10x20";
	if(params.boltHead == "hexagon") par.fixPartId = "bolt_M10x30";
	par.division = "metal";
	}
	
if(params.stairType == "стекло"){
	par.material = "glass";
	par.timberPaint = false;
	par.fixPart = "scotch";
	par.fixPartId = "scotch";
	}

	return par;
} //end of getTreadParams

function printVal(val){
	if(!val) return ""
	else return val;
}

function getTimberPlugType(baseMat){
	var timberPlugType = "дуб";
	
	if(baseMat == "сосна кл.Б") timberPlugType = "сосна";
	if(baseMat == "сосна экстра") timberPlugType = "сосна";
	if(baseMat == "береза паркет.") timberPlugType = "береза";
	if(baseMat == "лиственница паркет.") timberPlugType = "лиственница";
	if(baseMat == "дуб паркет.") timberPlugType = "дуб";
	if(baseMat == "дуб ц/л") timberPlugType = "дуб";

	timberPlugType = timberPlugType.toUpperCase();
	
	return timberPlugType;

}