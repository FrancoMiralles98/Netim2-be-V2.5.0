CRITICAS
- ahora no cambio el valor del precio de los items de utilidad, unicamente la cantidad
 si quiero saber el precio se hace la multiplicacion del valor por la cantidad
 ya que en legacy cambiaba constantemente el precio y resulta incomodo e innecesario hacerlo
 (en donde se encuentra estos cambios: Modulo "Inventory")
- Cambios estructurales de las skills y de los escalados de las skills
 Cambios estructurales de los stats/atributos de los characters
Cambios estructurales de las props de character
- ahora la prop de "hab" , "especialidad","raza","type_weapon","target_type" esta en un orden superior y ya no se encuentra dentro de la prop de "stats"

MODULO    
    - bonus:
        - types:
            -bonus-list.type: en la interface BonusList en el valor de "valid" falta agregarle el tipo que valida que sea los nombres del equipo (arma,armadura,botas, etc...) 
    - skill
        - types
            -skill-damage.type: en la documentacion falta agregar un enlace en bonus_damage sobre como funciona ese valor dependiendo de cada skill especial que lo tenga, (emboscada, lluvia de flechas, daga rodante, etc)
    - Character
        -types
            -mission-option.type: Tiene valores en any, ya que el modulo de missiones y sus tipos todavia no esta creado
            -dungeon-in-progress.type: Tiene valores en any ya que el modulo de Dungeon y sus types todavia no esta creado
        - schema
            -character.schema.ts: el timer_lv se tiene que agregar por default el valor inicial, la definicion de dicho valor no esta, segun fijado no va en modulo de character iria en modulo de fight o mob , como a dia de fecha no esta realizada todavia no se puso
        - const
            -base-pvp-data: en "remainingLosses" falta agregar el valor por default que no esta definido ya que el modulo de Arena no esta configurado
            -stats-progress-by-race.const: agregado de la estructura base de como sera la nueva progresion de estadisitcas de los personajes segun la raza y luego aplicarlo tambien a especialidad, falta el desarrollo de los numeros y luego los metodos apropiados para aplicar dicho escalados de estadisticas
        
